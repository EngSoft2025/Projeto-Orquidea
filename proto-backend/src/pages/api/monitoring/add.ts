// src/pages/api/monitoring/add.js

import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto'; // Módulo nativo do Node.js para criptografia (hashing)

// Caminho correto para o banco de dados baseado na sua estrutura de projeto
const dbPath = path.join(process.cwd(), 'src', 'database', 'orquidea.db');

export default function handler(req, res) {
    // Este endpoint só deve aceitar requisições do tipo POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let db;
    try {
        // Conecta ao banco de dados
        db = new Database(dbPath);

        const { userEmail, researcher, publications } = req.body;

        // Validação dos dados recebidos do frontend
        if (!userEmail || !researcher || !researcher.id || !researcher.name || !Array.isArray(publications)) {
            return res.status(400).json({ error: 'Dados insuficientes para iniciar o monitoramento.' });
        }

        // --- Iniciar a Transação ---
        // 'transaction' garante que todas as queries dentro dela sejam executadas com sucesso.
        // Se qualquer uma falhar, todas as mudanças são revertidas (rollback).
        const runTransaction = db.transaction(() => {
            // 1. Obter o ID do usuário a partir do email
            const user = db.prepare('SELECT id FROM Users WHERE email = ?').get(userEmail);
            if (!user) {
                // Se o usuário não for encontrado no nosso DB, a operação não pode continuar.
                throw new Error(`Usuário com email ${userEmail} não foi encontrado no banco de dados local.`);
            }
            const userId = user.id;

            // 2. Gerar o hash da lista de publicações
            // Criamos uma string consistente com os DOIs ou títulos, ordenamos para garantir a mesma ordem sempre,
            // e então geramos o hash. Usamos .trim() para limpar os dados.
            const publicationIdentifiers = publications
                .map(p => (p.doi || p.title)?.trim())
                .filter(Boolean) // Remove quaisquer valores nulos ou vazios
                .sort()
                .join('|');
            const publicationsHash = crypto.createHash('sha256').update(publicationIdentifiers).digest('hex');

            // 3. Inserir ou atualizar o pesquisador (UPSERT)
            // ON CONFLICT...DO UPDATE atualiza o nome e o hash se o orcid_id já existir.
            const researcherStmt = db.prepare(`
                INSERT INTO Researchers (orcid_id, name, hash_trabalhos)
                VALUES (?, ?, ?)
                ON CONFLICT(orcid_id) DO UPDATE SET
                    name = excluded.name,
                    hash_trabalhos = excluded.hash_trabalhos;
            `);
            researcherStmt.run(researcher.id, researcher.name, publicationsHash);

            // 4. Ligar o usuário ao pesquisador na tabela de monitoramento (UPSERT via IGNORE)
            const monitorStmt = db.prepare('INSERT OR IGNORE INTO UserMonitorsResearcher (user_id, researcher_orcid_id) VALUES (?, ?)');
            monitorStmt.run(userId, researcher.id);
            
            // 5. Inserir ou ignorar cada publicação e ligar a autoria
            const publicationInsertStmt = db.prepare('INSERT OR IGNORE INTO Publications (doi, title) VALUES (?, ?)');
            const authorshipStmt = db.prepare('INSERT OR IGNORE INTO Authorship (researcher_orcid_id, publication_id) VALUES (?, ?)');
            
            // Queries de busca separadas para clareza e robustez
            const getPubByDoiStmt = db.prepare('SELECT id FROM Publications WHERE doi = ?');
            const getPubByTitleStmt = db.prepare('SELECT id FROM Publications WHERE title = ? AND doi IS NULL');

            for (const pub of publications) {
                const doi = pub.doi?.trim() || null;
                const title = pub.title?.trim();

                // Só processa a publicação se ela tiver um título
                if (title) {
                    // Tenta inserir. Se já existir, o IGNORE impede o erro.
                    publicationInsertStmt.run(doi, title);
                    
                    let dbPub;
                    // Busca o ID da publicação que agora garantidamente existe no banco
                    if (doi) {
                        dbPub = getPubByDoiStmt.get(doi);
                    } else {
                        dbPub = getPubByTitleStmt.get(title);
                    }

                    if (dbPub) {
                        // Liga a autoria entre o pesquisador principal e a publicação
                        authorshipStmt.run(researcher.id, dbPub.id);
                    } else {
                        // Se não encontrarmos a publicação aqui, algo está muito errado.
                        // Lançar um erro aqui faz a transação inteira ser revertida.
                        throw new Error(`Não foi possível encontrar a publicação recém-inserida: ${title}`);
                    }
                }
            }
        });

        // Executa a transação que definimos acima
        runTransaction();

        res.status(200).json({ message: 'Pesquisador adicionado ao monitoramento com sucesso!' });

    } catch (error) {
        console.error("API Error adding to monitoring:", error);
        res.status(500).json({ error: 'Falha ao processar a solicitação.', details: error.message });
    } finally {
        // Garante que a conexão com o banco de dados seja sempre fechada
        if (db) {
            db.close();
        }
    }
}
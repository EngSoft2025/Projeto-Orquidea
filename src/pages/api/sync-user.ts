// src/pages/api/sync-user.js

import Database from 'better-sqlite3';
import path from 'path';

// O caminho correto para o seu banco de dados, baseado na sua estrutura de projeto
const dbPath = path.join(process.cwd(), 'src', 'database', 'orquidea.db');

export default function handler(req, res) {
    // Este endpoint só aceitará requisições do tipo POST
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let db;
    try {
        // Conecta ao banco de dados
        db = new Database(dbPath);

        const { name, email } = req.body;

        // Validação básica dos dados recebidos
        if (!name || !email) {
            return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
        }

        // Use 'INSERT OR IGNORE' para adicionar o usuário apenas se ele não existir.
        // A verificação é feita pela restrição 'UNIQUE' na coluna 'email'.
        // Se o email já existir, o comando é simplesmente ignorado sem gerar erro.
        const stmt = db.prepare('INSERT OR IGNORE INTO Users (name, email) VALUES (?, ?)');
        const info = stmt.run(name, email);

        // 'info.changes' será 1 se uma nova linha foi inserida, e 0 se o usuário já existia.
        if (info.changes > 0) {
            console.log(`Usuário registrado no banco de dados local: ${email}`);
            return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
        } else {
            console.log(`Usuário já existente no banco de dados local: ${email}`);
            return res.status(200).json({ message: 'Login de usuário existente.' });
        }

    } catch (error) {
        console.error("Erro na API ao sincronizar usuário:", error);
        return res.status(500).json({ error: 'Falha ao sincronizar usuário com o banco de dados.' });
    } finally {
        // Garante que a conexão com o banco de dados seja sempre fechada
        if (db) {
            db.close();
        }
    }
}
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database', 'orquidea.db');

export default function handler(req, res) {
    // Este endpoint só aceita requisições GET
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    // O email do usuário será passado como um parâmetro na URL
    // Ex: /api/monitored-researchers?userEmail=teste@exemplo.com
    const { userEmail } = req.query;

    if (!userEmail) {
        return res.status(400).json({ error: 'O email do usuário é obrigatório.' });
    }

    let db;
    try {
        // Abre o banco de dados em modo "somente leitura", uma boa prática para queries GET
        db = new Database(dbPath, { readonly: true }); 

        // Esta é a query principal. Ela junta 3 tabelas:
        // 1. Encontra o usuário na tabela `Users` pelo email.
        // 2. Usa o ID desse usuário para encontrar suas relações na tabela `UserMonitorsResearcher`.
        // 3. Usa o ORCID da relação para buscar os dados do pesquisador na tabela `Researchers`.
        const query = `
            SELECT R.orcid_id, R.name
            FROM Users U
            JOIN UserMonitorsResearcher UMR ON U.id = UMR.user_id
            JOIN Researchers R ON UMR.researcher_orcid_id = R.orcid_id
            WHERE U.email = ?
            ORDER BY R.name;
        `;

        const stmt = db.prepare(query);
        const researchers = stmt.all(userEmail);

        // A PARTIR DAQUI, REMOVA A LÓGICA DE MOCKUP ANTERIOR E DEIXE APENAS:
        // A API vai retornar exatamente o que o banco tem. Vamos adicionar a instituição na proxima etapa.
        // Por enquanto, vamos retornar um valor padrão para não quebrar o card.
        const responseData = researchers.map(r => ({
            orcid_id: r.orcid_id,
            name: r.name,
            institution: "Universidade Exemplo" // Placeholder
        }));

        res.status(200).json(responseData);

    } catch (error) {
        console.error("API Error fetching monitored researchers:", error);
        res.status(500).json({ error: 'Falha ao buscar dados do banco de dados.' });
    } finally {
        // Garante que a conexão com o banco de dados seja sempre fechada
        if (db) {
            db.close();
        }
    }
}
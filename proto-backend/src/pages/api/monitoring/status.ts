// src/pages/api/monitoring/status.js

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database', 'orquidea.db');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { userEmail, orcid } = req.query;

    if (!userEmail || !orcid) {
        return res.status(400).json({ error: 'Email do usuário e ORCID do pesquisador são obrigatórios.' });
    }

    let db;
    try {
        db = new Database(dbPath, { readonly: true });

        // Esta query verifica se existe uma entrada na tabela de junção
        // que conecta o usuário (encontrado pelo email) e o pesquisador (encontrado pelo ORCID).
        // COUNT(*) é muito eficiente para apenas verificar a existência.
        const query = `
            SELECT COUNT(*) as count
            FROM UserMonitorsResearcher umr
            JOIN Users u ON u.id = umr.user_id
            WHERE u.email = ? AND umr.researcher_orcid_id = ?;
        `;

        const stmt = db.prepare(query);
        const result = stmt.get(userEmail, orcid);

        // Se a contagem for maior que 0, significa que a relação de monitoramento existe.
        const isMonitored = result.count > 0;

        res.status(200).json({ isMonitored });

    } catch (error) {
        console.error("API Error checking monitoring status:", error);
        res.status(500).json({ error: 'Falha ao verificar status no banco de dados.', details: error.message });
    } finally {
        if (db) {
            db.close();
        }
    }
}
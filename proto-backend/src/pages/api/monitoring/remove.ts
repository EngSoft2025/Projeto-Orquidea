// src/pages/api/monitoring/remove.js

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database', 'orquidea.db');

export default function handler(req, res) {
    // Usaremos POST para este endpoint para facilitar o envio de dados no corpo
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    let db;
    try {
        db = new Database(dbPath);

        const { userEmail, orcid } = req.body;

        if (!userEmail || !orcid) {
            return res.status(400).json({ error: 'Email do usuário e ORCID do pesquisador são obrigatórios.' });
        }

        // 1. Encontrar o ID do usuário
        const user = db.prepare('SELECT id FROM Users WHERE email = ?').get(userEmail);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // 2. Executar o DELETE na tabela de junção
        // Isso remove a linha que conecta este usuário a este pesquisador
        const stmt = db.prepare('DELETE FROM UserMonitorsResearcher WHERE user_id = ? AND researcher_orcid_id = ?');
        const info = stmt.run(user.id, orcid);

        if (info.changes > 0) {
            res.status(200).json({ message: 'Pesquisador removido do monitoramento com sucesso.' });
        } else {
            res.status(404).json({ message: 'Relação de monitoramento não encontrada.' });
        }

    } catch (error) {
        console.error("API Error removing from monitoring:", error);
        res.status(500).json({ error: 'Falha ao remover pesquisador do monitoramento.' });
    } finally {
        if (db) {
            db.close();
        }
    }
}
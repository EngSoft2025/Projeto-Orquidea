// src/pages/api/sync-user.js
import Database from "better-sqlite3";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// O caminho correto para o seu banco de dados, baseado na sua estrutura de projeto
const dbPath = path.join(process.cwd(), "src", "database", "orquidea.db");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let db;
  try {
    // Conecta ao banco de dados
    db = new Database(dbPath);

    const { userEmail } = req.body;

    // Validação básica dos dados recebidos
    if (!userEmail) {
      return res
        .status(400)
        .json({ error: "Id de usuário e inscrição são obrigatórios." });
    }

    // 1. Encontrar o ID do usuário
    const user = db
      .prepare("SELECT id FROM Users WHERE email = ?")
      .get(userEmail);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Use 'INSERT OR IGNORE' para adicionar o usuário apenas se ele não existir.
    // A verificação é feita pela restrição 'UNIQUE' na coluna 'email'.
    // Se o email já existir, o comando é simplesmente ignorado sem gerar erro.
    const stmt = db.prepare(
      "DELETE FROM UserPushSubscriptions WHERE user_id = ?"
    );
    const info = stmt.run(user.id);

    if (info.changes > 0) {
      res
        .status(200)
        .json({
          message: "Inscrições push removidas com sucesso.",
        });
    } else {
      res
        .status(404)
        .json({ message: "Inscrições push não encontradas." });
    }
  } catch (error) {
    console.error("Erro na API ao remover inscrição:", error);
    return res
      .status(500)
      .json({ error: "Falha ao remover inscrição com o banco de dados." });
  } finally {
    // Garante que a conexão com o banco de dados seja sempre fechada
    if (db) {
      db.close();
    }
  }
}

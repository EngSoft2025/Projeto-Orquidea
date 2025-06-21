// src/pages/api/sync-user.js
import { sendPushNotification } from "@/lib/webpush";
import Database from "better-sqlite3";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// O caminho correto para o seu banco de dados, baseado na sua estrutura de projeto
const dbPath = path.join(process.cwd(), "src", "database", "orquidea.db");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let db;
  try {
    // Conecta ao banco de dados
    db = new Database(dbPath);

    const { userEmail, subscription, title } = req.body;

    // Validação básica dos dados recebidos
    if (!userEmail || !subscription || !title) {
      return res
        .status(400)
        .json({ error: "Id de usuário e inscrição são obrigatórios." });
    }

    await sendPushNotification(subscription, title);

    return res.status(200).json({});
  } catch (error) {
    console.error("Erro na API ao testar notificação push", error);
    return res
      .status(500)
      .json({ error: "Falha ao sincronizar inscrição com o banco de dados." });
  } finally {
    // Garante que a conexão com o banco de dados seja sempre fechada
    if (db) {
      db.close();
    }
  }
}

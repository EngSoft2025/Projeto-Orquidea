import { checkAllResearchersForUpdates } from '@/lib/tasks'; // Importe sua função

export default async function handler(req, res) {
    // Protege a API com um token secreto
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await checkAllResearchersForUpdates();
        res.status(200).json({ message: 'Verificação de atualizações concluída com sucesso.' });
    } catch (error) {
        console.error("Erro no handler do cron:", error);
        res.status(500).json({ error: 'Falha ao executar a verificação de atualizações.' });
    }
}
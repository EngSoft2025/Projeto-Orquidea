import nodemailer from 'nodemailer';
import type { OrcidWorkSummary } from './profile_info_query'; // Ajuste o tipo se necessário

// Variável para armazenar o transportador e reutilizá-lo
let transporter: nodemailer.Transporter | null = null;

function getGmailClient() {
    // Se o transportador ainda não foi criado, crie-o.
    // Isso evita recriar a conexão a cada e-mail enviado.
    if (!transporter) {
        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;

        if (!user || !pass) {
            throw new Error("Credenciais do Gmail (GMAIL_USER, GMAIL_APP_PASSWORD) não encontradas no .env.local");
        }

        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: user,
                pass: pass, // Use a Senha de App aqui
            },
        });
    }
    return transporter;
}

/**
 * Envia um e-mail de notificação de atualização usando uma conta do Gmail.
 * @param userEmail O e-mail do destinatário.
 * @param researcherName O nome do pesquisador que foi atualizado.
 * @param newPublications A lista de novas publicações encontradas.
 */
export async function sendUpdateEmail(
    userEmail: string, 
    researcherName: string, 
    newPublications: OrcidWorkSummary[]
) {
    try {
        const mailer = getGmailClient();

        const publicationTitles = newPublications.map(p => `<li>${p.title?.title?.value}</li>`).join('');

        const mailOptions = {
            from: `"Projeto Orquídea" <${process.env.GMAIL_USER}>`, // Seu e-mail do Gmail como remetente
            to: userEmail, // O destinatário da notificação
            subject: `Novas publicações de ${researcherName}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6;">
                    <h2>Alerta de Monitoramento - Projeto Orquídea</h2>
                    <p>Olá!</p>
                    <p>Detectamos <strong>${newPublications.length} nova(s) publicação(ões)</strong> para o pesquisador <strong>${researcherName}</strong>, que você está monitorando:</p>
                    <ul style="padding-left: 20px;">
                        ${publicationTitles}
                    </ul>
                    <p>Acesse o perfil na plataforma para mais detalhes.</p>
                    <br/>
                    <p><em>Equipe do Projeto Orquídea</em></p>
                </div>
            `,
        };

        const info = await mailer.sendMail(mailOptions);
        console.log(`Email de notificação enviado com sucesso para ${userEmail}. Message ID: ${info.messageId}`);

    } catch (error) {
        console.error(`Falha ao enviar e-mail para ${userEmail} via Gmail:`, error);
    }
}
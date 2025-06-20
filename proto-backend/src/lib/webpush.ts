import webpush from "web-push";
import { OrcidWorkSummary } from "./profile_info_query_secondary";

webpush.setVapidDetails(
  "mailto:" + process.env.GMAIL_USER,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  researcherName: string,
  newPublications: OrcidWorkSummary[]
) {
  try {
    const publicationTitles = newPublications
      .map((p) => ` - ${p.title?.title?.value}`)
      .join("\n");

    const title = `Novas publicações de ${researcherName}`;
    const body = [
      `Olá!`,
      `Detectamos ${newPublications.length} nova(s) publicação(ões) para o pesquisador ${researcherName}, que você está monitorando:`,
      publicationTitles,
    ].join("\n");

    console.log(
      `Notificação push enviada com sucesso para ${subscription.endpoint}.`
    );

    return await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body,
        tag: `researcher-${researcherName}`,
      })
    );
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error);
  }
}

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
) {
  try {
    const title = `Novas publicações de ${researcherName}`;

    console.log(
      `Notificação push enviada com sucesso para ${subscription.endpoint}.`
    );

    return await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        tag: `researcher-${researcherName}`,
      })
    );
  } catch (error) {
    console.error("Erro ao enviar notificação push:", error);
  }
}

import { Models } from "appwrite";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function subscribeUser(userEmail: string, subscription: PushSubscription) {
  return fetch("/api/push/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail, subscription }),
  });
}

function unsubscribeUser(userEmail: string) {
  return fetch("/api/push/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ userEmail }),
  });
}

interface PushNotificationManagerProps {
  currentUser: Models.User<Models.Preferences> | null;
}

export function PushNotificationManager({
  currentUser,
}: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const email = currentUser?.email;
    if (!email) {
      console.error(
        "User email is required to subscribe to push notifications."
      );
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(email, serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    const email = currentUser?.email;
    if (!email) {
      console.error(
        "User email is required to unsubscribe from push notifications."
      );
      return;
    }
    await unsubscribeUser(email);
  }

  async function sendTestPush() {
    const email = currentUser?.email;
    if (!email) {
      console.error("User email is required to send a test push notification.");
      return;
    }

    if (!subscription) {
      console.error("No push subscription found.");
      return;
    }

    await fetch("/api/push/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
        subscription,
        title: "Teste de Notificação",
      }),
    });
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      {currentUser && isSupported ? (
        subscription ? (
          <>
            <Button onClick={unsubscribeFromPush} variant="destructive">
              Cancelar notificações push
            </Button>

            <Button onClick={sendTestPush}>Enviar notificação teste</Button>
          </>
        ) : (
          <Button onClick={subscribeToPush}>Assinar notificações push</Button>
        )
      ) : null}
    </div>
  );
}

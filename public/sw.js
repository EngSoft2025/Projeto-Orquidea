// @ts-check
/// <reference lib="WebWorker" />
/// <reference lib="es2020" />

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);

sw.addEventListener("push", (event) => {
  if(!event.data) {
    console.warn("Push event received without data.");
    return;
  }
  const data = event.data.json();
  /** @type {NotificationOptions} */
  const notificationOptions = {
    body: data.body,
    tag: data.tag, // Use a unique tag to prevent duplicate notifications
    icon: data.icon,
    data: data.data,
  };

  sw.registration.showNotification(data.title, notificationOptions);
});

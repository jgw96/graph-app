importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

importScripts(
  "https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js"
);

// This is your Service Worker, you can put any of your custom Service Worker
// code in this file, above the `precacheAndRoute` line.

// notifications shit
self.addEventListener('push', async (event) => {
  if (event.data) {
    console.log('This push event has data: ', event.data.json());

    // build notification
    const data = event.data.json();

    if (data.title && data.title === "New Emails") {
      const mailData = await getLatestMail();

      // how many unread emails do we have?
      const unread = mailData.filter((email) => {
        return email.isRead === false;
      });

      // set badge
      await navigator.setAppBadge(unread.length);

      const options = {
        body: `You have ${unread.length} unread emails`,
        icon: "/assets/icons/512.png",
        vibrate: [100, 100, 100],
      };

      // show notification
      self.registration.showNotification(data.title, options);
    }
    else {
      const options = {
        body: data.body || "No body",
        icon: "/assets/icons/512.png",
        vibrate: [100, 100, 100],
      };

      // show notification
      event.waitUntil(self.registration.showNotification(data.title, options));
    }

  } else {
    console.log('This push event has no data.');
  }
});

self.addEventListener("notificationclick", (event) => {
  // close notification
  event.notification.close();

  const promiseChain = clients.openWindow("/");
  event.waitUntil(promiseChain);
});

const syncContent = async () => {
  if (navigator.connection.effectiveType === "4g") {
    const token = await idbKeyval.get("graphToken");

    if (token) {
      const headers = new Headers();
      const bearer = "Bearer " + token;
      headers.append("Authorization", bearer);
      const options = {
        method: "GET",
        headers: headers,
      };
      const graphEndpoint = `https://graph.microsoft.com/beta/me/messages`;

      const response = await fetch(graphEndpoint, options);

      const cache = await caches.open("offline-mail");

      if (cache) {
        const cacheResp = await cache.matchAll(graphEndpoint);
        cacheResp.forEach(async (element, index, array) => {
          await cache.delete(element);
        });

        await navigator.setAppBadge();

        cache.put(graphEndpoint, response);

        if (Notification.permission === "granted") {
          const options = {
            body: "New email was received in the background",
            icon: "/assets/icons/48.png",
            vibrate: [100],
            data: {
              dateOfArrival: Date.now(),
            },
            actions: [
              { action: "open", title: "Open" },
              { action: "close", title: "Close" },
            ],
          };
          await registration.showNotification("New mail available", options);
        }
      }
    }
  }
};

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  ({ url }) =>
    url.href === "https://graph.microsoft.com/beta/me/messages",
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "offline-mail",
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 19 * 60, // 5 minutes
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);

const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
  "sentEmail",
  {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
  }
);

const attachBgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
  "attemptedAttach",
  {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
  }
);

const unsubBgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
  "unsubAttempts",
  {
    maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
  }
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("me/sendEmail"),
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin],
  }),
  "POST"
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("/$value"),
  new workbox.strategies.NetworkOnly({
    plugins: [attachBgSyncPlugin],
  })
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("/unsubscribe"),
  new workbox.strategies.NetworkOnly({
    plugins: [unsubBgSyncPlugin],
  }),
  "POST"
);

self.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  const action = event.action;

  if (action === "close") {
    notification.close();
  } else {
    clients.openWindow(
      notification.body.substring(notification.body.indexOf("https"))
    );
    notification.close();
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "mail-sync") {
    event.waitUntil(syncContent());
  }
});

async function getLatestMail() {
  const token = await idbKeyval.get("graphToken");
  console.log("token", token);

  if (token) {
    const headers = new Headers();
    const bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    const fetchOptions = {
      method: "GET",
      headers: headers,
    };
    const graphEndpoint = `https://graph.microsoft.com/beta/me/messages`;

    const response = await fetch(graphEndpoint, fetchOptions);

    const mailData = await response.json();

    return mailData.value;
  }
}

async function shareTargetHandler({ event }) {
  const formData = await event.request.formData();
  const mediaFiles = formData.getAll("file");
  const cache = await caches.open("shareTarget");

  for (const mediaFile of mediaFiles) {
    await cache.put(
      // TODO: Handle scenarios in which mediaFile.name isn't set,
      // or doesn't include a proper extension.
      mediaFile.name,
      new Response(mediaFile, {
        headers: {
          "content-length": mediaFile.size,
          "content-type": mediaFile.type,
        },
      })
    );
  }

  return Response.redirect(`/newEmail?name=${mediaFiles[0].name}`, 303);
}

workbox.routing.registerRoute("/attach/file/", shareTargetHandler, "POST");

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("comlink"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("fast-components"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("ionic"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("@pwabuilder"),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("/me/drive/recent/"),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("/mailFolders"),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  ({ url }) => url.href.includes("/messages"),
  new workbox.strategies.StaleWhileRevalidate()
);

self.addEventListener("widgetclick", (event) => {
  if (event.action && event.action === "widget-install") {
    try {
      event.waitUntil(renderWidget(event.widget))
    }
    catch (err) {
      console.log(err)
    }
  }
});

self.addEventListener('activate', (event) => {
  event.waitUntil(renderWidget(event.widget));
});

async function renderWidget(widget) {
  const templateUrl = widget.definition.msAcTemplate;

  const template = await (await fetch(templateUrl)).json();

  const initData = await (await fetch(widget.definition.data)).json();

  const token = await idbKeyval.get("graphToken");

  if (token) {
    const headers = new Headers();
    const bearer = "Bearer " + token;
    headers.append("Authorization", bearer);
    const options = {
      method: "GET",
      headers: headers,
    };
    const graphEndpoint = `https://graph.microsoft.com/beta/me/messages`;

    const response = await fetch(graphEndpoint, options);
    const data = await response.json();

    if (data.value) {
      initData.messages = data.value;
    }
  }

  try {
    await self.widgets.updateByTag(widget.definition.tag, {
      template: JSON.stringify(template),
      data: JSON.stringify(initData)
    });
  } catch (e) {
    console.log('Failed to update widget', e);
  }
}

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
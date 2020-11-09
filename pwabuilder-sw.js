importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('https://cdn.jsdelivr.net/npm/idb-keyval@3/dist/idb-keyval-iife.min.js');


self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  ({ url }) => url.href.includes('https://graph.microsoft.com/beta/me/messages'),
  new workbox.strategies.CacheFirst({
    cacheName: 'stories',
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

const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('sentEmail', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

const syncContent = async () => {
  if (navigator.connection.effectiveType === "4g") {
    const token = await idbKeyval.get('graphToken');

    if (token) {
      const headers = new Headers();
      const bearer = "Bearer " + token;
      headers.append("Authorization", bearer);
      const options = {
        method: "GET",
        headers: headers
      };
      const graphEndpoint = `https://graph.microsoft.com/beta/me/messages/`;

      const response = await fetch(graphEndpoint, options);
      const data = await response.json();

      console.log(data.value);

      await idbKeyval.set('latestMail', data.value);
    }
  }
}

workbox.routing.registerRoute(
  ({ url }) => url.href.includes('me/sendEmail'),
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

self.addEventListener('notificationclick', (event) => {
  clients.openWindow(event.notification.body.split("Mail: ").pop());
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'mail-sync') {
    // See the "Think before you sync" section for
    // checks you could perform before syncing.
    event.waitUntil(syncContent());
  }
  // Other logic for different tags as needed.
});

async function shareTargetHandler({ event }) {
  event.respondWith(Response.redirect("/"));

  event.waitUntil(async function () {
    const data = await event.request.formData();
    console.log('data', data);
    const client = await self.clients.get(event.resultingClientId || event.clientId);
    // Get the data from the named element 'file'
    const file = data.get('file');

    console.log('file', file);
    client.postMessage({ file, action: 'load-image' });
  }());

  // Do something with the rest of formData as you need
  // Maybe save it to IndexedDB
};

workbox.routing.registerRoute(
  '/attach/file/',
  shareTargetHandler,
  'POST'
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
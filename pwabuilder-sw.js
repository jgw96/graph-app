importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

/**
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

const API_CACHE_NAME = "stories";
const DEFAULT_TAG = "service-worker";
const PBS_TAG = "content-sync";

async function initialize() {
    if ('periodicSync' in self.registration) {
        self.addEventListener('periodicsync', (event) => {
            event.waitUntil((async () => {
                const cache = await caches.open(API_CACHE_NAME);
                const url = event.url.href.includes('https://graph.microsoft.com/me/messages') ? event.url : null;

                console.log(url);

                if (url) {
                    await cache.add(url);
                    console.log(`In periodicsync handler, updated`, url);
                }
            })());
        });

        const status = await self.navigator.permissions.query({
            name: 'periodic-background-sync',
        });

        if (status.state === 'granted') {
            const tags = await self.registration.periodicSync.getTags();
            if (tags.includes(PBS_TAG)) {
                console.log(`Already registered for periodic background sync with tag`,
                    PBS_TAG);
            } else {
                try {
                    await registration.periodicSync.register(PBS_TAG, {
                        // An interval of one day.
                        minInterval: 24 * 60 * 60 * 1000,
                    });
                    console.log(`Registered for periodic background sync with tag`,
                        PBS_TAG);
                } catch (error) {
                    console.error(`Periodic background sync permission is 'granted', ` +
                        `but something went wrong:`, error);
                }
            }
        } else {
            console.info(`Periodic background sync permission is not 'granted', so ` +
                `skipping registration.`);
        }
    } else {
        console.log(`Periodic background sync is not available in this browser.`);
    }
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

workbox.routing.registerRoute(
  ({url}) => url.href.includes('https://graph.microsoft.com/me/messages'),
  new workbox.strategies.CacheFirst({
      cacheName: 'stories',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
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

workbox.routing.registerRoute(
  ({url}) => url.href.includes('me/sendEmail'),
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin]
  }),
  'POST'
);

self.addEventListener('notificationclick', (event) => {
  clients.openWindow(event.notification.body.split("Mail: ").pop());
});

initialize();

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);
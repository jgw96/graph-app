importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

// This is your Service Worker, you can put any of your custom Service Worker
// code in this file, above the `precacheAndRoute` line.

// cache requests to the microsoft graph api with workbox-sw
workbox.routing.registerRoute(
    ({url}) => {
        // does url contain me/messages?
        return url.href.includes('me/messages');
    },
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
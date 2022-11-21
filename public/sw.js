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

self.addEventListener("widgetclick", (event) => {
    if (event.action && event.action === "widget-install") {
        event.waitUntil(renderWidget(event.widget))
    }
});

async function renderWidget(widget) {
    const templateUrl = widget.definition.msAcTemplate;
    const dataUrl = widget.definition.data;

    const template = await (await fetch(templateUrl)).text();
    const data = await (await fetch(dataUrl)).text();

    await self.widgets.updateByTag(widget.definition.tag, {template, data});
}

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { registerRoute, Route } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import env from "env";

const NAME_PRECACHE = "PreCache";

if (!env.IS_DEVELOPMENT) {
    self.__WB_DISABLE_DEV_LOGS = true;
}
const PRECACHE_LIST = self.__WB_MANIFEST;
precacheAndRoute(PRECACHE_LIST);


// A new route that matches same-origin image requests and handles
// them with the cache-first, falling back to network strategy:
const staticRoute = new Route(({ request, sameOrigin }) => {
    return sameOrigin && ['image', 'script', 'style', 'video', 'document'].includes(request.destination);
}, new CacheFirst({
    cacheName: NAME_PRECACHE,
    plugins: [
        new ExpirationPlugin({
            maxAgeSeconds: 60 * 60 * 24 * 30,
        }),
    ]
}));

// Register the new route
registerRoute(staticRoute);

addEventListener("install", (event) => {
    self.skipWaiting();
});

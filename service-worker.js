<<<<<<< HEAD
const CACHE_NAME = 'workout-tracker-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => { Jacob
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
=======
const CACHE_NAME = 'workout-tracker-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => { Jacob
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
>>>>>>> 820771c9634541779e8cb30501a1a1a25bb1446f

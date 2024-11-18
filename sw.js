const CACHE_NAME = `temperature-converter-v1`;

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([
            '/',
            '/converter.js',
            '/converter.css'
        ]);
    })());
});

self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);

        // Get the resource from the cache.
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            return cachedResponse;
        } else {
            try {
                // If the resource was not in the cache, try the network.
                const fetchResponse = await fetch(event.request);

                // Save the resource in the cache and return it.
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            } catch (e) {
                // The network failed.
            }
        }
    })());
});

self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    const action = event.action;
    const link = notification.data.link;
    if (action !== 'close') {
        if (link) {
            clients.openWindow(link);
        }
    }
    notification.close();
    console.log('notificationclick action is', action);
})

self.addEventListener('push', event => {
    console.log('[Service Worker] Push Received.');
    let title = 'Server Push';
    let options = {
        body: 'push TEST',
        icon: './assets/images/android_048.png'
    };
    if (event.data) {
        options = event.data.json();
        title = options.title;
    }

    event.waitUntil(self.registration.showNotification(title, options));
});

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");
importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.7.0/firebase-messaging.js');

workbox.clientsClaim();
workbox.skipWaiting();

workbox.precaching.precacheAndRoute([
    // 要快取的檔案
]);

// firebase config
var config = {
    apiKey: "BF1yuvAoZL0G119dhJeZEQeNAMkPAX_T55zLHVEI0i3sBIN_KYUE2AvchrAceK6HoX8YadHeXocUp7KuVYpe928",
    authDomain: "pwa114.firebaseapp.com",
    projectId: "pwa114",
    storageBucket: "pwa114.firebasestorage.app",
    messagingSenderId: "665617311410",
    appId: "1:665617311410:web:bbc9f3a25204c0b9338bab",
    measurementId: "G-7TG5F5SRZV"
};
firebase.initializeApp(config);

var messaging = firebase.messaging();
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
    apiKey: "AIzaSyC6aaGbABDxCwGDvEnR2dsKFog2lgekshI",
    authDomain: "pwa114.firebaseapp.com",
    projectId: "pwa114",
    storageBucket: "pwa114.firebasestorage.app",
    messagingSenderId: "665617311410",
    appId: "1:665617311410:web:cdb0e1ac4e0a7cc9338bab",
    measurementId: "G-S46CE8PT24",
};
firebase.initializeApp(config);

var messaging = firebase.messaging();

window.addEventListener('load', function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(function (reg) {
                // firebase methods，用同一支sw.js
                messaging.useServiceWorker(reg);
            })
            // 註冊失敗
            .catch(function (err) {
                console.log('error: ', err);
            });
    }

    messaging.requestPermission().then(function () {

        // 先判斷cookies有沒有token，沒有再取token
        var ckv = document.cookie.replace(/(?:(?:^|.*;\\s*)augustusWsPush\s*\=\s*([^;]*).*$)|^.*$/, "$1") || null;

        // cookies不存在，跟使用者要求通知權限
        if (ckv === null) {
            // 拿到token，firebase-messaging-sw.js 就會存 Service Workers 裡
            messaging.getToken().then(function (currentToken) {

                // token存至firebase
                var id = currentToken.split(':')[0];
                firebase.database().ref('pushUsers/' + id).set({ 'token': currentToken });

                // token存至cookies
                document.cookie = "augustusWsPush=" + currentToken;

            });
        }
        // cookies 已存在，從 cookies 取出後傳至 firebase
        else {
            var id = ckv.split(':')[0];
            firebase.database().ref('pushUsers/' + id).set({ 'token': ckv });
        }

    }).catch(function (err) {
        console.log('使用者未允許通知', err);
    });

});

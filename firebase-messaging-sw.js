importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in the messagingSenderId
firebase.initializeApp({
  apiKey: "AIzaSyC6aaGbABDxCwGDvEnR2dsKFog2lgekshI",
  authDomain: "pwa114.firebaseapp.com",
  projectId: "pwa114",
  storageBucket: "pwa114.firebasestorage.app",
  messagingSenderId: "665617311410",
  appId: "1:665617311410:web:bbc9f3a25204c0b9338bab",
  measurementId: "G-7TG5F5SRZV"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// Nama cache dan daftar asset awal yang akan disimpan di cache
const cacheName = 'v1';
const cacheAssets = [
  '/index.html',
  '/portofolio.html',
  '/resume.html',
  '/script.js',
  '/images/Shafira.jpg',
  '/images/Logo_CV.png',
  '/portofolio/portofolio1.png',
  '/portofolio/portofolio2.png',
  '/cv/Shafira_CV.pdf',
  '/cv/resume_shafira.JPG',
  '/style.css',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.10/typed.min.js'
];

// Install event - caching assets saat pertama kali service worker terpasang
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('Service Worker: Caching Files');
            return cache.addAll(cacheAssets);
        }).then(function() {
            self.skipWaiting();
        }).catch(function(error) {
            console.error('Failed to cache some assets:', error);
        })
    );
});

// Activate event - membersihkan cache lama
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys().then(function(cacheKeys) {
            return Promise.all(
                cacheKeys.map(function(oldCacheName) {
                    if (oldCacheName !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(oldCacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - caching dengan pengecualian untuk permintaan 'chrome-extension'
self.addEventListener('fetch', function(event) {
    if (event.request.url.startsWith('chrome-extension')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }

            return fetch(event.request).then(function(networkResponse) {
                if (networkResponse && networkResponse.ok) {
                    let responseClone = networkResponse.clone();
                    caches.open(cacheName).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            }).catch(function() {
                return caches.match('/index.html'); // Fallback ke halaman utama jika offline
            });
        })
    );
});

firebase.initializeApp({
    apiKey: "AIzaSyBtpvn07blOacc0ejq224rD1hX05NobtfY",
    authDomain: "portofolio-608b3.firebaseapp.com",
    projectId: "portofolio-608b3",
    storageBucket: "portofolio-608b3.firebasestorage.app",
    messagingSenderId: "170764643590",
    appId: "1:170764643590:web:1640fc133c822d7e8b8287",
    measurementId: "G-VBMNS54FQZ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'Shafira CV';
  const notificationOptions = {
    body: 'Halo! Selamat Datang di Shafira CV',
    icon: 'images/Logo_CV.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = "productivity-app-cache-v1";
const urlsToCache = [
  "/",
  "Productivity_App/index.html",
  "Productivity_App/styles.css",
  "Productivity_App/script.js",
  "Productivity_App/manifest.json",
  "Productivity_App/icon-192.png",
  "Productivity_App/icon-512.png", 
  "Productivity_App/beep-329314.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Reminder';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Optionally, handle notification click events
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css", // Change if your CSS file has a different name
  "/script.js",  // Change if your JS file has a different name
  "/icon-192.png",
  "/icon-512.png",
];

// Install event — caching files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event — serve cached files when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
const CACHE_NAME = 'cheatsheet-v0.0.32';
const BASE_PATH = '/cheatsheet-generate/';

const STATIC_ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/brand/icon.svg',
  BASE_PATH + 'assets/brand/icon-192x192.png',
  BASE_PATH + 'assets/brand/icon-512x512.png',
  BASE_PATH + 'css/variables.css',
  BASE_PATH + 'css/common.css',
  BASE_PATH + 'assets/common.js',
  BASE_PATH + 'assets/nav-query.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  if (url.origin !== self.location.origin) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {
        if (cached) return cached;
        
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
            
            return response;
          })
          .catch(() => {
            return caches.match(BASE_PATH + 'index.html');
          });
      })
  );
});

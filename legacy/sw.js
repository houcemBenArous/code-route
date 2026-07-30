/**
 * sw.js — Code Route Service Worker
 * Caches all app assets for full offline support.
 */

const CACHE_NAME = 'code-route-v1';

const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/questions.js',
  '/js/quiz.js',
  '/js/course.js',
  '/icons/icon.svg',
  '/icons/icon-192.svg',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap',
];

// ─── Install: cache all assets ────────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate: clean up old caches ───────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch: serve from cache, fall back to network ───────────────────────────
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => {
        // If offline and not cached, return the main page as fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

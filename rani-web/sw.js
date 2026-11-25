/* RANI AI service worker — installable PWA, offline shell cache.
 * Cache-first for the app shell only. API calls (Gemini / Supabase /
 * Firebase) are never cached. Bump CACHE_NAME when the shell changes.
 */
var CACHE_NAME = 'rani-ai-v1';
var SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon.svg',
  './js/config.example.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(SHELL); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var url = new URL(event.request.url);
  // Never cache API traffic.
  if (url.hostname.indexOf('googleapis.com') !== -1 ||
      url.hostname.indexOf('supabase') !== -1 ||
      url.hostname.indexOf('firebase') !== -1 ||
      url.hostname.indexOf('google.com') !== -1) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
        return res;
      }).catch(function () { return caches.match('./index.html'); });
    })
  );
});

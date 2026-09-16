// Service Worker - Challenge 02 (PWA)
// Estrategia hibrida vista en clase:
//   HTML          -> Network First   (para no servir versiones viejas)
//   JS / CSS      -> Cache First     (porque el nombre de archivo trae hash)
//   Imagenes      -> Cache First + Stale While Revalidate (rendimiento)
//   APIs          -> Network First   (esta app no consume APIs externas)

const CACHE_NAME = 'contactos-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function isHTML(request) {
  return request.mode === 'navigate' || request.destination === 'document';
}

function isStaticAsset(request) {
  return request.destination === 'script' || request.destination === 'style';
}

function isImage(request) {
  return request.destination === 'image';
}

// Network First: intenta la red, si falla usa la copia en cache.
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

// Cache First: usa la copia en cache si existe, si no va a la red.
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  cache.put(request, response.clone());
  return response;
}

// Stale While Revalidate: responde con la cache de inmediato (si existe)
// y en paralelo actualiza la cache con la version de red.
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const networkFetch = fetch(request)
    .then((response) => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  return cached || networkFetch;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (isHTML(request)) {
    event.respondWith(networkFirst(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isImage(request)) {
    event.respondWith(staleWhileRevalidate(request));
  }
  // cualquier otra request (por ejemplo una API futura) usa network first
  else {
    event.respondWith(networkFirst(request));
  }
});

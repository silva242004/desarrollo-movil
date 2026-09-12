// Service Worker de MediClinic (PWA) - Estrategia híbrida vista en clase:
//
//   Recurso        Estrategia                          Por qué
//   HTML           Network First                       evita servir una versión vieja
//   JS / CSS       Cache First                          el nombre del archivo trae hash
//   Imágenes       Cache First - Stale While Revalidate rendimiento, se refrescan en 2do plano
//   Otro (API/etc) Network First                        datos actualizados
//
// No hay backend en este proyecto, pero se deja la rama "API" por si se agrega.

const CACHE_NAME = 'mediclinic-pwa-v1'
const APP_SHELL = ['/', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png']

// Paso 3/4: crear e instalar el service worker (precache del app shell)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

async function networkFirst(request) {
  try {
    const respuestaRed = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, respuestaRed.clone())
    return respuestaRed
  } catch (error) {
    const respuestaCache = await caches.match(request)
    if (respuestaCache) return respuestaCache
    throw error
  }
}

async function cacheFirst(request) {
  const respuestaCache = await caches.match(request)
  if (respuestaCache) return respuestaCache
  const respuestaRed = await fetch(request)
  const cache = await caches.open(CACHE_NAME)
  cache.put(request, respuestaRed.clone())
  return respuestaRed
}

async function cacheFirstStaleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME)
  const respuestaCache = await cache.match(request)
  const actualizacion = fetch(request)
    .then((respuestaRed) => {
      cache.put(request, respuestaRed.clone())
      return respuestaRed
    })
    .catch(() => undefined)
  return respuestaCache || actualizacion
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  if (request.destination === 'document') {
    event.respondWith(networkFirst(request))
  } else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(cacheFirst(request))
  } else if (request.destination === 'image') {
    event.respondWith(cacheFirstStaleWhileRevalidate(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})

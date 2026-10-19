const VERSION = 'v3'
const SHELL_CACHE = `lutins-shell-${VERSION}`
const ASSET_CACHE = `lutins-assets-${VERSION}`

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)

  // Navigations & HTML: network first (fresh app), fallback to cached shell offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone()
          caches.open(SHELL_CACHE).then((c) => c.put('/', copy))
          return res
        })
        .catch(() => caches.match('/') ),
    )
    return
  }

  // Assets: network first (les fichiers de public/assets/ ne sont pas hashés),
  // cache en repli hors-ligne — et on ne met jamais une erreur en cache
  if (url.origin === self.location.origin && (url.pathname.startsWith('/assets/') || url.pathname.includes('materialdesignicons'))) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(ASSET_CACHE).then((c) => c.put(event.request, copy))
          }
          return res
        })
        .catch(() => caches.match(event.request).then((cached) => cached || Response.error())),
    )
  }
})

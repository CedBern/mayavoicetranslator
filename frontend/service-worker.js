self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('mayavoice-v1').then(cache => {
      return cache.addAll([
        '/frontend/inicio.html',
        '/frontend/index.html',
        '/frontend/ingestion.html',
        '/frontend/admin.html',
        '/frontend/mis-tareas.html',
        '/frontend/validar-correcciones.html',
        '/assets/images/mayavoice-modern.svg',
        '/assets/images/icon.png',
        '/assets/images/adaptive-icon.png'
      ]);
    })
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

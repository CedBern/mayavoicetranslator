/**
 * 🔧 SERVICE WORKER TALKKIN - PWA OPTIMISÉ
 * 
 * Fonctionnalités :
 * - Cache strategies avancées
 * - Offline-first approach
 * - Background sync
 * - Push notifications
 * - Performance monitoring
 */

const CACHE_NAME = 'talkkin-v1.0.0';
const STATIC_CACHE = 'talkkin-static-v1';
const DYNAMIC_CACHE = 'talkkin-dynamic-v1';
const API_CACHE = 'talkkin-api-v1';
const IMAGES_CACHE = 'talkkin-images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/static/js/vendor.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/languages',
  '/api/translate',
  '/api/audio',
];

// Cache strategies
const CACHE_STRATEGIES = {
  static: 'cache-first',
  api: 'network-first',
  images: 'cache-first',
  dynamic: 'stale-while-revalidate',
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('✅ Service Worker: Installation complete');
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Service Worker: Installation failed', error);
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== API_CACHE &&
            cacheName !== IMAGES_CACHE
          ) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isApiRequest(url)) {
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(url)) {
    event.respondWith(handleImageRequest(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Cache strategies implementation
async function handleStaticAsset(request) {
  try {
    // Cache-first strategy
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Service Worker: Static asset fetch failed', error);
    return new Response('Offline', { status: 503 });
  }
}

async function handleApiRequest(request) {
  try {
    // Network-first strategy
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔄 Service Worker: Network failed, trying cache for API');
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API
    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        message: 'Please check your internet connection',
        offline: true,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

async function handleImageRequest(request) {
  try {
    // Cache-first strategy for images
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGES_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Service Worker: Image fetch failed', error);
    // Return placeholder image
    return new Response('', { status: 404 });
  }
}

async function handleDynamicRequest(request) {
  try {
    // Stale-while-revalidate strategy
    const cachedResponse = await caches.match(request);
    const networkResponsePromise = fetch(request);
    
    if (cachedResponse) {
      // Update cache in background
      networkResponsePromise.then((networkResponse) => {
        if (networkResponse.ok) {
          const cache = caches.open(DYNAMIC_CACHE);
          cache.then((c) => c.put(request, networkResponse.clone()));
        }
      }).catch(() => {
        // Ignore network errors for background updates
      });
      
      return cachedResponse;
    }
    
    // No cache, wait for network
    const networkResponse = await networkResponsePromise;
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Service Worker: Dynamic request failed', error);
    return new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.pathname.includes(asset)) ||
         url.pathname.includes('/static/') ||
         url.pathname.includes('/assets/');
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/') ||
         API_ENDPOINTS.some(endpoint => url.pathname.includes(endpoint));
}

function isImageRequest(url) {
  return /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url.pathname);
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-translation') {
    event.waitUntil(processOfflineTranslations());
  }
});

async function processOfflineTranslations() {
  try {
    // Get offline translations from IndexedDB or localStorage
    const offlineTranslations = await getOfflineTranslations();
    
    for (const translation of offlineTranslations) {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(translation),
        });
        
        if (response.ok) {
          await removeOfflineTranslation(translation.id);
          console.log('✅ Offline translation synced:', translation.id);
        }
      } catch (error) {
        console.error('❌ Failed to sync translation:', error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Push received');
  
  const options = {
    body: event.data ? event.data.text() : 'New translation available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: 'explore',
        title: 'Open TalkKin',
        icon: '/icons/checkmark.png',
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/icons/xmark.png',
      },
    ],
  };
  
  event.waitUntil(
    self.registration.showNotification('TalkKin', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PERFORMANCE_METRICS') {
    console.log('📊 Service Worker: Performance metrics received', event.data.metrics);
    // Send to analytics service
  }
});

// Helper functions for offline storage
async function getOfflineTranslations() {
  // Implementation would use IndexedDB
  return [];
}

async function removeOfflineTranslation(id) {
  // Implementation would remove from IndexedDB
  console.log('Removing offline translation:', id);
}

// Cache management utilities
async function clearOldCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames
      .filter(name => name.startsWith('talkkin-') && name !== CACHE_NAME)
      .map(name => caches.delete(name))
  );
}

async function getCacheSize() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  let totalSize = 0;
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const clone = response.clone();
      const buffer = await clone.arrayBuffer();
      totalSize += buffer.byteLength;
    }
  }
  
  return totalSize;
}

console.log('🔧 Service Worker: Loaded and ready');

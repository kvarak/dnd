/**
 * Service Worker for dnd.rigo.nu
 * Provides offline capability and performance caching for D&D reference materials
 * Optimized for tabletop gaming scenarios where internet may be unreliable
 */

const CACHE_NAME = 'dnd-rigo-nu-v1';
const OFFLINE_PAGE = '/dnd/offline.html';

// Critical resources to cache immediately on install
const CORE_CACHE = [
  '/dnd/',
  '/dnd/offline.html',
  '/dnd/assets/css/style.min.css',
  '/dnd/assets/vendor/bootstrap/bootstrap.min.css',
  '/dnd/assets/vendor/bootstrap/bootstrap.bundle.min.js',
  '/dnd/assets/vendor/jquery/jquery-3.7.1.min.js',
  '/dnd/assets/vendor/fontawesome/fontawesome-all.min.css',
  '/dnd/assets/vendor/fonts/buenard.css',
  '/dnd/assets/vendor/fonts/buenard-regular.ttf',
  '/dnd/assets/images/og-image.jpg',
  '/dnd/assets/js/search.min.js'
];

// Essential D&D reference pages to cache for offline gaming
const ESSENTIAL_PAGES = [
  '/dnd/docs/_RulesCharacter/character-creation.html',
  '/dnd/docs/_RulesCharacter/ability-scores.html',
  '/dnd/docs/_RulesCombat/combat.html',
  '/dnd/docs/_RulesMagic/spellcasting.html',
  '/dnd/docs/_RulesExtra/conditions.html'
];

// Install event - cache core resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core resources');
        return precacheResources(cache);
      })
      .then(() => {
        console.log('Service Worker: Core resources cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch(err => console.log('Service Worker: Cache failed', err))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - handle all network requests with appropriate caching strategy
self.addEventListener('fetch', event => {
  // Skip non-GET requests and external requests
  if (event.request.method !== 'GET' || !event.request.url.includes('/dnd/')) {
    return;
  }

  event.respondWith(
    handleRequest(event.request)
  );
});

/**
 * Pre-cache core resources with error handling
 */
async function precacheResources(cache) {
  const cachePromises = CORE_CACHE.map(async (url) => {
    try {
      await cache.add(url);
      console.log(`Cached: ${url}`);
    } catch (error) {
      console.warn(`Failed to cache ${url}:`, error);
      // Don't throw - continue with other resources
    }
  });

  await Promise.allSettled(cachePromises);

  // Also try to cache essential pages
  const pagePromises = ESSENTIAL_PAGES.map(async (url) => {
    try {
      await cache.add(url);
      console.log(`Cached essential page: ${url}`);
    } catch (error) {
      console.warn(`Failed to cache essential page ${url}:`, error);
    }
  });

  await Promise.allSettled(pagePromises);
}

/**
 * Handle different types of requests with appropriate caching strategies
 */
async function handleRequest(request) {
  const url = new URL(request.url);

  // Strategy 1: Cache-First for static assets (CSS, JS, images, fonts)
  if (isStaticAsset(url.pathname)) {
    return cacheFirst(request);
  }

  // Strategy 2: Network-First for HTML pages (get updates but fallback to cache)
  if (isHTMLPage(url.pathname)) {
    return networkFirstWithOfflinePage(request);
  }

  // Strategy 3: Cache-First for D&D content pages and collections
  if (isDnDContent(url.pathname)) {
    return cacheFirst(request);
  }

  // Default: Network-First for everything else
  return networkFirst(request);
}

/**
 * Cache-First strategy: Check cache first, then network
 * Perfect for static assets that don't change often
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Cache-First failed:', error);
    return caches.match(request) || caches.match(OFFLINE_PAGE);
  }
}

/**
 * Network-First strategy: Try network first, fallback to cache
 * Good for HTML pages that might have updates
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || caches.match(OFFLINE_PAGE);
  }
}

/**
 * Network-First with offline page fallback for HTML pages
 */
async function networkFirstWithOfflinePage(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      return networkResponse;
    }

    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    console.log('Network failed for HTML page:', error);
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for failed HTML requests
    return caches.match(OFFLINE_PAGE);
  }
}

/**
 * Check if URL is a static asset (CSS, JS, images, fonts)
 */
function isStaticAsset(pathname) {
  return pathname.includes('/assets/') ||
         pathname.endsWith('.css') ||
         pathname.endsWith('.js') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.jpeg') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.gif') ||
         pathname.endsWith('.webp') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.woff') ||
         pathname.endsWith('.woff2') ||
         pathname.endsWith('.ttf') ||
         pathname.endsWith('.eot');
}

/**
 * Check if URL is an HTML page
 */
function isHTMLPage(pathname) {
  return pathname.endsWith('.html') ||
         pathname.endsWith('/') ||
         (!pathname.includes('.') && !pathname.includes('/assets/'));
}

/**
 * Check if URL is D&D content (collections)
 */
function isDnDContent(pathname) {
  return pathname.includes('/docs/_') || // Jekyll collections
         pathname.includes('/_Classes/') ||
         pathname.includes('/_Folk/') ||
         pathname.includes('/_Rules') ||
         pathname.includes('/_Campaigns/') ||
         pathname.includes('/_Resources/') ||
         pathname.includes('/_Specific/');
}

// Background sync for failed requests (future enhancement)
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
  }
});

// Handle service worker updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
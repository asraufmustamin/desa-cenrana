/**
 * Service Worker for Desa Cenrana PWA
 * ====================================
 * 
 * Allows offline access to cached pages and assets
 */

const CACHE_NAME = "desa-cenrana-v1";
const OFFLINE_URL = "/offline.html";

// Assets to cache on install
const PRECACHE_ASSETS = [
    "/",
    "/offline.html",
    "/logo-maros.png",
    "/manifest.json",
];

// Install event - cache essential assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("📦 Pre-caching essential assets");
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("🗑️ Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event) => {
    // Skip non-GET requests
    if (event.request.method !== "GET") return;

    // Skip API requests (always go to network)
    if (event.request.url.includes("/api/")) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone response for caching
                const responseClone = response.clone();

                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }

                return response;
            })
            .catch(async () => {
                // Network failed, try cache
                const cachedResponse = await caches.match(event.request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                // If it's a navigation request, show offline page
                if (event.request.mode === "navigate") {
                    const offlineResponse = await caches.match(OFFLINE_URL);
                    if (offlineResponse) {
                        return offlineResponse;
                    }
                }

                // Return empty response for other failed requests
                return new Response("Offline", {
                    status: 503,
                    statusText: "Service Unavailable",
                });
            })
    );
});

// ========================================
// PUSH NOTIFICATION HANDLERS
// ========================================

// Handle incoming push notifications
self.addEventListener("push", (event) => {
    console.log("📩 Push notification received");

    let data = {
        title: "Desa Cenrana",
        body: "Ada informasi baru dari Desa Cenrana",
        icon: "/logo-maros.png",
        badge: "/logo-maros.png",
        url: "/"
    };

    // Try to parse push data
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || "/logo-maros.png",
        badge: data.badge || "/logo-maros.png",
        vibrate: [200, 100, 200],
        tag: data.tag || "desa-cenrana-notification",
        renotify: true,
        requireInteraction: false,
        data: {
            url: data.url || "/",
            timestamp: Date.now()
        },
        actions: [
            { action: "open", title: "Buka" },
            { action: "close", title: "Tutup" }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    console.log("🔔 Notification clicked");

    event.notification.close();

    const url = event.notification.data?.url || "/";

    // Handle action buttons
    if (event.action === "close") {
        return;
    }

    // Open the URL or focus existing tab
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true })
            .then((windowClients) => {
                // Check if there's already a tab open with our site
                for (const client of windowClients) {
                    if (client.url.includes(self.location.origin)) {
                        client.navigate(url);
                        return client.focus();
                    }
                }
                // If no tab found, open a new one
                return clients.openWindow(url);
            })
    );
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
    console.log("🔕 Notification closed");
});

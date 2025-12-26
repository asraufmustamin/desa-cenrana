"use client";

import { useEffect } from "react";

/**
 * PWA Component
 * Registers the service worker for offline support
 */
export default function PWAProvider() {
    useEffect(() => {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            // Register service worker
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("✅ Service Worker registered:", registration.scope);

                    // Check for updates
                    registration.addEventListener("updatefound", () => {
                        const newWorker = registration.installing;
                        if (newWorker) {
                            newWorker.addEventListener("statechange", () => {
                                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                                    // New content available, show refresh prompt
                                    console.log("🔄 New content available, refresh to update");
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("❌ Service Worker registration failed:", error);
                });
        }
    }, []);

    // This component doesn't render anything
    return null;
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Check, X, Loader2 } from "lucide-react";

export default function PushNotificationPrompt() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPrompt, setShowPrompt] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        checkSupport();
    }, []);

    const checkSupport = async () => {
        // Check if push notifications are supported
        if ("serviceWorker" in navigator && "PushManager" in window && "Notification" in window) {
            setIsSupported(true);

            // Check if already subscribed
            try {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                setIsSubscribed(!!subscription);

                // Show prompt if not subscribed and user hasn't dismissed it before
                if (!subscription) {
                    const dismissed = localStorage.getItem("push-prompt-dismissed");
                    if (!dismissed) {
                        // Delay showing prompt
                        setTimeout(() => setShowPrompt(true), 5000);
                    }
                }
            } catch (error) {
                console.error("Error checking subscription:", error);
            }
        }
        setIsLoading(false);
    };

    const subscribe = async () => {
        setIsLoading(true);
        setMessage(null);

        try {
            // Request notification permission
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                setMessage({ type: "error", text: "Izin notifikasi ditolak" });
                setIsLoading(false);
                return;
            }

            // Get service worker registration
            const registration = await navigator.serviceWorker.ready;

            // Subscribe to push notifications
            // Note: In production, you need to generate VAPID keys
            // For demo, we'll use a placeholder
            const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
                "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource
            });

            // Send subscription to server
            const response = await fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscription })
            });

            if (response.ok) {
                setIsSubscribed(true);
                setShowPrompt(false);
                setMessage({ type: "success", text: "Notifikasi berhasil diaktifkan!" });
            } else {
                throw new Error("Failed to save subscription");
            }
        } catch (error) {
            console.error("Subscription error:", error);
            setMessage({ type: "error", text: "Gagal mengaktifkan notifikasi" });
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        setIsLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Unsubscribe from PushManager
                await subscription.unsubscribe();

                // Remove from server
                await fetch("/api/push/subscribe", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ endpoint: subscription.endpoint })
                });

                setIsSubscribed(false);
                setMessage({ type: "success", text: "Notifikasi dinonaktifkan" });
            }
        } catch (error) {
            console.error("Unsubscribe error:", error);
            setMessage({ type: "error", text: "Gagal menonaktifkan notifikasi" });
        } finally {
            setIsLoading(false);
        }
    };

    const dismissPrompt = () => {
        setShowPrompt(false);
        localStorage.setItem("push-prompt-dismissed", "true");
    };

    // Helper function to convert VAPID key
    function urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Auto-hide message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!isSupported || isLoading) return null;

    return (
        <>
            {/* Floating Prompt */}
            <AnimatePresence>
                {showPrompt && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-24 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40"
                    >
                        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 shadow-2xl">
                            <button
                                onClick={dismissPrompt}
                                className="absolute top-3 right-3 p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                    <Bell className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)] mb-1">Aktifkan Notifikasi?</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                                        Dapatkan info terbaru dari Desa Cenrana langsung di HP Anda.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={subscribe}
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Check className="w-4 h-4" />
                                            )}
                                            Aktifkan
                                        </button>
                                        <button
                                            onClick={dismissPrompt}
                                            className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-secondary)] rounded-lg font-semibold text-sm hover:bg-[var(--bg-card)] transition-colors"
                                        >
                                            Nanti Saja
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status Toast */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg ${message.type === "success"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                            }`}
                    >
                        {message.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        {message.text}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button in Settings (optional - show small button if subscribed) */}
            {isSubscribed && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={unsubscribe}
                    disabled={isLoading}
                    className="fixed bottom-24 right-20 z-30 p-3 bg-green-500/20 text-green-500 rounded-full border border-green-500/30 hover:bg-green-500/30 transition-all shadow-lg"
                    title="Notifikasi Aktif - Klik untuk nonaktifkan"
                >
                    <Bell className="w-5 h-5" />
                </motion.button>
            )}
        </>
    );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Facebook, Twitter, Send, MessageCircle, Link2, Check, X } from "lucide-react";
import { shareWhatsApp, shareFacebook, shareTwitter, shareTelegram, copyLink, getCurrentUrl } from "@/lib/share";

/**
 * ShareButton Component
 * =====================
 * 
 * Tombol share dengan dropdown berbagai platform
 */

interface ShareButtonProps {
    title: string;
    url?: string;
    text?: string;
    className?: string;
    variant?: "icon" | "button";
}

export default function ShareButton({
    title,
    url,
    text,
    className = "",
    variant = "icon",
}: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== "undefined" ? getCurrentUrl() : "");
    const shareText = text || title;

    const handleCopyLink = async () => {
        const success = await copyLink(shareUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: MessageCircle,
            color: "bg-green-500",
            onClick: () => shareWhatsApp(shareText, shareUrl),
        },
        {
            name: "Facebook",
            icon: Facebook,
            color: "bg-blue-600",
            onClick: () => shareFacebook(shareUrl),
        },
        {
            name: "Twitter",
            icon: Twitter,
            color: "bg-sky-500",
            onClick: () => shareTwitter(shareText, shareUrl),
        },
        {
            name: "Telegram",
            icon: Send,
            color: "bg-blue-400",
            onClick: () => shareTelegram(shareText, shareUrl),
        },
        {
            name: copied ? "Tersalin!" : "Salin Link",
            icon: copied ? Check : Link2,
            color: copied ? "bg-emerald-500" : "bg-slate-500",
            onClick: handleCopyLink,
        },
    ];

    return (
        <div className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 rounded-xl transition-all
                    ${variant === "icon"
                        ? "p-3 bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        : "px-4 py-2 bg-[var(--bg-panel)] hover:bg-[var(--bg-card)] text-[var(--text-primary)] font-bold"
                    }
                `}
            >
                <Share2 className="w-5 h-5" />
                {variant === "button" && <span>Bagikan</span>}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 z-50 p-2 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xl min-w-[180px]"
                        >
                            <p className="px-3 py-2 text-xs font-bold text-[var(--text-secondary)] uppercase">
                                Bagikan ke
                            </p>
                            {shareOptions.map((option) => (
                                <button
                                    key={option.name}
                                    onClick={() => {
                                        option.onClick();
                                        if (option.name !== "Salin Link" && option.name !== "Tersalin!") {
                                            setIsOpen(false);
                                        }
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-panel)] transition-colors"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${option.color} flex items-center justify-center`}>
                                        <option.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-[var(--text-primary)]">
                                        {option.name}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

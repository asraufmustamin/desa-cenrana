"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowUp, X, MessageCircle, Home, Search, Send } from "lucide-react";

/**
 * FloatingActionButton Component
 * ==============================
 * 
 * FAB dengan menu expandable
 */

interface FABAction {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
    color?: string;
}

interface FloatingActionButtonProps {
    actions?: FABAction[];
    mainIcon?: React.ComponentType<{ className?: string }>;
    position?: "bottom-right" | "bottom-left";
    className?: string;
}

export default function FloatingActionButton({
    actions = [],
    mainIcon: MainIcon = Plus,
    position = "bottom-right",
    className = "",
}: FloatingActionButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const positionClasses = {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
    };

    return (
        <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
            {/* Action Buttons */}
            <AnimatePresence>
                {isOpen && actions.length > 0 && (
                    <div className="absolute bottom-16 right-0 flex flex-col gap-3">
                        {actions.map((action, index) => (
                            <motion.button
                                key={action.label}
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    action.onClick();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 group"
                            >
                                <span className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] text-sm font-medium text-[var(--text-primary)] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {action.label}
                                </span>
                                <div className={`w-12 h-12 rounded-full ${action.color || "bg-emerald-500"} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                                    <action.icon className="w-5 h-5 text-white" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Main FAB */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <MainIcon className="w-6 h-6 text-white" />
                    )}
                </motion.div>
            </motion.button>
        </div>
    );
}

/**
 * ScrollToTop Component
 * =====================
 * 
 * Tombol untuk scroll ke atas halaman
 */

interface ScrollToTopProps {
    threshold?: number;
    className?: string;
}

export function ScrollToTop({ threshold = 300, className = "" }: ScrollToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > threshold);
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={scrollToTop}
                    className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center shadow-lg hover:border-emerald-500/50 transition-all ${className}`}
                >
                    <ArrowUp className="w-5 h-5 text-[var(--text-primary)]" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

/**
 * WhatsApp FAB
 * ============
 * 
 * Tombol WhatsApp yang melayang
 */

interface WhatsAppFABProps {
    phone: string;
    message?: string;
    className?: string;
}

export function WhatsAppFAB({ phone, message = "Halo, saya ingin bertanya...", className = "" }: WhatsAppFABProps) {
    const handleClick = () => {
        let normalizedPhone = phone.replace(/\D/g, "");
        if (normalizedPhone.startsWith("0")) {
            normalizedPhone = "62" + normalizedPhone.slice(1);
        }
        const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    return (
        <motion.button
            onClick={handleClick}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 ${className}`}
        >
            <MessageCircle className="w-7 h-7 text-white" />
        </motion.button>
    );
}

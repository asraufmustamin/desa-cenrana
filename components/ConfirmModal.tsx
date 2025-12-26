"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

/**
 * ConfirmModal Component
 * ======================
 * 
 * Modal konfirmasi untuk aksi berbahaya (hapus, logout, dll)
 */

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info";
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Konfirmasi",
    cancelText = "Batal",
    variant = "danger",
    isLoading = false,
}: ConfirmModalProps) {
    const variants = {
        danger: {
            icon: Trash2,
            iconBg: "bg-red-500/20",
            iconColor: "text-red-400",
            buttonBg: "bg-red-500 hover:bg-red-600",
        },
        warning: {
            icon: AlertTriangle,
            iconBg: "bg-amber-500/20",
            iconColor: "text-amber-400",
            buttonBg: "bg-amber-500 hover:bg-amber-600",
        },
        info: {
            icon: AlertTriangle,
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400",
            buttonBg: "bg-blue-500 hover:bg-blue-600",
        },
    };

    const style = variants[variant];
    const Icon = style.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    >
                        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-2xl max-w-sm w-full p-6">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Icon */}
                            <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center mx-auto mb-4`}>
                                <Icon className={`w-7 h-7 ${style.iconColor}`} />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-[var(--text-primary)] text-center mb-2">
                                {title}
                            </h3>

                            {/* Message */}
                            <p className="text-[var(--text-secondary)] text-center mb-6">
                                {message}
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-panel)] text-[var(--text-primary)] font-bold hover:bg-opacity-80 transition-all disabled:opacity-50"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`flex-1 px-4 py-3 rounded-xl text-white font-bold transition-all disabled:opacity-50 ${style.buttonBg}`}
                                >
                                    {isLoading ? "Loading..." : confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

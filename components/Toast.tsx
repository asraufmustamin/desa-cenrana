"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

/**
 * Toast Notification System
 * =========================
 * 
 * Global toast notifications untuk feedback ke user
 */

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast: Toast = { id, type, message, duration };

        setToasts((prev) => [...prev, toast]);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((message: string) => showToast("success", message), [showToast]);
    const error = useCallback((message: string) => showToast("error", message, 6000), [showToast]);
    const warning = useCallback((message: string) => showToast("warning", message), [showToast]);
    const info = useCallback((message: string) => showToast("info", message), [showToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast, success, error, warning, info }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertTriangle,
        info: Info,
    };

    const colors = {
        success: {
            bg: "bg-emerald-500/10 border-emerald-500/30",
            icon: "text-emerald-400",
            text: "text-emerald-100",
        },
        error: {
            bg: "bg-red-500/10 border-red-500/30",
            icon: "text-red-400",
            text: "text-red-100",
        },
        warning: {
            bg: "bg-amber-500/10 border-amber-500/30",
            icon: "text-amber-400",
            text: "text-amber-100",
        },
        info: {
            bg: "bg-blue-500/10 border-blue-500/30",
            icon: "text-blue-400",
            text: "text-blue-100",
        },
    };

    const Icon = icons[toast.type];
    const color = colors[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl ${color.bg}`}
        >
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color.icon}`} />
            <p className={`text-sm font-medium flex-1 ${color.text}`}>{toast.message}</p>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

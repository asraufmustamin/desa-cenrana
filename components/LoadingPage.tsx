"use client";

import { motion } from "framer-motion";

/**
 * LoadingPage Component
 * =====================
 * 
 * Full page loading indicator
 */

interface LoadingPageProps {
    message?: string;
}

export default function LoadingPage({ message = "Memuat..." }: LoadingPageProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-body)]">
            {/* Animated Logo/Spinner */}
            <div className="relative mb-6">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500" />
                </div>
            </div>

            {/* Message */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[var(--text-secondary)] font-medium"
            >
                {message}
            </motion.p>
        </div>
    );
}

/**
 * LoadingOverlay Component
 * ========================
 * 
 * Overlay loading untuk komponen/section
 */

export function LoadingOverlay({ message = "Memuat..." }: { message?: string }) {
    return (
        <div className="absolute inset-0 bg-[var(--bg-body)]/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-inherit">
            <div className="flex flex-col items-center gap-3">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500"
                />
                <span className="text-sm text-[var(--text-secondary)]">{message}</span>
            </div>
        </div>
    );
}

/**
 * LoadingButton Component
 * =======================
 * 
 * Button dengan loading state
 */

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export function LoadingButton({
    isLoading,
    loadingText = "Memproses...",
    children,
    className = "",
    disabled,
    ...props
}: LoadingButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={`relative ${className}`}
            {...props}
        >
            <span className={isLoading ? "opacity-0" : "opacity-100"}>
                {children}
            </span>
            {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center gap-2">
                    <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 rounded-full border-2 border-current border-t-transparent"
                    />
                    <span>{loadingText}</span>
                </span>
            )}
        </button>
    );
}

/**
 * Skeleton variants untuk loading states
 */
export function LoadingDots() {
    return (
        <span className="inline-flex gap-1">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-current"
                />
            ))}
        </span>
    );
}

/**
 * Shimmer effect for loading
 */
export function LoadingShimmer({ className = "" }: { className?: string }) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
    );
}

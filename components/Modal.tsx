"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Modal Component
 * ===============
 * 
 * Generic modal dengan berbagai ukuran
 */

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "full";
    showCloseButton?: boolean;
    closeOnBackdrop?: boolean;
    footer?: ReactNode;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true,
    closeOnBackdrop = true,
    footer,
}: ModalProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-full mx-4",
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeOnBackdrop ? onClose : undefined}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`w-full ${sizeClasses[size]} bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-2xl`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    {(title || showCloseButton) && (
                        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
                            {title && (
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                    {title}
                                </h2>
                            )}
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className="p-5">{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-panel)] rounded-b-2xl">
                            {footer}
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}

/**
 * Drawer Component
 * ================
 * 
 * Side panel yang muncul dari samping
 */

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    position?: "left" | "right";
    size?: "sm" | "md" | "lg";
}

export function Drawer({
    isOpen,
    onClose,
    title,
    children,
    position = "right",
    size = "md",
}: DrawerProps) {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
    };

    const positionClasses = {
        left: "left-0",
        right: "right-0",
    };

    const slideFrom = position === "left" ? { x: "-100%" } : { x: "100%" };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            {/* Drawer */}
            <motion.div
                initial={slideFrom}
                animate={{ x: 0 }}
                exit={slideFrom}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`
                    fixed top-0 bottom-0 ${positionClasses[position]} z-[9999]
                    w-full ${sizeClasses[size]}
                    bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl
                    flex flex-col
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
                    {title && (
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">
                            {title}
                        </h2>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </motion.div>
        </>
    );
}

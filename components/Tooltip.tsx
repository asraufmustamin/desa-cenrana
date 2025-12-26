"use client";

import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Tooltip Component
 * =================
 * 
 * Tooltip dengan animasi untuk menampilkan informasi tambahan
 */

interface TooltipProps {
    children: ReactNode;
    content: string | ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    delay?: number;
}

export default function Tooltip({
    children,
    content,
    position = "top",
    delay = 200,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        const id = setTimeout(() => setIsVisible(true), delay);
        setTimeoutId(id);
    };

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
    };

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
        top: "top-full left-1/2 -translate-x-1/2 border-t-[var(--bg-card)]",
        bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-[var(--bg-card)]",
        left: "left-full top-1/2 -translate-y-1/2 border-l-[var(--bg-card)]",
        right: "right-full top-1/2 -translate-y-1/2 border-r-[var(--bg-card)]",
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 ${positionClasses[position]}`}
                    >
                        <div className="px-3 py-2 text-sm text-[var(--text-primary)] bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)] shadow-lg whitespace-nowrap">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Popover Component
 * =================
 * 
 * Popover untuk menampilkan content yang lebih kompleks
 */

interface PopoverProps {
    children: ReactNode;
    content: ReactNode;
    position?: "top" | "bottom" | "left" | "right";
    trigger?: "click" | "hover";
}

export function Popover({
    children,
    content,
    position = "bottom",
    trigger = "click",
}: PopoverProps) {
    const [isOpen, setIsOpen] = useState(false);

    const positionClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-0 mt-2",
        left: "right-full top-0 mr-2",
        right: "left-full top-0 ml-2",
    };

    const handleTrigger = () => {
        if (trigger === "click") {
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        if (trigger === "hover") {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === "hover") {
            setIsOpen(false);
        }
    };

    return (
        <div
            className="relative inline-flex"
            onClick={handleTrigger}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {trigger === "click" && (
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsOpen(false)}
                            />
                        )}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className={`absolute z-50 ${positionClasses[position]}`}
                        >
                            <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xl min-w-[200px]">
                                {content}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

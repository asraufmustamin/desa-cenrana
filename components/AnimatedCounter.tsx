"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedCounter Component
 * =========================
 * 
 * Animasi counting up number dari 0 ke target
 */

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    className?: string;
    formatter?: (value: number) => string;
}

export default function AnimatedCounter({
    value,
    duration = 1500,
    className = "",
    formatter = (v) => v.toLocaleString(),
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const startValue = displayValue;
        const endValue = value;
        const diff = endValue - startValue;

        if (diff === 0) return;

        const animate = (timestamp: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease out cubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.round(startValue + diff * easedProgress);
            setDisplayValue(currentValue);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        startTimeRef.current = null;
        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, [value, duration]);

    return (
        <span className={className}>{formatter(displayValue)}</span>
    );
}

/**
 * Stats Card with Animation
 */
interface StatsCardProps {
    title: string;
    value: number;
    suffix?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({
    title,
    value,
    suffix = "",
    icon,
    trend,
    className = "",
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] ${className}`}
        >
            <div className="flex items-start justify-between mb-3">
                <span className="text-[var(--text-secondary)] text-sm font-medium">{title}</span>
                {icon && (
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-panel)] flex items-center justify-center text-[var(--text-secondary)]">
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-2">
                <AnimatedCounter
                    value={value}
                    className="text-3xl font-black text-[var(--text-primary)]"
                />
                {suffix && (
                    <span className="text-[var(--text-secondary)] text-lg">{suffix}</span>
                )}
            </div>
            {trend && (
                <div className={`mt-2 flex items-center gap-1 text-sm ${trend.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                    <span>{trend.isPositive ? "↑" : "↓"}</span>
                    <span>{Math.abs(trend.value)}%</span>
                    <span className="text-[var(--text-secondary)]">dari bulan lalu</span>
                </div>
            )}
        </motion.div>
    );
}

/**
 * Progress Bar Component
 */
export function ProgressBar({
    value,
    max = 100,
    size = "md",
    color = "emerald",
    showLabel = true,
    className = "",
}: {
    value: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    color?: "emerald" | "blue" | "amber" | "red";
    showLabel?: boolean;
    className?: string;
}) {
    const percentage = Math.min(100, Math.round((value / max) * 100));

    const sizeClasses = {
        sm: "h-1.5",
        md: "h-2.5",
        lg: "h-4",
    };

    const colorClasses = {
        emerald: "from-emerald-500 to-teal-500",
        blue: "from-blue-500 to-cyan-500",
        amber: "from-amber-500 to-orange-500",
        red: "from-red-500 to-pink-500",
    };

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text-secondary)]">{value.toLocaleString()}</span>
                    <span className="text-[var(--text-primary)] font-bold">{percentage}%</span>
                </div>
            )}
            <div className={`w-full bg-[var(--bg-panel)] rounded-full overflow-hidden ${sizeClasses[size]}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
                />
            </div>
        </div>
    );
}

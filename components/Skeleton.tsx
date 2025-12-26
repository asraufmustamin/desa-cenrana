"use client";

import { ReactNode } from "react";

/**
 * Skeleton Components
 * ===================
 * 
 * Loading placeholders untuk berbagai elemen UI
 */

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
}

/**
 * Base Skeleton component
 */
export function Skeleton({ className = "", width, height }: SkeletonProps) {
    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === "number" ? `${width}px` : width;
    if (height) style.height = typeof height === "number" ? `${height}px` : height;

    return (
        <div
            className={`animate-pulse bg-[var(--bg-panel)] rounded ${className}`}
            style={style}
        />
    );
}

/**
 * Skeleton untuk text/paragraph
 */
export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <Skeleton
                    key={i}
                    className="h-4"
                    width={i === lines - 1 ? "60%" : "100%"}
                />
            ))}
        </div>
    );
}

/**
 * Skeleton untuk card
 */
export function SkeletonCard({ className = "" }: { className?: string }) {
    return (
        <div className={`rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <SkeletonText lines={2} />
        </div>
    );
}

/**
 * Skeleton untuk list item
 */
export function SkeletonListItem({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center gap-4 p-4 ${className}`}>
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1">
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="w-16 h-6 rounded-full" />
        </div>
    );
}

/**
 * Skeleton untuk table row
 */
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
    return (
        <tr>
            {[...Array(columns)].map((_, i) => (
                <td key={i} className="p-4">
                    <Skeleton className="h-4" width={i === 0 ? "120px" : i === columns - 1 ? "80px" : "100%"} />
                </td>
            ))}
        </tr>
    );
}

/**
 * Skeleton untuk avatar
 */
export function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
    };

    return <Skeleton className={`rounded-full ${sizeClasses[size]}`} />;
}

/**
 * Skeleton untuk image/banner
 */
export function SkeletonImage({ aspectRatio = "16/9", className = "" }: { aspectRatio?: string; className?: string }) {
    return (
        <Skeleton
            className={`w-full rounded-xl ${className}`}
            style={{ aspectRatio }}
        />
    );
}

/**
 * Skeleton untuk stats card (seperti di dashboard)
 */
export function SkeletonStats({ count = 4 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <Skeleton className="w-12 h-8" />
                    </div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Skeleton untuk product card
 */
export function SkeletonProductCard({ className = "" }: { className?: string }) {
    return (
        <div className={`rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden ${className}`}>
            <SkeletonImage aspectRatio="1/1" className="rounded-none" />
            <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-3" />
                <Skeleton className="h-6 w-24" />
            </div>
        </div>
    );
}

/**
 * Wrapper untuk conditional skeleton
 */
export function SkeletonWrapper({
    isLoading,
    skeleton,
    children,
}: {
    isLoading: boolean;
    skeleton: ReactNode;
    children: ReactNode;
}) {
    return <>{isLoading ? skeleton : children}</>;
}

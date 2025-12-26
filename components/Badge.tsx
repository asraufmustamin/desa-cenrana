"use client";

import { ReactNode } from "react";

/**
 * Badge Component
 * ===============
 * 
 * Status badges untuk berbagai use case
 */

type BadgeVariant = "success" | "warning" | "error" | "info" | "default" | "pending" | "active";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: "sm" | "md" | "lg";
    dot?: boolean;
    className?: string;
}

const variantStyles = {
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    error: "bg-red-500/20 text-red-400 border-red-500/30",
    info: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    default: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    pending: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    active: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
};

export default function Badge({
    children,
    variant = "default",
    size = "sm",
    dot = false,
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 font-bold rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        >
            {dot && (
                <span
                    className={`w-1.5 h-1.5 rounded-full ${variant === "success" ? "bg-emerald-400" :
                            variant === "warning" ? "bg-amber-400" :
                                variant === "error" ? "bg-red-400" :
                                    variant === "info" ? "bg-blue-400" :
                                        variant === "pending" ? "bg-orange-400 animate-pulse" :
                                            variant === "active" ? "bg-cyan-400" :
                                                "bg-slate-400"
                        }`}
                />
            )}
            {children}
        </span>
    );
}

/**
 * Status badge presets
 */
export const STATUS_BADGES = {
    pending: { variant: "pending" as BadgeVariant, label: "Pending", dot: true },
    diproses: { variant: "info" as BadgeVariant, label: "Diproses", dot: true },
    selesai: { variant: "success" as BadgeVariant, label: "Selesai", dot: true },
    ditolak: { variant: "error" as BadgeVariant, label: "Ditolak", dot: true },
    active: { variant: "active" as BadgeVariant, label: "Aktif", dot: true },
    inactive: { variant: "default" as BadgeVariant, label: "Nonaktif", dot: true },
    published: { variant: "success" as BadgeVariant, label: "Published", dot: true },
    draft: { variant: "default" as BadgeVariant, label: "Draft", dot: true },
};

/**
 * Fungsi helper untuk mendapatkan status badge
 */
export function getStatusBadge(status: string): { variant: BadgeVariant; label: string; dot: boolean } {
    const normalizedStatus = status.toLowerCase();

    const statusMap: Record<string, { variant: BadgeVariant; label: string; dot: boolean }> = {
        pending: STATUS_BADGES.pending,
        diproses: STATUS_BADGES.diproses,
        selesai: STATUS_BADGES.selesai,
        ditolak: STATUS_BADGES.ditolak,
        rejected: STATUS_BADGES.ditolak,
        active: STATUS_BADGES.active,
        inactive: STATUS_BADGES.inactive,
        published: STATUS_BADGES.published,
        draft: STATUS_BADGES.draft,
    };

    return statusMap[normalizedStatus] || { variant: "default", label: status, dot: false };
}

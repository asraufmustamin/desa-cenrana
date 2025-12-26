"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Inbox, Search, FileText, ShoppingBag, MessageSquare, Plus, LucideIcon } from "lucide-react";

/**
 * EmptyState Component
 * ====================
 * 
 * Tampilan ketika tidak ada data
 */

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export default function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    action,
    className = "",
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
        >
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-[var(--bg-panel)] flex items-center justify-center mb-6">
                <Icon className="w-10 h-10 text-[var(--text-secondary)]" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className="text-[var(--text-secondary)] max-w-sm mb-6">
                    {description}
                </p>
            )}

            {/* Action Button */}
            {action && (
                <button
                    onClick={action.onClick}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold hover:opacity-90 transition-opacity"
                >
                    <Plus className="w-5 h-5" />
                    {action.label}
                </button>
            )}
        </motion.div>
    );
}

/**
 * Preset empty states
 */
export const EMPTY_STATES = {
    search: {
        icon: Search,
        title: "Tidak Ditemukan",
        description: "Coba kata kunci lain atau periksa ejaan",
    },
    berita: {
        icon: FileText,
        title: "Belum Ada Berita",
        description: "Berita akan muncul di sini setelah dipublikasikan",
    },
    lapak: {
        icon: ShoppingBag,
        title: "Belum Ada Produk",
        description: "Produk UMKM warga akan ditampilkan di sini",
    },
    aspirasi: {
        icon: MessageSquare,
        title: "Belum Ada Aspirasi",
        description: "Aspirasi dan laporan warga akan muncul di sini",
    },
    data: {
        icon: Inbox,
        title: "Tidak Ada Data",
        description: "Data yang Anda cari tidak tersedia",
    },
};

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    ShoppingBag,
    Newspaper,
    Users,
    Bell,
    TrendingUp,
    Clock,
    CheckCircle,
    Eye,
    RefreshCw
} from "lucide-react";

interface Stats {
    aspirasi: {
        total: number;
        pending: number;
        diproses: number;
        selesai: number;
    };
    lapak: {
        total: number;
        pending: number;
        active: number;
        totalViews: number;
    };
    berita: {
        total: number;
        published: number;
        draft: number;
    };
    penduduk: {
        total: number;
    };
    waSubscribers: {
        total: number;
    };
}

export default function AdminStats() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<string>("");

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/admin/stats");
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
                setLastUpdate(new Date().toLocaleTimeString("id-ID"));
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Auto refresh setiap 5 menit
        const interval = setInterval(fetchStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (isLoading && !stats) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-32 rounded-2xl bg-[var(--bg-panel)] animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {
            title: "Aspirasi",
            value: stats.aspirasi.total,
            icon: MessageSquare,
            gradient: "from-blue-500 to-cyan-500",
            shadow: "shadow-blue-500/30",
            subStats: [
                { label: "Pending", value: stats.aspirasi.pending, color: "text-amber-400" },
                { label: "Diproses", value: stats.aspirasi.diproses, color: "text-blue-400" },
                { label: "Selesai", value: stats.aspirasi.selesai, color: "text-emerald-400" },
            ]
        },
        {
            title: "Produk Lapak",
            value: stats.lapak.total,
            icon: ShoppingBag,
            gradient: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-500/30",
            subStats: [
                { label: "Active", value: stats.lapak.active, color: "text-emerald-400" },
                { label: "Pending", value: stats.lapak.pending, color: "text-amber-400" },
                { label: "Views", value: stats.lapak.totalViews, color: "text-blue-400", icon: Eye },
            ]
        },
        {
            title: "Berita",
            value: stats.berita.total,
            icon: Newspaper,
            gradient: "from-purple-500 to-pink-500",
            shadow: "shadow-purple-500/30",
            subStats: [
                { label: "Published", value: stats.berita.published, color: "text-emerald-400" },
                { label: "Draft", value: stats.berita.draft, color: "text-slate-400" },
            ]
        },
        {
            title: "Penduduk",
            value: stats.penduduk.total,
            icon: Users,
            gradient: "from-amber-500 to-orange-500",
            shadow: "shadow-amber-500/30",
            subStats: [
                { label: "WA Subscribers", value: stats.waSubscribers.total, color: "text-emerald-400", icon: Bell },
            ]
        },
    ];

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Statistik Real-time
                </h2>
                <button
                    onClick={fetchStats}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-all"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {lastUpdate && <span className="text-xs">Update: {lastUpdate}</span>}
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group h-full"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity`} />
                        <div className="relative h-full p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-opacity-50 transition-all flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center ${card.shadow} shadow-lg`}>
                                    <card.icon className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-3xl font-black text-[var(--text-primary)]">
                                    {card.value.toLocaleString()}
                                </span>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-[var(--text-primary)] mb-2">{card.title}</h3>

                            {/* Sub Stats - flex-grow to push to bottom */}
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {card.subStats.map((sub) => (
                                    <div
                                        key={sub.label}
                                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--bg-panel)] text-xs"
                                    >
                                        {sub.icon && <sub.icon className={`w-3 h-3 ${sub.color}`} />}
                                        <span className={sub.color}>{sub.value}</span>
                                        <span className="text-[var(--text-secondary)]">{sub.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

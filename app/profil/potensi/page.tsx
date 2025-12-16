"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import EditModeIndicator from "@/components/EditModeIndicator";
import { Leaf, ArrowLeft, Sparkles, Store, Wheat, TrendingUp, ArrowRight, Coffee, Fish, Egg, Factory, ShoppingBag, Banana } from "lucide-react";

const potensiData = [
    {
        id: "pertanian",
        title: "Pertanian",
        icon: Wheat,
        color: "from-amber-500 to-yellow-500",
        borderColor: "border-amber-500/30",
        textColor: "text-amber-400",
        bgColor: "bg-amber-500/10",
        items: [
            { name: "Padi Sawah", value: "120 Ha", icon: "🌾" },
            { name: "Jagung", value: "45 Ha", icon: "🌽" },
            { name: "Kacang Tanah", value: "15 Ha", icon: "🥜" },
        ]
    },
    {
        id: "perkebunan",
        title: "Perkebunan",
        icon: Leaf,
        color: "from-emerald-500 to-green-500",
        borderColor: "border-emerald-500/30",
        textColor: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        items: [
            { name: "Kelapa", value: "80 Ha", icon: "🥥" },
            { name: "Kopi", value: "25 Ha", icon: "☕" },
            { name: "Kakao", value: "10 Ha", icon: "🍫" },
        ]
    },
    {
        id: "peternakan",
        title: "Peternakan",
        icon: Egg,
        color: "from-rose-500 to-pink-500",
        borderColor: "border-rose-500/30",
        textColor: "text-rose-400",
        bgColor: "bg-rose-500/10",
        items: [
            { name: "Sapi", value: "250 Ekor", icon: "🐄" },
            { name: "Kambing", value: "180 Ekor", icon: "🐐" },
            { name: "Ayam", value: "5.000+ Ekor", icon: "🐔" },
        ]
    },
    {
        id: "umkm",
        title: "UMKM",
        icon: Store,
        color: "from-violet-500 to-purple-500",
        borderColor: "border-violet-500/30",
        textColor: "text-violet-400",
        bgColor: "bg-violet-500/10",
        items: [
            { name: "Warung", value: "25 Unit", icon: "🏪" },
            { name: "Kios", value: "12 Unit", icon: "🛒" },
            { name: "Home Industry", value: "8 Unit", icon: "🏭" },
        ]
    }
];

export default function PotensiDesaPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <EditModeIndicator />

            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/profil" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali ke Profil
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border border-emerald-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Ekonomi Desa</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black mb-2 text-[var(--text-primary)]">
                        Potensi{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-400 to-orange-400">
                            Desa
                        </span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                        Gambaran umum potensi ekonomi pertanian dan UMKM Desa Cenrana
                    </p>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                        <div className="text-xl font-black text-amber-400">180+</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Ha Lahan</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                        <div className="text-xl font-black text-emerald-400">430+</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Ternak</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-violet-500/10 border border-violet-500/30 text-center">
                        <div className="text-xl font-black text-violet-400">45</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">UMKM</div>
                    </div>
                </motion.div>

                {/* Potensi Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {potensiData.map((potensi, index) => {
                        const Icon = potensi.icon;
                        return (
                            <motion.div
                                key={potensi.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="group"
                                whileHover={{ y: -3 }}
                            >
                                <div className="relative">
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${potensi.color} rounded-2xl blur-sm opacity-0 group-hover:opacity-40 transition-opacity`}></div>
                                    <div className={`relative p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border ${potensi.borderColor} overflow-hidden`}>
                                        {/* Header */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${potensi.color} flex items-center justify-center shadow-lg`}>
                                                <Icon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-[var(--text-primary)]">{potensi.title}</h3>
                                                <p className={`text-[10px] font-medium ${potensi.textColor}`}>Desa Cenrana</p>
                                            </div>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-2">
                                            {potensi.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)]">
                                                    <span className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                                                        <span className="text-base">{item.icon}</span>
                                                        {item.name}
                                                    </span>
                                                    <span className={`text-xs font-bold ${potensi.textColor}`}>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* CTA to Lapak Warga */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Link
                        href="/lapak"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Lihat Produk UMKM di Lapak Warga
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import EditModeIndicator from "@/components/EditModeIndicator";
import { Building, ArrowLeft, Sparkles, MapPin, Church, GraduationCap, Plus, Hospital, Home, Landmark, Droplets, Library, Warehouse, TreeDeciduous } from "lucide-react";

const saranaData = [
    {
        id: "kantor",
        name: "Kantor Desa",
        count: "1 Unit",
        icon: Landmark,
        color: "from-blue-500 to-cyan-500",
        borderColor: "border-blue-500/30",
        textColor: "text-blue-400"
    },
    {
        id: "masjid",
        name: "Masjid / Musholla",
        count: "5 Unit",
        icon: Church,
        color: "from-emerald-500 to-green-500",
        borderColor: "border-emerald-500/30",
        textColor: "text-emerald-400"
    },
    {
        id: "sekolah",
        name: "Sekolah",
        count: "3 Unit",
        icon: GraduationCap,
        color: "from-amber-500 to-orange-500",
        borderColor: "border-amber-500/30",
        textColor: "text-amber-400"
    },
    {
        id: "posyandu",
        name: "Posyandu",
        count: "2 Unit",
        icon: Hospital,
        color: "from-rose-500 to-pink-500",
        borderColor: "border-rose-500/30",
        textColor: "text-rose-400"
    },
    {
        id: "balai",
        name: "Balai Desa",
        count: "1 Unit",
        icon: Home,
        color: "from-violet-500 to-purple-500",
        borderColor: "border-violet-500/30",
        textColor: "text-violet-400"
    },
    {
        id: "perpustakaan",
        name: "Perpustakaan",
        count: "1 Unit",
        icon: Library,
        color: "from-teal-500 to-cyan-500",
        borderColor: "border-teal-500/30",
        textColor: "text-teal-400"
    },
    {
        id: "gudang",
        name: "Gudang Desa",
        count: "1 Unit",
        icon: Warehouse,
        color: "from-slate-500 to-gray-500",
        borderColor: "border-slate-500/30",
        textColor: "text-slate-400"
    },
    {
        id: "air",
        name: "Sumber Air Bersih",
        count: "4 Unit",
        icon: Droplets,
        color: "from-sky-500 to-blue-500",
        borderColor: "border-sky-500/30",
        textColor: "text-sky-400"
    }
];

export default function SaranaPrasaranaPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const totalSarana = saranaData.length;

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <EditModeIndicator />

            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/profil" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Building className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-bold text-cyan-400">Fasilitas</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black mb-2 text-[var(--text-primary)]">
                        Sarana &{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400">
                            Prasarana
                        </span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                        Fasilitas umum yang tersedia di Desa Cenrana
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="flex justify-center gap-3 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                        <div className="text-xl font-black text-cyan-400">{totalSarana}</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Kategori</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                        <div className="text-xl font-black text-emerald-400">19</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Total Unit</div>
                    </div>
                </motion.div>

                {/* Sarana Grid */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {saranaData.map((sarana, index) => {
                        const Icon = sarana.icon;
                        return (
                            <motion.div
                                key={sarana.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.05 * index }}
                                className="group"
                                whileHover={{ y: -5, scale: 1.02 }}
                            >
                                <div className={`relative p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border ${sarana.borderColor} overflow-hidden text-center`}>
                                    {/* Decorative */}
                                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${sarana.color} opacity-10 rounded-bl-full`}></div>

                                    {/* Icon */}
                                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${sarana.color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 line-clamp-1">{sarana.name}</h3>
                                    <span className={`text-lg font-black ${sarana.textColor}`}>{sarana.count}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="text-xs text-[var(--text-secondary)] flex items-center justify-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Data fasilitas Desa Cenrana, Kec. Cenrana, Kab. Maros
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

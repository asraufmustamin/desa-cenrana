"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";
import { Users, ArrowLeft, Sparkles, Award, Target, Heart, UserCheck, Building2, Shield, Handshake } from "lucide-react";

const lembagaData = [
    {
        id: "bpd",
        name: "BPD",
        fullName: "Badan Permusyawaratan Desa",
        description: "Lembaga yang melaksanakan fungsi pemerintahan yang anggotanya merupakan wakil dari penduduk desa",
        icon: Shield,
        color: "from-blue-500 to-cyan-500",
        borderColor: "border-blue-500/30",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400"
    },
    {
        id: "lpm",
        name: "LPM",
        fullName: "Lembaga Pemberdayaan Masyarakat",
        description: "Lembaga yang bertugas menyusun rencana pembangunan secara partisipatif dan menggerakkan swadaya masyarakat",
        icon: Building2,
        color: "from-emerald-500 to-green-500",
        borderColor: "border-emerald-500/30",
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-400"
    },
    {
        id: "pkk",
        name: "PKK",
        fullName: "Pemberdayaan Kesejahteraan Keluarga",
        description: "Organisasi kemasyarakatan yang memberdayakan wanita untuk berpartisipasi dalam pembangunan",
        icon: Heart,
        color: "from-pink-500 to-rose-500",
        borderColor: "border-pink-500/30",
        bgColor: "bg-pink-500/10",
        textColor: "text-pink-400"
    },
    {
        id: "karangtaruna",
        name: "Karang Taruna",
        fullName: "Karang Taruna Desa Cenrana",
        description: "Organisasi kepemudaan yang bergerak dalam bidang kesejahteraan sosial dan pemberdayaan generasi muda",
        icon: Users,
        color: "from-violet-500 to-purple-500",
        borderColor: "border-violet-500/30",
        bgColor: "bg-violet-500/10",
        textColor: "text-violet-400"
    }
];

export default function LembagaPage() {
    const { cmsContent } = useAppContext();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <EditModeIndicator />

            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/profil" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20">
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Handshake className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-blue-400">Kelembagaan</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black mb-2 text-[var(--text-primary)]">
                        Lembaga{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400">
                            Kemasyarakatan
                        </span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                        Organisasi pendukung pemerintahan desa dalam pelayanan masyarakat
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="flex justify-center gap-3 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                        <div className="text-xl font-black text-blue-400">4</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Lembaga</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                        <div className="text-xl font-black text-emerald-400">100+</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Anggota</div>
                    </div>
                </motion.div>

                {/* Lembaga Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {lembagaData.map((lembaga, index) => {
                        const Icon = lembaga.icon;
                        return (
                            <motion.div
                                key={lembaga.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="group"
                                whileHover={{ y: -5 }}
                            >
                                <div className="relative">
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${lembaga.color} rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity`}></div>
                                    <div className={`relative p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border ${lembaga.borderColor} overflow-hidden`}>
                                        {/* Decorative Corner */}
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${lembaga.color} opacity-10 rounded-bl-full`}></div>

                                        <div className="relative z-10">
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${lembaga.color} flex items-center justify-center shadow-lg shrink-0`}>
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${lembaga.bgColor} ${lembaga.textColor}`}>
                                                            {lembaga.name}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 truncate">
                                                        {lembaga.fullName}
                                                    </h3>
                                                    <p className="text-xs leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                                                        {lembaga.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
                                                <div className="flex items-center gap-1 text-[10px] text-[var(--text-secondary)]">
                                                    <UserCheck className="w-3 h-3" />
                                                    <span>Aktif</span>
                                                </div>
                                                <span className={`text-[10px] font-bold ${lembaga.textColor}`}>
                                                    Desa Cenrana
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}

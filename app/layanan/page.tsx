"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
    MessageSquareText,
    Store,
    Map,
    FileText,
    Phone,
    Users,
    ChevronRight,
    Search,
    Newspaper,
    ImageIcon,
    Calendar,
    Scale,
    Zap
} from "lucide-react";

// Animation Variants with proper typing
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
};

export default function LayananPage() {
    const services = [
        {
            category: "Layanan Utama",
            items: [
                {
                    title: "Layanan Aspirasi",
                    desc: "Sampaikan kritik, saran, dan pengaduan.",
                    icon: MessageSquareText,
                    color: "blue",
                    link: "/aspirasi",
                    featured: true
                },
                {
                    title: "Lacak Status",
                    desc: "Pantau progress aspirasi Anda.",
                    icon: Search,
                    color: "emerald",
                    link: "/aspirasi/track"
                },
                {
                    title: "Lapak Warga",
                    desc: "Marketplace produk UMKM lokal.",
                    icon: Store,
                    color: "orange",
                    link: "/lapak"
                },
            ]
        },
        {
            category: "Informasi Publik",
            items: [
                { title: "Peta Digital", desc: "Jelajahi wilayah desa.", icon: Map, color: "emerald", link: "/informasi/peta" },
                { title: "Transparansi Dana", desc: "Laporan APBDes & realisasi.", icon: FileText, color: "purple", link: "/informasi/transparansi" },
                { title: "Berita Desa", desc: "Kabar terbaru seputar desa.", icon: Newspaper, color: "blue", link: "/informasi/berita" },
                { title: "Galeri Desa", desc: "Dokumentasi foto kegiatan.", icon: ImageIcon, color: "pink", link: "/informasi/galeri" },
                { title: "Agenda Kegiatan", desc: "Jadwal acara desa.", icon: Calendar, color: "orange", link: "/informasi/agenda" },
                { title: "Produk Hukum", desc: "Peraturan & SK desa.", icon: Scale, color: "emerald", link: "/informasi/hukum" },
            ]
        },
    ];

    const colorMap: Record<string, { bg: string, text: string, border: string, glow: string }> = {
        blue: { bg: "from-neon-blue/20 to-neon-blue/5", text: "text-neon-blue", border: "neon-border-blue", glow: "shadow-glow-blue" },
        emerald: { bg: "from-neon-emerald/20 to-neon-emerald/5", text: "text-neon-emerald", border: "neon-border-emerald", glow: "shadow-glow-emerald" },
        purple: { bg: "from-neon-purple/20 to-neon-purple/5", text: "text-neon-purple", border: "neon-border-purple", glow: "shadow-glow-purple" },
        orange: { bg: "from-neon-orange/20 to-neon-orange/5", text: "text-neon-orange", border: "neon-border-orange", glow: "shadow-glow-orange" },
        pink: { bg: "from-neon-pink/20 to-neon-pink/5", text: "text-neon-pink", border: "border border-pink-500/30", glow: "" },
    };

    const [searchQuery, setSearchQuery] = React.useState("");

    // Filter services based on search
    const filteredServices = services.map(section => ({
        ...section,
        items: section.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.items.length > 0);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[var(--bg-primary)] pt-28 pb-20 px-4 md:px-8 mesh-bg transition-colors duration-300">
            {/* Decorative Orbs - Adjusted opacity for light mode */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 text-sm font-medium tracking-wide mb-6 backdrop-blur-sm">
                        <Zap className="w-4 h-4 text-neon-blue" />
                        Direktori Layanan Digital
                    </motion.div>

                    <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                        Layanan{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-emerald">
                            Publik
                        </span>
                    </motion.h1>

                    <motion.p variants={fadeInUp} className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                        Akses seluruh layanan digital dan informasi publik Desa Cenrana.
                        Cepat, mudah, dan transparan.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div variants={fadeInUp} className="max-w-xl mx-auto">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative flex items-center">
                                <Search className="absolute left-5 w-5 h-5 text-gray-400 dark:text-gray-500 group-focus-within:text-neon-blue transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari layanan (misal: Aspirasi, Peta...)"
                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-gray-400 backdrop-blur-xl focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all shadow-lg shadow-slate-200/50 dark:shadow-none"
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Services Grid */}
                <div className="space-y-16">
                    {filteredServices.length > 0 ? (
                        filteredServices.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={staggerContainer}
                            >
                                <motion.h2
                                    variants={fadeInUp}
                                    className="text-sm font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-8 pb-3 border-b border-slate-200 dark:border-white/5"
                                >
                                    {section.category}
                                </motion.h2>

                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    variants={staggerContainer}
                                >
                                    {section.items.map((item, itemIdx) => {
                                        const colors = colorMap[item.color] || colorMap.blue;

                                        return (
                                            <motion.div key={itemIdx} variants={scaleIn}>
                                                <Link href={item.link} className="block group h-full">
                                                    <div className={`glow-card h-full p-6 ${colors.border} hover:${colors.glow} transition-all duration-300 relative overflow-hidden`}>
                                                        {/* Icon */}
                                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                                            <item.icon className={`w-7 h-7 ${colors.text}`} />
                                                        </div>

                                                        {/* Content */}
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-neon-blue transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                                            {item.desc}
                                                        </p>

                                                        {/* Link */}
                                                        <div className={`inline-flex items-center text-sm font-medium ${colors.text} group-hover:translate-x-1 transition-transform`}>
                                                            Buka Layanan <ChevronRight className="w-4 h-4 ml-1" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-slate-500 dark:text-gray-500 text-lg">Tidak ditemukan layanan untuk "{searchQuery}"</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-4 text-neon-blue hover:underline"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

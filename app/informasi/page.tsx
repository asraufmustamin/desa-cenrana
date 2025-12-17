"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Newspaper, Image, Calendar, MapPin, BarChart3, FileText, Scale, Lightbulb, Building2, History, Users, Sparkles, ArrowRight, Info, BookOpen, Target, MessageCircle, Landmark, Home } from "lucide-react";

// Menu items configuration
const informasiMenus = [
    { title: "Berita Desa", description: "Kabar terbaru kegiatan desa", href: "/informasi/berita", icon: Newspaper, gradient: "from-blue-500 to-cyan-500", color: "blue" },
    { title: "Galeri Foto", description: "Dokumentasi momen penting", href: "/informasi/galeri", icon: Image, gradient: "from-pink-500 to-rose-500", color: "pink" },
    { title: "Agenda Kegiatan", description: "Jadwal acara mendatang", href: "/informasi/agenda", icon: Calendar, gradient: "from-amber-500 to-orange-500", color: "amber" },
    { title: "Peta Digital", description: "Peta wilayah & potensi", href: "/informasi/peta", icon: MapPin, gradient: "from-emerald-500 to-green-500", color: "emerald" },
    { title: "Infografis", description: "Data statistik visual", href: "/informasi/infografis", icon: BarChart3, gradient: "from-violet-500 to-purple-500", color: "violet" },
    { title: "Transparansi APBDes", description: "Laporan keuangan desa", href: "/informasi/transparansi", icon: FileText, gradient: "from-teal-500 to-cyan-600", color: "teal" },
    { title: "Produk Hukum", description: "Peraturan & dokumen hukum", href: "/informasi/hukum", icon: Scale, gradient: "from-slate-500 to-gray-600", color: "slate" },
    { title: "Program Unggulan", description: "Inisiatif strategis desa", href: "/informasi/program", icon: Lightbulb, gradient: "from-yellow-500 to-amber-500", color: "yellow" },
];

const profilMenus = [
    { title: "Profil Desa", description: "Info umum Desa Cenrana", href: "/profil", icon: Building2, gradient: "from-cyan-500 to-blue-600", color: "cyan" },
    { title: "Sejarah Desa", description: "Asal-usul & perjalanan", href: "/profil/sejarah", icon: History, gradient: "from-emerald-500 to-green-600", color: "emerald" },
    { title: "Struktur Organisasi", description: "Bagan SOTK pemerintahan", href: "/profil/sotk", icon: Users, gradient: "from-violet-500 to-purple-600", color: "violet" },
    { title: "Visi & Misi", description: "Tujuan pembangunan desa", href: "/profil/visi-misi", icon: Target, gradient: "from-blue-500 to-indigo-600", color: "blue" },
    { title: "Sambutan Kades", description: "Kata sambutan pimpinan", href: "/profil/sambutan", icon: MessageCircle, gradient: "from-amber-500 to-orange-600", color: "amber" },
    { title: "Lembaga Desa", description: "BPD, PKK, Karang Taruna", href: "/profil/lembaga", icon: Landmark, gradient: "from-rose-500 to-pink-600", color: "rose" },
    { title: "Sarana Prasarana", description: "Fasilitas umum desa", href: "/profil/sarana", icon: Home, gradient: "from-teal-500 to-cyan-600", color: "teal" },
    { title: "Potensi Desa", description: "SDA & ekonomi lokal", href: "/profil/potensi", icon: Sparkles, gradient: "from-lime-500 to-green-600", color: "lime" },
];

export default function InformasiPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Premium Hero Header */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Info className="w-4 h-4 text-violet-400" />
                        <span className="text-sm font-bold text-violet-400">Pusat Informasi</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 text-[var(--text-primary)]">
                        Layanan{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">Informasi</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                        Akses berbagai informasi publik dan layanan digital Desa Cenrana
                    </p>
                </motion.div>

                {/* Profil Section */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">Profil Desa</h2>
                            <p className="text-xs text-[var(--text-secondary)]">Kenali lebih dekat Desa Cenrana</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {profilMenus.map((menu, index) => (
                            <motion.div
                                key={menu.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 + index * 0.05 }}
                            >
                                <Link href={menu.href} className="block group h-full">
                                    <motion.div
                                        className="relative h-full p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg overflow-hidden transition-all duration-300"
                                        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                                    >
                                        {/* Decorative Gradient Corner */}
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${menu.gradient} opacity-10 rounded-bl-full`}></div>

                                        {/* Icon */}
                                        <motion.div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${menu.gradient} flex items-center justify-center mb-3 shadow-lg`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <menu.icon className="w-6 h-6 text-white" />
                                        </motion.div>

                                        {/* Content */}
                                        <h3 className="text-base font-bold mb-1 text-[var(--text-primary)] group-hover:text-rose-400 transition-colors">
                                            {menu.title}
                                        </h3>
                                        <p className="text-xs text-[var(--text-secondary)] mb-3">
                                            {menu.description}
                                        </p>

                                        {/* Arrow */}
                                        <div className="flex items-center gap-1 text-xs font-semibold text-rose-400 opacity-0 group-hover:opacity-100 transition-all">
                                            <span>Buka</span>
                                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Informasi Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[var(--text-primary)]">Informasi Publik</h2>
                            <p className="text-xs text-[var(--text-secondary)]">{informasiMenus.length} kategori tersedia</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {informasiMenus.map((menu, index) => (
                            <motion.div
                                key={menu.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 + index * 0.05 }}
                            >
                                <Link href={menu.href} className="block group h-full">
                                    <motion.div
                                        className="relative h-full p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg overflow-hidden transition-all duration-300"
                                        whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                                    >
                                        {/* Glowing Border Effect on Hover */}
                                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} style={{ background: `linear-gradient(to bottom right, var(--${menu.color}-500/10), transparent)` }}></div>

                                        {/* Icon */}
                                        <motion.div
                                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${menu.gradient} flex items-center justify-center mb-3 shadow-lg relative z-10`}
                                            whileHover={{ scale: 1.1, rotate: -5 }}
                                            transition={{ type: "spring", stiffness: 400 }}
                                        >
                                            <menu.icon className="w-5 h-5 text-white" />
                                        </motion.div>

                                        {/* Content */}
                                        <h3 className="text-sm font-bold mb-1 text-[var(--text-primary)] group-hover:text-violet-400 transition-colors relative z-10">
                                            {menu.title}
                                        </h3>
                                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 relative z-10">
                                            {menu.description}
                                        </p>

                                        {/* Hover Arrow */}
                                        <motion.div
                                            className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                                            initial={{ scale: 0 }}
                                            whileHover={{ scale: 1.2 }}
                                        >
                                            <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
                                        </motion.div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {[
                        { label: "Menu Tersedia", value: (informasiMenus.length + profilMenus.length).toString(), icon: "📚", gradient: "from-blue-500/10 to-cyan-500/10", border: "border-blue-500/30" },
                        { label: "Akses 24/7", value: "Online", icon: "🌐", gradient: "from-emerald-500/10 to-green-500/10", border: "border-emerald-500/30" },
                        { label: "Update", value: "Real-time", icon: "⚡", gradient: "from-amber-500/10 to-orange-500/10", border: "border-amber-500/30" },
                        { label: "Gratis", value: "100%", icon: "💎", gradient: "from-violet-500/10 to-purple-500/10", border: "border-violet-500/30" },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} border ${stat.border} backdrop-blur-xl text-center`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="text-2xl mb-1">{stat.icon}</div>
                            <div className="text-lg font-black text-[var(--text-primary)]">{stat.value}</div>
                            <div className="text-[10px] font-medium text-[var(--text-secondary)]">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

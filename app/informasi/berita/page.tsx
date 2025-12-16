"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { Calendar, ChevronRight, Newspaper, ArrowLeft, Sparkles, Search, Eye } from "lucide-react";

export default function BeritaPage() {
    const { news } = useAppContext();
    const [mounted, setMounted] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/informasi" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Newspaper className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-bold text-blue-400">Berita Desa</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 text-[var(--text-primary)]">
                        Kabar{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Desa</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto mb-6">
                        Informasi terkini dari Pemerintah Desa Cenrana
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-blue-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari berita..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </motion.div>

                {/* News Grid */}
                {filteredNews.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {filteredNews.map((item, index) => {
                            const isInvalidImage = item.image?.includes("whatsapp") || item.image?.includes("wa.me") || item.image?.includes("mediacorp.sg");
                            const safeImage = isInvalidImage ? "https://images.unsplash.com/photo-1589923188900-85dae5233271?auto=format&fit=crop&w=800&q=80" : item.image;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group"
                                    whileHover={{ y: -5 }}
                                >
                                    <Link href={`/berita/${item.id}`} className="block">
                                        <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all duration-300">
                                            <div className="relative h-32 overflow-hidden">
                                                <Image
                                                    src={safeImage}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[9px] font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500">
                                                    {item.category || "Berita"}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {item.date}
                                                </div>
                                                <h3 className="text-sm font-bold mb-1 line-clamp-2 text-[var(--text-primary)] group-hover:text-blue-400 transition-colors leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="text-[11px] leading-relaxed line-clamp-2 text-[var(--text-secondary)] mb-2">
                                                    {item.excerpt}
                                                </p>
                                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400">
                                                    Baca <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-16 rounded-2xl bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-4">
                            <Newspaper className="w-8 h-8 text-[var(--text-secondary)]/40" />
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">Belum ada berita</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Silakan kembali lagi nanti untuk informasi terbaru</p>
                    </motion.div>
                )}

                {/* Stats */}
                <motion.div
                    className="mt-8 flex justify-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                        <div className="text-lg font-black text-blue-400">{news.length}</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Total Berita</div>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                        <div className="text-lg font-black text-emerald-400">{filteredNews.length}</div>
                        <div className="text-[10px] font-medium text-[var(--text-secondary)]">Ditampilkan</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

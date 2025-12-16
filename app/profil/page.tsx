"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";
import OrgChart from "@/components/OrgChart";
import { History, Target, Award, Users, Building2, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Eye, ChevronDown } from "lucide-react";

export default function Profil() {
    const { cmsContent } = useAppContext();
    const { profil } = cmsContent;
    const [mounted, setMounted] = React.useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle scroll to section on page load
    useEffect(() => {
        if (mounted) {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 300);
                }
            }
        }
    }, [mounted]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const navItems = [
        { id: 'sambutan', label: 'Sambutan', icon: Award, gradient: 'from-amber-500 to-orange-500' },
        { id: 'sejarah', label: 'Sejarah', icon: History, gradient: 'from-cyan-500 to-blue-500' },
        { id: 'visi-misi', label: 'Visi & Misi', icon: Target, gradient: 'from-emerald-500 to-green-500' },
        { id: 'struktur', label: 'Struktur', icon: Users, gradient: 'from-violet-500 to-purple-500' },
        { id: 'lembaga', label: 'Lembaga', icon: Building2, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'sarana', label: 'Sarana', icon: Building2, gradient: 'from-teal-500 to-cyan-500' },
        { id: 'potensi', label: 'Potensi', icon: Eye, gradient: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <EditModeIndicator />

            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* ========== HERO SECTION ========== */}
            <section className="pt-24 pb-12 px-4 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20">
                            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                            Kembali
                        </Link>
                    </motion.div>

                    {/* Hero Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Building2 className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-bold text-cyan-400">Profil Desa</span>
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-black mb-2 text-[var(--text-primary)]">
                            Mengenal{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-400">
                                Desa Cenrana
                            </span>
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto mb-6">
                            Jelajahi sejarah, visi misi, dan struktur pemerintahan desa kami
                        </p>

                        {/* Quick Navigation - 7 Menu Items */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {navItems.map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + index * 0.05 }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs transition-all bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-cyan-500/50 hover:shadow-lg"
                                >
                                    <div className={`w-5 h-5 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                                        <item.icon className="w-3 h-3 text-white" />
                                    </div>
                                    {item.label}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Hero Banner */}
                    <motion.div
                        className="relative rounded-2xl overflow-hidden group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-green-500 rounded-2xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>
                        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden">
                            <Editable
                                type="image"
                                section="profil"
                                field="historyBanner"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="flex justify-center mt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.button
                            onClick={() => scrollToSection('sambutan')}
                            className="flex flex-col items-center gap-1 text-[var(--text-secondary)] hover:text-amber-400 transition-colors"
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <span className="text-xs">Scroll</span>
                            <ChevronDown className="w-5 h-5" />
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* ========== 1. SAMBUTAN KEPALA DESA SECTION ========== */}
            <section id="sambutan" className="py-16 px-4 scroll-mt-24 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="text-center mb-6">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Award className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-bold text-amber-400">Sambutan</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sambutan Kepala Desa</h2>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-2xl blur-sm"></div>
                            <div className="relative p-6 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-amber-500/30">
                                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                    {/* Photo */}
                                    <div className="shrink-0">
                                        <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-amber-500/50 bg-[var(--bg-panel)]">
                                            <Editable type="image" section="sambutan" field="fotoKades" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-center mt-2">
                                            <p className="text-sm font-bold text-[var(--text-primary)]">
                                                <Editable section="sambutan" field="namaKades" />
                                            </p>
                                            <p className="text-[10px] text-amber-400">Kepala Desa</p>
                                        </div>
                                    </div>
                                    {/* Message */}
                                    <div className="flex-1">
                                        <p className="text-sm leading-relaxed text-[var(--text-secondary)] italic whitespace-pre-line">
                                            "<Editable section="sambutan" field="isiSambutan" type="textarea" />"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== 2. SEJARAH SECTION ========== */}
            <section id="sejarah" className="py-16 px-4 scroll-mt-24 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <Link href="/profil/sejarah" className="block group">
                            <div className="relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur-sm group-hover:opacity-100 opacity-50 transition-opacity"></div>
                                <div className="relative rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] overflow-hidden group-hover:border-cyan-500/50 transition-all">
                                    {/* Image Banner */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Editable
                                            type="image"
                                            section="profil"
                                            field="historyBanner"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                                                    <History className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Sejarah Desa</span>
                                                    <h2 className="text-lg font-bold text-white">
                                                        <Editable section="profil" field="historyTitle" />
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Content */}
                                    <div className="p-5">
                                        <p className="text-sm leading-relaxed text-[var(--text-secondary)] line-clamp-3 mb-4">
                                            {profil.historyFullText?.substring(0, 200)}...
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[var(--text-secondary)]">📍 Desa Cenrana, Kab. Maros</span>
                                            <span className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all">
                                                Baca Selengkapnya
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ========== VISI MISI SECTION ========== */}
            <section id="visi-misi" className="py-16 px-4 scroll-mt-24 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Target className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-400">Arah Pembangunan</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                Visi & Misi Desa Cenrana
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
                            {/* Visi Card */}
                            <motion.div
                                className="relative group h-full"
                                whileHover={{ y: -5 }}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/40 to-green-500/40 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative h-full p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-emerald-500/30 overflow-hidden flex flex-col justify-center">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <Eye className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">VISI</h3>
                                        </div>
                                        <div className="text-sm italic leading-relaxed pl-4 border-l-2 border-emerald-500 text-[var(--text-secondary)]">
                                            "<Editable section="profil" field="visionText" type="textarea" />"
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Misi Card */}
                            <motion.div
                                className="relative group h-full"
                                whileHover={{ y: -5 }}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative h-full p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-cyan-500/30 overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-tr-full"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                                <Award className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-[var(--text-primary)]">MISI</h3>
                                        </div>
                                        <div className="space-y-2">
                                            {profil.missionList.map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    className="flex items-start gap-2 p-2 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)]"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-cyan-500 to-blue-500">
                                                        {index + 1}
                                                    </div>
                                                    <p className="text-xs leading-relaxed text-[var(--text-secondary)]">{item}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== STRUKTUR ORGANISASI SECTION ========== */}
            <section id="struktur" className="py-16 px-4 pb-24 scroll-mt-24 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Users className="w-4 h-4 text-violet-400" />
                                <span className="text-sm font-bold text-violet-400">Pemerintahan Desa</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                                Struktur Organisasi
                            </h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Bagan SOTK Pemerintah Desa Cenrana
                            </p>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-2xl blur-sm"></div>
                            <div className="relative rounded-2xl overflow-hidden p-6 bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)]">
                                <OrgChart />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== 5. LEMBAGA KEMASYARAKATAN SECTION ========== */}
            <section id="lembaga" className="py-16 px-4 scroll-mt-24 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="text-center mb-6">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Building2 className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-bold text-blue-400">Kelembagaan</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Lembaga Kemasyarakatan</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { name: "BPD", full: "Badan Permusyawaratan Desa", emoji: "🏛️" },
                                { name: "LPM", full: "Lembaga Pemberdayaan Masyarakat", emoji: "🏗️" },
                                { name: "PKK", full: "Pemberdayaan Kesejahteraan Keluarga", emoji: "💗" },
                                { name: "Karang Taruna", full: "Organisasi Kepemudaan", emoji: "👥" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-blue-500/30 text-center"
                                >
                                    <div className="text-3xl mb-2">{item.emoji}</div>
                                    <h3 className="text-sm font-bold text-blue-400">{item.name}</h3>
                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1 line-clamp-2">{item.full}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== 6. SARANA & PRASARANA SECTION ========== */}
            <section id="sarana" className="py-16 px-4 scroll-mt-24 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="text-center mb-6">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Building2 className="w-4 h-4 text-teal-400" />
                                <span className="text-sm font-bold text-teal-400">Fasilitas</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sarana & Prasarana</h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                            {[
                                { name: "Kantor Desa", count: "1", emoji: "🏛️" },
                                { name: "Masjid/Musholla", count: "5", emoji: "🕌" },
                                { name: "Sekolah", count: "3", emoji: "🏫" },
                                { name: "Posyandu", count: "2", emoji: "🏥" },
                                { name: "Balai Desa", count: "1", emoji: "🏠" },
                                { name: "Perpustakaan", count: "1", emoji: "📚" },
                                { name: "Lapangan", count: "2", emoji: "⚽" },
                                { name: "Sumber Air", count: "4", emoji: "💧" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -3 }}
                                    className="p-3 rounded-xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-teal-500/30 text-center"
                                >
                                    <div className="text-2xl mb-1">{item.emoji}</div>
                                    <h3 className="text-xs font-bold text-[var(--text-primary)] line-clamp-1">{item.name}</h3>
                                    <p className="text-lg font-black text-teal-400">{item.count}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ========== 7. POTENSI DESA SECTION ========== */}
            <section id="potensi" className="py-16 px-4 pb-24 scroll-mt-24 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <div className="text-center mb-6">
                            <motion.div
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Eye className="w-4 h-4 text-green-400" />
                                <span className="text-sm font-bold text-green-400">Ekonomi</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Potensi Desa</h2>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { name: "Pertanian", items: "Padi, Jagung, Kacang", emoji: "🌾", stat: "180 Ha" },
                                { name: "Perkebunan", items: "Kelapa, Kopi, Kakao", emoji: "🌴", stat: "115 Ha" },
                                { name: "Peternakan", items: "Sapi, Kambing, Ayam", emoji: "🐄", stat: "430+" },
                                { name: "UMKM", items: "Warung, Kios, Industri", emoji: "🏪", stat: "45 Unit" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-green-500/30"
                                >
                                    <div className="text-3xl mb-2">{item.emoji}</div>
                                    <h3 className="text-sm font-bold text-green-400">{item.name}</h3>
                                    <p className="text-[10px] text-[var(--text-secondary)] mt-1">{item.items}</p>
                                    <p className="text-lg font-black text-[var(--text-primary)] mt-2">{item.stat}</p>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            className="mt-6 text-center"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Link href="/lapak" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
                                🛒 Lihat Produk UMKM di Lapak Warga
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Back to Top Button */}
            <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg z-40 bg-gradient-to-br from-cyan-500 to-emerald-500"
                style={{ boxShadow: '0 8px 20px rgba(14, 165, 233, 0.4)' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowDown className="w-5 h-5 rotate-180" />
            </motion.button>
        </div>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";
import { MessageCircle, ArrowLeft, Sparkles, Quote, User, Award, Calendar, MapPin } from "lucide-react";

export default function SambutanKadesPage() {
    const { cmsContent, kepalaDesaStatus } = useAppContext();
    const { profil } = cmsContent;
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
                <div className="absolute top-1/2 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/profil" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20">
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
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <MessageCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-bold text-amber-400">Sambutan</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black mb-2 text-[var(--text-primary)]">
                        Sambutan{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400">
                            Kepala Desa
                        </span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Selamat datang di Desa Cenrana, Kabupaten Maros
                    </p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-3xl blur-sm"></div>
                        <div className="relative rounded-3xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] overflow-hidden">
                            {/* Photo & Info Section */}
                            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                                {/* Photo */}
                                <motion.div
                                    className="relative shrink-0"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-sm opacity-60"></div>
                                    <div className="relative w-40 h-52 rounded-2xl overflow-hidden border-2 border-amber-500/50">
                                        <Editable
                                            type="image"
                                            section="sambutan"
                                            field="fotoKades"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Status Badge */}
                                        <div className={`absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg text-center text-[10px] font-bold backdrop-blur-md ${kepalaDesaStatus?.isActive ? 'bg-emerald-500/80 text-white' : 'bg-red-500/80 text-white'}`}>
                                            {kepalaDesaStatus?.isActive ? '🟢 Aktif Menjabat' : '🔴 Tidak Aktif'}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h2 className="text-xl font-black text-[var(--text-primary)] mb-1">
                                        <Editable section="sambutan" field="namaKades" />
                                    </h2>
                                    <p className="text-sm font-semibold text-amber-400 mb-4">
                                        Kepala Desa Cenrana
                                    </p>

                                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                                        <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-amber-400" />
                                            <span className="text-[10px] font-bold text-amber-400">
                                                <Editable section="sambutan" field="periodeMenjabat" />
                                            </span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                                            <Award className="w-3 h-3 text-emerald-400" />
                                            <span className="text-[10px] font-bold text-emerald-400">
                                                <Editable section="sambutan" field="pendidikan" />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Info */}
                                    <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-[var(--text-secondary)]">
                                        <MapPin className="w-3 h-3 text-red-400" />
                                        <span>Desa Cenrana, Kec. Cenrana, Kab. Maros</span>
                                    </div>
                                </div>
                            </div>

                            {/* Message Section */}
                            <div className="p-6 md:p-8 border-t border-[var(--border-color)] bg-gradient-to-b from-transparent to-amber-500/5">
                                <div className="flex items-start gap-4">
                                    <Quote className="w-8 h-8 text-amber-400/30 shrink-0 mt-1" />
                                    <div className="flex-1">
                                        <div className="text-base leading-relaxed text-[var(--text-secondary)] whitespace-pre-line italic">
                                            <Editable section="sambutan" field="isiSambutan" type="textarea" />
                                        </div>
                                        <div className="mt-6 flex items-center gap-3">
                                            <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-[var(--text-primary)]">
                                                    <Editable section="sambutan" field="namaKades" />
                                                </p>
                                                <p className="text-xs text-amber-400">Kepala Desa Cenrana</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Additional Info Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* Motto Card */}
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-amber-500/30">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                <Award className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-bold text-[var(--text-primary)]">Motto Desa</h3>
                        </div>
                        <p className="text-sm italic text-[var(--text-secondary)]">
                            "<Editable section="sambutan" field="mottoDesa" />"
                        </p>
                    </div>

                    {/* Contact Card */}
                    <div className="p-4 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-emerald-500/30">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                <MessageCircle className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-sm font-bold text-[var(--text-primary)]">Kontak Desa</h3>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                            📧 <Editable section="sambutan" field="emailDesa" />
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                            📞 <Editable section="sambutan" field="telpDesa" />
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

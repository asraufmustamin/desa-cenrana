"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { PieChart, TrendingUp, Wallet, FileText, ArrowLeft, Sparkles, BarChart3 } from "lucide-react";

export default function TransparansiPage() {
    const { cmsContent } = useAppContext();
    const { transparansi } = cmsContent;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const formatRupiah = (value: string | number) => {
        const numberString = value.toString().replace(/[^,\d]/g, "");
        const split = numberString.split(",");
        let sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);
        if (ribuan) {
            rupiah += (sisa ? "." : "") + ribuan.join(".");
        }
        return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
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
                    <Link href="/informasi" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/20">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FileText className="w-4 h-4 text-teal-400" />
                        <span className="text-sm font-bold text-teal-400">Transparansi APBDes</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black mb-2 text-[var(--text-primary)]">
                        <Editable section="transparansi" field="title" />
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                        Pengelolaan keuangan desa yang terbuka dan akuntabel
                    </p>
                </motion.div>

                {/* Summary Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Pendapatan */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-emerald-500/30 overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                        Pendapatan
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">Realisasi</p>
                                    <h3 className="text-lg font-black text-[var(--text-primary)]">
                                        Rp <Editable section="transparansi" field="budget.pendapatan.realisasi" />
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">Target</p>
                                    <p className="text-sm font-semibold text-[var(--text-secondary)]">
                                        Rp <Editable section="transparansi" field="budget.pendapatan.target" />
                                    </p>
                                </div>
                                <div className="mt-4 w-full rounded-full h-1.5 overflow-hidden bg-[var(--bg-panel)]">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-emerald-500 to-green-500"
                                        style={{ width: mounted ? "83%" : "0%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Belanja */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/30 to-red-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-rose-500/30 overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-500/20 to-transparent rounded-bl-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                                        <Wallet className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                                        Belanja
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">Realisasi</p>
                                    <h3 className="text-lg font-black text-[var(--text-primary)]">
                                        Rp <Editable section="transparansi" field="budget.belanja.realisasi" />
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">Target</p>
                                    <p className="text-sm font-semibold text-[var(--text-secondary)]">
                                        Rp <Editable section="transparansi" field="budget.belanja.target" />
                                    </p>
                                </div>
                                <div className="mt-4 w-full rounded-full h-1.5 overflow-hidden bg-[var(--bg-panel)]">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-rose-500 to-red-500"
                                        style={{ width: mounted ? "73%" : "0%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Pembiayaan */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative p-5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-cyan-500/30 overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                                        <PieChart className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                        Pembiayaan
                                    </span>
                                </div>
                                <div className="space-y-1 mb-3">
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">Penerimaan</p>
                                    <h3 className="text-lg font-black text-[var(--text-primary)]">Rp 50.000.000</h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">Pengeluaran</p>
                                    <p className="text-sm font-semibold text-[var(--text-secondary)]">Rp 20.000.000</p>
                                </div>
                                <div className="mt-4 w-full rounded-full h-1.5 overflow-hidden bg-[var(--bg-panel)]">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-cyan-500 to-blue-500"
                                        style={{ width: mounted ? "40%" : "0%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Detailed Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl blur-sm"></div>
                        <div className="relative rounded-2xl p-5 bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)]">
                            <h3 className="text-lg font-bold mb-6 flex items-center text-[var(--text-primary)]">
                                <BarChart3 className="w-5 h-5 mr-2 text-teal-400" /> Rincian Anggaran
                            </h3>
                            <div className="space-y-4">
                                {transparansi.items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <h4 className="text-sm font-bold text-[var(--text-primary)]">{item.label}</h4>
                                                <p className="text-[10px] text-[var(--text-secondary)]">
                                                    Target: Rp {formatRupiah(item.target)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-base font-bold text-emerald-400">{item.percentage}%</p>
                                                <p className="text-[10px] text-[var(--text-secondary)]">
                                                    Rp {formatRupiah(item.realization)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full rounded-full h-2 overflow-hidden bg-[var(--bg-primary)]">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-teal-500 to-cyan-500"
                                                style={{ width: mounted ? `${item.percentage}%` : "0%" }}
                                            ></div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

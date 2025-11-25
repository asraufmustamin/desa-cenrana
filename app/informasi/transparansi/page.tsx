"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { PieChart, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { useEffect, useState } from "react";

export default function TransparansiPage() {
    const { cmsContent } = useAppContext();
    const { transparansi } = cmsContent;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const formatRupiah = (value: string | number) => {
        const numberString = value.toString().replace(/[^,\d]/g, "");
        const split = numberString.split(",");
        let sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (ribuan) {
            const separator = sisa ? "." : "";
            rupiah += separator + ribuan.join(".");
        }

        return split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    };

    const calculatePercentage = (target: number, realization: number) => {
        if (target === 0) return 0;
        return Math.min(Math.round((realization / target) * 100), 100);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        <Editable section="transparansi" field="title" />
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Wujud komitmen kami dalam pengelolaan keuangan desa yang terbuka dan akuntabel.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Pendapatan */}
                    <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                                    Pendapatan
                                </span>
                            </div>
                            <div className="space-y-1 mb-4">
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Realisasi</p>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                                    Rp <Editable section="transparansi" field="budget.pendapatan.realisasi" />
                                </h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Target</p>
                                <p className="text-lg font-semibold text-[var(--text-secondary)]">
                                    Rp <Editable section="transparansi" field="budget.pendapatan.target" />
                                </p>
                            </div>
                            <div className="mt-6 w-full bg-[var(--bg-panel)] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: mounted ? "83%" : "0%" }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Belanja */}
                    <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-2xl hover:shadow-rose-500/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-rose-500/20 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400">
                                    <Wallet className="w-8 h-8" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                                    Belanja
                                </span>
                            </div>
                            <div className="space-y-1 mb-4">
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Realisasi</p>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                                    Rp <Editable section="transparansi" field="budget.belanja.realisasi" />
                                </h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Target</p>
                                <p className="text-lg font-semibold text-[var(--text-secondary)]">
                                    Rp <Editable section="transparansi" field="budget.belanja.target" />
                                </p>
                            </div>
                            <div className="mt-6 w-full bg-[var(--bg-panel)] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-rose-500 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: mounted ? "73%" : "0%" }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Pembiayaan (Placeholder for now, using Net Surplus/Deficit logic visually) */}
                    <div className="glass-card p-8 rounded-[2rem] relative overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-blue-500/20 transition-colors"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                                    <PieChart className="w-8 h-8" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
                                    Pembiayaan
                                </span>
                            </div>
                            <div className="space-y-1 mb-4">
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Penerimaan</p>
                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                                    Rp 50.000.000
                                </h3>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[var(--text-secondary)] text-sm font-medium">Pengeluaran</p>
                                <p className="text-lg font-semibold text-[var(--text-secondary)]">
                                    Rp 20.000.000
                                </p>
                            </div>
                            <div className="mt-6 w-full bg-[var(--bg-panel)] rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: mounted ? "40%" : "0%" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="glass-panel rounded-[2rem] p-8 overflow-hidden">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-8 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-blue-500" />
                        Rincian Anggaran
                    </h3>
                    <div className="space-y-8">
                        {transparansi.items.map((item, index) => (
                            <div key={index} className="relative">
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{item.label}</h4>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            Target: Rp {formatRupiah(item.target)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-emerald-400">
                                            {item.percentage}%
                                        </p>
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            Rp {formatRupiah(item.realization)}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full bg-[var(--bg-panel)] rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                        style={{ width: mounted ? `${item.percentage}%` : "0%" }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

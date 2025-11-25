
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Activity } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";

export default function Transparansi() {
    const { cmsContent, updateContent } = useAppContext();

    // SAFETY CHECK
    if (!cmsContent || !cmsContent.transparansi || !cmsContent.transparansi.budget) {
        return <div className="p-10 text-center text-white">Memuat Data Anggaran...</div>;
    }

    const { budget } = cmsContent.transparansi;

    // Calculate percentages
    const pendapatanPercent = Math.round((budget.pendapatan.realisasi / budget.pendapatan.target) * 100);
    const belanjaPercent = Math.round((budget.belanja.realisasi / budget.belanja.target) * 100);

    const dataPendapatan = [
        { name: "Realisasi", value: budget.pendapatan.realisasi },
        { name: "Sisa Target", value: budget.pendapatan.target - budget.pendapatan.realisasi },
    ];

    const dataBelanja = [
        { name: "Realisasi", value: budget.belanja.realisasi },
        { name: "Sisa Anggaran", value: budget.belanja.target - budget.belanja.realisasi },
    ];

    const COLORS_PENDAPATAN = ["#10b981", "#064e3b"]; // Emerald
    const COLORS_BELANJA = ["#3b82f6", "#1e3a8a"]; // Blue

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
    };

    const updateBudget = (type: "pendapatan" | "belanja", field: "target" | "realisasi", value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
        const newBudget = { ...budget, [type]: { ...budget[type], [field]: numValue } };

        // Create a deep copy of transparansi to update
        const newTransparansi = { ...cmsContent.transparansi, budget: newBudget };
        updateContent("transparansi", "budget", newBudget);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 text-glow">Transparansi Anggaran</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Laporan realisasi Anggaran Pendapatan dan Belanja Desa (APBDes) Tahun 2024.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Pendapatan Card */}
                    <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp className="w-32 h-32 text-emerald-500" />
                        </div>
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500 mr-4">
                                <ArrowUpRight className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Pendapatan Desa</h2>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm mb-1">Target Anggaran</p>
                                <Editable
                                    value={budget.pendapatan.target}
                                    onSave={(val) => updateBudget("pendapatan", "target", val)}
                                    className="text-2xl font-bold text-[var(--text-primary)]"
                                />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm mb-1">Realisasi</p>
                                <Editable
                                    value={budget.pendapatan.realisasi}
                                    onSave={(val) => updateBudget("pendapatan", "realisasi", val)}
                                    className="text-3xl font-bold text-emerald-500"
                                />
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-2 font-bold">
                                    <span className="text-[var(--text-secondary)]">Capaian</span>
                                    <span className="text-emerald-500">{pendapatanPercent}%</span>
                                </div>
                                <div className="w-full bg-[var(--bg-card)] rounded-full h-3 overflow-hidden border border-[var(--border-color)]">
                                    <div
                                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${pendapatanPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Belanja Card */}
                    <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Activity className="w-32 h-32 text-blue-500" />
                        </div>
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500 mr-4">
                                <ArrowDownRight className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Belanja Desa</h2>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm mb-1">Target Anggaran</p>
                                <Editable
                                    value={budget.belanja.target}
                                    onSave={(val) => updateBudget("belanja", "target", val)}
                                    className="text-2xl font-bold text-[var(--text-primary)]"
                                />
                            </div>
                            <div>
                                <p className="text-[var(--text-secondary)] text-sm mb-1">Realisasi</p>
                                <Editable
                                    value={budget.belanja.realisasi}
                                    onSave={(val) => updateBudget("belanja", "realisasi", val)}
                                    className="text-3xl font-bold text-blue-500"
                                />
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm mb-2 font-bold">
                                    <span className="text-[var(--text-secondary)]">Serapan</span>
                                    <span className="text-blue-500">{belanjaPercent}%</span>
                                </div>
                                <div className="w-full bg-[var(--bg-card)] rounded-full h-3 overflow-hidden border border-[var(--border-color)]">
                                    <div
                                        className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${belanjaPercent}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8 rounded-[2rem] flex flex-col items-center">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Komposisi Pendapatan</h3>
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataPendapatan}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dataPendapatan.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_PENDAPATAN[index % COLORS_PENDAPATAN.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] flex flex-col items-center">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Komposisi Belanja</h3>
                        <div className="w-full h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dataBelanja}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {dataBelanja.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_BELANJA[index % COLORS_BELANJA.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}
                                        itemStyle={{ color: 'var(--text-primary)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

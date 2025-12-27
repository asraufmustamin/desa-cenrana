"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAppContext } from "@/context/AppContext";
import {
    PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
    Tooltip, Legend, CartesianGrid, LineChart, Line, AreaChart, Area
} from "recharts";
import {
    Users, GraduationCap, Briefcase, BarChart3, ArrowLeft, Filter,
    TrendingUp, Home, Baby, UserCheck, MapPin, Calendar
} from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Data Statistik Tambahan (dummy, bisa diganti dari CMS/Database)
const populationTrend = [
    { year: "2020", penduduk: 3200 },
    { year: "2021", penduduk: 3280 },
    { year: "2022", penduduk: 3350 },
    { year: "2023", penduduk: 3420 },
    { year: "2024", penduduk: 3500 },
];

const ageGroups = [
    { name: "0-14", value: 850, fill: "#10B981" },
    { name: "15-24", value: 620, fill: "#3B82F6" },
    { name: "25-44", value: 1100, fill: "#8B5CF6" },
    { name: "45-64", value: 680, fill: "#F59E0B" },
    { name: "65+", value: 250, fill: "#EF4444" },
];

const dusunData = [
    { name: "Cenrana", pria: 450, wanita: 420 },
    { name: "Bonto Manai", pria: 380, wanita: 360 },
    { name: "Tanete", pria: 420, wanita: 400 },
    { name: "Bonto Loe", pria: 340, wanita: 320 },
    { name: "Kampung Baru", pria: 280, wanita: 260 },
];

const DUSUN_OPTIONS = ["Semua Dusun", "Cenrana", "Bonto Manai", "Tanete", "Bonto Loe", "Kampung Baru"];

export default function InfografisPage() {
    const { cmsContent } = useAppContext();
    const { infografis } = cmsContent;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [selectedDusun, setSelectedDusun] = useState("Semua Dusun");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedTheme === "dark" : true;
    const bgColor = isDark ? "#0A0F1A" : "#F8FAFC";
    const textColor = isDark ? "#FFFFFF" : "#1E293B";
    const subtextColor = isDark ? "#9CA3AF" : "#64748B";
    const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
    const borderColor = isDark ? "rgba(255,255,255,0.1)" : "#E2E8F0";

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Stats Cards Data
    const statsCards = [
        { icon: Users, label: "Total Penduduk", value: "3,500", color: "from-blue-500 to-cyan-500" },
        { icon: Home, label: "Jumlah KK", value: "892", color: "from-emerald-500 to-teal-500" },
        { icon: Baby, label: "Kelahiran (2024)", value: "45", color: "from-pink-500 to-rose-500" },
        { icon: UserCheck, label: "Wajib Pilih", value: "2,450", color: "from-amber-500 to-orange-500" },
    ];

    return (
        <div className="min-h-screen pt-28 pb-20 px-4" style={{ backgroundColor: bgColor }}>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-8">
                    <Link
                        href="/informasi"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:gap-3"
                        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: subtextColor }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div className="mb-10 text-center" initial="hidden" animate="visible" variants={fadeInUp}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                        style={{
                            backgroundColor: 'rgba(168, 85, 247, 0.1)',
                            border: `1px solid ${isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.4)'}`,
                            color: isDark ? '#A855F7' : '#9333EA'
                        }}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-sm font-semibold">Data Statistik</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: textColor }}>Infografis Desa</h1>
                    <p className="max-w-2xl mx-auto" style={{ color: subtextColor }}>
                        Data statistik kependudukan dan demografi Desa Cenrana secara visual
                    </p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    initial="hidden" animate="visible" variants={fadeInUp}
                >
                    {statsCards.map((stat, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-2xl relative overflow-hidden"
                            style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                        >
                            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}></div>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold" style={{ color: textColor }}>{stat.value}</p>
                            <p className="text-sm" style={{ color: subtextColor }}>{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Filter */}
                <motion.div
                    className="flex flex-wrap items-center gap-4 mb-8 p-4 rounded-2xl"
                    initial="hidden" animate="visible" variants={fadeInUp}
                    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5" style={{ color: subtextColor }} />
                        <span className="font-semibold" style={{ color: textColor }}>Filter:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {DUSUN_OPTIONS.map((dusun) => (
                            <button
                                key={dusun}
                                onClick={() => setSelectedDusun(dusun)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedDusun === dusun
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                        : ""
                                    }`}
                                style={selectedDusun !== dusun ? { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', color: subtextColor } : {}}
                            >
                                {dusun}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Population Trend Chart - NEW */}
                <motion.div
                    className="p-6 rounded-3xl mb-8"
                    initial="hidden" animate="visible" variants={fadeInUp}
                    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                >
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 rounded-xl text-white" style={{
                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                            boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                        }}>
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold" style={{ color: textColor }}>Tren Pertumbuhan Penduduk</h2>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={populationTrend}>
                                <defs>
                                    <linearGradient id="colorPenduduk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                <XAxis dataKey="year" stroke={subtextColor} fontSize={12} />
                                <YAxis stroke={subtextColor} fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                        borderRadius: '12px',
                                        border: `1px solid ${borderColor}`,
                                        color: textColor
                                    }}
                                />
                                <Area type="monotone" dataKey="penduduk" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorPenduduk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gender Chart */}
                    <motion.div
                        className="p-6 rounded-3xl"
                        initial="hidden" animate="visible" variants={fadeInUp}
                        style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 rounded-xl text-white" style={{
                                background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                                boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'
                            }}>
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold" style={{ color: textColor }}>Jenis Kelamin</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={infografis.gender} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={100} fill="#8884d8" dataKey="value">
                                        {infografis.gender.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Age Groups Chart - NEW */}
                    <motion.div
                        className="p-6 rounded-3xl"
                        initial="hidden" animate="visible" variants={fadeInUp}
                        style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 rounded-xl text-white" style={{
                                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
                            }}>
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold" style={{ color: textColor }}>Kelompok Usia</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ageGroups} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis type="number" stroke={subtextColor} fontSize={12} />
                                    <YAxis dataKey="name" type="category" stroke={subtextColor} fontSize={12} width={50} />
                                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }} />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                        {ageGroups.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Education Chart */}
                    <motion.div
                        className="p-6 rounded-3xl"
                        initial="hidden" animate="visible" variants={fadeInUp}
                        style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 rounded-xl text-white" style={{
                                background: 'linear-gradient(135deg, #10B981, #059669)',
                                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                            }}>
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold" style={{ color: textColor }}>Tingkat Pendidikan</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={infografis.education}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" stroke={subtextColor} fontSize={12} />
                                    <YAxis stroke={subtextColor} fontSize={12} />
                                    <Tooltip cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {infografis.education.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Distribution by Dusun - NEW */}
                    <motion.div
                        className="p-6 rounded-3xl"
                        initial="hidden" animate="visible" variants={fadeInUp}
                        style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 rounded-xl text-white" style={{
                                background: 'linear-gradient(135deg, #EC4899, #F43F5E)',
                                boxShadow: '0 8px 20px rgba(236, 72, 153, 0.3)'
                            }}>
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold" style={{ color: textColor }}>Distribusi per Dusun</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dusunData}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" stroke={subtextColor} fontSize={10} />
                                    <YAxis stroke={subtextColor} fontSize={12} />
                                    <Tooltip contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }} />
                                    <Legend />
                                    <Bar dataKey="pria" name="Laki-laki" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="wanita" name="Perempuan" fill="#EC4899" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Occupation Chart - Full Width */}
                <motion.div
                    className="p-6 rounded-3xl mt-8"
                    initial="hidden" animate="visible" variants={fadeInUp}
                    style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}` }}
                >
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-3 rounded-xl text-white" style={{
                            background: 'linear-gradient(135deg, #A855F7, #7C3AED)',
                            boxShadow: '0 8px 20px rgba(168, 85, 247, 0.3)'
                        }}>
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold" style={{ color: textColor }}>Mata Pencaharian</h2>
                    </div>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={infografis.job}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                >
                                    {infografis.job.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderRadius: '12px', border: `1px solid ${borderColor}`, color: textColor }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

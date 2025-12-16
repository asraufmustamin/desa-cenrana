"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAppContext } from "@/context/AppContext";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Users, GraduationCap, Briefcase, BarChart3, ArrowLeft } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function InfografisPage() {
    const { cmsContent } = useAppContext();
    const { infografis } = cmsContent;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedTheme === "dark" : true;
    const bgColor = isDark ? "#0A0F1A" : "#F8FAFC";
    const textColor = isDark ? "#FFFFFF" : "#1E293B";
    const subtextColor = isDark ? "#9CA3AF" : "#64748B";

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

    return (
        <div className="min-h-screen pt-28 pb-20 px-4" style={{ backgroundColor: bgColor }}>
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-8"
                >
                    <Link
                        href="/informasi"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:gap-3"
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            color: subtextColor
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="mb-10 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                        style={{
                            backgroundColor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)',
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Gender Chart */}
                    <motion.div
                        className="p-6 rounded-3xl"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                            boxShadow: `0 4px 20px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                        }}
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
                                    <Pie
                                        data={infografis.gender}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {infografis.gender.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                            borderRadius: '12px',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            color: textColor
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Education Chart */}
                    <motion.div
                        className="p-6 rounded-3xl"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                            boxShadow: `0 4px 20px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                        }}
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
                                    <Tooltip
                                        cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{
                                            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                            borderRadius: '12px',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            color: textColor
                                        }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {infografis.education.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Occupation Chart */}
                    <motion.div
                        className="lg:col-span-2 p-6 rounded-3xl"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                            boxShadow: `0 4px 20px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                        }}
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
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                                            borderRadius: '12px',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                            color: textColor
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

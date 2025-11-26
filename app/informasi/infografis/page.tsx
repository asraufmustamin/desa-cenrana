"use client";

import { useAppContext } from "@/context/AppContext";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Users, GraduationCap, Briefcase } from "lucide-react";

export default function InfografisPage() {
    const { cmsContent } = useAppContext();
    const { infografis } = cmsContent;

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
        <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-10 px-4">
            <div className="container mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">Infografis Desa</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Data statistik kependudukan dan demografi Desa Cenrana secara visual.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Chart 1: Gender Distribution (Pie) */}
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">Jenis Kelamin</h2>
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
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Education Level (Bar) */}
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">Tingkat Pendidikan</h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={infografis.education}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                    <YAxis stroke="var(--text-secondary)" fontSize={12} />
                                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {infografis.education.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 3: Occupation (Pie/Donut) */}
                    <div className="lg:col-span-2 bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-500">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">Mata Pencaharian</h2>
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
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {infografis.job.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '8px', border: 'none', color: '#fff' }} />
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

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { Plus, Trash2, CheckCircle, Clock, Activity, Lightbulb, Map, Laptop, HeartPulse, Home, ArrowLeft, Sparkles, Rocket } from "lucide-react";

export default function ProgramPage() {
    const { cmsContent, isEditMode, addProgram, deleteProgram, updateProgram } = useAppContext();
    const { programs } = cmsContent;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Selesai": return { bg: "bg-emerald-500/10", color: "text-emerald-400", border: "border-emerald-500/30" };
            case "Berjalan": return { bg: "bg-cyan-500/10", color: "text-cyan-400", border: "border-cyan-500/30" };
            default: return { bg: "bg-amber-500/10", color: "text-amber-400", border: "border-amber-500/30" };
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Selesai": return <CheckCircle className="w-3 h-3 mr-1" />;
            case "Berjalan": return <Activity className="w-3 h-3 mr-1" />;
            default: return <Clock className="w-3 h-3 mr-1" />;
        }
    };

    const getIcon = (iconName: string) => {
        const icons: { [key: string]: any } = { Road: Map, Map, Laptop, HeartPulse, Home, Lightbulb };
        const IconComponent = icons[iconName] || Lightbulb;
        return <IconComponent className="w-5 h-5 text-white" />;
    };

    const getProgressWidth = (status: string) => {
        switch (status) {
            case "Selesai": return "100%";
            case "Berjalan": return "50%";
            default: return "25%";
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/informasi" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Lightbulb className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-bold text-yellow-400">Program Unggulan</span>
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-black mb-1 text-[var(--text-primary)]">
                            Program{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">Kerja</span>
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)]">Rencana dan realisasi pembangunan desa</p>
                    </div>
                    {isEditMode && (
                        <motion.button
                            onClick={addProgram}
                            className="px-4 py-2 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-4 h-4" /> Tambah Program
                        </motion.button>
                    )}
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="flex gap-3 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-2">
                        <Rocket className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">{programs?.length || 0} Program</span>
                    </div>
                </motion.div>

                {/* Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {programs.map((program, index) => {
                        const statusStyle = getStatusStyle(program.status);
                        return (
                            <motion.div
                                key={program.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative"
                                whileHover={{ y: -5 }}
                            >
                                <div className="p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg hover:shadow-xl hover:border-yellow-500/30 transition-all">
                                    {isEditMode && (
                                        <button
                                            onClick={() => deleteProgram(program.id)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/30">
                                            {getIcon(program.icon)}
                                        </div>
                                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center ${statusStyle.bg} ${statusStyle.color} border ${statusStyle.border}`}>
                                            {getStatusIcon(program.status)}
                                            <Editable value={program.status} onSave={(val) => updateProgram(program.id, { status: val as any })} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-base font-bold leading-tight text-[var(--text-primary)] line-clamp-2">
                                            <Editable value={program.title} onSave={(val) => updateProgram(program.id, { title: val })} />
                                        </h3>
                                        <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                                            <Editable type="textarea" value={program.description} onSave={(val) => updateProgram(program.id, { description: val })} />
                                        </p>
                                    </div>

                                    <div className="mt-4 h-1 w-full rounded-full overflow-hidden bg-[var(--bg-panel)]">
                                        <div
                                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-yellow-500 to-amber-500"
                                            style={{ width: getProgressWidth(program.status) }}
                                        ></div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {isEditMode && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={addProgram}
                            className="flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed rounded-2xl p-4 transition-all group border-[var(--border-color)] hover:border-yellow-500/50"
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="p-3 rounded-full mb-2 group-hover:scale-110 transition-transform bg-[var(--bg-panel)]">
                                <Plus className="w-6 h-6 text-[var(--text-secondary)]" />
                            </div>
                            <span className="font-bold text-sm text-[var(--text-secondary)]">Tambah Program</span>
                        </motion.button>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

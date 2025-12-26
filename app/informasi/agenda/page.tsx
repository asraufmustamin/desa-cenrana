"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { Calendar, Clock, MapPin, Plus, Trash2, ArrowLeft, Sparkles, CalendarDays } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import LoadingPage from "@/components/LoadingPage";

export default function AgendaPage() {
    const { cmsContent, isEditMode, addAgenda, deleteAgenda, updateAgenda, isLoading } = useAppContext();
    const { agenda } = cmsContent;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString("id-ID", { month: "short" }).toUpperCase(),
            year: date.getFullYear(),
        };
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Breadcrumb />
                </div>

                {isLoading && (
                    <div className="min-h-[50vh] flex items-center justify-center">
                        <LoadingPage />
                    </div>
                )}

                {!isLoading && (
                    <>
                        {/* Header */}
                        <motion.div
                            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="text-center md:text-left">
                                <motion.div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Calendar className="w-4 h-4 text-amber-400" />
                                    <span className="text-sm font-bold text-amber-400">Agenda Kegiatan</span>
                                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                </motion.div>
                                <h1 className="text-2xl md:text-3xl font-black mb-1 text-[var(--text-primary)]">
                                    Agenda{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400">Kegiatan</span>
                                </h1>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Jadwal kegiatan pemerintahan dan kemasyarakatan desa
                                </p>
                            </div>
                            {isEditMode && (
                                <motion.button
                                    onClick={addAgenda}
                                    className="px-4 py-2 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus className="w-4 h-4" /> Tambah Agenda
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
                            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                                <CalendarDays className="w-3 h-3 text-amber-400" />
                                <span className="text-xs font-bold text-amber-400">{agenda?.length || 0} Agenda</span>
                            </div>
                        </motion.div>

                        {/* Agenda Grid */}
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {agenda.map((item, index) => {
                                const dateObj = formatDate(item.date);
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative"
                                        whileHover={{ y: -5 }}
                                    >
                                        <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg hover:shadow-xl hover:border-amber-500/30 transition-all duration-300">
                                            {/* Delete Button */}
                                            {isEditMode && (
                                                <button
                                                    onClick={() => deleteAgenda(item.id)}
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}

                                            {/* Date Badge */}
                                            <div className="p-3 text-center text-white bg-gradient-to-r from-amber-500 to-orange-500">
                                                <div className="text-2xl font-black leading-none">{dateObj.day}</div>
                                                <div className="text-[10px] font-bold opacity-90">{dateObj.month} {dateObj.year}</div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 space-y-3">
                                                <h3 className="text-base font-bold leading-tight text-[var(--text-primary)] line-clamp-2">
                                                    <Editable value={item.title} onSave={(val) => updateAgenda(item.id, { title: val })} />
                                                </h3>

                                                <div className="space-y-1.5 text-[11px] font-medium text-[var(--text-secondary)]">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-amber-400" />
                                                        <Editable value={item.time} onSave={(val) => updateAgenda(item.id, { time: val })} />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3 h-3 text-red-400" />
                                                        <Editable value={item.location} onSave={(val) => updateAgenda(item.id, { location: val })} />
                                                    </div>
                                                </div>

                                                <div className="pt-3 border-t border-[var(--border-color)]">
                                                    <p className="text-[11px] leading-relaxed text-[var(--text-secondary)] line-clamp-2">
                                                        <Editable type="textarea" value={item.description} onSave={(val) => updateAgenda(item.id, { description: val })} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {agenda.length === 0 && (
                                <div className="col-span-full">
                                    <motion.div
                                        className="text-center py-16 rounded-2xl bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-[var(--text-secondary)]/40" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">Belum ada agenda</h3>
                                        <p className="text-sm text-[var(--text-secondary)]">Silakan kembali lagi nanti</p>
                                    </motion.div>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
}

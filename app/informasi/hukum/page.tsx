"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { FileText, Download, Plus, Trash2, Scale, ArrowLeft, Sparkles, Gavel } from "lucide-react";

export default function HukumPage() {
    const { cmsContent, isEditMode, addHukum, deleteHukum, updateHukum } = useAppContext();
    const { hukum } = cmsContent;
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-slate-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-zinc-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/informasi" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-slate-500/50 hover:shadow-lg">
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-slate-500/10 to-gray-500/10 border border-slate-500/30"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Scale className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-400">Produk Hukum</span>
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-black mb-1 text-[var(--text-primary)]">
                            Produk{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-gray-400 to-zinc-400">Hukum</span>
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)]">Peraturan Desa dan Keputusan Kepala Desa</p>
                    </div>
                    {isEditMode && (
                        <motion.button
                            onClick={addHukum}
                            className="px-4 py-2 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 bg-gradient-to-r from-slate-500 to-gray-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-4 h-4" /> Tambah Hukum
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
                    <div className="px-3 py-1.5 rounded-lg bg-slate-500/10 border border-slate-500/30 flex items-center gap-2">
                        <Gavel className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold text-slate-400">{hukum?.length || 0} Dokumen</span>
                    </div>
                </motion.div>

                {/* List */}
                <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {hukum.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative"
                            whileHover={{ x: 5 }}
                        >
                            <div className="p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg hover:shadow-xl hover:border-slate-500/30 transition-all">
                                {isEditMode && (
                                    <button
                                        onClick={() => deleteHukum(item.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}

                                {/* Icon */}
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-lg">
                                    <Scale className="w-5 h-5 text-white" />
                                </div>

                                {/* Content */}
                                <div className="flex-grow space-y-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/30">
                                            <Editable value={item.jenis} onSave={(val) => updateHukum(item.id, { jenis: val as any })} />
                                        </span>
                                        <span className="text-xs font-mono text-[var(--text-secondary)]">
                                            No. <Editable value={item.nomor} onSave={(val) => updateHukum(item.id, { nomor: val })} /> /
                                            <Editable value={item.tahun} onSave={(val) => updateHukum(item.id, { tahun: val })} />
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                                        <Editable value={item.judul} onSave={(val) => updateHukum(item.id, { judul: val })} />
                                    </h3>
                                </div>

                                {/* Action */}
                                <a
                                    href={item.downloadUrl}
                                    className="shrink-0 flex items-center px-3 py-1.5 rounded-lg font-semibold text-xs transition-all bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-slate-500/10 hover:border-slate-500/30"
                                >
                                    <Download className="w-3 h-3 mr-1.5" /> PDF
                                </a>
                            </div>
                        </motion.div>
                    ))}

                    {hukum.length === 0 && (
                        <motion.div
                            className="text-center py-16 rounded-2xl bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="w-16 h-16 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-4">
                                <Scale className="w-8 h-8 text-[var(--text-secondary)]/40" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">Belum ada dokumen</h3>
                            <p className="text-sm text-[var(--text-secondary)]">Produk hukum akan ditampilkan di sini</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

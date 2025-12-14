"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { FileText, Download, Plus, Trash2, Scale } from "lucide-react";

export default function HukumPage() {
    const { cmsContent, isEditMode, addHukum, deleteHukum, updateHukum } = useAppContext();
    const { hukum } = cmsContent;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-10 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">Produk Hukum Desa</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Daftar Peraturan Desa (Perdes) dan Keputusan Kepala Desa (SK Kades) yang berlaku.
                    </p>
                </div>

                {/* Admin Add Button */}
                {isEditMode && (
                    <div className="mb-8 flex justify-end">
                        <button
                            onClick={addHukum}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Produk Hukum
                        </button>
                    </div>
                )}

                {/* List Layout */}
                <div className="space-y-4">
                    {hukum.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500/50 dark:hover:border-white/20 transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row items-start md:items-center gap-6"
                        >
                            {/* Delete Button (Admin Only) */}
                            {isEditMode && (
                                <button
                                    onClick={() => deleteHukum(item.id)}
                                    className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                    title="Hapus"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            {/* Icon */}
                            <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-xl text-slate-500 dark:text-slate-400">
                                <Scale className="w-8 h-8" />
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-1">
                                <div className="flex items-center space-x-3 mb-1">
                                    <span className="px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                                        <Editable
                                            value={item.jenis}
                                            onSave={(val) => updateHukum(item.id, { jenis: val as any })}
                                        />
                                    </span>
                                    <span className="text-sm font-mono text-[var(--text-secondary)]">
                                        No. <Editable value={item.nomor} onSave={(val) => updateHukum(item.id, { nomor: val })} /> /
                                        <Editable value={item.tahun} onSave={(val) => updateHukum(item.id, { tahun: val })} />
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    <Editable
                                        value={item.judul}
                                        onSave={(val) => updateHukum(item.id, { judul: val })}
                                    />
                                </h3>
                            </div>

                            {/* Action */}
                            <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
                                <a
                                    href={item.downloadUrl}
                                    className="flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 dark:border-gray-600 bg-slate-100 dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold text-sm transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </a>
                            </div>
                        </div>
                    ))}

                    {hukum.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                            <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-[var(--text-secondary)]">Belum ada produk hukum yang diunggah.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

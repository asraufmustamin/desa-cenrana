"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { FileText, Download, Plus, Trash2, Scale, ArrowLeft, Sparkles, Gavel, Upload, X } from "lucide-react";

export default function HukumPage() {
    const { cmsContent, isLoggedIn, isEditMode, addHukum, deleteHukum, updateHukum } = useAppContext();
    const { hukum } = cmsContent;
    const [mounted, setMounted] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [newHukum, setNewHukum] = React.useState({
        jenis: "PERDES",
        nomor: "",
        tahun: new Date().getFullYear().toString(),
        judul: "",
        pdfBase64: ""
    });
    const [pdfFileName, setPdfFileName] = React.useState("");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("Ukuran file maksimal 10MB");
                return;
            }
            if (file.type !== "application/pdf") {
                alert("Hanya file PDF yang diperbolehkan");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setNewHukum(prev => ({ ...prev, pdfBase64: reader.result as string }));
                setPdfFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!newHukum.judul || !newHukum.nomor) {
            alert("Harap isi Judul dan Nomor!");
            return;
        }

        const newItem = {
            id: Date.now(),
            jenis: newHukum.jenis,
            nomor: newHukum.nomor,
            tahun: newHukum.tahun,
            judul: newHukum.judul,
            downloadUrl: newHukum.pdfBase64 || "#"
        };

        // Add to CMS content
        await addHukum();
        // Update the last added item with our data
        setTimeout(() => {
            const latestId = cmsContent.hukum[0]?.id;
            if (latestId) {
                updateHukum(latestId, {
                    jenis: newHukum.jenis as any,
                    nomor: newHukum.nomor,
                    tahun: newHukum.tahun,
                    judul: newHukum.judul,
                    downloadUrl: newHukum.pdfBase64 || "#"
                });
            }
        }, 100);

        setShowAddModal(false);
        setNewHukum({
            jenis: "PERDES",
            nomor: "",
            tahun: new Date().getFullYear().toString(),
            judul: "",
            pdfBase64: ""
        });
        setPdfFileName("");
    };

    const handleAddClick = () => {
        setShowAddModal(true);
    };

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

                    {/* Tombol Tambah - Muncul saat login sebagai admin */}
                    {isLoggedIn && (
                        <motion.button
                            onClick={handleAddClick}
                            className="px-4 py-2 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-4 h-4" /> Tambah Produk Hukum
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
                            <div className="p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg hover:shadow-xl hover:border-slate-500/30 transition-all">
                                {/* Top Row: Icon + Content */}
                                <div className="flex items-start gap-3 w-full">
                                    {/* Icon */}
                                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-lg shrink-0">
                                        <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow space-y-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/30">
                                                {isLoggedIn ? (
                                                    <Editable value={item.jenis} onSave={(val) => updateHukum(item.id, { jenis: val as any })} />
                                                ) : (
                                                    item.jenis
                                                )}
                                            </span>
                                            <span className="text-[10px] sm:text-xs font-mono text-[var(--text-secondary)]">
                                                No. {isLoggedIn ? (
                                                    <Editable value={item.nomor} onSave={(val) => updateHukum(item.id, { nomor: val })} />
                                                ) : (
                                                    item.nomor
                                                )} /
                                                {isLoggedIn ? (
                                                    <Editable value={item.tahun} onSave={(val) => updateHukum(item.id, { tahun: val })} />
                                                ) : (
                                                    item.tahun
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] line-clamp-2 sm:truncate">
                                            {isLoggedIn ? (
                                                <Editable value={item.judul} onSave={(val) => updateHukum(item.id, { judul: val })} />
                                            ) : (
                                                item.judul
                                            )}
                                        </h3>
                                    </div>
                                </div>

                                {/* Bottom Row: PDF Button + Delete (Mobile) */}
                                <div className="flex items-center justify-between w-full gap-2 mt-3 sm:mt-0 sm:w-auto sm:justify-end">
                                    {/* PDF Download Button */}
                                    {item.downloadUrl && item.downloadUrl !== "#" ? (
                                        <a
                                            href={item.downloadUrl}
                                            download={`${item.jenis}-${item.nomor}-${item.tahun}.pdf`}
                                            className="flex items-center px-3 py-1.5 rounded-lg font-semibold text-xs transition-all bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg"
                                        >
                                            <Download className="w-3 h-3 mr-1.5" /> PDF
                                        </a>
                                    ) : (
                                        <div className="flex items-center px-3 py-1.5 rounded-lg font-semibold text-xs bg-gray-500/20 text-gray-400 cursor-not-allowed">
                                            <FileText className="w-3 h-3 mr-1.5" /> Belum Ada PDF
                                        </div>
                                    )}

                                    {/* Delete button for admin */}
                                    {isLoggedIn && (
                                        <button
                                            onClick={async () => {
                                                if (window.confirm("Apakah Anda yakin ingin menghapus produk hukum ini?")) {
                                                    await deleteHukum(item.id);
                                                }
                                            }}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors text-xs font-semibold"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            <span className="sm:hidden">Hapus</span>
                                        </button>
                                    )}
                                </div>
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
                            {isLoggedIn && (
                                <button
                                    onClick={handleAddClick}
                                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm hover:from-blue-600 hover:to-cyan-600 transition-colors"
                                >
                                    + Tambah Produk Hukum
                                </button>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            className="bg-[var(--bg-card)] rounded-2xl p-6 w-full max-w-lg border border-[var(--border-color)] shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">Tambah Produk Hukum</h2>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 rounded-lg hover:bg-red-500/10 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Jenis */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Jenis Dokumen</label>
                                    <select
                                        value={newHukum.jenis}
                                        onChange={(e) => setNewHukum(prev => ({ ...prev, jenis: e.target.value }))}
                                        className="w-full px-4 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="PERDES">PERDES (Peraturan Desa)</option>
                                        <option value="SK KADES">SK KADES (Surat Keputusan Kepala Desa)</option>
                                        <option value="PERBUP">PERBUP (Peraturan Bupati)</option>
                                        <option value="PERDA">PERDA (Peraturan Daerah)</option>
                                    </select>
                                </div>

                                {/* Nomor & Tahun */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Nomor</label>
                                        <input
                                            type="text"
                                            value={newHukum.nomor}
                                            onChange={(e) => setNewHukum(prev => ({ ...prev, nomor: e.target.value }))}
                                            placeholder="01"
                                            className="w-full px-4 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tahun</label>
                                        <input
                                            type="text"
                                            value={newHukum.tahun}
                                            onChange={(e) => setNewHukum(prev => ({ ...prev, tahun: e.target.value }))}
                                            placeholder="2024"
                                            className="w-full px-4 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Judul */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Judul Dokumen</label>
                                    <input
                                        type="text"
                                        value={newHukum.judul}
                                        onChange={(e) => setNewHukum(prev => ({ ...prev, judul: e.target.value }))}
                                        placeholder="Contoh: Anggaran Pendapatan dan Belanja Desa Tahun 2024"
                                        className="w-full px-4 py-2 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                {/* Upload PDF */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Upload PDF (Opsional)</label>
                                    <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[var(--border-color)] cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                                        <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
                                        <span className="text-sm text-[var(--text-secondary)]">
                                            {pdfFileName || "Pilih file PDF (maks 10MB)"}
                                        </span>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handlePdfUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={async () => {
                                        if (!newHukum.judul || !newHukum.nomor) {
                                            alert("Harap isi Judul dan Nomor!");
                                            return;
                                        }

                                        // Create new item directly using updateHukum pattern
                                        const newItem = {
                                            id: Date.now(),
                                            jenis: newHukum.jenis,
                                            nomor: newHukum.nomor,
                                            tahun: newHukum.tahun,
                                            judul: newHukum.judul,
                                            downloadUrl: newHukum.pdfBase64 || "#"
                                        };

                                        // Add via context addHukum then update with real data
                                        await addHukum();

                                        // Get the latest added item ID and update it
                                        setTimeout(() => {
                                            const latestId = cmsContent.hukum[0]?.id;
                                            if (latestId) {
                                                updateHukum(latestId, {
                                                    jenis: newHukum.jenis as any,
                                                    nomor: newHukum.nomor,
                                                    tahun: newHukum.tahun,
                                                    judul: newHukum.judul,
                                                    downloadUrl: newHukum.pdfBase64 || "#"
                                                });
                                            }
                                        }, 100);

                                        setShowAddModal(false);
                                        setNewHukum({
                                            jenis: "PERDES",
                                            nomor: "",
                                            tahun: new Date().getFullYear().toString(),
                                            judul: "",
                                            pdfBase64: ""
                                        });
                                        setPdfFileName("");
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-colors"
                                >
                                    Simpan Produk Hukum
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { Image as ImageIcon, Plus, X, Upload, ArrowLeft, Sparkles, Grid, ZoomIn } from "lucide-react";

export default function GaleriPage() {
    const { cmsContent, isEditMode, addGalleryItem } = useAppContext();
    const { gallery } = cmsContent;
    const [mounted, setMounted] = React.useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = () => {
        if (preview && title) {
            addGalleryItem({ title, image: preview });
            setPreview(null);
            setTitle("");
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/informasi" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20">
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
                    <div className="text-center md:text-left">
                        <motion.div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30"
                            whileHover={{ scale: 1.05 }}
                        >
                            <ImageIcon className="w-4 h-4 text-pink-400" />
                            <span className="text-sm font-bold text-pink-400">Galeri Foto</span>
                            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-black mb-1 text-[var(--text-primary)]">
                            Galeri{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400">Desa</span>
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Potret kegiatan dan keindahan Desa Cenrana
                        </p>
                    </div>
                    {isEditMode && (
                        <motion.button
                            onClick={() => setIsUploading(true)}
                            className="px-4 py-2 text-white rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-4 h-4" /> Tambah Foto
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
                    <div className="px-3 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center gap-2">
                        <Grid className="w-3 h-3 text-pink-400" />
                        <span className="text-xs font-bold text-pink-400">{gallery?.length || 0} Foto</span>
                    </div>
                </motion.div>

                {/* Gallery Grid - Masonry */}
                <motion.div
                    className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {gallery?.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="break-inside-avoid group cursor-pointer"
                            onClick={() => setSelectedImage(item)}
                        >
                            <div className="relative rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-pink-500/50 transition-all shadow-lg hover:shadow-xl hover:shadow-pink-500/10">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                    <h3 className="text-white font-bold text-sm mb-0.5">{item.title}</h3>
                                    <div className="flex items-center gap-1 text-white/70 text-[10px]">
                                        <ImageIcon className="w-3 h-3" /> Galeri Desa
                                    </div>
                                </div>
                                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {(!gallery || gallery.length === 0) && (
                    <motion.div
                        className="text-center py-16 rounded-2xl bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-[var(--text-secondary)]/40" />
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">Belum ada foto</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Upload foto pertama untuk memulai galeri</p>
                    </motion.div>
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploading && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="p-5 rounded-2xl w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border-color)]"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Tambah Foto</h3>
                                <button onClick={() => setIsUploading(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-panel)] text-[var(--text-secondary)]">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all border-[var(--border-color)] hover:border-pink-500/50"
                                >
                                    {preview ? (
                                        <div className="relative h-40 w-full rounded-lg overflow-hidden">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-6 h-6 mb-2 text-[var(--text-secondary)]" />
                                            <p className="text-sm font-bold text-[var(--text-primary)]">Klik untuk upload</p>
                                            <p className="text-xs text-[var(--text-secondary)]">JPG, PNG (Max 5MB)</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1.5 text-[var(--text-secondary)]">Judul Foto</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl text-sm outline-none bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-pink-500"
                                        placeholder="Contoh: Panen Raya 2024"
                                    />
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={!preview || !title}
                                    className="w-full py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                                >
                                    Simpan Foto
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative max-w-4xl max-h-[90vh]"
                        >
                            <img src={selectedImage.image} alt={selectedImage.title} className="max-h-[90vh] rounded-xl" />
                            <div className="absolute bottom-4 left-4 right-4 text-center">
                                <h3 className="text-white font-bold text-lg">{selectedImage.title}</h3>
                            </div>
                            <button
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

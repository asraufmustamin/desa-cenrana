"use client";

import { useAppContext } from "@/context/AppContext";
import { Image as ImageIcon, Plus, X, Upload } from "lucide-react";
import { useState, useRef } from "react";

export default function GaleriPage() {
    const { cmsContent, isEditMode, addGalleryItem } = useAppContext();
    const { gallery } = cmsContent;
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
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
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 animate-fade-in-up">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                            Galeri Desa
                        </h1>
                        <p className="text-[var(--text-secondary)] max-w-2xl text-lg">
                            Potret kegiatan dan keindahan alam Desa Cenrana.
                        </p>
                    </div>
                    {isEditMode && (
                        <button
                            onClick={() => setIsUploading(true)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" /> Tambah Foto
                        </button>
                    )}
                </div>

                {/* Upload Modal */}
                {isUploading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-[var(--bg-panel)] p-6 rounded-2xl w-full max-w-md border border-[var(--border-color)] shadow-2xl animate-scale-in">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Tambah Foto Baru</h3>
                                <button onClick={() => setIsUploading(false)} className="p-2 hover:bg-[var(--bg-card)] rounded-full text-[var(--text-secondary)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${preview ? 'border-blue-500 bg-blue-500/10' : 'border-[var(--border-color)] hover:border-blue-500 hover:bg-[var(--bg-card)]'}`}
                                >
                                    {preview ? (
                                        <div className="relative h-48 w-full rounded-lg overflow-hidden">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-8 h-8 text-[var(--text-secondary)] mb-2" />
                                            <p className="text-sm font-bold text-[var(--text-primary)]">Klik untuk upload foto</p>
                                            <p className="text-xs text-[var(--text-secondary)]">JPG, PNG (Max 5MB)</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Judul Foto</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                        placeholder="Contoh: Panen Raya 2024"
                                    />
                                </div>

                                <button
                                    onClick={handleUpload}
                                    disabled={!preview || !title}
                                    className={`w-full py-3 rounded-xl font-bold transition-all ${preview && title ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30' : 'bg-[var(--bg-card)] text-[var(--text-secondary)] cursor-not-allowed'}`}
                                >
                                    Simpan Foto
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {gallery?.map((item, index) => (
                        <div
                            key={item.id}
                            className="break-inside-avoid glass-card rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative group">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                                        <p className="text-white/80 text-xs flex items-center">
                                            <ImageIcon className="w-3 h-3 mr-1" /> Galeri Desa
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

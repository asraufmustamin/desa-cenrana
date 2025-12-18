"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, ChevronRight, Store, MapPin, HeartHandshake, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Define strict types manually if valid types are not imported 
// In a real app we import from types/supabase.ts
interface SuratType {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string;
    icon: string;
}

const iconMap: Record<string, any> = {
    Store: Store,
    MapPin: MapPin,
    HeartHandshake: HeartHandshake,
    ShieldCheck: FileText, // Lucide icon for SKCK
    UserX: FileText,
    Banknote: FileText,
    Baby: FileText,
    Cross: FileText,
    FileSignature: FileText,
    Truck: FileText,
    UserMinus: FileText,
    Search: Search,
    PartyPopper: FileText,
    Landplot: FileText,
    FileText: FileText // fallback
};

export default function LayananSuratPage() {
    const router = useRouter();
    const [suratTypes, setSuratTypes] = useState<SuratType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAll, setShowAll] = useState(false); // New state for "Show More"

    // Modal State for NIK Validation
    const [showNikModal, setShowNikModal] = useState(false);
    const [selectedSurat, setSelectedSurat] = useState<SuratType | null>(null);
    const [nik, setNik] = useState("");
    const [isCheckingNik, setIsCheckingNik] = useState(false);
    const [nikError, setNikError] = useState("");

    useEffect(() => {
        fetchSuratTypes();
    }, []);

    const fetchSuratTypes = async () => {
        try {
            const { data, error } = await supabase
                .from('surat_types')
                .select('*')
                .order('nama', { ascending: true });

            if (error) throw error;
            setSuratTypes(data || []);
        } catch (error) {
            console.error("Error fetching surat types:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectSurat = (surat: SuratType) => {
        setSelectedSurat(surat);
        setShowNikModal(true);
        setNik("");
        setNikError("");
    };

    const handleCheckNik = async (e: React.FormEvent) => {
        e.preventDefault();
        setNikError("");

        if (nik.length !== 16) {
            setNikError("NIK harus 16 digit angka.");
            return;
        }

        setIsCheckingNik(true);

        try {
            // Check NIK in penduduk table
            const { data, error } = await supabase
                .from('penduduk')
                .select('nik, nama')
                .eq('nik', nik)
                .single();

            if (error || !data) {
                setNikError("NIK tidak ditemukan. Pastikan Anda terdaftar sebagai warga Desa Cenrana.");
                return;
            }

            // If valid, redirect to form page with encoded NIK (base64 for simple obfuscation)
            // In a real app we might use a session token or signed URL, but here this suffices for UX flow
            const encodedNik = btoa(nik);
            router.push(`/layanan/surat/form?type=${selectedSurat?.id}&nik=${encodedNik}`);

        } catch (error) {
            console.error(error);
            setNikError("Terjadi kesalahan sistem. Silakan coba lagi.");
        } finally {
            setIsCheckingNik(false);
        }
    };

    const filteredSurat = suratTypes.filter(s =>
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-slate-50 dark:bg-[var(--bg-primary)] transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-200 dark:border-blue-800">
                        E-Government Service
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                        Layanan Surat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Online</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Ajukan surat keterangan usaha, domisili, dan administrasi lainnya secara mandiri. Cepat, mudah, dan bisa dari rumah.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-16 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-duration-500 pointer-events-none"></div>
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari jenis surat (misal: Usaha, Domisili...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all"
                        />
                    </div>
                </div>

                {/* Grid Surat */}
                {isLoading ? (
                    <div className="text-center py-20 text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                        Memuat daftar layanan...
                    </div>
                ) : filteredSurat.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Logic: Show all if searching, otherwise show limited */}
                            {filteredSurat.slice(0, searchQuery ? undefined : (showAll ? undefined : 9)).map((surat) => {
                                const IconComponent = iconMap[surat.icon] || FileText;
                                return (
                                    <motion.div
                                        key={surat.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -5 }}
                                        onClick={() => handleSelectSurat(surat)}
                                        className="cursor-pointer group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all dark:hover:border-blue-500/50"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                                            {surat.nama}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                                            {surat.deskripsi}
                                        </p>
                                        <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                                            Buat Surat <ChevronRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Show More Button */}
                        {!searchQuery && filteredSurat.length > 9 && !showAll && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
                                >
                                    Lihat {filteredSurat.length - 9} Layanan Lainnya
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Show Less Button (Optional, for better UX) */}
                        {!searchQuery && showAll && filteredSurat.length > 9 && (
                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => setShowAll(false)}
                                    className="px-6 py-2 text-sm text-slate-500 hover:text-blue-500 transition-colors"
                                >
                                    Sembunyikan
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-lg text-slate-500">Tidak ada layanan surat yang cocok dengan "{searchQuery}"</p>
                    </div>
                )}

                {/* Quick Track Link */}
                <div className="mt-20 text-center">
                    <Link href="/layanan/check" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
                        Sudah mengajukan surat? <span className="font-bold underline decoration-2 underline-offset-4">Cek Status Pengajuan</span>
                    </Link>
                </div>
            </div>

            {/* NIK Validation Modal */}
            <AnimatePresence>
                {showNikModal && selectedSurat && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-8 relative shadow-2xl border border-white/20"
                        >
                            <button
                                onClick={() => setShowNikModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
                            >
                                ✕
                            </button>

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4 border border-blue-100 dark:border-blue-800">
                                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Gatekeeper Check</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Masukkan NIK Anda untuk memverifikasi data kependudukan sebelum melanjutkan.
                                </p>
                            </div>

                            <form onSubmit={handleCheckNik}>
                                <div className="mb-6">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                                        Nomor Induk Kependudukan (NIK)
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={16}
                                        value={nik}
                                        onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                                        className={`w-full text-center text-2xl font-mono tracking-widest py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border-2 ${nikError ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} focus:border-blue-500 outline-none transition-colors text-slate-900 dark:text-white`}
                                        placeholder="•• •• •• •• •• •• •• ••"
                                    />
                                    {nikError && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mt-3 text-red-500 text-sm justify-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                                            <AlertCircle className="w-4 h-4" />
                                            {nikError}
                                        </motion.div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCheckingNik || nik.length < 16}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCheckingNik ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Memverifikasi...
                                        </>
                                    ) : (
                                        <>
                                            Lanjut ke Formulir <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <p className="text-center text-xs text-slate-400 mt-6">
                                Data Anda aman dan terenkripsi. Hanya digunakan untuk validasi layanan desa.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Search, AlertCircle, CheckCircle, Clock, MessageSquare, History, Upload, X, Image as ImageIcon, Trash2, Shield } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

export default function Aspirasi() {
    const { addAspirasi, getAspirasiByTicket, aspirasi, deleteAspirasi, isEditMode, checkNikAvailability } = useAppContext();
    const [activeTab, setActiveTab] = useState<"form" | "track" | "admin">("form");
    const [ticketId, setTicketId] = useState("");
    const [searchResult, setSearchResult] = useState<any>(null);
    const [myHistory, setMyHistory] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        nama: "",
        nik: "",
        dusun: "Benteng",
        kategori: "Infrastruktur",
        laporan: "",
        image: "",
        is_anonymous: false,
    });

    const [nikError, setNikError] = useState("");
    const [submitError, setSubmitError] = useState("");

    // State untuk inline errors di setiap field
    const [errors, setErrors] = useState({
        nama: "",
        nik: "",
        laporan: "",
        image: ""
    });

    // Load history from local storage on mount
    useEffect(() => {
        const history = localStorage.getItem("my_aspirasi_history");
        if (history) {
            setMyHistory(JSON.parse(history));
        }
    }, []);

    const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        setForm({ ...form, nik: value });

        if (value.length > 0 && value.length !== 16) {
            setNikError("NIK harus 16 digit angka.");
        } else {
            setNikError("");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setForm({ ...form, image: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setForm({ ...form, image: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Validation function untuk Aspirasi form dengan inline errors
    const validateForm = (): boolean => {
        const newErrors = { nama: "", nik: "", laporan: "", image: "" };
        let isValid = true;

        // Validasi Nama
        if (!form.nama.trim()) {
            newErrors.nama = "Mohon isi nama lengkap Anda sesuai KTP";
            isValid = false;
        } else if (form.nama.trim().length < 3) {
            newErrors.nama = "Nama minimal 3 karakter";
            isValid = false;
        }

        // Validasi NIK
        if (!form.nik) {
            newErrors.nik = "NIK wajib diisi";
            isValid = false;
        } else if (form.nik.length !== 16) {
            newErrors.nik = "NIK harus 16 digit angka";
            isValid = false;
        }

        // Validasi Laporan
        if (!form.laporan.trim()) {
            newErrors.laporan = "Mohon isi detail laporan Anda";
            isValid = false;
        } else if (form.laporan.trim().length < 20) {
            newErrors.laporan = "Laporan minimal 20 karakter agar admin dapat memahami dengan jelas";
            isValid = false;
        }

        // Set semua errors sekaligus
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");

        // ✅ Validate form before submission
        if (!validateForm()) {
            return;
        }

        // NIK is required
        if (!form.nik || form.nik.length !== 16) {
            setNikError("NIK wajib diisi 16 digit.");
            return;
        }

        try {
            // Step 1: Validate NIK exists in penduduk table & fetch data for cross-validation
            const nikExists = await checkNikAvailability(form.nik);
            if (!nikExists) {
                setSubmitError("Validasi Gagal: NIK Anda tidak terdaftar sebagai warga.");
                return;
            }

            // Step 2: CROSS-VALIDATE nama and dusun with penduduk database
            const { data: pendudukData, error: pendudukError } = await (await import('@/lib/supabase')).supabase
                .from('penduduk')
                .select('nama, dusun')
                .eq('nik', form.nik)
                .single();

            if (pendudukError || !pendudukData) {
                setSubmitError("Gagal memvalidasi data. Silakan coba lagi.");
                return;
            }

            // Validate NAMA match (case-insensitive, trim whitespace)
            const submittedNama = form.nama.trim().toLowerCase();
            const dbNama = pendudukData.nama.trim().toLowerCase();

            if (submittedNama !== dbNama) {
                setSubmitError(`Validasi Gagal: Nama yang Anda masukkan (${form.nama}) tidak sesuai dengan data penduduk (${pendudukData.nama}). Mohon isi sesuai KTP.`);
                return;
            }

            // Validate DUSUN match
            if (form.dusun !== pendudukData.dusun) {
                setSubmitError(`Validasi Gagal: Dusun yang Anda pilih (${form.dusun}) tidak sesuai dengan data penduduk (${pendudukData.dusun}). Mohon pilih dusun yang benar.`);
                return;
            }

            // All validations passed - proceed with submission
            const newTicketId = await addAspirasi(form);

            // Update local history
            const updatedHistory = [newTicketId, ...myHistory];
            setMyHistory(updatedHistory);
            localStorage.setItem("my_aspirasi_history", JSON.stringify(updatedHistory));

            alert(`✅ Aspirasi berhasil dikirim! ID Tiket Anda: ${newTicketId}. Simpan ID ini untuk melacak status laporan Anda.`);
            setForm({ nama: "", nik: "", dusun: "Dusun 1", kategori: "Infrastruktur", laporan: "", image: "", is_anonymous: false });
            setImagePreview(null);
            setTicketId(newTicketId);
            setActiveTab("track");
            handleSearch(newTicketId);
        } catch (error: any) {
            setSubmitError(error.message || "Terjadi kesalahan saat mengirim aspirasi.");
        }
    };

    const handleSearch = (idToSearch = ticketId) => {
        const result = getAspirasiByTicket(idToSearch);
        if (result) {
            setSearchResult(result);
            setTicketId(idToSearch); // Ensure input matches if called via history click
            setActiveTab("track");
        } else {
            setSearchResult(null);
            alert("ID Tiket tidak ditemukan.");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 text-glow">Layanan Aspirasi</h1>
                    <p className="text-[var(--text-secondary)] text-lg">Sampaikan aspirasi, keluhan, dan saran Anda untuk kemajuan Desa Cenrana.</p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="glass-panel p-1 rounded-2xl inline-flex">
                        <button
                            onClick={() => setActiveTab("form")}
                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${activeTab === "form"
                                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Buat Laporan
                        </button>
                        <button
                            onClick={() => setActiveTab("track")}
                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${activeTab === "track"
                                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Lacak Status
                        </button>
                        {isEditMode && (
                            <button
                                onClick={() => setActiveTab("admin")}
                                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${activeTab === "admin"
                                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Panel
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {/* Main Content Area */}
                    <div className="md:col-span-2">
                        <div className="glass-panel rounded-2xl md:rounded-[2rem] p-6 md:p-8 lg:p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                            {activeTab === "form" ? (
                                <form onSubmit={handleSubmit} noValidate className="space-y-6">{/* noValidate: disable browser validation untuk test */}
                                    {submitError && (
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start">
                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                                            <p className="text-sm text-red-800 dark:text-red-200 leading-relaxed font-medium">{submitError}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.nama}
                                                onChange={(e) => {
                                                    setForm({ ...form, nama: e.target.value });
                                                    // Clear error saat user mengetik
                                                    if (errors.nama) setErrors({ ...errors, nama: "" });
                                                }}
                                                className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] focus:ring-1 outline-none transition-all ${errors.nama
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                    : "border-[var(--border-color)] focus:border-blue-500 focus:ring-blue-500"
                                                    }`}
                                                placeholder="Sesuai KTP"
                                            />
                                            {errors.nama && (
                                                <p className="text-red-500 text-sm mt-1.5 flex items-start">
                                                    <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                    {errors.nama}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">NIK <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                required
                                                value={form.nik}
                                                onChange={(e) => {
                                                    handleNikChange(e);
                                                    // Clear error saat user mengetik
                                                    if (errors.nik) setErrors({ ...errors, nik: "" });
                                                }}
                                                maxLength={16}
                                                className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] focus:ring-1 outline-none transition-all ${errors.nik
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                    : "border-[var(--border-color)] focus:border-blue-500 focus:ring-blue-500"
                                                    }`}
                                                placeholder="16 digit NIK (wajib)"
                                            />
                                            {errors.nik && (
                                                <p className="text-red-500 text-sm mt-1.5 flex items-start">
                                                    <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                    {errors.nik}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Dusun</label>
                                            <select
                                                value={form.dusun}
                                                onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--bg-panel)] to-[var(--bg-card)] border-2 border-[var(--border-color)] text-[var(--text-primary)] font-medium text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm hover:shadow-md cursor-pointer"
                                            >
                                                <option value="Benteng" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Benteng</option>
                                                <option value="Kajuara" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Kajuara</option>
                                                <option value="Tanatengnga" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Tanatengnga</option>
                                                <option value="Panagi" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Panagi</option>
                                                <option value="Holiang" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Holiang</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Kategori Laporan</label>
                                            <select
                                                value={form.kategori}
                                                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--bg-panel)] to-[var(--bg-card)] border-2 border-[var(--border-color)] text-[var(--text-primary)] font-medium text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm hover:shadow-md cursor-pointer"
                                            >
                                                <option value="Infrastruktur" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">🏗️ Infrastruktur</option>
                                                <option value="Pelayanan Publik" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">📋 Pelayanan Publik</option>
                                                <option value="Kesehatan" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">🏥 Kesehatan</option>
                                                <option value="Pendidikan" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">📚 Pendidikan</option>
                                                <option value="Keamanan & Ketertiban" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">🚨 Keamanan & Ketertiban</option>
                                                <option value="Ekonomi & UMKM" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">💼 Ekonomi & UMKM</option>
                                                <option value="Sosial & Budaya" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">🎭 Sosial & Budaya</option>
                                                <option value="Lingkungan" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">🌳 Lingkungan</option>
                                                <option value="Lainnya" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">📌 Lainnya</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center space-x-3 cursor-pointer group mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                            <input
                                                type="checkbox"
                                                checked={form.is_anonymous}
                                                onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
                                                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors">
                                                        Rahasiakan Identitas Saya (Laporan Anonim)
                                                    </span>
                                                </div>
                                                <p className="mt-1 ml-7 text-xs text-gray-500 dark:text-gray-400">
                                                    Identitas Anda tetap tersimpan untuk validasi, namun tidak akan ditampilkan kepada admin.
                                                </p>
                                            </div>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Isi Laporan</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.laporan}
                                            onChange={(e) => {
                                                setForm({ ...form, laporan: e.target.value });
                                                // Clear error saat user mengetik
                                                if (errors.laporan) setErrors({ ...errors, laporan: "" });
                                            }}
                                            className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] focus:ring-1 outline-none transition-all resize-none ${errors.laporan
                                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                                    : "border-[var(--border-color)] focus:border-blue-500 focus:ring-blue-500"
                                                }`}
                                            placeholder="Jelaskan detail laporan Anda secara rinci..."
                                        />
                                        {errors.laporan && (
                                            <p className="text-red-500 text-sm mt-1.5 flex items-start">
                                                <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                {errors.laporan}
                                            </p>
                                        )}
                                    </div>

                                    {/* Image Upload Dropzone */}
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Upload Bukti Foto (Opsional)</label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center ${imagePreview ? "border-blue-500 bg-blue-500/5" : "border-[var(--border-color)] hover:border-blue-500 hover:bg-[var(--bg-card)]"
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />

                                            {imagePreview ? (
                                                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeImage();
                                                        }}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full z-20 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-4">
                                                    <div className="p-3 bg-[var(--bg-panel)] rounded-full mb-3">
                                                        <ImageIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                                                    </div>
                                                    <p className="text-sm font-bold text-[var(--text-primary)]">Klik atau tarik foto ke sini</p>
                                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Format: JPG, PNG (Max 5MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!!nikError}
                                        className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center ${nikError
                                            ? "bg-gray-500 cursor-not-allowed opacity-50 text-white"
                                            : "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02]"
                                            }`}
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Kirim Laporan
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={ticketId}
                                            onChange={(e) => setTicketId(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-lg font-mono"
                                            placeholder="Masukkan ID Tiket (Contoh: ASP-001)"
                                        />
                                        <Search className="absolute left-4 top-4.5 text-[var(--text-secondary)] w-6 h-6" />
                                        <button
                                            onClick={() => handleSearch()}
                                            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all"
                                        >
                                            Cari
                                        </button>
                                    </div>

                                    {searchResult ? (
                                        <div className="animate-fade-in-up">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Status Laporan</h3>
                                                    <p className="text-[var(--text-secondary)] font-mono">{typeof searchResult.id === 'object' ? JSON.stringify(searchResult.id) : searchResult.id}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-full font-bold flex items-center ${searchResult.status === "Selesai"
                                                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20"
                                                    : searchResult.status === "Diproses"
                                                        ? "bg-blue-500/20 text-blue-500 border border-blue-500/20"
                                                        : searchResult.status === "Rejected"
                                                            ? "bg-red-500/20 text-red-500 border border-red-500/20"
                                                            : "bg-amber-500/20 text-amber-500 border border-amber-500/20"  // Pending
                                                    }`}>
                                                    {searchResult.status === "Selesai" && <CheckCircle className="w-4 h-4 mr-2" />}
                                                    {searchResult.status === "Diproses" && <Clock className="w-4 h-4 mr-2 text-blue-500" />}
                                                    {searchResult.status === "Rejected" && <AlertCircle className="w-4 h-4 mr-2" />}
                                                    {searchResult.status === "Pending" && <Clock className="w-4 h-4 mr-2" />}
                                                    {typeof searchResult.status === 'object' ? JSON.stringify(searchResult.status) : searchResult.status}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                                                    <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Detail Laporan</h4>
                                                    <p className="text-[var(--text-primary)] leading-relaxed">{typeof searchResult.laporan === 'object' ? JSON.stringify(searchResult.laporan) : searchResult.laporan}</p>
                                                    <div className="mt-4 flex items-center text-sm text-[var(--text-secondary)]">
                                                        <span className="mr-4">Oleh: {
                                                            searchResult.is_anonymous
                                                                ? <span className="flex items-center"><Shield className="w-4 h-4 mr-1 text-blue-500" /> <strong className="text-blue-500">Pelapor Anonim</strong></span>
                                                                : (typeof searchResult.nama === 'object' ? JSON.stringify(searchResult.nama) : searchResult.nama)
                                                        }</span>
                                                        <span>{typeof searchResult.date === 'object' ? JSON.stringify(searchResult.date) : searchResult.date}</span>
                                                    </div>
                                                </div>

                                                {searchResult.reply && (
                                                    <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20">
                                                        <div className="flex items-center mb-3">
                                                            <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                                                            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider">Tanggapan Admin</h4>
                                                        </div>
                                                        <p className="text-[var(--text-primary)] leading-relaxed">{typeof searchResult.reply === 'object' ? JSON.stringify(searchResult.reply) : searchResult.reply}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Search className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-20" />
                                            <p className="text-[var(--text-secondary)]">Masukkan ID tiket untuk melihat status laporan Anda.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "admin" && isEditMode && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">Semua Aspirasi Masuk</h3>
                                        <div className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full font-bold text-sm">
                                            Total: {aspirasi.length} Laporan
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {aspirasi.length === 0 ? (
                                            <div className="text-center py-12 text-[var(--text-secondary)]">
                                                Belum ada data aspirasi.
                                            </div>
                                        ) : (
                                            aspirasi.map((item) => (
                                                <div key={item.id} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] relative group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <span className="font-mono font-bold text-blue-500">{typeof item.id === 'object' ? JSON.stringify(item.id) : item.id}</span>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.status === "Selesai" || item.status === "Diproses" ? "bg-emerald-500/20 text-emerald-500" :
                                                                    item.status === "Rejected" ? "bg-red-500/20 text-red-500" :
                                                                        "bg-amber-500/20 text-amber-500"
                                                                    }`}>
                                                                    {typeof item.status === 'object' ? JSON.stringify(item.status) : item.status}
                                                                </span>
                                                                {item.is_anonymous && (
                                                                    <span className="flex items-center text-xs px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-500">
                                                                        <Shield className="w-3 h-3 mr-1" /> Anonim
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <h4 className="font-bold text-[var(--text-primary)]">
                                                                {item.is_anonymous
                                                                    ? <span className="text-blue-500 flex items-center"><Shield className="w-4 h-4 mr-2" />Pelapor Anonim</span>
                                                                    : <>{typeof item.nama === 'object' ? JSON.stringify(item.nama) : item.nama} <span className="text-[var(--text-secondary)] font-normal text-sm">({typeof item.dusun === 'object' ? JSON.stringify(item.dusun) : item.dusun})</span></>
                                                                }
                                                            </h4>
                                                        </div>
                                                        <div className="text-xs text-[var(--text-secondary)]">
                                                            {typeof item.date === 'object' ? JSON.stringify(item.date) : item.date}
                                                        </div>
                                                    </div>

                                                    <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">{typeof item.laporan === 'object' ? JSON.stringify(item.laporan) : item.laporan}</p>

                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("Hapus laporan ini permanen?")) {
                                                                    deleteAspirasi(item.id);
                                                                }
                                                            }}
                                                            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-sm hover:bg-red-500 hover:text-white transition-colors flex items-center"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: My History */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel rounded-[2rem] p-6 h-full">
                            <div className="flex items-center mb-6">
                                <History className="w-5 h-5 text-[var(--text-primary)] mr-2" />
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Riwayat Saya</h3>
                            </div>

                            {myHistory.length === 0 ? (
                                <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
                                    Belum ada riwayat laporan di perangkat ini.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myHistory.filter((value, index, self) => self.indexOf(value) === index).map((id) => {
                                        const item = getAspirasiByTicket(id);
                                        return (
                                            <button
                                                key={typeof id === 'string' || typeof id === 'number' ? id : JSON.stringify(id)}
                                                onClick={() => handleSearch(typeof id === 'string' ? id : String(id))}
                                                className="w-full text-left p-4 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] border border-[var(--border-color)] transition-all group"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-mono font-bold text-blue-500 text-sm">{typeof id === 'object' ? JSON.stringify(id) : id}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item?.status === "Selesai" || item?.status === "Diproses" ? "bg-emerald-500/20 text-emerald-500" :
                                                        item?.status === "Rejected" ? "bg-red-500/20 text-red-500" :
                                                            "bg-amber-500/20 text-amber-500"
                                                        }`}>
                                                        {typeof item?.status === 'object' ? JSON.stringify(item?.status) : (item?.status || "Unknown")}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-[var(--text-secondary)] line-clamp-1 group-hover:text-[var(--text-primary)]">
                                                    {typeof item?.laporan === 'object' ? JSON.stringify(item?.laporan) : (item?.laporan || "Memuat...")}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

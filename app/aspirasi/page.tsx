"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Send, Search, AlertCircle, CheckCircle, Clock, MessageSquare, History, Upload, X, Image as ImageIcon, Trash2, Shield, ArrowLeft, MessageCircle, Sparkles, Ticket, Zap, FileText, MapPin, Tag, User, Hash } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { canSubmit, recordSubmit, getRemainingTime } from "@/lib/rateLimit";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Aspirasi() {
    const { addAspirasi, getAspirasiByTicket, aspirasi, deleteAspirasi, isEditMode, checkNikAvailability } = useAppContext();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
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
    const [errors, setErrors] = useState({ nama: "", nik: "", laporan: "", image: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [successTicketId, setSuccessTicketId] = useState("");
    const [copied, setCopied] = useState(false);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        setMounted(true);
        const history = localStorage.getItem("my_aspirasi_history");
        if (history) setMyHistory(JSON.parse(history));
    }, []);

    useEffect(() => {
        if (isOnCooldown && remainingTime > 0) {
            const timer = setInterval(() => {
                const remaining = getRemainingTime('aspirasi');
                if (remaining <= 0) {
                    setIsOnCooldown(false);
                    setRemainingTime(0);
                } else {
                    setRemainingTime(remaining);
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOnCooldown, remainingTime]);

    const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
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
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const validateForm = (): boolean => {
        const newErrors = { nama: "", nik: "", laporan: "", image: "" };
        let isValid = true;
        if (!form.nama.trim()) { newErrors.nama = "Mohon isi nama lengkap Anda sesuai KTP"; isValid = false; }
        else if (form.nama.trim().length < 3) { newErrors.nama = "Nama minimal 3 karakter"; isValid = false; }
        if (!form.nik) { newErrors.nik = "NIK wajib diisi"; isValid = false; }
        else if (form.nik.length !== 16) { newErrors.nik = "NIK harus 16 digit angka"; isValid = false; }
        if (!form.laporan.trim()) { newErrors.laporan = "Mohon isi detail laporan Anda"; isValid = false; }
        else if (form.laporan.trim().length < 20) { newErrors.laporan = "Laporan minimal 20 karakter"; isValid = false; }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        if (!canSubmit('aspirasi')) {
            const remaining = getRemainingTime('aspirasi');
            setIsOnCooldown(true);
            setRemainingTime(remaining);
            setSubmitError(`⏱️ Mohon tunggu ${remaining} detik sebelum mengirim lagi.`);
            return;
        }
        if (!validateForm()) return;
        if (!form.nik || form.nik.length !== 16) {
            setErrors({ ...errors, nik: "NIK wajib diisi 16 digit" });
            return;
        }
        setIsSubmitting(true);
        try {
            const nikExists = await checkNikAvailability(form.nik);
            if (!nikExists) { setSubmitError("Validasi Gagal: NIK Anda tidak terdaftar."); return; }
            const { data: pendudukData, error: pendudukError } = await (await import('@/lib/supabase')).supabase
                .from('penduduk').select('nama, dusun').eq('nik', form.nik).single();
            if (pendudukError || !pendudukData) { setSubmitError("Gagal memvalidasi data."); return; }
            const submittedNama = form.nama.trim().toLowerCase();
            const dbNama = pendudukData.nama.trim().toLowerCase();
            if (submittedNama !== dbNama) { setSubmitError(`Nama tidak sesuai data penduduk (${pendudukData.nama}).`); return; }
            if (form.dusun !== pendudukData.dusun) { setSubmitError(`Dusun tidak sesuai (${pendudukData.dusun}).`); return; }
            const newTicketId = await addAspirasi(form);
            recordSubmit('aspirasi');
            const updatedHistory = [newTicketId, ...myHistory];
            setMyHistory(updatedHistory);
            localStorage.setItem("my_aspirasi_history", JSON.stringify(updatedHistory));
            setSuccessTicketId(newTicketId);
            setShowSuccessCard(true);
            setForm({ nama: "", nik: "", dusun: "Benteng", kategori: "Infrastruktur", laporan: "", image: "", is_anonymous: false });
            setImagePreview(null);
            setTicketId(newTicketId);
            setTimeout(() => { setShowSuccessCard(false); setActiveTab("track"); handleSearch(newTicketId); }, 5000);
        } catch (error: any) {
            setSubmitError(error.message || "Terjadi kesalahan.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSearch = (idToSearch = ticketId) => {
        const result = getAspirasiByTicket(idToSearch);
        if (result) {
            setSearchResult(result);
            setTicketId(idToSearch);
            setActiveTab("track");
            setSubmitError("");
        } else {
            setSearchResult(null);
            setSubmitError("ID Tiket tidak ditemukan.");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "Selesai": return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: 'rgba(16, 185, 129, 0.4)' };
            case "Diproses": return { bg: 'rgba(14, 165, 233, 0.15)', color: '#0EA5E9', border: 'rgba(14, 165, 233, 0.4)' };
            case "Rejected": return { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', border: 'rgba(239, 68, 68, 0.4)' };
            default: return { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', border: 'rgba(245, 158, 11, 0.4)' };
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Animated Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link href="/" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-500/10">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Premium Hero Header */}
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Layanan Aspirasi</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 text-[var(--text-primary)]">
                        Layanan{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
                            Aspirasi
                        </span>
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto text-[var(--text-secondary)]">
                        Sampaikan aspirasi, keluhan, dan saran Anda untuk kemajuan Desa Cenrana
                    </p>
                </motion.div>

                {/* Premium Tab Buttons */}
                <motion.div
                    className="flex justify-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="p-1.5 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] inline-flex shadow-lg">
                        {[
                            { id: "form", label: "Buat Laporan", icon: Send, gradient: "from-emerald-500 via-emerald-400 to-teal-400" },
                            { id: "track", label: "Lacak Status", icon: Search, gradient: "from-blue-500 via-blue-400 to-cyan-400" },
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 relative overflow-hidden ${activeTab === tab.id ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                whileHover={{ scale: activeTab === tab.id ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className={`absolute inset-0 bg-gradient-to-r ${tab.gradient} rounded-xl`}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <tab.icon className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">{tab.label}</span>
                            </motion.button>
                        ))}
                        {isEditMode && (
                            <motion.button
                                onClick={() => setActiveTab("admin")}
                                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 relative overflow-hidden ${activeTab === "admin" ? 'text-white' : 'text-[var(--text-secondary)]'
                                    }`}
                                whileHover={{ scale: activeTab === "admin" ? 1 : 1.02 }}
                            >
                                {activeTab === "admin" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <Shield className="w-4 h-4 relative z-10" />
                                <span className="relative z-10">Admin</span>
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="relative">
                            {/* Glowing Border Effect */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-sm"></div>

                            <div className="relative rounded-3xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-2xl overflow-hidden">
                                {/* Gradient Top Bar */}
                                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

                                {/* Decorative Corner Elements */}
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-tr-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-bl-3xl"></div>

                                <div className="relative p-6 md:p-8">
                                    {activeTab === "form" ? (
                                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                            {/* Error Alert */}
                                            {submitError && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    className="p-4 rounded-xl flex items-start gap-3 bg-red-500/10 border border-red-500/30"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                                        <AlertCircle className="w-5 h-5 text-red-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-red-300">Terjadi Kesalahan</p>
                                                        <p className="text-sm text-red-200/70">{submitError}</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Cooldown Warning */}
                                            {isOnCooldown && remainingTime > 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="p-5 rounded-xl bg-amber-500/10 border-2 border-amber-500/40"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                            <Clock className="w-6 h-6 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-amber-300 mb-1">⏱️ Mohon Tunggu</h3>
                                                            <p className="text-sm text-amber-200/70 mb-3">Kirim lagi dalam <strong className="text-amber-300">{remainingTime} detik</strong></p>
                                                            <div className="h-2 rounded-full overflow-hidden bg-amber-500/20">
                                                                <motion.div
                                                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                                                    initial={{ width: '100%' }}
                                                                    animate={{ width: `${(remainingTime / 60) * 100}%` }}
                                                                    transition={{ duration: 0.5 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Success Card */}
                                            {showSuccessCard && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-500/40 relative overflow-hidden"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent animate-pulse"></div>
                                                    <div className="relative flex items-start gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce" style={{ animationDuration: '2s' }}>
                                                            <CheckCircle className="w-7 h-7 text-white" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-bold text-emerald-300 mb-1">🎉 Berhasil Dikirim!</h3>
                                                            <p className="text-sm text-emerald-200/70 mb-3">Laporan Anda telah kami terima</p>
                                                            <div className="p-4 rounded-xl bg-[var(--bg-panel)] border border-emerald-500/30 mb-3">
                                                                <p className="text-xs text-[var(--text-secondary)] mb-1">ID Tiket Anda:</p>
                                                                <div className="flex items-center gap-3">
                                                                    <p className="text-2xl font-black text-emerald-400 tracking-wider flex-1">{successTicketId}</p>
                                                                    <motion.button
                                                                        type="button"
                                                                        onClick={() => { navigator.clipboard.writeText(successTicketId); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                                                                        className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        {copied ? '✓ Copied!' : '📋 Copy'}
                                                                    </motion.button>
                                                                </div>
                                                            </div>
                                                            <p className="text-xs text-emerald-400 flex items-center gap-1">
                                                                <Zap className="w-3 h-3" />
                                                                Auto redirect dalam 5 detik...
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Form Fields */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {/* Nama Field */}
                                                <div className="group">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        <User className="w-4 h-4 text-emerald-400" />
                                                        Nama Lengkap
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            required
                                                            value={form.nama}
                                                            onChange={(e) => { setForm({ ...form, nama: e.target.value }); if (errors.nama) setErrors({ ...errors, nama: "" }); }}
                                                            className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300 bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                                            style={{ borderColor: errors.nama ? '#EF4444' : 'var(--border-color)' }}
                                                            placeholder="Sesuai KTP"
                                                        />
                                                    </div>
                                                    {errors.nama && (
                                                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm mt-2 text-red-400 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />{errors.nama}
                                                        </motion.p>
                                                    )}
                                                </div>

                                                {/* NIK Field */}
                                                <div className="group">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        <Hash className="w-4 h-4 text-blue-400" />
                                                        NIK <span className="text-red-400">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            required
                                                            value={form.nik}
                                                            maxLength={16}
                                                            onChange={(e) => { handleNikChange(e); if (errors.nik) setErrors({ ...errors, nik: "" }); }}
                                                            className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300 bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                                                            style={{ borderColor: errors.nik ? '#EF4444' : 'var(--border-color)' }}
                                                            placeholder="16 digit NIK (wajib)"
                                                        />
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--text-secondary)]">
                                                            {form.nik.length}/16
                                                        </div>
                                                    </div>
                                                    {errors.nik && (
                                                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm mt-2 text-red-400 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />{errors.nik}
                                                        </motion.p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {/* Dusun Field */}
                                                <div className="group">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        <MapPin className="w-4 h-4 text-purple-400" />
                                                        Dusun
                                                    </label>
                                                    <select
                                                        value={form.dusun}
                                                        onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                                                        className="w-full px-4 py-3.5 rounded-xl outline-none cursor-pointer transition-all duration-300 bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-primary)] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                                    >
                                                        <option value="Benteng">🏘️ Benteng</option>
                                                        <option value="Kajuara">🏘️ Kajuara</option>
                                                        <option value="Tanatengnga">🏘️ Tanatengnga</option>
                                                        <option value="Panagi">🏘️ Panagi</option>
                                                        <option value="Holiang">🏘️ Holiang</option>
                                                    </select>
                                                </div>

                                                {/* Kategori Field */}
                                                <div className="group">
                                                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        <Tag className="w-4 h-4 text-amber-400" />
                                                        Kategori Laporan
                                                    </label>
                                                    <select
                                                        value={form.kategori}
                                                        onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                                                        className="w-full px-4 py-3.5 rounded-xl outline-none cursor-pointer transition-all duration-300 bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-primary)] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                                    >
                                                        <option value="Infrastruktur">🏗️ Infrastruktur</option>
                                                        <option value="Pelayanan Publik">📋 Pelayanan Publik</option>
                                                        <option value="Kesehatan">🏥 Kesehatan</option>
                                                        <option value="Pendidikan">📚 Pendidikan</option>
                                                        <option value="Keamanan & Ketertiban">🚨 Keamanan & Ketertiban</option>
                                                        <option value="Ekonomi & UMKM">💼 Ekonomi & UMKM</option>
                                                        <option value="Sosial & Budaya">🎭 Sosial & Budaya</option>
                                                        <option value="Lingkungan">🌳 Lingkungan</option>
                                                        <option value="Lainnya">📌 Lainnya</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Anonymous Toggle */}
                                            <motion.div
                                                className="p-5 rounded-xl cursor-pointer transition-all duration-300 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/15 hover:border-blue-500/50"
                                                onClick={() => setForm({ ...form, is_anonymous: !form.is_anonymous })}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <label className="flex items-center gap-4 cursor-pointer">
                                                    <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${form.is_anonymous ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-[var(--bg-panel)]'}`}>
                                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${form.is_anonymous ? 'left-6' : 'left-1'}`}></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="w-5 h-5 text-blue-400" />
                                                            <span className="font-bold text-[var(--text-primary)]">Rahasiakan Identitas Saya</span>
                                                        </div>
                                                        <p className="mt-1 text-xs text-[var(--text-secondary)]">Identitas tetap tersimpan untuk validasi, namun tidak ditampilkan kepada admin.</p>
                                                    </div>
                                                </label>
                                            </motion.div>

                                            {/* Laporan Textarea */}
                                            <div className="group">
                                                <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                    <FileText className="w-4 h-4 text-teal-400" />
                                                    Isi Laporan
                                                </label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={form.laporan}
                                                    onChange={(e) => { setForm({ ...form, laporan: e.target.value }); if (errors.laporan) setErrors({ ...errors, laporan: "" }); }}
                                                    className="w-full px-4 py-3.5 rounded-xl outline-none transition-all duration-300 resize-none bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                                                    style={{ borderColor: errors.laporan ? '#EF4444' : 'var(--border-color)' }}
                                                    placeholder="Jelaskan detail laporan Anda secara rinci..."
                                                />
                                                <div className="flex justify-between items-center mt-2">
                                                    {errors.laporan ? (
                                                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 flex items-center gap-1">
                                                            <AlertCircle className="w-4 h-4" />{errors.laporan}
                                                        </motion.p>
                                                    ) : <span />}
                                                    <span className="text-xs text-[var(--text-secondary)]">{form.laporan.length} karakter</span>
                                                </div>
                                            </div>

                                            {/* Image Upload */}
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                    <ImageIcon className="w-4 h-4 text-pink-400" />
                                                    Upload Bukti Foto (Opsional)
                                                </label>
                                                <div
                                                    className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 text-center ${imagePreview ? 'border-emerald-500 bg-emerald-500/5' : 'border-[var(--border-color)] hover:border-emerald-500/50 hover:bg-emerald-500/5'}`}
                                                >
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/*"
                                                        onChange={handleImageUpload}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    {imagePreview ? (
                                                        <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                                                            <Image src={imagePreview} alt="Preview" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => { e.preventDefault(); removeImage(); }}
                                                                className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full z-20 hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-4">
                                                            <div className="p-4 rounded-full mb-3 bg-[var(--bg-panel)] border border-[var(--border-color)]">
                                                                <Upload className="w-8 h-8 text-emerald-400" />
                                                            </div>
                                                            <p className="font-bold text-[var(--text-primary)]">Klik atau tarik foto ke sini</p>
                                                            <p className="text-xs mt-1 text-[var(--text-secondary)]">Format: JPG, PNG (Max 5MB)</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Submit Button */}
                                            <motion.button
                                                type="submit"
                                                disabled={!!nikError || isSubmitting || isOnCooldown}
                                                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    background: isOnCooldown ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'linear-gradient(135deg, #10B981, #0EA5E9)',
                                                    boxShadow: isOnCooldown || isSubmitting ? 'none' : '0 10px 30px rgba(16, 185, 129, 0.4)',
                                                }}
                                                whileHover={{ scale: isSubmitting || isOnCooldown ? 1 : 1.02 }}
                                                whileTap={{ scale: isSubmitting || isOnCooldown ? 1 : 0.98 }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {isOnCooldown ? (
                                                        <><Clock className="w-5 h-5 animate-pulse" /> Tunggu {remainingTime}s</>
                                                    ) : isSubmitting ? (
                                                        <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengirim...</>
                                                    ) : (
                                                        <><Send className="w-5 h-5" /> Kirim Laporan</>
                                                    )}
                                                </span>
                                            </motion.button>
                                        </form>
                                    ) : activeTab === "track" ? (
                                        <div className="space-y-6">
                                            {/* Search Header */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                                    <Search className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Lacak Status Laporan</h2>
                                                    <p className="text-sm text-[var(--text-secondary)]">Masukkan ID tiket Anda</p>
                                                </div>
                                            </div>

                                            {/* Search Input */}
                                            <div className="relative group">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                                <div className="relative flex gap-3">
                                                    <div className="flex-1 relative">
                                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-blue-400 transition-colors" />
                                                        <input
                                                            type="text"
                                                            value={ticketId}
                                                            onChange={(e) => setTicketId(e.target.value.toUpperCase())}
                                                            className="w-full pl-12 pr-4 py-4 rounded-xl text-lg font-mono outline-none transition-all duration-300 bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                                            placeholder="Contoh: ASP-001"
                                                        />
                                                    </div>
                                                    <motion.button
                                                        onClick={() => handleSearch()}
                                                        className="px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 transition-all"
                                                        whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(59, 130, 246, 0.5)' }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Cari
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Info: Link to dedicated track page */}
                                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Zap className="w-5 h-5 text-blue-400" />
                                                    <span className="text-sm text-blue-300">Ingin tampilan lebih lengkap?</span>
                                                </div>
                                                <Link
                                                    href="/aspirasi/track"
                                                    className="px-4 py-2 rounded-lg font-semibold text-sm bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all"
                                                >
                                                    Buka Halaman Lacak →
                                                </Link>
                                            </div>

                                            {/* Search Result */}
                                            {searchResult ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="space-y-4"
                                                >
                                                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                                                        <div>
                                                            <p className="text-sm text-[var(--text-secondary)]">ID Tiket</p>
                                                            <p className="text-xl font-bold text-[var(--text-primary)]">{searchResult.id}</p>
                                                        </div>
                                                        <div
                                                            className="px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2"
                                                            style={{ backgroundColor: getStatusStyle(searchResult.status).bg, color: getStatusStyle(searchResult.status).color, border: `1px solid ${getStatusStyle(searchResult.status).border}` }}
                                                        >
                                                            {searchResult.status === "Selesai" && <CheckCircle className="w-4 h-4" />}
                                                            {searchResult.status === "Diproses" && <Clock className="w-4 h-4" />}
                                                            {searchResult.status === "Pending" && <Clock className="w-4 h-4" />}
                                                            {searchResult.status}
                                                        </div>
                                                    </div>

                                                    <div className="p-5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                                                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">Detail Laporan</h4>
                                                        <p className="text-[var(--text-primary)] leading-relaxed">{searchResult.laporan}</p>
                                                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                                                            <span>{searchResult.is_anonymous ? '🛡️ Pelapor Anonim' : searchResult.nama}</span>
                                                            <span>•</span>
                                                            <span>{searchResult.date}</span>
                                                        </div>
                                                    </div>

                                                    {searchResult.reply && (
                                                        <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <MessageSquare className="w-5 h-5 text-blue-400" />
                                                                <h4 className="font-bold text-blue-300">Tanggapan Admin</h4>
                                                            </div>
                                                            <p className="text-blue-100">{searchResult.reply}</p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="w-20 h-20 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-4">
                                                        <Search className="w-10 h-10 text-[var(--text-secondary)]/30" />
                                                    </div>
                                                    <p className="text-[var(--text-secondary)]">Masukkan ID tiket untuk melihat status laporan Anda.</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : activeTab === "admin" && isEditMode && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-bold text-[var(--text-primary)]">Semua Aspirasi</h3>
                                                <div className="px-4 py-2 rounded-full font-bold text-sm bg-emerald-500/20 text-emerald-400">
                                                    Total: {aspirasi.length}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                {aspirasi.length === 0 ? (
                                                    <div className="text-center py-12 text-[var(--text-secondary)]">Belum ada data aspirasi.</div>
                                                ) : (
                                                    aspirasi.map((item, index) => (
                                                        <motion.div
                                                            key={item.id}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="p-5 rounded-2xl bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-emerald-500/30 transition-all group"
                                                        >
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="font-mono font-bold text-emerald-400">{item.id}</span>
                                                                    <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ backgroundColor: getStatusStyle(item.status).bg, color: getStatusStyle(item.status).color }}>{item.status}</span>
                                                                    {item.is_anonymous && (
                                                                        <span className="flex items-center text-xs px-2 py-1 rounded-full font-bold bg-blue-500/20 text-blue-400">
                                                                            <Shield className="w-3 h-3 mr-1" /> Anonim
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <span className="text-xs text-[var(--text-secondary)]">{item.date}</span>
                                                            </div>
                                                            <p className="mb-3 text-[var(--text-secondary)] line-clamp-2">{item.laporan}</p>
                                                            <div className="flex justify-end">
                                                                <button
                                                                    onClick={() => { if (confirm("Hapus laporan ini?")) deleteAspirasi(item.id); }}
                                                                    className="px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> Hapus
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Sidebar: History */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <div className="relative sticky top-28">
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-teal-500/20 rounded-3xl opacity-50 blur-sm"></div>
                            <div className="relative rounded-3xl p-6 bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                        <History className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Riwayat Saya</h3>
                                </div>

                                {myHistory.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-3">
                                            <Ticket className="w-8 h-8 text-[var(--text-secondary)]/30" />
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)]">Belum ada riwayat laporan di perangkat ini.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {myHistory.filter((value, index, self) => self.indexOf(value) === index).slice(0, 5).map((id, index) => {
                                            const item = getAspirasiByTicket(id);
                                            return (
                                                <motion.button
                                                    key={id}
                                                    onClick={() => handleSearch(id)}
                                                    className="w-full text-left p-4 rounded-xl transition-all duration-300 bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 group"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    whileHover={{ scale: 1.02, x: 5 }}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-mono font-bold text-sm text-emerald-400">{id}</span>
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ backgroundColor: getStatusStyle(item?.status || 'Pending').bg, color: getStatusStyle(item?.status || 'Pending').color }}>
                                                            {item?.status || "Unknown"}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs line-clamp-1 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                                                        {item?.laporan || "Memuat..."}
                                                    </p>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

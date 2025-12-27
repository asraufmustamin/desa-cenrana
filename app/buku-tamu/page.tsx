"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    ClipboardList, User, Phone, MapPin, Target, FileText,
    Send, CheckCircle, Loader2, AlertCircle, ArrowLeft, Clock, Users
} from "lucide-react";

const TUJUAN_OPTIONS = [
    { value: "mengurus_surat", label: "Mengurus Surat/Dokumen", icon: "📄" },
    { value: "bertemu_kades", label: "Bertemu Kepala Desa", icon: "👤" },
    { value: "bertemu_sekdes", label: "Bertemu Sekretaris Desa", icon: "👥" },
    { value: "konsultasi", label: "Konsultasi/Tanya Informasi", icon: "💬" },
    { value: "pengaduan", label: "Menyampaikan Pengaduan", icon: "📢" },
    { value: "undangan", label: "Menghadiri Undangan/Rapat", icon: "📅" },
    { value: "survey", label: "Survey/Penelitian", icon: "📊" },
    { value: "kunjungan_dinas", label: "Kunjungan Dinas", icon: "🏛️" },
    { value: "lainnya", label: "Lainnya", icon: "📌" },
];

interface SuccessData {
    queueNumber: number;
    nama: string;
    tujuan: string;
}

export default function BukuTamuPage() {
    const [nama, setNama] = useState("");
    const [nik, setNik] = useState("");
    const [noHp, setNoHp] = useState("");
    const [alamat, setAlamat] = useState("");
    const [tujuan, setTujuan] = useState("");
    const [keperluan, setKeperluan] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState<SuccessData | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!nama.trim() || nama.trim().length < 3) {
            setError("Nama minimal 3 karakter");
            return;
        }
        if (!tujuan) {
            setError("Silakan pilih tujuan kunjungan");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/buku-tamu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama, nik, no_hp: noHp, alamat, tujuan, keperluan })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess({
                    queueNumber: data.queueNumber,
                    nama: nama,
                    tujuan: TUJUAN_OPTIONS.find(t => t.value === tujuan)?.label || tujuan
                });
                // Reset form
                setNama("");
                setNik("");
                setNoHp("");
                setAlamat("");
                setTujuan("");
                setKeperluan("");
            } else {
                setError(data.error || "Gagal mendaftar");
            }
        } catch {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSuccess(null);
        setError("");
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center text-[var(--text-secondary)] hover:text-blue-500 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Beranda
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-4 shadow-lg shadow-emerald-500/30">
                        <ClipboardList className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Buku Tamu Digital</h1>
                    <p className="text-[var(--text-secondary)]">Kantor Desa Cenrana</p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </span>
                    </div>
                </motion.div>

                {/* Success State */}
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-8 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Pendaftaran Berhasil!</h2>
                            <p className="text-[var(--text-secondary)] mb-6">Silakan menunggu di ruang tunggu</p>

                            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-6">
                                <p className="text-sm text-[var(--text-secondary)] mb-2">Nomor Antrian Anda</p>
                                <p className="text-6xl font-extrabold text-emerald-500 mb-4">{success.queueNumber}</p>
                                <div className="text-sm text-[var(--text-secondary)]">
                                    <p><strong className="text-[var(--text-primary)]">{success.nama}</strong></p>
                                    <p>{success.tujuan}</p>
                                </div>
                            </div>

                            <button
                                onClick={resetForm}
                                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-600 transition-all"
                            >
                                Daftar Tamu Baru
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8"
                        >
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Nama */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                                        <input
                                            type="text"
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder="Masukkan nama lengkap"
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* NIK */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        NIK (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={nik}
                                        onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
                                        placeholder="16 digit NIK"
                                        className="w-full px-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                </div>

                                {/* No HP */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        No. Telepon/WhatsApp (Opsional)
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                                        <input
                                            type="tel"
                                            value={noHp}
                                            onChange={(e) => setNoHp(e.target.value)}
                                            placeholder="08xxxxxxxxxx"
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Alamat */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Alamat (Opsional)
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-[var(--text-secondary)]" />
                                        <textarea
                                            value={alamat}
                                            onChange={(e) => setAlamat(e.target.value)}
                                            placeholder="Alamat tempat tinggal"
                                            rows={2}
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Tujuan */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Tujuan Kunjungan <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {TUJUAN_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setTujuan(option.value)}
                                                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${tujuan === option.value
                                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                                                        : "bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-emerald-500/50"
                                                    }`}
                                            >
                                                <span className="text-lg">{option.icon}</span>
                                                <span className="text-sm font-medium">{option.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Keperluan Detail */}
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                        Keterangan Tambahan (Opsional)
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-5 h-5 text-[var(--text-secondary)]" />
                                        <textarea
                                            value={keperluan}
                                            onChange={(e) => setKeperluan(e.target.value)}
                                            placeholder="Jelaskan keperluan Anda secara singkat..."
                                            rows={3}
                                            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2 text-sm"
                                    >
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Mendaftar...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Daftar Hadir
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Info Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-center text-sm text-[var(--text-secondary)]"
                >
                    <p>Jam Pelayanan: Senin - Jumat, 08:00 - 16:00 WITA</p>
                    <p className="mt-1">Jika ada kendala, hubungi petugas di loket.</p>
                </motion.div>
            </div>
        </div>
    );
}

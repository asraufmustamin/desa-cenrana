"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { Search, AlertCircle, CheckCircle2, Clock, XCircle, ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

const statusConfig = {
    Pending: { label: "Menunggu", color: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20", Icon: Clock },
    Diproses: { label: "Diproses", color: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20", Icon: Clock },
    Selesai: { label: "Selesai", color: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20", Icon: CheckCircle2 },
    Rejected: { label: "Ditolak", color: "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20", Icon: XCircle },
};

export default function TrackPage() {
    const { getAspirasiByTicket, submitRating } = useAppContext();
    const [ticketCode, setTicketCode] = useState("");
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [aspirasi, setAspirasi] = useState<any>(null);
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchAttempted(true);
        const result = getAspirasiByTicket(ticketCode.trim().toUpperCase());
        setAspirasi(result || null);
        if (result && result.status === "Selesai" && !result.rating) {
            setShowRating(true);
        }
    };

    const handleSubmitRating = async () => {
        if (!aspirasi || rating === 0) return;
        setIsSubmittingRating(true);
        try {
            await submitRating(aspirasi.id, rating, feedback);
            setShowRating(false);
            // Refresh aspirasi data
            const updated = getAspirasiByTicket(aspirasi.id);
            setAspirasi(updated);
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
        setIsSubmittingRating(false);
    };

    const StatusIcon = aspirasi ? statusConfig[aspirasi.status as keyof typeof statusConfig].Icon : Clock;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="container mx-auto max-w-4xl">
                {/* Proper Back Button with Styling */}
                <Link
                    href="/aspirasi"
                    className="inline-flex items-center gap-2 px-4 py-2.5 mb-6 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Form Aspirasi
                </Link>

                <div className="glass-panel rounded-[2rem] shadow-lg border border-[var(--border-color)] p-6 md:p-10">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">🔍 Lacak Aspirasi Anda</h1>
                    <p className="text-[var(--text-secondary)] mb-8">
                        Masukkan kode tiket untuk melihat status dan detail aspirasi Anda
                    </p>

                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={ticketCode}
                                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                                placeholder="Contoh: ASP-001"
                                className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" />
                                Cari
                            </button>
                        </div>
                    </form>

                    {searchAttempted && !aspirasi && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start">
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <p className="text-sm text-red-800 dark:text-red-200 font-medium">Tiket tidak ditemukan</p>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    Pastikan kode tiket yang Anda masukkan benar. Format: ASP-XXX
                                </p>
                            </div>
                        </div>
                    )}

                    {aspirasi && (
                        <div className="space-y-6">
                            <div className="border-t border-[var(--border-color)] pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                                        Aspirasi #{aspirasi.id}
                                    </h2>
                                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig[aspirasi.status as keyof typeof statusConfig].color}`}>
                                        {statusConfig[aspirasi.status as keyof typeof statusConfig].label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <p className="text-sm text-[var(--text-secondary)]">Dusun</p>
                                        <p className="font-semibold text-[var(--text-primary)]">{aspirasi.dusun}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-secondary)]">Kategori</p>
                                        <p className="font-semibold text-[var(--text-primary)]">{aspirasi.kategori}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[var(--text-secondary)]">Tanggal Dibuat</p>
                                        <p className="font-semibold text-[var(--text-primary)]">{aspirasi.date}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-sm text-[var(--text-secondary)] mb-2">Isi Laporan</p>
                                    <p className="text-[var(--text-primary)] leading-relaxed bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-color)]">
                                        {aspirasi.laporan}
                                    </p>
                                </div>

                                {aspirasi.image && (
                                    <div className="mb-6">
                                        <p className="text-sm text-[var(--text-secondary)] mb-2">Foto Pendukung</p>
                                        <img
                                            src={aspirasi.image}
                                            alt="Foto aspirasi"
                                            className="w-full max-w-2xl rounded-xl shadow-md border border-[var(--border-color)]"
                                        />
                                    </div>
                                )}

                                {aspirasi.reply && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">💬 Balasan Admin</p>
                                        <p className="text-blue-800 dark:text-blue-300">{aspirasi.reply}</p>
                                    </div>
                                )}

                                {aspirasi.rating && (
                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">⭐ Rating Anda</p>
                                        <div className="flex items-center gap-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < aspirasi.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
                                                />
                                            ))}
                                            <span className="text-yellow-900 dark:text-yellow-200 font-semibold ml-2">
                                                {aspirasi.rating}/5
                                            </span>
                                        </div>
                                        {aspirasi.feedback_text && (
                                            <p className="text-yellow-800 dark:text-yellow-300 mt-2">{aspirasi.feedback_text}</p>
                                        )}
                                    </div>
                                )}

                                {showRating && !aspirasi.rating && (
                                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 mt-6">
                                        <h3 className="text-lg font-bold text-green-900 dark:text-green-200 mb-4">⭐ Beri Rating</h3>
                                        <p className="text-sm text-green-800 dark:text-green-300 mb-4">
                                            Bagaimana kepuasan Anda terhadap penanganan aspirasi ini?
                                        </p>
                                        <div className="flex items-center gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    className="transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`w-8 h-8 cursor-pointer ${star <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300 dark:text-gray-600 hover:text-yellow-400"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Feedback (opsional)"
                                            rows={3}
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none mb-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                        />
                                        <button
                                            onClick={handleSubmitRating}
                                            disabled={rating === 0 || isSubmittingRating}
                                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                                        >
                                            {isSubmittingRating ? "Mengirim..." : "Kirim Rating"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

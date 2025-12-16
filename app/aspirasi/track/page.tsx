"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { Search, AlertCircle, CheckCircle2, Clock, XCircle, ArrowLeft, Star, Send, FileText, MapPin, Tag, Calendar, MessageSquare, Image as ImageIcon, Sparkles, Ticket, Shield, Zap } from "lucide-react";
import Link from "next/link";

const statusConfig = {
    Pending: { label: "Menunggu Verifikasi", color: "from-amber-500 to-orange-500", bgColor: "bg-amber-500/10", textColor: "text-amber-400", Icon: Clock, step: 1 },
    Diproses: { label: "Sedang Diproses", color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-500/10", textColor: "text-blue-400", Icon: Clock, step: 2 },
    Selesai: { label: "Selesai", color: "from-emerald-500 to-green-500", bgColor: "bg-emerald-500/10", textColor: "text-emerald-400", Icon: CheckCircle2, step: 3 },
    Rejected: { label: "Ditolak", color: "from-red-500 to-rose-500", bgColor: "bg-red-500/10", textColor: "text-red-400", Icon: XCircle, step: -1 },
};

const steps = [
    { id: 1, label: "Terkirim", icon: Send },
    { id: 2, label: "Diproses", icon: Clock },
    { id: 3, label: "Selesai", icon: CheckCircle2 },
];

export default function TrackPage() {
    const { getAspirasiByTicket, submitRating } = useAppContext();
    const [ticketCode, setTicketCode] = useState("");
    const [searchAttempted, setSearchAttempted] = useState(false);
    const [aspirasi, setAspirasi] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        setSearchAttempted(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        const result = getAspirasiByTicket(ticketCode.trim().toUpperCase());
        setAspirasi(result || null);
        if (result && result.status === "Selesai" && !result.rating) {
            setShowRating(true);
        }
        setIsSearching(false);
    };

    const handleSubmitRating = async () => {
        if (!aspirasi || rating === 0) return;
        setIsSubmittingRating(true);
        try {
            await submitRating(aspirasi.id, rating, feedback);
            setShowRating(false);
            const updated = getAspirasiByTicket(aspirasi.id);
            setAspirasi(updated);
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
        setIsSubmittingRating(false);
    };

    const currentStep = aspirasi ? statusConfig[aspirasi.status as keyof typeof statusConfig]?.step || 0 : 0;
    const StatusIcon = aspirasi ? statusConfig[aspirasi.status as keyof typeof statusConfig]?.Icon || Clock : Clock;

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="container mx-auto max-w-3xl relative z-10">
                {/* Animated Back Button */}
                <Link
                    href="/aspirasi"
                    className={`group inline-flex items-center gap-2 px-4 py-2.5 mb-6 rounded-2xl font-medium text-sm transition-all duration-500 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 hover:bg-emerald-500/10 transform ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                >
                    <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    Kembali ke Form Aspirasi
                </Link>

                {/* Premium Search Card with Animation */}
                <div className={`relative mb-6 transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '100ms' }}>
                    {/* Glowing Border Effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 blur-sm group-hover:opacity-30 animate-pulse"></div>

                    <div className="relative bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl">
                        {/* Decorative Corner Elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-tr-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-bl-3xl"></div>

                        {/* Header with Animation */}
                        <div className="relative flex items-start gap-4 mb-6">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-bounce" style={{ animationDuration: '3s' }}>
                                    <Ticket className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                            </div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1 flex items-center gap-2">
                                    Lacak Aspirasi
                                    <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                                </h1>
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Masukkan kode tiket untuk melihat status & detail aspirasi Anda
                                </p>
                            </div>
                        </div>

                        {/* Features Mini Cards */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { icon: Shield, label: "Aman", color: "text-emerald-400" },
                                { icon: Zap, label: "Cepat", color: "text-amber-400" },
                                { icon: CheckCircle2, label: "Akurat", color: "text-blue-400" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 p-2 bg-[var(--bg-panel)]/50 rounded-xl border border-[var(--border-color)] transition-all duration-300 hover:scale-105 hover:bg-[var(--bg-panel)]"
                                >
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                    <span className="text-xs font-medium text-[var(--text-secondary)]">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Search Form */}
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <div className="flex gap-3">
                                    <div className="flex-1 relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative flex items-center">
                                            <FileText className="absolute left-4 w-5 h-5 text-[var(--text-secondary)] group-focus-within:text-emerald-400 transition-colors duration-300" />
                                            <input
                                                type="text"
                                                value={ticketCode}
                                                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                                                placeholder="Masukkan kode tiket..."
                                                className="w-full pl-12 pr-4 py-4 bg-[var(--bg-panel)] border-2 border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:ring-0 focus:border-emerald-500 outline-none transition-all duration-300 font-medium text-lg"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSearching || !ticketCode.trim()}
                                        className="px-8 py-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2 relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        {isSearching ? (
                                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Search className="w-6 h-6" />
                                        )}
                                        <span>Cari</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Not Found - Animated */}
                {searchAttempted && !aspirasi && !isSearching && (
                    <div className="animate-shake mb-6">
                        <div className="relative p-5 bg-gradient-to-r from-red-500/10 via-rose-500/10 to-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-2xl flex items-center gap-4 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent animate-pulse"></div>
                            <div className="relative w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-400 animate-bounce" />
                            </div>
                            <div className="relative">
                                <p className="font-bold text-red-300 text-lg">Tiket Tidak Ditemukan!</p>
                                <p className="text-sm text-red-200/70">
                                    Pastikan format kode tiket benar: <code className="bg-red-500/20 px-2 py-0.5 rounded-lg text-red-300 font-mono">ASP-XXX</code>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Card - Animated */}
                {aspirasi && (
                    <div className="space-y-4 animate-fade-in-up">
                        {/* Animated Status Progress Tracker */}
                        {currentStep > 0 && (
                            <div className="bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-5 uppercase tracking-wider flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-emerald-400" />
                                    Status Tracking
                                </h3>
                                <div className="relative flex justify-between items-center">
                                    {/* Animated Progress Line */}
                                    <div className="absolute top-5 left-10 right-10 h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out relative"
                                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 animate-shimmer"></div>
                                        </div>
                                    </div>

                                    {steps.map((step, index) => {
                                        const isCompleted = currentStep >= step.id;
                                        const isCurrent = currentStep === step.id;
                                        return (
                                            <div key={step.id} className="relative flex flex-col items-center z-10" style={{ animationDelay: `${index * 200}ms` }}>
                                                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted
                                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40'
                                                        : 'bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-secondary)]'
                                                    } ${isCurrent ? 'scale-125 ring-4 ring-emerald-500/30' : ''}`}>
                                                    {isCurrent && (
                                                        <div className="absolute inset-0 rounded-full bg-emerald-500/50 animate-ping"></div>
                                                    )}
                                                    <step.icon className="w-4 h-4 relative z-10" />
                                                </div>
                                                <span className={`mt-3 text-xs font-semibold transition-colors duration-300 ${isCompleted ? 'text-emerald-400' : 'text-[var(--text-secondary)]'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Rejected Status - Special Animation */}
                        {currentStep === -1 && (
                            <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-2xl p-5 flex items-center gap-4 animate-shake">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                                    <XCircle className="w-7 h-7 text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-300 text-lg">Aspirasi Ditolak</h3>
                                    <p className="text-sm text-red-200/70">Mohon maaf, aspirasi tidak dapat diproses.</p>
                                </div>
                            </div>
                        )}

                        {/* Main Content Card - Premium */}
                        <div className="bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl">
                            {/* Gradient Header */}
                            <div className={`relative bg-gradient-to-r ${statusConfig[aspirasi.status as keyof typeof statusConfig]?.color || 'from-gray-500 to-gray-600'} p-5 overflow-hidden`}>
                                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <StatusIcon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-xs font-medium uppercase tracking-wider">Kode Tiket</p>
                                            <h2 className="text-xl font-bold text-white">{aspirasi.id}</h2>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20">
                                        <span className="text-white font-bold text-sm">
                                            {statusConfig[aspirasi.status as keyof typeof statusConfig]?.label || aspirasi.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details Content */}
                            <div className="p-5">
                                {/* Animated Info Cards */}
                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    {[
                                        { icon: MapPin, label: "Dusun", value: aspirasi.dusun || '-', color: "emerald" },
                                        { icon: Tag, label: "Kategori", value: aspirasi.kategori || '-', color: "blue" },
                                        { icon: Calendar, label: "Tanggal", value: aspirasi.date || '-', color: "purple" },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="group p-3 bg-[var(--bg-panel)] rounded-xl border border-[var(--border-color)] transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-emerald-500/30"
                                            style={{ animationDelay: `${i * 100}ms` }}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <item.icon className={`w-4 h-4 text-${item.color}-400 group-hover:scale-110 transition-transform`} />
                                                <p className="text-[10px] text-[var(--text-secondary)] uppercase font-semibold">{item.label}</p>
                                            </div>
                                            <p className="text-sm font-bold text-[var(--text-primary)] truncate">{item.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Laporan Content */}
                                <div className="mb-4 group">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                                        <FileText className="w-3.5 h-3.5" />
                                        Isi Laporan
                                    </h4>
                                    <div className="p-4 bg-[var(--bg-panel)] rounded-xl border border-[var(--border-color)] transition-all duration-300 group-hover:border-emerald-500/30">
                                        <p className="text-sm text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                                            {aspirasi.laporan}
                                        </p>
                                    </div>
                                </div>

                                {/* Image with Hover Effect */}
                                {aspirasi.image && (
                                    <div className="mb-4 group">
                                        <h4 className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            Foto Pendukung
                                        </h4>
                                        <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)] group-hover:border-emerald-500/30 transition-all duration-300">
                                            <img
                                                src={aspirasi.image}
                                                alt="Foto aspirasi"
                                                className="w-full max-h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Admin Reply - Glowing */}
                                {aspirasi.reply && (
                                    <div className="mb-4 relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-sm"></div>
                                        <div className="relative p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-2">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                Balasan Admin
                                            </h4>
                                            <p className="text-sm text-blue-100 leading-relaxed">{aspirasi.reply}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Rating Display */}
                                {aspirasi.rating && (
                                    <div className="relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl blur-sm animate-pulse"></div>
                                        <div className="relative p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                                            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                Rating Anda
                                            </h4>
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 transition-all duration-300 ${i < aspirasi.rating ? "fill-amber-400 text-amber-400 scale-110" : "text-gray-600"}`}
                                                        style={{ animationDelay: `${i * 100}ms` }}
                                                    />
                                                ))}
                                                <span className="ml-2 text-amber-300 font-bold text-sm">{aspirasi.rating}/5</span>
                                            </div>
                                            {aspirasi.feedback_text && (
                                                <p className="text-sm text-amber-200/80 mt-2">{aspirasi.feedback_text}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Rating Form - Interactive */}
                                {showRating && !aspirasi.rating && (
                                    <div className="mt-4 relative">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-xl blur-sm animate-pulse"></div>
                                        <div className="relative p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                            <h4 className="font-bold text-emerald-300 mb-1 flex items-center gap-2">
                                                <Sparkles className="w-4 h-4" />
                                                Beri Rating
                                            </h4>
                                            <p className="text-xs text-emerald-200/70 mb-4">
                                                Bagaimana kepuasan Anda terhadap penanganan aspirasi ini?
                                            </p>
                                            <div className="flex items-center gap-2 mb-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="transition-all duration-200 hover:scale-125 active:scale-95"
                                                    >
                                                        <Star
                                                            className={`w-10 h-10 transition-all duration-200 ${star <= (hoverRating || rating)
                                                                    ? "fill-amber-400 text-amber-400 drop-shadow-lg"
                                                                    : "text-gray-500 hover:text-amber-300"
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Tulis feedback Anda (opsional)..."
                                                rows={2}
                                                className="w-full px-4 py-3 text-sm bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] mb-4 transition-all duration-300"
                                            />
                                            <button
                                                onClick={handleSubmitRating}
                                                disabled={rating === 0 || isSubmittingRating}
                                                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white rounded-xl font-bold transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                                {isSubmittingRating ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Mengirim...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        Kirim Rating
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out;
                }
            `}</style>
        </div>
    );
}

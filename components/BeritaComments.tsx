"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, User, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface Comment {
    id: number;
    nama: string;
    komentar: string;
    created_at: string;
}

interface BeritaCommentsProps {
    beritaId: number;
}

export default function BeritaComments({ beritaId }: BeritaCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nama, setNama] = useState("");
    const [komentar, setKomentar] = useState("");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Fetch comments
    useEffect(() => {
        fetchComments();
    }, [beritaId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/berita/${beritaId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nama.trim() || nama.trim().length < 2) {
            setMessage({ type: "error", text: "Nama minimal 2 karakter" });
            return;
        }
        if (!komentar.trim() || komentar.trim().length < 5) {
            setMessage({ type: "error", text: "Komentar minimal 5 karakter" });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch(`/api/berita/${beritaId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nama: nama.trim(), komentar: komentar.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                setComments([data.comment, ...comments]);
                setNama("");
                setKomentar("");
                setMessage({ type: "success", text: "Komentar berhasil ditambahkan!" });
            } else {
                const error = await res.json();
                setMessage({ type: "error", text: error.error || "Gagal mengirim komentar" });
            }
        } catch {
            setMessage({ type: "error", text: "Terjadi kesalahan. Coba lagi." });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-hide message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Komentar</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{comments.length} komentar</p>
                </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Nama Anda
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder="Masukkan nama Anda"
                                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                maxLength={100}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Komentar Anda
                        </label>
                        <textarea
                            value={komentar}
                            onChange={(e) => setKomentar(e.target.value)}
                            placeholder="Tulis komentar Anda di sini..."
                            rows={4}
                            className="w-full px-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                            maxLength={1000}
                        />
                        <p className="text-xs text-[var(--text-secondary)] mt-1 text-right">
                            {komentar.length}/1000
                        </p>
                    </div>

                    {/* Message */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-3 rounded-xl flex items-center gap-2 text-sm ${message.type === "success"
                                        ? "bg-green-500/10 border border-green-500/30 text-green-400"
                                        : "bg-red-500/10 border border-red-500/30 text-red-400"
                                    }`}
                            >
                                {message.type === "success" ? (
                                    <CheckCircle className="w-4 h-4" />
                                ) : (
                                    <AlertCircle className="w-4 h-4" />
                                )}
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Kirim Komentar
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-3 opacity-50" />
                        <p className="text-[var(--text-secondary)]">Belum ada komentar. Jadilah yang pertama!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {comments.map((comment, index) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="p-4 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-500">
                                            {comment.nama.charAt(0).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-[var(--text-primary)]">
                                                {comment.nama}
                                            </span>
                                            <span className="text-xs text-[var(--text-secondary)]">
                                                • {formatDate(comment.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-secondary)] text-sm leading-relaxed whitespace-pre-wrap">
                                            {comment.komentar}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

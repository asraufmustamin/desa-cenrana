"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Vote, Plus, Trash2, Edit2, BarChart3, Users, Clock,
    Save, X, RefreshCw, Loader2, Eye, MessageSquare
} from "lucide-react";

interface PollOption {
    id: number;
    text: string;
    votes?: number;
    percentage?: number;
}

interface Poll {
    id: number;
    question: string;
    options: PollOption[];
    is_active: boolean;
    end_date: string | null;
    created_at: string;
    totalVotes?: number;
}

interface OtherVote {
    id: number;
    other_text: string;
    voted_at: string;
}

export default function PollingTab() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showOtherVotes, setShowOtherVotes] = useState<number | null>(null);
    const [otherVotes, setOtherVotes] = useState<OtherVote[]>([]);

    // Form state
    const [newQuestion, setNewQuestion] = useState("");
    const [newOptions, setNewOptions] = useState(["", "", "", "Lainnya"]);
    const [newEndDate, setNewEndDate] = useState("");

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/polling/admin");
            if (res.ok) {
                const data = await res.json();
                setPolls(data.polls || []);
            }
        } catch (error) {
            console.error("Error fetching polls:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOtherVotes = async (pollId: number) => {
        try {
            const res = await fetch(`/api/polling/admin?pollId=${pollId}&others=true`);
            if (res.ok) {
                const data = await res.json();
                setOtherVotes(data.otherVotes || []);
                setShowOtherVotes(pollId);
            }
        } catch (error) {
            console.error("Error fetching other votes:", error);
        }
    };

    const createPoll = async () => {
        if (!newQuestion.trim() || newOptions.filter(o => o.trim()).length < 2) {
            alert("Isi pertanyaan dan minimal 2 opsi!");
            return;
        }

        setIsSubmitting(true);
        try {
            const options = newOptions
                .filter(o => o.trim())
                .map((text, i) => ({ id: i + 1, text: text.trim() }));

            const res = await fetch("/api/polling/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: newQuestion.trim(),
                    options,
                    end_date: newEndDate || null
                })
            });

            if (res.ok) {
                setShowCreateForm(false);
                setNewQuestion("");
                setNewOptions(["", "", "", "Lainnya"]);
                setNewEndDate("");
                fetchPolls();
            }
        } catch (error) {
            console.error("Error creating poll:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePollActive = async (pollId: number, isActive: boolean) => {
        try {
            await fetch("/api/polling/admin", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pollId, is_active: !isActive })
            });
            fetchPolls();
        } catch (error) {
            console.error("Error toggling poll:", error);
        }
    };

    const deletePoll = async (pollId: number) => {
        if (!confirm("Hapus polling ini beserta semua vote-nya?")) return;
        try {
            await fetch("/api/polling/admin", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pollId })
            });
            fetchPolls();
        } catch (error) {
            console.error("Error deleting poll:", error);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("id-ID", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Vote className="w-6 h-6 text-blue-400" />
                        Manajemen Polling
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">Buat dan kelola polling warga</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchPolls}
                        className="px-3 py-2 bg-white/5 border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Polling
                    </button>
                </div>
            </div>

            {/* Create Form Modal */}
            <AnimatePresence>
                {showCreateForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCreateForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-[var(--text-primary)]">Buat Polling Baru</h3>
                                <button onClick={() => setShowCreateForm(false)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Pertanyaan</label>
                                    <input
                                        type="text"
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        placeholder="Contoh: Program apa yang paling dibutuhkan?"
                                        className="w-full px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Opsi Jawaban</label>
                                    <div className="space-y-2">
                                        {newOptions.map((opt, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => {
                                                        const updated = [...newOptions];
                                                        updated[i] = e.target.value;
                                                        setNewOptions(updated);
                                                    }}
                                                    placeholder={`Opsi ${i + 1}`}
                                                    className="flex-1 px-3 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:border-blue-500 outline-none"
                                                />
                                                {i > 1 && (
                                                    <button
                                                        onClick={() => setNewOptions(newOptions.filter((_, j) => j !== i))}
                                                        className="px-2 text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {newOptions.length < 6 && (
                                            <button
                                                onClick={() => setNewOptions([...newOptions, ""])}
                                                className="text-sm text-blue-400 hover:text-blue-300"
                                            >
                                                + Tambah opsi
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tanggal Berakhir (Opsional)</label>
                                    <input
                                        type="date"
                                        value={newEndDate}
                                        onChange={(e) => setNewEndDate(e.target.value)}
                                        className="w-full px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <button
                                    onClick={createPoll}
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Simpan Polling
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Other Votes Modal */}
            <AnimatePresence>
                {showOtherVotes && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowOtherVotes(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 w-full max-w-md max-h-[70vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-purple-400" />
                                    Saran "Lainnya"
                                </h3>
                                <button onClick={() => setShowOtherVotes(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {otherVotes.length === 0 ? (
                                <p className="text-center text-[var(--text-secondary)] py-4">Belum ada saran</p>
                            ) : (
                                <div className="space-y-3">
                                    {otherVotes.map(vote => (
                                        <div key={vote.id} className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-[var(--text-primary)]">"{vote.other_text}"</p>
                                            <p className="text-xs text-[var(--text-secondary)] mt-1">{formatDate(vote.voted_at)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Polls List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
            ) : polls.length === 0 ? (
                <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                    <Vote className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">Belum ada polling</p>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium"
                    >
                        Buat Polling Pertama
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {polls.map(poll => (
                        <motion.div
                            key={poll.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-5"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${poll.is_active
                                                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                                                : "bg-gray-500/10 text-gray-400 border border-gray-500/30"
                                            }`}>
                                            {poll.is_active ? "Aktif" : "Nonaktif"}
                                        </span>
                                        {poll.end_date && (
                                            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Berakhir: {formatDate(poll.end_date)}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-[var(--text-primary)]">{poll.question}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => togglePollActive(poll.id, poll.is_active)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium ${poll.is_active
                                                ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                                                : "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                            }`}
                                    >
                                        {poll.is_active ? "Nonaktifkan" : "Aktifkan"}
                                    </button>
                                    <button
                                        onClick={() => deletePoll(poll.id)}
                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Options with results */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                                {(poll.options as PollOption[]).map(opt => (
                                    <div key={opt.id} className="p-3 bg-white/5 rounded-lg">
                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{opt.text}</p>
                                        <p className="text-lg font-bold text-blue-400">{opt.votes || 0} <span className="text-xs font-normal text-[var(--text-secondary)]">suara</span></p>
                                        <div className="w-full h-1 bg-white/10 rounded-full mt-1">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${opt.percentage || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                                    <Users className="w-4 h-4" />
                                    <span>{poll.totalVotes || 0} total suara</span>
                                </div>
                                <button
                                    onClick={() => fetchOtherVotes(poll.id)}
                                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                >
                                    <Eye className="w-4 h-4" />
                                    Lihat saran "Lainnya"
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}

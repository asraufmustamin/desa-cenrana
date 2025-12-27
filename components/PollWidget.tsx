"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, Clock, Check, Vote, Send } from "lucide-react";

interface PollOption {
    id: number;
    text: string;
    votes: number;
    percentage: number;
}

interface Poll {
    id: number;
    question: string;
    options: PollOption[];
    totalVotes: number;
    is_active: boolean;
    end_date: string | null;
}

export default function PollWidget() {
    const [poll, setPoll] = useState<Poll | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [otherText, setOtherText] = useState("");
    const [hasVoted, setHasVoted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchPoll();
    }, []);

    const getVoterId = (): string => {
        if (typeof window === "undefined") return "";
        let voterId = localStorage.getItem("poll_voter_id");
        if (!voterId) {
            voterId = "voter_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("poll_voter_id", voterId);
        }
        return voterId;
    };

    const fetchPoll = async () => {
        try {
            const res = await fetch("/api/polling");
            const data = await res.json();
            setPoll(data.poll);

            if (data.poll) {
                const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "[]");
                if (votedPolls.includes(data.poll.id)) {
                    setHasVoted(true);
                }
            }
        } catch (error) {
            console.error("Error fetching poll:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const submitVote = async () => {
        if (!poll || selectedOption === null) return;

        // Check if "Lainnya" selected but no text
        const isOther = poll.options.find(o => o.id === selectedOption)?.text.toLowerCase() === "lainnya";
        if (isOther && !otherText.trim()) {
            setMessage("❌ Silakan isi saran Anda untuk pilihan 'Lainnya'");
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/polling", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pollId: poll.id,
                    optionId: selectedOption,
                    voterId: getVoterId(),
                    otherText: isOther ? otherText.trim() : undefined
                })
            });

            const data = await res.json();

            if (res.ok) {
                setHasVoted(true);
                setMessage("✅ " + data.message);
                const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "[]");
                votedPolls.push(poll.id);
                localStorage.setItem("voted_polls", JSON.stringify(votedPolls));
                fetchPoll();
            } else {
                setMessage("❌ " + data.error);
            }
        } catch (error) {
            setMessage("❌ Gagal mengirim suara");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatTimeRemaining = (endDate: string): string => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end.getTime() - now.getTime();
        if (diff <= 0) return "Berakhir";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0) return `${days} hari lagi`;
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (hours > 0) return `${hours} jam lagi`;
        return "Segera berakhir";
    };

    // Check if selected option is "Lainnya"
    const isOtherSelected = poll?.options.find(o => o.id === selectedOption)?.text.toLowerCase() === "lainnya";

    if (isLoading) {
        return (
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-500/20">
                <div className="animate-pulse flex items-center gap-4">
                    <div className="h-10 w-10 bg-white/10 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/10 rounded w-1/3"></div>
                        <div className="h-3 bg-white/10 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!poll) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl p-4 md:p-5 border border-blue-500/20 relative overflow-hidden"
        >
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                        <Vote className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-[var(--text-primary)] text-sm md:text-base">Polling Warga</h3>
                            {poll.end_date && (
                                <span className="text-xs text-[var(--text-secondary)] bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatTimeRemaining(poll.end_date)}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-[var(--text-primary)] font-medium mt-0.5 line-clamp-2">{poll.question}</p>
                    </div>
                </div>

                {/* Stats (shown after voting) */}
                {hasVoted && (
                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-white/5 px-3 py-1.5 rounded-lg">
                        <Users className="w-4 h-4" />
                        <span>{poll.totalVotes} suara</span>
                    </div>
                )}
            </div>

            {/* Horizontal Options Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {poll.options.map((option) => (
                    <motion.button
                        key={option.id}
                        onClick={() => !hasVoted && setSelectedOption(option.id)}
                        disabled={hasVoted}
                        whileHover={!hasVoted ? { scale: 1.02 } : {}}
                        whileTap={!hasVoted ? { scale: 0.98 } : {}}
                        className={`relative p-3 rounded-xl border transition-all text-left overflow-hidden ${hasVoted
                            ? "bg-white/5 border-[var(--border-color)] cursor-default"
                            : selectedOption === option.id
                                ? "bg-blue-500/20 border-blue-500/50 ring-1 ring-blue-500/30"
                                : "bg-white/5 border-[var(--border-color)] hover:border-blue-500/30"
                            }`}
                    >
                        {/* Progress bar background - show for selected option OR after voting */}
                        {(hasVoted || selectedOption === option.id) && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${option.percentage}%` }}
                                transition={{ duration: 0.3 }}
                                className={`absolute inset-y-0 left-0 ${hasVoted
                                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10"
                                    : "bg-blue-500/10"
                                    }`}
                            />
                        )}

                        <div className="relative flex items-center gap-2">
                            {/* Radio/Check */}
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedOption === option.id
                                ? hasVoted
                                    ? "bg-blue-500 border-blue-500"
                                    : "border-blue-500 bg-blue-500/20"
                                : "border-[var(--border-color)]"
                                }`}>
                                {selectedOption === option.id && hasVoted && (
                                    <Check className="w-2.5 h-2.5 text-white" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className="text-xs md:text-sm font-medium text-[var(--text-primary)] block truncate">
                                    {option.text}
                                </span>
                                {/* Show percentage: always for voted, or for selected option before voting */}
                                {(hasVoted || selectedOption === option.id) && (
                                    <span className="text-xs text-blue-400 font-bold">{option.percentage}%</span>
                                )}
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Other Text Input (shown when "Lainnya" is selected) */}
            <AnimatePresence>
                {isOtherSelected && !hasVoted && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-3"
                    >
                        <input
                            type="text"
                            value={otherText}
                            onChange={(e) => setOtherText(e.target.value)}
                            placeholder="Tulis saran Anda di sini..."
                            className="w-full px-4 py-2.5 bg-white/5 border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none transition-all"
                            maxLength={100}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Vote Button or Status */}
            {hasVoted ? (
                <div className="text-center text-xs text-green-400 font-medium py-1">
                    ✓ Terima kasih! Suara Anda sudah tercatat
                </div>
            ) : (
                <button
                    onClick={submitVote}
                    disabled={selectedOption === null || isSubmitting}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Mengirim...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Kirim Suara
                        </>
                    )}
                </button>
            )}

            {/* Message */}
            <AnimatePresence>
                {message && (
                    <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-2 text-xs text-center text-[var(--text-secondary)]"
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

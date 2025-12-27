"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Users, Clock, Check, Vote, ChevronRight } from "lucide-react";

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

            // Check if user already voted
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

        setIsSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch("/api/polling", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pollId: poll.id,
                    optionId: selectedOption,
                    voterId: getVoterId()
                })
            });

            const data = await res.json();

            if (res.ok) {
                setHasVoted(true);
                setMessage("✅ " + data.message);

                // Save voted poll to localStorage
                const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "[]");
                votedPolls.push(poll.id);
                localStorage.setItem("voted_polls", JSON.stringify(votedPolls));

                // Refresh poll data
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
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) return `${days} hari lagi`;
        if (hours > 0) return `${hours} jam lagi`;
        return "Segera berakhir";
    };

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
                <div className="animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-12 bg-white/10 rounded"></div>
                        <div className="h-12 bg-white/10 rounded"></div>
                        <div className="h-12 bg-white/10 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!poll) {
        return null; // No active poll
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Vote className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-[var(--text-primary)]">Polling Warga</h3>
                        <p className="text-xs text-[var(--text-secondary)]">Suaramu penting!</p>
                    </div>
                </div>
                {poll.end_date && (
                    <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] bg-white/5 px-3 py-1 rounded-full">
                        <Clock className="w-3 h-3" />
                        {formatTimeRemaining(poll.end_date)}
                    </div>
                )}
            </div>

            {/* Question */}
            <p className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                {poll.question}
            </p>

            {/* Options */}
            <div className="space-y-3">
                {poll.options.map((option) => (
                    <motion.button
                        key={option.id}
                        onClick={() => !hasVoted && setSelectedOption(option.id)}
                        disabled={hasVoted}
                        whileHover={!hasVoted ? { scale: 1.01 } : {}}
                        whileTap={!hasVoted ? { scale: 0.99 } : {}}
                        className={`w-full p-4 rounded-xl border transition-all relative overflow-hidden text-left ${hasVoted
                                ? "bg-white/5 border-[var(--border-color)] cursor-default"
                                : selectedOption === option.id
                                    ? "bg-blue-500/20 border-blue-500/50"
                                    : "bg-white/5 border-[var(--border-color)] hover:border-blue-500/30"
                            }`}
                    >
                        {/* Progress bar (shown after voting) */}
                        {hasVoted && (
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${option.percentage}%` }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                            />
                        )}

                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Radio button / Check */}
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${hasVoted && selectedOption === option.id
                                        ? "bg-blue-500 border-blue-500"
                                        : selectedOption === option.id
                                            ? "border-blue-500 bg-blue-500/20"
                                            : "border-[var(--border-color)]"
                                    }`}>
                                    {(hasVoted && selectedOption === option.id) && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </div>
                                <span className="font-medium text-[var(--text-primary)]">{option.text}</span>
                            </div>

                            {/* Vote count & percentage */}
                            {hasVoted && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-[var(--text-secondary)]">{option.votes} suara</span>
                                    <span className="font-bold text-blue-400">{option.percentage}%</span>
                                </div>
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Vote button or stats */}
            <div className="mt-4">
                {hasVoted ? (
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <Users className="w-4 h-4" />
                            <span>{poll.totalVotes} warga sudah memilih</span>
                        </div>
                        <span className="text-green-400 font-medium">✓ Anda sudah voting</span>
                    </div>
                ) : (
                    <button
                        onClick={submitVote}
                        disabled={selectedOption === null || isSubmitting}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-sm hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Mengirim...
                            </>
                        ) : (
                            <>
                                <BarChart3 className="w-4 h-4" />
                                Kirim Suara
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Message */}
            <AnimatePresence>
                {message && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-sm text-center text-[var(--text-secondary)]"
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

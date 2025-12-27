"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ClipboardList, Users, Clock, CheckCircle, XCircle,
    Search, Download, Loader2, Phone, MapPin, RefreshCw,
    Play, Check
} from "lucide-react";

interface Guest {
    id: number;
    nama: string;
    nik?: string;
    no_hp?: string;
    alamat?: string;
    tujuan: string;
    keperluan?: string;
    waktu_datang: string;
    waktu_selesai?: string;
    status: string;
    catatan_admin?: string;
}

interface Stats {
    waiting: number;
    serving: number;
    completed: number;
    total: number;
}

const TUJUAN_LABELS: Record<string, string> = {
    "mengurus_surat": "Mengurus Surat",
    "bertemu_kades": "Bertemu Kades",
    "bertemu_sekdes": "Bertemu Sekdes",
    "konsultasi": "Konsultasi",
    "pengaduan": "Pengaduan",
    "undangan": "Undangan/Rapat",
    "survey": "Survey",
    "kunjungan_dinas": "Kunjungan Dinas",
    "lainnya": "Lainnya",
};

const STATUS_CONFIG = {
    menunggu: { label: "Menunggu", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30", icon: Clock },
    dilayani: { label: "Dilayani", color: "bg-blue-500/10 text-blue-500 border-blue-500/30", icon: Play },
    selesai: { label: "Selesai", color: "bg-green-500/10 text-green-500 border-green-500/30", icon: CheckCircle },
};

export default function BukuTamuTab() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [stats, setStats] = useState<Stats>({ waiting: 0, serving: 0, completed: 0, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showAllDates, setShowAllDates] = useState(false);

    useEffect(() => {
        fetchGuests();
    }, [showAllDates]);

    const fetchGuests = async () => {
        setIsLoading(true);
        try {
            const url = showAllDates ? "/api/buku-tamu?all=true" : "/api/buku-tamu";
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setGuests(data.guests || []);
                setStats(data.stats || { waiting: 0, serving: 0, completed: 0, total: 0 });
            }
        } catch (error) {
            console.error("Failed to fetch guests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (guestId: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/buku-tamu/${guestId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchGuests();
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const deleteGuest = async (guestId: number) => {
        if (!confirm("Hapus data tamu ini?")) return;
        try {
            const res = await fetch(`/api/buku-tamu/${guestId}`, { method: "DELETE" });
            if (res.ok) {
                fetchGuests();
            }
        } catch (error) {
            console.error("Failed to delete guest:", error);
        }
    };

    const exportToExcel = () => {
        // Simple CSV export
        const headers = ["No", "Tanggal", "Waktu", "Nama", "NIK", "No HP", "Tujuan", "Keperluan", "Status"];
        const rows = guests.map((g, i) => [
            i + 1,
            new Date(g.waktu_datang).toLocaleDateString("id-ID"),
            new Date(g.waktu_datang).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
            g.nama,
            g.nik || "-",
            g.no_hp || "-",
            TUJUAN_LABELS[g.tujuan] || g.tujuan,
            g.keperluan || "-",
            STATUS_CONFIG[g.status as keyof typeof STATUS_CONFIG]?.label || g.status
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Buku_Tamu_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    };

    const filteredGuests = guests.filter(g => {
        const matchSearch = g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (g.no_hp && g.no_hp.includes(searchQuery));
        const matchStatus = filterStatus === "all" || g.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-emerald-400" />
                        Buku Tamu Digital
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">Kelola daftar tamu kantor desa</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchGuests}
                        className="px-3 py-2 bg-white/5 border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] hover:bg-white/10 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={exportToExcel}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-yellow-500">Menunggu</span>
                    </div>
                    <p className="text-3xl font-bold text-yellow-500">{stats.waiting}</p>
                </div>
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Play className="w-5 h-5 text-blue-500" />
                        <span className="text-sm text-blue-500">Dilayani</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-500">{stats.serving}</p>
                </div>
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-500">Selesai</span>
                    </div>
                    <p className="text-3xl font-bold text-green-500">{stats.completed}</p>
                </div>
                <div className="p-4 bg-white/5 border border-[var(--border-color)] rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-[var(--text-secondary)]" />
                        <span className="text-sm text-[var(--text-secondary)]">Total Hari Ini</span>
                    </div>
                    <p className="text-3xl font-bold text-[var(--text-primary)]">{stats.total}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                    <input
                        type="text"
                        placeholder="Cari nama atau no HP..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                >
                    <option value="all">Semua Status</option>
                    <option value="menunggu">Menunggu</option>
                    <option value="dilayani">Dilayani</option>
                    <option value="selesai">Selesai</option>
                </select>
                <label className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showAllDates}
                        onChange={(e) => setShowAllDates(e.target.checked)}
                        className="w-4 h-4 accent-emerald-500"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">Tampilkan semua tanggal</span>
                </label>
            </div>

            {/* Guest List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
            ) : filteredGuests.length === 0 ? (
                <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                    <ClipboardList className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">Belum ada tamu terdaftar</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filteredGuests.map((guest, index) => {
                            const statusConfig = STATUS_CONFIG[guest.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.menunggu;
                            const StatusIcon = statusConfig.icon;

                            return (
                                <motion.div
                                    key={guest.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            {/* Queue Number */}
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-lg font-bold text-emerald-400">{index + 1}</span>
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-[var(--text-primary)]">{guest.nama}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                                                        <StatusIcon className="w-3 h-3 inline mr-1" />
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-emerald-400 font-medium mb-1">
                                                    {TUJUAN_LABELS[guest.tujuan] || guest.tujuan}
                                                </p>
                                                <div className="flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                                                    <span>{formatDate(guest.waktu_datang)} • {formatTime(guest.waktu_datang)}</span>
                                                    {guest.no_hp && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            {guest.no_hp}
                                                        </span>
                                                    )}
                                                </div>
                                                {guest.keperluan && (
                                                    <p className="text-sm text-[var(--text-secondary)] mt-1 italic">"{guest.keperluan}"</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 ml-16 md:ml-0">
                                            {guest.status === "menunggu" && (
                                                <button
                                                    onClick={() => updateStatus(guest.id, "dilayani")}
                                                    className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-1"
                                                >
                                                    <Play className="w-3 h-3" />
                                                    Layani
                                                </button>
                                            )}
                                            {guest.status === "dilayani" && (
                                                <button
                                                    onClick={() => updateStatus(guest.id, "selesai")}
                                                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Selesai
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteGuest(guest.id)}
                                                className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

"use client";

import React from "react";
import { useAppContext, KepalaDesaStatus } from "@/context/AppContext";
import { motion } from "framer-motion";
import { Settings, UserCheck, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

const statusOptions: { value: KepalaDesaStatus; label: string; description: string; color: string; icon: React.ReactNode }[] = [
    {
        value: 'di_kantor',
        label: 'Di Kantor',
        description: 'Kepala Desa sedang berada di kantor dan siap melayani',
        color: '#10B981',
        icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
        value: 'rapat',
        label: 'Sedang Rapat',
        description: 'Kepala Desa sedang dalam rapat atau pertemuan',
        color: '#F59E0B',
        icon: <Clock className="w-6 h-6" />
    },
    {
        value: 'tidak_hadir',
        label: 'Tidak di Kantor',
        description: 'Kepala Desa sedang tidak berada di kantor (dinas luar/cuti)',
        color: '#EF4444',
        icon: <AlertCircle className="w-6 h-6" />
    },
];

export default function AdminSettingsPage() {
    const { kepalaDesaStatus, setKepalaDesaStatus, isLoggedIn } = useAppContext();
    const [saving, setSaving] = React.useState(false);

    const handleStatusChange = async (newStatus: KepalaDesaStatus) => {
        setSaving(true);
        try {
            await setKepalaDesaStatus(newStatus);
        } catch (error) {
            console.error('Error updating status:', error);
        }
        setSaving(false);
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Akses Ditolak</h1>
                    <p className="text-[var(--text-secondary)] mb-4">Silakan login sebagai admin untuk mengakses halaman ini.</p>
                    <Link href="/admin/login" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                        Login Admin
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 px-4" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-8 h-8 text-cyan-500" />
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Pengaturan Status</h1>
                    </div>
                    <p className="text-[var(--text-secondary)]">Kelola status kehadiran Kepala Desa yang akan ditampilkan di halaman utama</p>
                </motion.div>

                {/* Current Status Display */}
                <motion.div
                    className="p-6 mb-8 rounded-2xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        Status Kehadiran Kepala Desa
                    </h2>

                    <div className="space-y-3">
                        {statusOptions.map((option) => {
                            const isSelected = kepalaDesaStatus === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleStatusChange(option.value)}
                                    disabled={saving}
                                    className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center gap-4 ${isSelected
                                        ? 'border-current'
                                        : 'border-[var(--border-color)] hover:border-slate-400'
                                        } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    style={{
                                        borderColor: isSelected ? option.color : undefined,
                                        backgroundColor: isSelected ? `${option.color}15` : 'var(--bg-panel)',
                                        color: isSelected ? option.color : 'var(--text-primary)'
                                    }}
                                >
                                    {/* Radio indicator */}
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'border-current' : 'border-[var(--text-secondary)]'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: option.color }}
                                            />
                                        )}
                                    </div>

                                    {/* Icon */}
                                    <div
                                        className="p-2 rounded-lg shrink-0"
                                        style={{
                                            backgroundColor: `${option.color}20`,
                                            color: option.color
                                        }}
                                    >
                                        {option.icon}
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold">
                                            {option.label}
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                                            {option.description}
                                        </p>
                                    </div>

                                    {/* Status indicator */}
                                    {isSelected && (
                                        <span className="text-xs font-medium px-2 py-1 rounded-full shrink-0" style={{ backgroundColor: `${option.color}20` }}>
                                            Aktif
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Info Box */}
                <motion.div
                    className="p-6 border-l-4 border-cyan-500 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-[var(--text-primary)] font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-500" />
                        Informasi
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm">
                        Status ini akan ditampilkan pada badge di halaman utama website. Warna badge akan berubah sesuai status:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            <span className="text-[var(--text-primary)]">Hijau = Di Kantor</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                            <span className="text-[var(--text-primary)]">Kuning = Sedang Rapat</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            <span className="text-[var(--text-primary)]">Merah = Tidak di Kantor</span>
                        </li>
                    </ul>
                </motion.div>

                {/* Back Link */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link href="/admin" className="text-cyan-500 font-medium hover:underline">
                        ← Kembali ke Dashboard Admin
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

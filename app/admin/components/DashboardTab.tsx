"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

interface DashboardTabProps {
    newsCount: number;
    aspirasiCount: number;
    activeLapakCount: number;
    pendingAspirasiCount: number;
    pendingLapakCount: number;
    isEditMode: boolean;
}

/**
 * DashboardTab Component
 * Menampilkan statistik overview untuk admin dashboard
 */
export default function DashboardTab({
    newsCount,
    aspirasiCount,
    activeLapakCount,
    pendingAspirasiCount,
    pendingLapakCount,
    isEditMode,
}: DashboardTabProps) {
    const router = useRouter();

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Total Berita */}
                <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-cyan-500">
                    <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Total Berita</h3>
                    <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{newsCount}</p>
                </div>

                {/* Total Aspirasi */}
                <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-blue-500">
                    <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Total Aspirasi</h3>
                    <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{aspirasiCount}</p>
                </div>

                {/* Lapak Aktif */}
                <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-emerald-500">
                    <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Lapak Aktif</h3>
                    <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{activeLapakCount}</p>
                </div>

                {/* Menunggu (Aspirasi) */}
                <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-amber-500">
                    <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Menunggu (Aspirasi)</h3>
                    <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{pendingAspirasiCount}</p>
                </div>

                {/* Menunggu (Produk) */}
                <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-purple-500">
                    <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Menunggu (Produk)</h3>
                    <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{pendingLapakCount}</p>
                </div>

                {/* Mode CMS */}
                <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-pink-500">
                    <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Mode CMS</h3>
                    <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">{isEditMode ? "AKTIF ✓" : "NON-AKTIF"}</p>
                </div>

                {/* Layanan Surat Card */}
                <div
                    onClick={() => router.push('/admin/surat')}
                    className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-indigo-500 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg hover:shadow-indigo-500/20"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Layanan Surat</h3>
                            <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Kelola Request</p>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                            <FileText className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

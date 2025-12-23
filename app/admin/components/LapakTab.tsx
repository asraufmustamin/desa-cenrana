"use client";

import { useState } from "react";
import {
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    Trash2,
    Eye,
    MessageSquare,
    Star,
    Trophy
} from "lucide-react";

// Types
interface LapakItem {
    id: number;
    title: string;
    seller: string;
    price: string;
    image: string;
    description: string;
    category: string;
    status: string;
    view_count?: number;
    wa_click_count?: number;
}

interface LapakTabProps {
    lapak: LapakItem[];
    pendingLapak: LapakItem[];
    approveLapak: (id: number) => void;
    rejectLapak: (id: number) => void;
    onDeleteLapak: (id: number) => void;
}

/**
 * LapakTab Component
 * Mengelola produk lapak warga (pending, active, analytics)
 */
export default function LapakTab({
    lapak,
    pendingLapak,
    approveLapak,
    rejectLapak,
    onDeleteLapak,
}: LapakTabProps) {
    const [lapakSubTab, setLapakSubTab] = useState<"management" | "analytics">("management");

    const activeProducts = lapak.filter(p => p.status === "Active");
    const totalViews = activeProducts.reduce((sum, p) => sum + (p.view_count || 0), 0);
    const totalClicks = activeProducts.reduce((sum, p) => sum + (p.wa_click_count || 0), 0);
    const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

    return (
        <div className="glass-panel rounded-[2rem] p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                    <ShoppingBag className="w-7 h-7 text-emerald-500" />
                    Kelola Lapak Warga
                </h2>
                <div className="flex gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)]">
                    <button
                        onClick={() => setLapakSubTab("management")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${lapakSubTab === "management"
                            ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        📋 Kelola Produk
                    </button>
                    <button
                        onClick={() => setLapakSubTab("analytics")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${lapakSubTab === "analytics"
                            ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg"
                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            }`}
                    >
                        📊 Analitik
                    </button>
                </div>
            </div>

            {/* MANAGEMENT TAB */}
            {lapakSubTab === "management" && (
                <div className="space-y-6 animate-fade-in">
                    {/* Pending Products */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Menunggu Persetujuan
                                {pendingLapak.length > 0 && (
                                    <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                                        {pendingLapak.length}
                                    </span>
                                )}
                            </h3>
                        </div>

                        {pendingLapak.length === 0 ? (
                            <p className="text-amber-700 dark:text-amber-300 text-sm text-center py-4">
                                ✅ Tidak ada permintaan produk baru
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
                                {pendingLapak.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-amber-200 dark:border-amber-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                                        style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both` }}
                                    >
                                        <div className="flex gap-3">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.title}</h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-300">{item.seller} • {item.price}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => approveLapak(item.id)}
                                                className="flex-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <CheckCircle className="w-3 h-3" />
                                                Setuju
                                            </button>
                                            <button
                                                onClick={() => rejectLapak(item.id)}
                                                className="flex-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                                            >
                                                <XCircle className="w-3 h-3" />
                                                Tolak
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Products Grid */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                Produk Aktif ({activeProducts.length})
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
                            {activeProducts.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                                    style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
                                >
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 mb-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                        <button
                                            onClick={() => onDeleteLapak(item.id)}
                                            className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <h4 className="font-bold text-[var(--text-primary)] text-xs truncate">{item.title}</h4>
                                    <p className="text-[10px] text-[var(--text-secondary)] truncate">{item.seller}</p>
                                    <p className="text-xs font-bold text-emerald-500 mt-1">{item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ANALYTICS TAB */}
            {lapakSubTab === "analytics" && (
                <div className="space-y-6 animate-fade-in">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-blue-100 text-xs font-bold mb-1">Total Views</p>
                                    <p className="text-2xl sm:text-3xl font-bold">{totalViews}</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-emerald-100 text-xs font-bold mb-1">WA Clicks</p>
                                    <p className="text-2xl sm:text-3xl font-bold">{totalClicks}</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-violet-100 text-xs font-bold mb-1">Conversion</p>
                                    <p className="text-2xl sm:text-3xl font-bold">{conversionRate}%</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg">
                                    <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Products Table */}
                    <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                        <div className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Trophy className="w-5 h-5" />
                                Top 10 Produk Paling Dilihat
                            </h3>
                        </div>
                        <div className="overflow-x-auto max-h-[400px]">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-gray-100 dark:bg-gray-900 border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="text-left py-2 px-4 text-gray-600 dark:text-gray-400 font-bold text-xs">#</th>
                                        <th className="text-left py-2 px-4 text-gray-600 dark:text-gray-400 font-bold text-xs">Produk</th>
                                        <th className="text-center py-2 px-4 text-gray-600 dark:text-gray-400 font-bold text-xs">Views</th>
                                        <th className="text-center py-2 px-4 text-gray-600 dark:text-gray-400 font-bold text-xs">Clicks</th>
                                        <th className="text-center py-2 px-4 text-gray-600 dark:text-gray-400 font-bold text-xs">Conv.</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeProducts
                                        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                                        .slice(0, 10)
                                        .map((product, index) => (
                                            <tr
                                                key={product.id}
                                                className="border-b border-[var(--border-color)] hover:bg-[var(--bg-panel)] transition-colors"
                                                style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both` }}
                                            >
                                                <td className="py-3 px-4">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {index + 1}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-xs" style={{ color: 'var(--text-primary, #ffffff)' }}>{product.title}</p>
                                                            <p className="text-[10px]" style={{ color: 'var(--text-secondary, #e5e7eb)' }}>{product.category}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-bold text-xs">
                                                        {product.view_count || 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold text-xs">
                                                        {product.wa_click_count || 0}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <span className="px-2 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-lg font-bold text-xs">
                                                        {product.view_count ? ((product.wa_click_count || 0) / product.view_count * 100).toFixed(1) : '0.0'}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            {activeProducts.length === 0 && (
                                <p className="text-center py-8 text-[var(--text-secondary)] text-sm">Belum ada produk aktif.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

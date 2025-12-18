"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Clock, CheckCircle2, XCircle, FileText, Download } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function TrackingPage() {
    const [trackingId, setTrackingId] = useState("");
    const [result, setResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId) return;

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            const { data, error } = await supabase
                .from('surat_requests')
                .select(`
                    *,
                    surat_types ( nama, icon )
                `)
                .eq('tracking_id', trackingId)
                .single();

            if (error || !data) {
                setError("Data tidak ditemukan. Periksa kembali Kode Resi Anda.");
            } else {
                setResult(data);
            }
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'text-amber-500 bg-amber-50 border-amber-200';
            case 'Diproses': return 'text-blue-500 bg-blue-50 border-blue-200';
            case 'Selesai': return 'text-green-500 bg-green-50 border-green-200';
            case 'Ditolak': return 'text-red-500 bg-red-50 border-red-200';
            default: return 'text-gray-500 bg-gray-50 border-gray-200';
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        switch (status) {
            case 'Pending': return <Clock className="w-5 h-5" />;
            case 'Diproses': return <Loader2 className="w-5 h-5 animate-spin" />;
            case 'Selesai': return <CheckCircle2 className="w-5 h-5" />;
            case 'Ditolak': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    // Helper for loading icon since it wasn't defined in the switch scope
    const Loader2 = ({ className }: { className?: string }) => (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
    );


    return (
        <div className="min-h-screen pt-28 pb-20 px-4 flex flex-col items-center bg-slate-50 dark:bg-[var(--bg-primary)]">
            <div className="w-full max-w-lg">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Lacak Permohonan</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Pantau status surat Anda dengan memasukkan Kode Resi.
                    </p>
                </div>

                {/* Search Box */}
                <form onSubmit={handleSearch} className="relative mb-10 group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            placeholder="Contoh: REQ-88291"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-lg font-mono font-bold tracking-wider text-slate-900 dark:text-white focus:border-blue-500 outline-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-all uppercase"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !trackingId}
                            className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                        </button>
                    </div>
                </form>

                {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-center font-medium">
                        {error}
                    </motion.div>
                )}

                {/* Result Card */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            {/* Header Status */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${getStatusColor(result.status)}`}>
                                        <StatusIcon status={result.status} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status Saat Ini</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">{result.status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400">Updated</p>
                                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {new Date(result.updated_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Jenis Layanan</p>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                        <p className="font-semibold text-slate-900 dark:text-white">{result.surat_types?.nama}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Pemohon</p>
                                    <p className="font-semibold text-slate-900 dark:text-white">{result.nama}</p>
                                    <p className="font-mono text-sm text-slate-500">{result.nik}</p>
                                </div>
                                {result.nomor_surat && (
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Nomor Surat</p>
                                        <p className="font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 inline-block px-2 py-1 rounded">
                                            {result.nomor_surat}
                                        </p>
                                    </div>
                                )}
                                {result.keterangan && (
                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs font-bold text-slate-500 mb-1">Catatan Admin:</p>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 italic">"{result.keterangan}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Download Button if Ready */}
                            {result.status === 'Selesai' && result.file_pdf_url && (
                                <Link
                                    href={result.file_pdf_url}
                                    target="_blank"
                                    className="block w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-center transition-colors shadow-lg shadow-green-500/20"
                                >
                                    <Download className="w-5 h-5 inline mr-2" /> Download Surat PDF
                                </Link>
                            )}

                            {result.status === 'Selesai' && !result.file_pdf_url && (
                                <div className="text-center p-4 bg-green-50 text-green-700 rounded-xl text-sm">
                                    Surat sudah jadi. Silakan ambil di Kantor Desa dengan membawa bukti resi ini.
                                </div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

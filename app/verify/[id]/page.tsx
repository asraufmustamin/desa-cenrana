"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, ShieldCheck, Loader2, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrapping params for Next.js 15+ compatibility
    const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        params.then(setUnwrappedParams);
    }, [params]);

    useEffect(() => {
        if (unwrappedParams?.id) {
            checkCertificate(unwrappedParams.id);
        }
    }, [unwrappedParams]);

    const checkCertificate = async (id: string) => {
        try {
            const { data: request, error } = await supabase
                .from('surat_requests')
                .select(`*, surat_types(nama)`)
                .eq('tracking_id', id)
                .single();

            if (error || !request) throw new Error("Not Found");

            setData(request);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 px-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Verifikasi Dokumen Elektronik</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Pemerintah Desa Cenrana</p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    {error ? (
                        <div className="p-8 text-center">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-red-600 mb-2">Dokumen Tidak Valid</h2>
                            <p className="text-slate-500 mb-6">QR Code tidak dikenali atau dokumen tidak ditemukan dalam database kami.</p>
                            <Link href="/" className="px-6 py-2 bg-slate-100 rounded-lg text-slate-700 font-bold hover:bg-slate-200 transition-colors">
                                Kembali ke Beranda
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <div className="bg-emerald-500 p-6 text-center text-white">
                                <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
                                <h2 className="text-2xl font-bold">Dokumen Asli / Valid</h2>
                                <p className="opacity-90 text-sm">Tercatat di Database Desa Cenrana</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Nomor Surat</p>
                                    <p className="text-lg font-mono font-bold text-slate-900 dark:text-white break-all">
                                        {data.nomor_surat || "Belum Terbit"}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <DetailRow label="Jenis Surat" value={data.surat_types?.nama} />
                                    <DetailRow label="Nama Pemohon" value={data.nama} />
                                    <DetailRow label="NIK" value={data.nik.replace(/(\d{6})\d{6}(\d{4})/, "$1******$2")} />
                                    <DetailRow label="Tanggal Terbit" value={new Date(data.updated_at).toLocaleDateString("id-ID", { dateStyle: 'full' })} />
                                </div>

                                {/* Visualisasi Tanda Tangan */}
                                <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-blue-100 text-blue-600 px-3 py-1 rounded-bl-xl text-xs font-bold">
                                        AUTHORIZED
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Tanda Tangan Pejabat</p>

                                    <div className="relative w-48 h-24 mx-auto flex items-center justify-center">
                                        {/* Tanda Tangan */}
                                        <img
                                            src="/ttd_kades.png"
                                            alt="Tanda Tangan Kepala Desa"
                                            className="absolute z-10 w-32 h-auto"
                                            style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.1))" }}
                                        />
                                        {/* Stempel Overlap */}
                                        <img
                                            src="/stempel_desa.png"
                                            alt="Stempel Desa"
                                            className="absolute z-0 w-28 h-28 opacity-100 translate-x-4 -translate-y-1"
                                            style={{ mixBlendMode: "multiply" }}
                                        />
                                    </div>

                                    <div className="mt-2">
                                        <h3 className="font-bold text-slate-900 dark:text-white">A. SYAFRUDDIN</h3>
                                        <p className="text-xs text-slate-500">Kepala Desa Cenrana</p>
                                    </div>
                                </div>

                                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-700 text-center">
                                    <p className="text-xs text-slate-400">
                                        Dokumen ini sah dan dikeluarkan secara resmi oleh Pemerintah Desa Cenrana, Kabupaten Maros.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center mt-8">
                    <Link href="/layanan/surat" className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium">
                        Ajukan Surat Lainnya <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 last:border-0 pb-2 last:pb-0">
            <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white text-right max-w-[60%]">{value}</span>
        </div>
    );
}

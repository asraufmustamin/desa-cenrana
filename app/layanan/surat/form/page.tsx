"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Send, CheckCircle2, User, FileText, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function SuratFormContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const typeId = searchParams.get('type');
    const encodedNik = searchParams.get('nik');

    // State
    const [suratType, setSuratType] = useState<any>(null);
    const [penduduk, setPenduduk] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [files, setFiles] = useState<Record<string, File | null>>({});
    const [submissionSuccess, setSubmissionSuccess] = useState<{ trackingId: string } | null>(null);

    useEffect(() => {
        if (typeId && encodedNik) {
            fetchData();
        } else {
            router.push('/layanan/surat');
        }
    }, [typeId, encodedNik]);

    const fetchData = async () => {
        try {
            const nik = atob(encodedNik!); // Decode NIK

            // 1. Fetch Resident Data
            const { data: pendudukData, error: pendudukError } = await supabase
                .from('penduduk')
                .select('*')
                .eq('nik', nik)
                .single();

            if (pendudukError) throw pendudukError;
            setPenduduk(pendudukData);

            // 2. Fetch Surat Type Data
            const { data: suratData, error: suratError } = await supabase
                .from('surat_types')
                .select('*')
                .eq('id', typeId)
                .single();

            if (suratError) throw suratError;
            setSuratType(suratData);

        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Gagal memuat data. Silakan coba lagi.");
            router.push('/layanan/surat');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (label: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [label]: e.target.files![0] }));
        }
    };

    const uploadFile = async (file: File, path: string) => {
        const { data, error } = await supabase.storage
            .from('lampiran_surat')
            .upload(path, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('lampiran_surat')
            .getPublicUrl(path);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Upload Files
            const uploadedUrls = [];
            for (const [key, file] of Object.entries(files)) {
                if (file) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}_${penduduk.nik}_${key.replace(/\s+/g, '_')}.${fileExt}`;
                    const url = await uploadFile(file, fileName);
                    uploadedUrls.push({ label: key, url: url });
                }
            }

            // 2. Generate Tracking ID
            const trackingId = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;

            // 3. Insert Request
            const { error } = await supabase.from('surat_requests').insert({
                tracking_id: trackingId,
                nik: penduduk.nik,
                nama: penduduk.nama,
                jenis_surat_id: suratType.id,
                status: 'Pending',
                data: formData,
                lampiran: uploadedUrls
            });

            if (error) throw error;

            setSubmissionSuccess({ trackingId });
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error: any) {
            console.error("Submission error:", error);
            alert(`Gagal mengirim permohonan: ${error.message || 'Terjadi kesalahan'}. \n\nPastikan bucket 'lampiran_surat' sudah dibuat di Supabase Storage.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (submissionSuccess) {
        return (
            <div className="min-h-screen pt-28 pb-20 px-4">
                <div className="max-w-xl mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Permohonan Berhasil!</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        Permohonan surat Anda telah kami terima dan sedang diverifikasi oleh petugas.
                    </p>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
                        <p className="text-sm text-slate-500 uppercase tracking-widest mb-2">Kode Resi (Tracking ID)</p>
                        <p className="text-4xl font-mono font-bold text-blue-600 tracking-wider mb-2">{submissionSuccess.trackingId}</p>
                        <p className="text-xs text-slate-400">Simpan kode ini untuk mengecek status permohonan.</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href="/layanan/check" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">
                            Lacak Status
                        </Link>
                        <Link href="/layanan/surat" className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold transition-colors">
                            Kembali ke Menu Layanan
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-slate-50 dark:bg-[var(--bg-primary)]">
            <div className="max-w-3xl mx-auto">
                <Link href="/layanan/surat" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-500 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-white">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{suratType.nama}</h1>
                        <p className="text-white/80">{suratType.deskripsi}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Section 1: Data Pemohon (Auto-filled) */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                <User className="w-5 h-5 text-blue-500" />
                                Data Pemohon (Otomatis)
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                                <div>
                                    <label className="text-xs text-slate-500 uppercase">NIK</label>
                                    <p className="font-mono font-medium text-slate-900 dark:text-slate-200">{penduduk.nik}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase">Nama Lengkap</label>
                                    <p className="font-medium text-slate-900 dark:text-slate-200">{penduduk.nama}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase">Dusun</label>
                                    <p className="font-medium text-slate-900 dark:text-slate-200">{penduduk.dusun}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 uppercase">Pekerjaan</label>
                                    <p className="font-medium text-slate-900 dark:text-slate-200">{penduduk.pekerjaan || "-"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Form Isian (Dynamic) */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                <FileText className="w-5 h-5 text-blue-500" />
                                Detail Surat
                            </h2>

                            {suratType.fields?.map((field: any, index: number) => (
                                <div key={index}>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            required={field.required}
                                            placeholder={field.placeholder}
                                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            required={field.required}
                                            placeholder={field.placeholder}
                                            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none transition-all"
                                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Section 3: Upload Persyaratan */}
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                <Upload className="w-5 h-5 text-blue-500" />
                                Dokumen Persyaratan
                            </h2>

                            {suratType.syarat?.map((syarat: string, index: number) => (
                                <div key={index} className="p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="font-medium text-slate-700 dark:text-slate-300">{syarat} <span className="text-red-500">*</span></label>
                                        {files[syarat] && <span className="text-xs text-green-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Terpilih</span>}
                                    </div>
                                    <input
                                        type="file"
                                        required
                                        accept="image/*,application/pdf"
                                        onChange={(e) => handleFileChange(syarat, e)}
                                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Mengirim Data...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-6 h-6" />
                                        Ajukan Permohonan
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function SuratFormPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        }>
            <SuratFormContent />
        </Suspense>
    );
}

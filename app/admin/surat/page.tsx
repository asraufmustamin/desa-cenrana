"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import {
    LayoutDashboard, FileText, CheckCircle, XCircle, Clock,
    Search, Filter, ChevronLeft, Calendar, User, Eye, Download, Printer, Send
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSuratPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");

    // Modal State
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

    // Process Form
    const [adminNote, setAdminNote] = useState("");
    const [nomorSurat, setNomorSurat] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('surat_requests')
                .select(`
                    *,
                    surat_types ( nama, kode )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcess = (request: any) => {
        setSelectedRequest(request);
        setNomorSurat(request.nomor_surat || "");
        setAdminNote(request.keterangan || "");
        setIsProcessModalOpen(true);
    };

    const submitProcess = async (status: 'Selesai' | 'Ditolak') => {
        if (!selectedRequest) return;
        setIsProcessing(true);

        try {
            const updatePayload: any = {
                status: status,
                keterangan: adminNote,
                updated_at: new Date().toISOString()
            };

            if (status === 'Selesai') {
                if (!nomorSurat) {
                    alert("Nomor Surat wajib diisi untuk status Selesai!");
                    setIsProcessing(false);
                    return;
                }
                updatePayload.nomor_surat = nomorSurat;
            }

            const { error } = await supabase
                .from('surat_requests')
                .update(updatePayload)
                .eq('id', selectedRequest.id);

            if (error) throw error;

            if (error) throw error;

            alert(`Permohonan berhasil ${status === 'Selesai' ? 'disetujui' : 'ditolak'}`);

            // UPDATE LOCAL STATE IMMEDIATELY so buttons appear
            setSelectedRequest((prev: any) => ({
                ...prev,
                status: status,
                nomor_surat: status === 'Selesai' ? nomorSurat : prev.nomor_surat,
                keterangan: adminNote
            }));

            // Refresh list in background
            fetchRequests();

            // Don't close modal immediately if approved, so they can print
            if (status !== 'Selesai') {
                setIsProcessModalOpen(false);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const generatePDF = async (request: any, action: 'download' | 'preview' = 'download', signatureMode: 'basah' | 'digital' = 'basah') => {
        try {
            const doc = new jsPDF();

            // ... (Kode PDF Generation sama seperti sebelumnya) ...
            // 1. Kop Surat (Sederhana)
            doc.setFontSize(14);
            doc.setFont("times", "bold");
            doc.text("PEMERINTAH KABUPATEN MAROS", 105, 20, { align: "center" });
            doc.text("KECAMATAN CENRANA", 105, 28, { align: "center" });
            doc.setFontSize(16);
            doc.text("DESA CENRANA", 105, 36, { align: "center" });
            doc.setFontSize(10);
            doc.setFont("times", "normal");
            doc.text("Jl. Poros Cenrana, Kecamatan Cenrana, Kabupaten Maros", 105, 42, { align: "center" });
            doc.setLineWidth(1);
            doc.line(20, 46, 190, 46);

            // 2. Judul Surat
            doc.setFontSize(14);
            doc.setFont("times", "bold");
            doc.text(request.surat_types.nama.toUpperCase(), 105, 60, { align: "center" });
            doc.setLineWidth(0.5);
            doc.line(65, 62, 145, 62); // Garis bawah judul
            doc.setFontSize(11);
            doc.setFont("times", "normal");
            doc.text(`Nomor: ${request.nomor_surat || "......./..../..../...."}`, 105, 68, { align: "center" });

            // 3. Isi Pembuka
            doc.setFontSize(12);
            doc.text("Yang bertanda tangan di bawah ini Kepala Desa Cenrana, Kecamatan Cenrana, Kabupaten Maros, menerangkan bahwa:", 20, 85, { maxWidth: 170, align: "justify" });

            let yPos = 100;
            const addField = (label: string, value: string) => {
                doc.text(label, 30, yPos);
                doc.text(":", 70, yPos);
                doc.text(value, 75, yPos);
                yPos += 8;
            };

            addField("Nama", request.nama);
            addField("NIK", request.nik);
            addField("Tempat/Tgl Lahir", "Ujung Pandang, 01-01-1990"); // Placeholder
            addField("Pekerjaan", "Wiraswasta");       // Placeholder
            addField("Alamat", "Desa Cenrana, Kec. Cenrana"); // Placeholder

            // 5. Data Khusus (Isi Surat)
            yPos += 5;
            doc.text("Benar namanaya tersebut di atas adalah warga Desa Cenrana yang mengajukan permohonan:", 20, yPos, { maxWidth: 170 });
            yPos += 10;

            // Render Dynamic Fields
            Object.entries(request.data).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    doc.text(`${key.replace(/_/g, " ")}`, 30, yPos);
                    doc.text(":", 70, yPos);
                    doc.text(value, 75, yPos);
                    yPos += 8;
                }
            });

            // 6. Penutup
            yPos += 10;
            doc.text("Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.", 20, yPos, { maxWidth: 170, align: "justify" });

            // 7. Tanda Tangan & Stempel (Digital Application)
            yPos += 15; // Jarak lebih rapat (30 -> 15)
            const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

            // Posisi Tanda Tangan (Center Axis)
            const signX = 165; // Geser kanan (148 -> 165) biar rata kanan
            const signY = yPos + 10;

            // Header Tanda Tangan (Centered)
            doc.text(`Cenrana, ${today}`, signX, yPos, { align: "center" });
            doc.text("Kepala Desa Cenrana", signX, yPos + 6, { align: "center" });

            if (signatureMode === 'basah') {
                // --- MODE BASAH: TTD Asli + Stempel, TANPA QR Code ---
                try {
                    const [ttdBase64, stempelBase64] = await Promise.all([
                        fetch('/ttd_kades.png').then(res => res.ok ? res.blob().then(blob => new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        })) : null),
                        fetch('/stempel_desa.png').then(res => res.ok ? res.blob().then(blob => new Promise<string>((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        })) : null)
                    ]);

                    // Render TTD & Stempel
                    if (ttdBase64) doc.addImage(ttdBase64, 'PNG', signX - 27, signY - 3, 54, 38);
                    if (stempelBase64) doc.addImage(stempelBase64, 'PNG', signX - 5, signY - 8, 50, 50);

                } catch (err) {
                    console.warn("Gagal render visual stempel/ttd:", err);
                }
            } else {
                // --- MODE DIGITAL: QR Code di posisi Tanda Tangan ---
                const qrData = `${window.location.origin}/verify/${request.tracking_id}`;
                const qrImage = await QRCode.toDataURL(qrData);

                // Render QR di tengah area tanda tangan (posisi signX, signY)
                // Ukuran 25x25 (cukup kompak)
                // Center alignment calculation: x = signX - (25/2) = signX - 12.5
                doc.addImage(qrImage, 'PNG', signX - 12.5, signY, 25, 25);

                doc.setFontSize(8);
                doc.text("Ditandatangani secara elektronik", signX, signY + 30, { align: "center" });
            }

            // Nama Terang
            doc.setFont("times", "bold");
            // Jarak nama (sesuaikan dengan mode)
            const nameY = signatureMode === 'basah' ? yPos + 45 : yPos + 50;
            doc.text("A. SYAFRUDDIN", signX, nameY, { align: "center" });
            doc.setFont("times", "normal");

            // Note: QR Code pojok kiri bawah DIHAPUS sesuai request

            if (action === 'download') {
                doc.save(`${request.tracking_id}_${request.surat_types.kode}.pdf`);
            } else {
                window.open(doc.output('bloburl'), '_blank');
            }

        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Gagal membuat PDF.");
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesSearch = req.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.nik.includes(searchQuery) ||
            req.tracking_id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "Semua" || req.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-600 border-amber-200';
            case 'Diproses': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'Selesai': return 'bg-green-100 text-green-600 border-green-200';
            case 'Ditolak': return 'bg-red-100 text-red-600 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 pt-24">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-20 z-30 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Link href="/admin" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-500" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Manajemen Surat
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Verifikasi dan kelola permohonan surat warga</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                            Total: {requests.length}
                        </div>
                        <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                            Pending: {requests.filter(r => r.status === 'Pending').length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, NIK, atau Kode Resi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {["Semua", "Pending", "Diproses", "Selesai", "Ditolak"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${filterStatus === status
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                        ))
                    ) : filteredRequests.length > 0 ? (
                        filteredRequests.map((req) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
                            >
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                        <span className="text-xs font-mono text-slate-400">
                                            {new Date(req.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">{req.nama}</h3>
                                    <p className="text-xs font-mono text-slate-500 mb-3 flex items-center gap-1">
                                        <User className="w-3 h-3" /> {req.nik}
                                    </p>

                                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 mb-4">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Jenis Surat</p>
                                        <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{req.surat_types?.nama}</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="font-mono bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded">{req.tracking_id}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                                    <button
                                        onClick={() => handleProcess(req)}
                                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" /> Detail & Proses
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-slate-400">
                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Tidak ada permohonan surat yang ditemukan</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Process Modal */}
            <AnimatePresence>
                {isProcessModalOpen && selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detail Permohonan</h2>
                                    <p className="text-sm text-slate-500 font-mono">{selectedRequest.tracking_id}</p>
                                </div>
                                <button onClick={() => setIsProcessModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                                    <XCircle className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Resident Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase">Nama Pemohon</label>
                                        <p className="font-semibold">{selectedRequest.nama}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase">NIK</label>
                                        <p className="font-mono">{selectedRequest.nik}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase">Jenis Surat</label>
                                        <p className="font-semibold text-blue-600">{selectedRequest.surat_types?.nama}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase">Tanggal Request</label>
                                        <p>{new Date(selectedRequest.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>

                                {/* Dynamic Data */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <h3 className="font-bold text-sm mb-3 text-slate-700 dark:text-slate-300">Isi Form Surat</h3>
                                    <div className="space-y-3">
                                        {Object.entries(selectedRequest.data || {}).map(([key, value]: any) => (
                                            <div key={key} className="flex flex-col sm:flex-row sm:justify-between border-b border-slate-200 dark:border-slate-700 pb-2 last:border-0">
                                                <span className="text-sm text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                                <span className="text-sm font-medium">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div>
                                    <h3 className="font-bold text-sm mb-3">Lampiran Dokumen</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(selectedRequest.lampiran as any[])?.map((file: any, index: number) => (
                                            <Link
                                                key={index}
                                                href={file.url}
                                                target="_blank"
                                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 transition-all group"
                                            >
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium truncate group-hover:text-blue-600">{file.label}</p>
                                                    <p className="text-xs text-slate-500">Klik untuk lihat</p>
                                                </div>
                                                <ExternalLinkIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                                            </Link>
                                        ))}
                                        {(!selectedRequest.lampiran || selectedRequest.lampiran.length === 0) && (
                                            <p className="text-sm text-slate-500 italic">Tidak ada lampiran.</p>
                                        )}
                                    </div>
                                </div>

                                <hr className="border-slate-200 dark:border-slate-700" />

                                {/* Admin Actions */}
                                <div>
                                    <h3 className="font-bold text-sm mb-4">Tindakan Admin</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Catatan / Keterangan</label>
                                            <textarea
                                                value={adminNote}
                                                onChange={(e) => setAdminNote(e.target.value)}
                                                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="Contoh: Dokumen kurang jelas / Surat siap diambil"
                                                rows={2}
                                            />
                                        </div>

                                        {/* Action Section - Full Width */}
                                        <div className="space-y-4">
                                            {/* Action Buttons Grid */}
                                            <div className="flex flex-col gap-4">

                                                {/* Top Row: Approve & Reject Logic */}
                                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                                                    <div className="flex flex-col sm:flex-row gap-3 items-end mb-4">
                                                        <div className="flex-1 w-full">
                                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nomor Surat (Wajib)</label>
                                                            <input
                                                                type="text"
                                                                value={nomorSurat}
                                                                onChange={(e) => setNomorSurat(e.target.value)}
                                                                placeholder="Contoh: 470/..."
                                                                className="w-full h-12 px-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none text-base"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => submitProcess('Selesai')}
                                                            disabled={isProcessing || !nomorSurat}
                                                            className="w-full sm:w-auto h-12 px-6 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                            Terbitkan
                                                        </button>
                                                    </div>

                                                    {/* Reject Button (Distinct & Larger) */}
                                                    <div>
                                                        <button
                                                            onClick={() => submitProcess('Ditolak')}
                                                            disabled={isProcessing || selectedRequest.status === 'Ditolak'}
                                                            className="w-full h-12 border-2 border-red-100 bg-white text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                            Tolak Permohonan
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Print Actions (Only if Approved) */}
                                                {selectedRequest.status === 'Selesai' && (
                                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

                                                        {/* Versi Cetak BASAH */}
                                                        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                                            <p className="text-xs font-bold text-slate-400 uppercase mb-3">Versi Cetak (Tanda Tangan Basah)</p>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <button
                                                                    onClick={() => generatePDF(selectedRequest, 'preview', 'basah')}
                                                                    className="h-12 rounded-lg border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                                                                >
                                                                    <Eye className="w-4 h-4" /> Preview
                                                                </button>
                                                                <button
                                                                    onClick={() => generatePDF(selectedRequest, 'download', 'basah')}
                                                                    className="h-12 rounded-lg bg-slate-800 text-white hover:bg-slate-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                                                                >
                                                                    <Printer className="w-4 h-4" /> Cetak
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Versi Cetak DIGITAL */}
                                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                                            <p className="text-xs font-bold text-blue-400 uppercase mb-3">Versi Digital (Barcode)</p>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <button
                                                                    onClick={() => generatePDF(selectedRequest, 'preview', 'digital')}
                                                                    className="h-12 rounded-lg border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-all flex items-center justify-center gap-2 text-sm font-bold"
                                                                >
                                                                    <Eye className="w-4 h-4" /> Preview
                                                                </button>
                                                                <button
                                                                    onClick={() => generatePDF(selectedRequest, 'download', 'digital')}
                                                                    className="h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm font-bold"
                                                                >
                                                                    <FileText className="w-4 h-4" /> Cetak Barcode
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Verifikasi Link */}
                                                        <Link
                                                            href={`/verify/${selectedRequest.tracking_id}`}
                                                            target="_blank"
                                                            className="block w-full py-2 text-center text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                                                        >
                                                            <CheckCircle className="w-3 h-3 inline mr-1" />
                                                            Cek Halaman Verifikasi
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Helper Icon
function ExternalLinkIcon({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
    )
}

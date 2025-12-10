"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { requestEmergencyDisclosure, getDisclosureHistory, getAccessLogs } from '@/lib/emergency-disclosure';
import { Shield, AlertTriangle, FileText, History, Lock } from 'lucide-react';

interface DisclosureResult {
    requestId: number;
    possibleNIKs: Array<{
        nik: string;
        nama: string;
        dusun: string;
        probability: number;
    }>;
    disclosedAt: Date;
}

export default function EmergencyDisclosurePage() {
    const { isLoggedIn } = useAppContext();
    const [activeTab, setActiveTab] = useState<'request' | 'history' | 'audit'>('request');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<DisclosureResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        ticketCode: '',
        requestReason: '',
        officialDocument: '',
        authorizedBy: '',
    });

    // Authorization check
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                        Access Denied
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Halaman ini hanya untuk Super Admin
                    </p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);
        setResult(null);

        try {
            // Get admin email from localStorage (fallback)
            const adminEmail = typeof window !== 'undefined'
                ? localStorage.getItem('adminEmail') || 'admin@desa.com'
                : 'admin@desa.com';

            const disclosureResult = await requestEmergencyDisclosure(
                {
                    ticketCode: formData.ticketCode,
                    requestedBy: adminEmail,
                    requestReason: formData.requestReason,
                    officialDocument: formData.officialDocument,
                    authorizedBy: formData.authorizedBy,
                },
                { email: adminEmail, role: 'super_admin' }
            );

            setResult(disclosureResult);

            // Reset form
            setFormData({
                ticketCode: '',
                requestReason: '',
                officialDocument: '',
                authorizedBy: '',
            });
        } catch (err: any) {
            setError(err.message || 'Failed to process disclosure request');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-10 h-10 text-red-500" />
                        <h1 className="text-4xl font-bold text-[var(--text-primary)]">
                            Sistem Pengungkapan Darurat
                        </h1>
                    </div>
                    <div className="glass-panel rounded-xl p-4 border-l-4 border-red-500">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-[var(--text-secondary)]">
                                <p className="font-bold text-red-500 mb-1">⚠️ KHUSUS SUPER ADMIN - AKSES TERBATAS</p>
                                <p>Sistem ini HANYA untuk kasus darurat (ancaman kekerasan, konten ilegal, permintaan pihak berwenang).</p>
                                <p className="mt-1">Semua akses tercatat dalam audit trail. Penyalahgunaan akan diproses secara hukum.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('request')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'request'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                            }`}
                    >
                        <FileText className="w-5 h-5 inline mr-2" />
                        Ajukan Pengungkapan
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'history'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                            }`}
                    >
                        <History className="w-5 h-5 inline mr-2" />
                        Riwayat Pengungkapan
                    </button>
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'audit'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                            }`}
                    >
                        <Shield className="w-5 h-5 inline mr-2" />
                        Jejak Audit
                    </button>
                </div>

                {/* Request Form Tab */}
                {activeTab === 'request' && (
                    <div className="glass-panel rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                            Ajukan Pengungkapan Identitas Darurat
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Ticket Code */}
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                    Kode Tiket Aspirasi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.ticketCode}
                                    onChange={(e) => setFormData({ ...formData, ticketCode: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-red-500 outline-none"
                                    placeholder="Contoh: TKT-ABC123"
                                />
                            </div>

                            {/* Request Reason */}
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                    Alasan Pengungkapan (minimal 50 karakter) <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    minLength={50}
                                    rows={4}
                                    value={formData.requestReason}
                                    onChange={(e) => setFormData({ ...formData, requestReason: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-red-500 outline-none resize-none"
                                    placeholder="Contoh: Laporan mengandung ancaman kekerasan serius terhadap warga desa..."
                                />
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    {formData.requestReason.length}/50 karakter (Wajib mengandung keyword: ancaman/kekerasan/ilegal/polisi/pengadilan)
                                </p>
                            </div>

                            {/* Official Document */}
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                    Nomor Surat Resmi
                                </label>
                                <input
                                    type="text"
                                    value={formData.officialDocument}
                                    onChange={(e) => setFormData({ ...formData, officialDocument: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="Contoh: Surat Kepolisian No. 001/2025"
                                />
                                <p className="text-xs text-[var(--text-secondary)] mt-1">
                                    Nomor surat dari Kepolisian/Pengadilan/Pejabat Berwenang
                                </p>
                            </div>

                            {/* Authorized By */}
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                    Disetujui Oleh <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.authorizedBy}
                                    onChange={(e) => setFormData({ ...formData, authorizedBy: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="Contoh: Kepala Desa / Kapolsek / Nama Pejabat"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Memproses...' : 'Ajukan Pengungkapan'}
                            </button>
                        </form>

                        {/* Error Display */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-500 font-bold">❌ Error: {error}</p>
                            </div>
                        )}

                        {/* Result Display */}
                        {result && (
                            <div className="mt-6 space-y-4">
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                                    <p className="text-emerald-500 font-bold">
                                        ✅ Disclosure Request #{result.requestId} Complete
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                                        Disclosed at: {new Date(result.disclosedAt).toLocaleString('id-ID')}
                                    </p>
                                </div>

                                <div className="glass-panel rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                                        Possible Reporter(s):
                                    </h3>

                                    {result.possibleNIKs.length === 0 ? (
                                        <p className="text-[var(--text-secondary)]">
                                            No matches found. Laporan mungkin sangat lama atau data tidak lengkap.
                                        </p>
                                    ) : (
                                        <div className="space-y-3">
                                            {result.possibleNIKs.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-bold text-[var(--text-primary)]">
                                                                {item.nama}
                                                            </p>
                                                            <p className="text-sm text-[var(--text-secondary)] font-mono">
                                                                NIK: {item.nik}
                                                            </p>
                                                            <p className="text-sm text-[var(--text-secondary)]">
                                                                Dusun: {item.dusun}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div
                                                                className={`px-3 py-1 rounded-full text-sm font-bold ${item.probability > 80
                                                                    ? 'bg-emerald-500/20 text-emerald-500'
                                                                    : item.probability > 50
                                                                        ? 'bg-yellow-500/20 text-yellow-500'
                                                                        : 'bg-red-500/20 text-red-500'
                                                                    }`}
                                                            >
                                                                {item.probability}% Probability
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="glass-panel rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                            Disclosure History
                        </h2>
                        <p className="text-[var(--text-secondary)]">
                            History of all disclosure requests (Coming in next update)
                        </p>
                    </div>
                )}

                {/* Audit Trail Tab */}
                {activeTab === 'audit' && (
                    <div className="glass-panel rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                            Audit Trail
                        </h2>
                        <p className="text-[var(--text-secondary)]">
                            Complete audit log of all access (Coming in next update)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

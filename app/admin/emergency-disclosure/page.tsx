"use client";

import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { requestEmergencyDisclosure, getDisclosureHistory, getAccessLogs, deleteDisclosureRequest, deleteAuditLog } from '@/lib/emergency-disclosure';
import { Shield, AlertTriangle, FileText, History, Lock, Trash2 } from 'lucide-react';

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
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [auditData, setAuditData] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [loadingAudit, setLoadingAudit] = useState(false);

    // Fetch history when tab changes
    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const data = await getDisclosureHistory();
            setHistoryData(data || []);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoadingHistory(false);
        }
    };

    // Fetch audit logs when tab changes
    const fetchAudit = async () => {
        setLoadingAudit(true);
        try {
            const data = await getAccessLogs();
            setAuditData(data || []);
        } catch (err) {
            console.error('Error fetching audit:', err);
        } finally {
            setLoadingAudit(false);
        }
    };

    // Fetch data when switching tabs
    const handleTabChange = (tab: 'request' | 'history' | 'audit') => {
        setActiveTab(tab);
        if (tab === 'history') fetchHistory();
        if (tab === 'audit') fetchAudit();
    };

    // Delete disclosure request
    const handleDeleteDisclosure = async (id: number) => {
        if (!confirm('Hapus riwayat pengungkapan ini?')) return;
        try {
            await deleteDisclosureRequest(id);
            fetchHistory(); // Refresh list
        } catch (err) {
            console.error('Error deleting disclosure:', err);
            alert('Gagal menghapus riwayat');
        }
    };

    // Delete audit log
    const handleDeleteAudit = async (id: number) => {
        if (!confirm('Hapus log audit ini?')) return;
        try {
            await deleteAuditLog(id);
            fetchAudit(); // Refresh list
        } catch (err) {
            console.error('Error deleting audit:', err);
            alert('Gagal menghapus log');
        }
    };

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
                        onClick={() => handleTabChange('request')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'request'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                            }`}
                    >
                        <FileText className="w-5 h-5 inline mr-2" />
                        Ajukan Pengungkapan
                    </button>
                    <button
                        onClick={() => handleTabChange('history')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'history'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                            }`}
                    >
                        <History className="w-5 h-5 inline mr-2" />
                        Riwayat Pengungkapan
                    </button>
                    <button
                        onClick={() => handleTabChange('audit')}
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
                            Riwayat Pengungkapan
                        </h2>
                        {loadingHistory ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-[var(--text-secondary)]">Memuat riwayat...</p>
                            </div>
                        ) : historyData.length === 0 ? (
                            <p className="text-[var(--text-secondary)] text-center py-8">
                                Belum ada riwayat pengungkapan.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {historyData.map((item, index) => (
                                    <div key={index} className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-mono font-bold text-red-500">Request #{item.id}</span>
                                            <span className="text-xs text-[var(--text-secondary)]">
                                                {new Date(item.created_at).toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mb-1">
                                            <strong>Tiket:</strong> {item.ticket_code}
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)] mb-1">
                                            <strong>Diminta oleh:</strong> {item.requested_by}
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)]">
                                            <strong>Alasan:</strong> {item.request_reason?.substring(0, 100)}...
                                        </p>
                                        {item.disclosed_niks && item.disclosed_niks.length > 0 && (
                                            <div className="mt-2 p-2 bg-emerald-500/10 rounded-lg">
                                                <p className="text-xs text-emerald-400 font-bold">NIK Terungkap: {item.disclosed_niks.join(', ')}</p>
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleDeleteDisclosure(item.id)}
                                            className="mt-3 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" /> Hapus
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Audit Trail Tab */}
                {activeTab === 'audit' && (
                    <div className="glass-panel rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                            Jejak Audit
                        </h2>
                        {loadingAudit ? (
                            <div className="text-center py-8">
                                <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-[var(--text-secondary)]">Memuat jejak audit...</p>
                            </div>
                        ) : auditData.length === 0 ? (
                            <p className="text-[var(--text-secondary)] text-center py-8">
                                Belum ada log audit.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {auditData.map((log, index) => (
                                    <div key={index} className="p-3 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                            <Shield className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-sm text-[var(--text-primary)]">{log.action}</span>
                                                <span className="text-xs text-[var(--text-secondary)]">
                                                    {new Date(log.created_at).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[var(--text-secondary)]">
                                                Oleh: {log.performed_by} | IP: {log.ip_address}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAudit(log.id)}
                                            className="px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

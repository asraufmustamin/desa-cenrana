
"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Search, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const AspirasiTracker = () => {
    const { getAspirasiByTicket } = useData();
    const [ticketId, setTicketId] = useState("");
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCheck = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        setTimeout(() => {
            const data = getAspirasiByTicket(ticketId);
            if (data) {
                setResult(data);
            } else {
                setError("Nomor Tiket tidak ditemukan. Mohon periksa kembali.");
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div id="tracking" className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-desa-dark mb-2">Cek Status Laporan</h2>
                <p className="text-gray-600">Masukkan Nomor Tiket (ID) yang Anda dapatkan saat mengirim laporan.</p>
            </div>

            <form onSubmit={handleCheck} className="max-w-md mx-auto mb-8">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Contoh: #ASP-8821"
                        value={ticketId}
                        onChange={(e) => setTicketId(e.target.value)}
                        className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-desa-green focus:border-desa-green outline-none text-lg"
                    />
                    <button
                        type="submit"
                        disabled={loading || !ticketId}
                        className="absolute right-2 p-2 bg-desa-green text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {loading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-desa-green border-t-transparent"></div>
                    <p className="mt-2 text-gray-500">Mencari data...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center text-red-700 max-w-md mx-auto animate-fade-in-up">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 max-w-lg mx-auto animate-fade-in-up">
                    <div className="flex justify-between items-start mb-4 border-b border-gray-200 pb-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Nomor Tiket</p>
                            <p className="text-xl font-bold text-desa-dark">{typeof result.id === 'object' ? JSON.stringify(result.id) : result.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Tanggal</p>
                            <p className="text-sm font-medium">{typeof result.date === 'object' ? JSON.stringify(result.date) : result.date}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Status Terkini</p>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${result.status === "Verified"
                            ? "bg-green-100 text-green-800"
                            : result.status === "Rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {result.status === "Verified" && <CheckCircle className="w-4 h-4 mr-2" />}
                            {result.status === "Pending" && <Clock className="w-4 h-4 mr-2" />}
                            {result.status === "Rejected" && <XCircle className="w-4 h-4 mr-2" />}
                            {result.status === "Verified" ? "Diverifikasi" : result.status === "Pending" ? "Menunggu Verifikasi" : "Ditolak"}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Detail Laporan</p>
                        <p className="text-gray-700 bg-white p-3 rounded-lg border border-gray-200 text-sm">
                            {typeof result.laporan === 'object' ? JSON.stringify(result.laporan) : result.laporan}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AspirasiTracker;

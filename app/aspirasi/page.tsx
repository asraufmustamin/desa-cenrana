
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Search, AlertCircle, CheckCircle, Clock, MessageSquare, History, Upload, X, Image as ImageIcon, Trash2, Shield } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

export default function Aspirasi() {
    const { addAspirasi, getAspirasiByTicket, aspirasi, deleteAspirasi, isEditMode } = useAppContext();
    const [activeTab, setActiveTab] = useState<"form" | "track" | "admin">("form");
    const [ticketId, setTicketId] = useState("");
    const [searchResult, setSearchResult] = useState<any>(null);
    const [myHistory, setMyHistory] = useState<string[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState({
        nama: "",
        nik: "",
        dusun: "Dusun 1",
        kategori: "Infrastruktur",
        laporan: "",
        image: "", // Store image URL or base64
    });

    const [nikError, setNikError] = useState("");

    // Load history from local storage on mount
    useEffect(() => {
        const history = localStorage.getItem("my_aspirasi_history");
        if (history) {
            setMyHistory(JSON.parse(history));
        }
    }, []);

    const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers
        if (!/^\d*$/.test(value)) return;

        setForm({ ...form, nik: value });

        if (value.length > 0 && value.length !== 16) {
            setNikError("NIK harus 16 digit angka.");
        } else {
            setNikError("");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setForm({ ...form, image: result });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setForm({ ...form, image: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (form.nik && form.nik.length !== 16) {
            setNikError("NIK wajib 16 digit.");
            return;
        }

        const newTicketId = addAspirasi(form);

        // Update local history
        const updatedHistory = [newTicketId, ...myHistory];
        setMyHistory(updatedHistory);
        localStorage.setItem("my_aspirasi_history", JSON.stringify(updatedHistory));

        alert(`Aspirasi berhasil dikirim! ID Tiket Anda: ${newTicketId}. Simpan ID ini untuk melacak status laporan Anda.`);
        setForm({ nama: "", nik: "", dusun: "Dusun 1", kategori: "Infrastruktur", laporan: "", image: "" });
        setImagePreview(null);
        setTicketId(newTicketId);
        setActiveTab("track");
        handleSearch(newTicketId); // Auto search the new ticket
    };

    const handleSearch = (idToSearch = ticketId) => {
        const result = getAspirasiByTicket(idToSearch);
        if (result) {
            setSearchResult(result);
            setTicketId(idToSearch); // Ensure input matches if called via history click
            setActiveTab("track");
        } else {
            setSearchResult(null);
            alert("ID Tiket tidak ditemukan.");
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 text-glow">Layanan Aspirasi</h1>
                    <p className="text-[var(--text-secondary)] text-lg">Sampaikan aspirasi, keluhan, dan saran Anda untuk kemajuan Desa Cenrana.</p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="glass-panel p-1 rounded-2xl inline-flex">
                        <button
                            onClick={() => setActiveTab("form")}
                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${activeTab === "form"
                                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Buat Laporan
                        </button>
                        <button
                            onClick={() => setActiveTab("track")}
                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${activeTab === "track"
                                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                }`}
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Lacak Status
                        </button>
                        {isEditMode && (
                            <button
                                onClick={() => setActiveTab("admin")}
                                className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center ${activeTab === "admin"
                                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Panel
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        <div className="glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

                            {activeTab === "form" ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Nama Lengkap</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.nama}
                                                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="Sesuai KTP"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">NIK (Opsional)</label>
                                            <input
                                                type="text"
                                                value={form.nik}
                                                onChange={handleNikChange}
                                                maxLength={16}
                                                className={`w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] focus:ring-1 outline-none transition-all ${nikError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[var(--border-color)] focus:border-blue-500 focus:ring-blue-500"
                                                    }`}
                                                placeholder="16 digit NIK"
                                            />
                                            {nikError && <p className="text-red-500 text-xs mt-1 font-bold">{nikError}</p>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Dusun</label>
                                            <select
                                                value={form.dusun}
                                                onChange={(e) => setForm({ ...form, dusun: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none transition-all"
                                            >
                                                <option className="bg-[var(--bg-panel)]">Dusun 1</option>
                                                <option className="bg-[var(--bg-panel)]">Dusun 2</option>
                                                <option className="bg-[var(--bg-panel)]">Dusun 3</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Kategori Laporan</label>
                                            <select
                                                value={form.kategori}
                                                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none transition-all"
                                            >
                                                <option className="bg-[var(--bg-panel)]">Infrastruktur</option>
                                                <option className="bg-[var(--bg-panel)]">Pelayanan Publik</option>
                                                <option className="bg-[var(--bg-panel)]">Keamanan</option>
                                                <option className="bg-[var(--bg-panel)]">Kesehatan</option>
                                                <option className="bg-[var(--bg-panel)]">Lainnya</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Isi Laporan</label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={form.laporan}
                                            onChange={(e) => setForm({ ...form, laporan: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Jelaskan detail laporan Anda secara rinci..."
                                        />
                                    </div>

                                    {/* Image Upload Dropzone */}
                                    <div>
                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Upload Bukti Foto (Opsional)</label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center ${imagePreview ? "border-blue-500 bg-blue-500/5" : "border-[var(--border-color)] hover:border-blue-500 hover:bg-[var(--bg-card)]"
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />

                                            {imagePreview ? (
                                                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeImage();
                                                        }}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full z-20 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-4">
                                                    <div className="p-3 bg-[var(--bg-panel)] rounded-full mb-3">
                                                        <ImageIcon className="w-6 h-6 text-[var(--text-secondary)]" />
                                                    </div>
                                                    <p className="text-sm font-bold text-[var(--text-primary)]">Klik atau tarik foto ke sini</p>
                                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Format: JPG, PNG (Max 5MB)</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!!nikError}
                                        className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center ${nikError
                                            ? "bg-gray-500 cursor-not-allowed opacity-50 text-white"
                                            : "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02]"
                                            }`}
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Kirim Laporan
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-8">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={ticketId}
                                            onChange={(e) => setTicketId(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-lg font-mono"
                                            placeholder="Masukkan ID Tiket (Contoh: ASP-001)"
                                        />
                                        <Search className="absolute left-4 top-4.5 text-[var(--text-secondary)] w-6 h-6" />
                                        <button
                                            onClick={() => handleSearch()}
                                            className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 transition-all"
                                        >
                                            Cari
                                        </button>
                                    </div>

                                    {searchResult ? (
                                        <div className="animate-fade-in-up">
                                            <div className="flex items-center justify-between mb-6">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Status Laporan</h3>
                                                    <p className="text-[var(--text-secondary)] font-mono">{searchResult.id}</p>
                                                </div>
                                                <div className={`px-4 py-2 rounded-full font-bold flex items-center ${searchResult.status === "Verified"
                                                    ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20"
                                                    : searchResult.status === "Rejected"
                                                        ? "bg-red-500/20 text-red-500 border border-red-500/20"
                                                        : "bg-amber-500/20 text-amber-500 border border-amber-500/20"
                                                    }`}>
                                                    {searchResult.status === "Verified" && <CheckCircle className="w-4 h-4 mr-2" />}
                                                    {searchResult.status === "Rejected" && <AlertCircle className="w-4 h-4 mr-2" />}
                                                    {searchResult.status === "Pending" && <Clock className="w-4 h-4 mr-2" />}
                                                    {searchResult.status}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                                                    <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Detail Laporan</h4>
                                                    <p className="text-[var(--text-primary)] leading-relaxed">{searchResult.laporan}</p>
                                                    <div className="mt-4 flex items-center text-sm text-[var(--text-secondary)]">
                                                        <span className="mr-4">Oleh: {searchResult.nama}</span>
                                                        <span>{searchResult.date}</span>
                                                    </div>
                                                </div>

                                                {searchResult.reply && (
                                                    <div className="bg-blue-500/10 p-6 rounded-2xl border border-blue-500/20">
                                                        <div className="flex items-center mb-3">
                                                            <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                                                            <h4 className="text-sm font-bold text-blue-500 uppercase tracking-wider">Tanggapan Admin</h4>
                                                        </div>
                                                        <p className="text-[var(--text-primary)] leading-relaxed">{searchResult.reply}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Search className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-20" />
                                            <p className="text-[var(--text-secondary)]">Masukkan ID tiket untuk melihat status laporan Anda.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "admin" && isEditMode && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">Semua Aspirasi Masuk</h3>
                                        <div className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-full font-bold text-sm">
                                            Total: {aspirasi.length} Laporan
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {aspirasi.length === 0 ? (
                                            <div className="text-center py-12 text-[var(--text-secondary)]">
                                                Belum ada data aspirasi.
                                            </div>
                                        ) : (
                                            aspirasi.map((item) => (
                                                <div key={item.id} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] relative group">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <span className="font-mono font-bold text-blue-500">{item.id}</span>
                                                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.status === "Verified" ? "bg-emerald-500/20 text-emerald-500" :
                                                                    item.status === "Rejected" ? "bg-red-500/20 text-red-500" :
                                                                        "bg-amber-500/20 text-amber-500"
                                                                    }`}>
                                                                    {item.status}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-bold text-[var(--text-primary)]">{item.nama} <span className="text-[var(--text-secondary)] font-normal text-sm">({item.dusun})</span></h4>
                                                        </div>
                                                        <div className="text-xs text-[var(--text-secondary)]">
                                                            {item.date}
                                                        </div>
                                                    </div>

                                                    <p className="text-[var(--text-secondary)] mb-4 line-clamp-3">{item.laporan}</p>

                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => {
                                                                if (confirm("Hapus laporan ini permanen?")) {
                                                                    deleteAspirasi(item.id);
                                                                }
                                                            }}
                                                            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-bold text-sm hover:bg-red-500 hover:text-white transition-colors flex items-center"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: My History */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel rounded-[2rem] p-6 h-full">
                            <div className="flex items-center mb-6">
                                <History className="w-5 h-5 text-[var(--text-primary)] mr-2" />
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">Riwayat Saya</h3>
                            </div>

                            {myHistory.length === 0 ? (
                                <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
                                    Belum ada riwayat laporan di perangkat ini.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myHistory.map((id) => {
                                        const item = getAspirasiByTicket(id);
                                        return (
                                            <button
                                                key={id}
                                                onClick={() => handleSearch(id)}
                                                className="w-full text-left p-4 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] border border-[var(--border-color)] transition-all group"
                                            >
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-mono font-bold text-blue-500 text-sm">{id}</span>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item?.status === "Verified" ? "bg-emerald-500/20 text-emerald-500" :
                                                        item?.status === "Rejected" ? "bg-red-500/20 text-red-500" :
                                                            "bg-amber-500/20 text-amber-500"
                                                        }`}>
                                                        {item?.status || "Unknown"}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-[var(--text-secondary)] line-clamp-1 group-hover:text-[var(--text-primary)]">
                                                    {item?.laporan || "Memuat..."}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import {
    LayoutDashboard,
    ShoppingBag,
    MessageSquare,
    LogOut,
    CheckCircle,
    XCircle,
    Clock,
    Reply,
    Send,
    Edit3,
    Eye,
    Newspaper,
    Trash2,
    Plus,
    Shield,
    Star,
    Search,
    AlertTriangle,
    Users
} from "lucide-react";

export default function AdminDashboard() {
    const {
        isLoggedIn,
        logout,
        news,
        addNews,
        deleteNews,
        lapak,
        approveLapak,
        rejectLapak,
        deleteLapak,
        aspirasi,
        verifyAspirasi,
        replyAspirasi,
        deleteAspirasi,
        isEditMode,
        toggleEditMode
    } = useAppContext();

    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [replyText, setReplyText] = useState("");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    // Search & Filter for Aspirasi
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("Semua");
    const [filterDusun, setFilterDusun] = useState<string>("Semua");

    // News form state
    const [newsForm, setNewsForm] = useState({
        title: "",
        excerpt: "",
        category: "Pengumuman",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"
    });

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/admin/login");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) return null;

    const pendingLapak = lapak.filter(item => item.status === "Pending");
    const pendingAspirasi = aspirasi.filter(item => item.status === "Pending");

    // Filtered Aspirasi based on search and filters
    const filteredAspirasi = aspirasi.filter(item => {
        // Search by ticket code, nama, or kategori
        const matchesSearch = searchQuery === "" ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.laporan.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by status
        const matchesStatus = filterStatus === "Semua" || item.status === filterStatus;

        // Filter by dusun
        const matchesDusun = filterDusun === "Semua" || item.dusun === filterDusun;

        return matchesSearch && matchesStatus && matchesDusun;
    });

    const handleReplySubmit = (id: string) => {
        if (replyText.trim()) {
            replyAspirasi(id, replyText);
            setReplyText("");
            setSelectedTicketId(null);
            alert("Tanggapan berhasil dikirim.");
        }
    };

    const handleAddNews = () => {
        if (!newsForm.title || !newsForm.excerpt) {
            alert("Harap isi semua field wajib.");
            return;
        }

        addNews({
            ...newsForm,
            date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
        });

        setNewsForm({
            title: "",
            excerpt: "",
            category: "Pengumuman",
            image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"
        });

        alert("Berita berhasil ditambahkan!");
    };

    const handleDeleteItem = (type: "news" | "lapak" | "aspirasi", id: number | string) => {
        if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
            if (type === "news") deleteNews(id as number);
            else if (type === "lapak") deleteLapak(id as number);
            else if (type === "aspirasi") deleteAspirasi(id as string);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero Banner for Admin */}
                <div className="relative rounded-[2.5rem] overflow-hidden mb-12 shadow-2xl animate-fade-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-violet-900"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-8 md:mb-0 text-center md:text-left">
                            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-bold mb-4">
                                Administrator Panel
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                Selamat Datang, Admin
                            </h1>
                            <p className="text-blue-200 text-lg max-w-xl">
                                Kelola konten website, aspirasi warga, dan lapak UMKM dari satu tempat yang terintegrasi.
                            </p>
                        </div>

                        {/* CMS Toggle Switch */}
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 flex flex-col items-center">
                            <span className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Mode Edit Website (CMS)</span>
                            <button
                                onClick={toggleEditMode}
                                className={`relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none ${isEditMode ? "bg-emerald-500" : "bg-slate-700"
                                    }`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${isEditMode ? "translate-x-10" : "translate-x-0"
                                        }`}
                                >
                                    {isEditMode ? <Edit3 className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4 text-slate-600" />}
                                </div>
                            </button>
                            <p className="text-white/60 text-xs mt-3 font-medium">
                                {isEditMode ? "Mode Edit AKTIF" : "Mode Edit NON-AKTIF"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-panel rounded-[2rem] p-6 sticky top-28">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("dashboard")}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === "dashboard"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    <LayoutDashboard className="w-5 h-5 mr-3" />
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setActiveTab("news")}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === "news"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    <Newspaper className="w-5 h-5 mr-3" />
                                    Kelola Berita
                                </button>
                                <button
                                    onClick={() => setActiveTab("lapak")}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === "lapak"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    <ShoppingBag className="w-5 h-5 mr-3" />
                                    Permintaan Produk
                                    {pendingLapak.length > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {pendingLapak.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("aspirasi")}
                                    className={`w-full flex items-center px-4 py-3 rounded-xl font-bold transition-all ${activeTab === "aspirasi"
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    <MessageSquare className="w-5 h-5 mr-3" />
                                    Aspirasi Warga
                                    {pendingAspirasi.length > 0 && (
                                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                            {pendingAspirasi.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => router.push('/admin/penduduk')}
                                    className="w-full flex items-center px-4 py-3 rounded-xl font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)] transition-all"
                                >
                                    <Users className="w-5 h-5 mr-3" />
                                    Data Penduduk
                                </button>
                                <button
                                    onClick={() => router.push('/admin/emergency-disclosure')}
                                    className="w-full flex items-center px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 border border-red-500/30 transition-all"
                                >
                                    <AlertTriangle className="w-5 h-5 mr-3" />
                                    <span className="flex-1 text-left">Emergency Disclosure</span>
                                    <Shield className="w-4 h-4" />
                                </button>
                                <div className="pt-6 mt-6 border-t border-[var(--border-color)]">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Logout
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === "dashboard" && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                                <div className="glass-card p-8 rounded-[2rem] border-l-4 border-cyan-500">
                                    <h3 className="text-[var(--text-secondary)] font-bold mb-2">Total Berita</h3>
                                    <p className="text-4xl font-bold text-[var(--text-primary)]">{news.length}</p>
                                </div>
                                <div className="glass-card p-8 rounded-[2rem] border-l-4 border-blue-500">
                                    <h3 className="text-[var(--text-secondary)] font-bold mb-2">Total Aspirasi</h3>
                                    <p className="text-4xl font-bold text-[var(--text-primary)]">{aspirasi.length}</p>
                                </div>
                                <div className="glass-card p-8 rounded-[2rem] border-l-4 border-emerald-500">
                                    <h3 className="text-[var(--text-secondary)] font-bold mb-2">Lapak Aktif</h3>
                                    <p className="text-4xl font-bold text-[var(--text-primary)]">{lapak.filter(l => l.status === "Active").length}</p>
                                </div>
                                <div className="glass-card p-8 rounded-[2rem] border-l-4 border-amber-500">
                                    <h3 className="text-[var(--text-secondary)] font-bold mb-2">Menunggu (Aspirasi)</h3>
                                    <p className="text-4xl font-bold text-[var(--text-primary)]">{pendingAspirasi.length}</p>
                                </div>
                                <div className="glass-card p-8 rounded-[2rem] border-l-4 border-purple-500">
                                    <h3 className="text-[var(--text-secondary)] font-bold mb-2">Menunggu (Produk)</h3>
                                    <p className="text-4xl font-bold text-[var(--text-primary)]">{pendingLapak.length}</p>
                                </div>
                                <div className="glass-card p-8 rounded-[2rem] border-l-4 border-pink-500">
                                    <h3 className="text-[var(--text-secondary)] font-bold mb-2">Mode CMS</h3>
                                    <p className="text-2xl font-bold text-[var(--text-primary)]">{isEditMode ? "AKTIF ✓" : "NON-AKTIF"}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "news" && (
                            <div className="glass-panel rounded-[2rem] p-8 animate-fade-in">
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Manajemen Berita</h2>

                                {/* Add News Form */}
                                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] mb-8">
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Tambah Berita Baru
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Judul</label>
                                            <input
                                                type="text"
                                                value={newsForm.title}
                                                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                                                placeholder="Judul berita..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Kategori</label>
                                            <select
                                                value={newsForm.category}
                                                onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                                            >
                                                <option>Pengumuman</option>
                                                <option>Kegiatan</option>
                                                <option>Pembangunan</option>
                                                <option>Lainnya</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Deskripsi</label>
                                            <textarea
                                                value={newsForm.excerpt}
                                                onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 min-h-[100px]"
                                                placeholder="Deskripsi berita..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">URL Gambar</label>
                                            <input
                                                type="text"
                                                value={newsForm.image}
                                                onChange={(e) => setNewsForm({ ...newsForm, image: e.target.value })}
                                                className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddNews}
                                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <Plus className="w-5 h-5 inline mr-2" />
                                            Tambah Berita
                                        </button>
                                    </div>
                                </div>

                                {/* News List */}
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Daftar Berita ({news.length})</h3>
                                <div className="space-y-4">
                                    {news.map((item) => (
                                        <div key={item.id} className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-[var(--text-primary)]">{item.title}</h4>
                                                    <p className="text-sm text-[var(--text-secondary)]">{item.date} • {item.category}</p>
                                                    <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{item.excerpt}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteItem("news", item.id)}
                                                className="ml-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "lapak" && (
                            <div className="glass-panel rounded-[2rem] p-8 animate-fade-in">
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Permintaan Produk Baru</h2>
                                {pendingLapak.length === 0 ? (
                                    <p className="text-[var(--text-secondary)] text-center py-8">Tidak ada permintaan produk baru.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingLapak.map((item) => (
                                            <div key={item.id} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                <div className="flex items-center space-x-4 flex-1">
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-[var(--text-primary)] text-lg">{item.title}</h3>
                                                        <p className="text-sm text-[var(--text-secondary)]">{item.seller} • {item.price}</p>
                                                        <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-md">{item.description}</p>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-3 w-full md:w-auto">
                                                    <button
                                                        onClick={() => approveLapak(item.id)}
                                                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg font-bold transition-colors flex items-center justify-center"
                                                    >
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Setuju
                                                    </button>
                                                    <button
                                                        onClick={() => rejectLapak(item.id)}
                                                        className="flex-1 md:flex-none px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-colors flex items-center justify-center"
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Tolak
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Active Lapak with Delete */}
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-12 mb-4">Produk Aktif</h3>
                                <div className="space-y-4">
                                    {lapak.filter(item => item.status === "Active").map((item) => (
                                        <div key={item.id} className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-color)] flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-[var(--text-primary)]">{item.title}</h4>
                                                    <p className="text-sm text-[var(--text-secondary)]">{item.seller} • {item.price}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteItem("lapak", item.id)}
                                                className="ml-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "aspirasi" && (
                            <div className="glass-panel rounded-[2rem] p-8 animate-fade-in">
                                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Aspirasi Warga</h2>

                                {/* Search & Filter Section */}
                                <div className="mb-6 space-y-4">
                                    {/* Search Bar */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari berdasarkan Kode Tiket, Nama, Kategori, atau Isi Laporan..."
                                            className="w-full px-4 py-3 pl-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-[var(--text-secondary)]" />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-3 top-3 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>

                                    {/* Filters */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {/* Status Filter */}
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
                                        >
                                            <option value="Semua" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Semua Status</option>
                                            <option value="Pending" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">⏳ Pending</option>
                                            <option value="Diproses" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">⚙️ Diproses</option>
                                            <option value="Selesai" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">✅ Selesai</option>
                                            <option value="Rejected" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">❌ Ditolak</option>
                                        </select>

                                        {/* Dusun Filter */}
                                        <select
                                            value={filterDusun}
                                            onChange={(e) => setFilterDusun(e.target.value)}
                                            className="px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all cursor-pointer font-medium"
                                        >
                                            <option value="Semua" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Semua Dusun</option>
                                            <option value="Benteng" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Benteng</option>
                                            <option value="Kajuara" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Kajuara</option>
                                            <option value="Tanatengnga" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Tanatengnga</option>
                                            <option value="Panagi" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Panagi</option>
                                            <option value="Holiang" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Holiang</option>
                                        </select>

                                        {/* Results Counter */}
                                        <div className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                                Menampilkan {filteredAspirasi.length} dari {aspirasi.length} aspirasi
                                            </span>
                                        </div>
                                    </div>

                                    {/* Quick Filter Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => { setFilterStatus("Pending"); setFilterDusun("Semua"); setSearchQuery(""); }}
                                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                                        >
                                            🔔 Pending ({pendingAspirasi.length})
                                        </button>
                                        <button
                                            onClick={() => { setFilterStatus("Selesai"); setFilterDusun("Semua"); setSearchQuery(""); }}
                                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                        >
                                            ✅ Selesai ({aspirasi.filter(a => a.status === "Selesai").length})
                                        </button>
                                        <button
                                            onClick={() => { setFilterStatus("Semua"); setFilterDusun("Semua"); setSearchQuery(""); }}
                                            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 transition-colors"
                                        >
                                            🔄 Reset Filter
                                        </button>
                                    </div>
                                </div>

                                {/* Aspirasi List */}
                                <div className="space-y-6">
                                    {filteredAspirasi.length === 0 ? (
                                        <div className="text-center py-12 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
                                            <Search className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-20" />
                                            <p className="text-[var(--text-secondary)] font-medium">
                                                {searchQuery || filterStatus !== "Semua" || filterDusun !== "Semua"
                                                    ? "Tidak ada aspirasi yang sesuai dengan filter"
                                                    : "Belum ada aspirasi masuk"}
                                            </p>
                                        </div>
                                    ) : (
                                        filteredAspirasi.map((item) => (
                                            <div key={item.id} className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)]">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-1">
                                                            <span className="font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded text-sm">{item.id}</span>
                                                            {item.is_anonymous && (
                                                                <span className="flex items-center text-xs px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-500">
                                                                    <Shield className="w-3 h-3 mr-1" /> Anonim
                                                                </span>
                                                            )}
                                                            <h3 className="font-bold text-[var(--text-primary)]">
                                                                {item.is_anonymous
                                                                    ? <span className="text-blue-500 flex items-center"><Shield className="w-4 h-4 mr-2" />Pelapor Anonim</span>
                                                                    : item.nama
                                                                }
                                                            </h3>
                                                        </div>
                                                        <p className="text-xs text-[var(--text-secondary)]">
                                                            {item.date} • {item.kategori} • {item.is_anonymous ? "Dusun Dirahasiakan" : item.dusun}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${item.status === "Selesai" ? "bg-emerald-500/20 text-emerald-500" :
                                                            item.status === "Diproses" ? "bg-blue-500/20 text-blue-500" :
                                                                item.status === "Rejected" ? "bg-red-500/20 text-red-500" :
                                                                    "bg-amber-500/20 text-amber-500"  // Pending
                                                            }`}>
                                                            {item.status === "Selesai" && <CheckCircle className="w-3 h-3 mr-1" />}
                                                            {item.status === "Diproses" && <Clock className="w-3 h-3 mr-1 text-blue-500" />}
                                                            {item.status === "Rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                                            {item.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                                                            {item.status}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteItem("aspirasi", item.id)}
                                                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-[var(--text-primary)] mb-4 leading-relaxed">{item.laporan}</p>

                                                {/* Display uploaded image if exists */}
                                                {item.image && (
                                                    <div className="mb-4 rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-panel)]">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={item.image}
                                                            alt="Foto Laporan"
                                                            className="w-full max-h-96 object-contain"
                                                        />
                                                    </div>
                                                )}


                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border-color)]">
                                                    {item.status === "Pending" && (
                                                        <>
                                                            <button
                                                                onClick={() => verifyAspirasi(item.id, "Diproses")}
                                                                className="px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-sm transition-colors flex items-center"
                                                            >
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Proses
                                                            </button>
                                                            <button
                                                                onClick={() => verifyAspirasi(item.id, "Rejected")}
                                                                className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold text-sm transition-colors"
                                                            >
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() => setSelectedTicketId(selectedTicketId === item.id ? null : item.id)}
                                                        className="px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-sm transition-colors flex items-center ml-auto"
                                                    >
                                                        <Reply className="w-4 h-4 mr-2" />
                                                        {item.reply ? "Edit Tanggapan" : "Beri Tanggapan"}
                                                    </button>
                                                </div>

                                                {/* Reply Section */}
                                                {(selectedTicketId === item.id || item.reply) && (
                                                    <div className={`mt-4 p-4 rounded-xl ${item.reply ? "bg-blue-500/5 border border-blue-500/10" : "bg-[var(--bg-panel)]"}`}>
                                                        {selectedTicketId === item.id ? (
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={replyText}
                                                                    onChange={(e) => setReplyText(e.target.value)}
                                                                    placeholder="Tulis tanggapan admin..."
                                                                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                                                                />
                                                                <button
                                                                    onClick={() => handleReplySubmit(item.id)}
                                                                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                                                                >
                                                                    <Send className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-start">
                                                                <div className="bg-blue-500/20 p-1.5 rounded-lg mr-3">
                                                                    <MessageSquare className="w-4 h-4 text-blue-500" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-blue-500 mb-1">Tanggapan Admin</p>
                                                                    <p className="text-sm text-[var(--text-primary)]">{item.reply}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Rating & Feedback Section - BELOW Reply */}
                                                {item.rating && (
                                                    <div className="mt-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl p-5 shadow-sm">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="text-base font-bold text-yellow-900 dark:text-yellow-200 flex items-center">
                                                                <div className="bg-yellow-400 dark:bg-yellow-600 p-2 rounded-xl mr-3">
                                                                    <Star className="w-5 h-5 fill-yellow-800 text-yellow-800 dark:fill-yellow-200 dark:text-yellow-200" />
                                                                </div>
                                                                Rating Kepuasan Warga
                                                            </h4>
                                                            <span className="px-4 py-1.5 bg-yellow-400 dark:bg-yellow-600 text-yellow-900 dark:text-yellow-100 rounded-full text-sm font-black shadow-sm">
                                                                {item.rating}/5
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mb-4">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-7 h-7 ${i < item.rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`}
                                                                />
                                                            ))}
                                                        </div>
                                                        {item.feedback_text && (
                                                            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                                                                <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 mb-2 uppercase tracking-wide">💬 Masukan Warga:</p>
                                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">&ldquo;{item.feedback_text}&rdquo;</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

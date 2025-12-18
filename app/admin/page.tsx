"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { motion } from "framer-motion";
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
    Trophy,
    Users,
    Megaphone,
    MessageCircle,
    ExternalLink,
    Copy,
    Phone,
    FileText
} from "lucide-react";

export default function AdminDashboard() {
    const {
        isLoggedIn,
        logout,
        news,
        addNews,
        deleteNews,
        updateNews,
        lapak,
        approveLapak,
        rejectLapak,
        deleteLapak,
        aspirasi,
        verifyAspirasi,
        replyAspirasi,
        deleteAspirasi,
        fetchPhotoById, // 🔥 For lazy loading photo
        isEditMode,
        toggleEditMode,
        cmsContent,
        addPengumuman,
        deletePengumuman,
        updatePengumuman,
        waSubscribers,
        deleteWASubscriber
    } = useAppContext();

    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [lapakSubTab, setLapakSubTab] = useState<"management" | "analytics">("management"); // NEW: Sub-tabs for Lapak
    const [replyText, setReplyText] = useState("");
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    // Search & Filter for Aspirasi
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("Semua");
    const [filterDusun, setFilterDusun] = useState<string>("Semua");

    // News form state - PROFESSIONAL
    const [newsSubTab, setNewsSubTab] = useState<"create" | "list">("list");
    const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
    const [newsImagePreview, setNewsImagePreview] = useState<string>("");
    const [newsSearchQuery, setNewsSearchQuery] = useState("");
    const [newsForm, setNewsForm] = useState({
        title: "",
        excerpt: "",
        content: "",
        category: "Pengumuman",
        author: "Admin Desa Cenrana",
        tags: "",
        status: "published" as "published" | "draft",
        date: new Date().toISOString().split('T')[0],
        image: ""
    });

    // 🔥 Photo Modal States
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [modalPhoto, setModalPhoto] = useState("");
    const [modalTicketCode, setModalTicketCode] = useState("");
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

    // Pengumuman Form State
    const [newPengumumanText, setNewPengumumanText] = useState("");
    const [editingPengumumanId, setEditingPengumumanId] = useState<number | null>(null);
    const [editPengumumanText, setEditPengumumanText] = useState("");

    // Broadcast WA State
    const [broadcastMessage, setBroadcastMessage] = useState("");
    const [broadcastSentIndex, setBroadcastSentIndex] = useState(0);
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    // Message Templates
    const messageTemplates = [
        {
            name: "📢 Pengumuman Umum",
            template: `🏘️ *PENGUMUMAN DESA CENRANA*

Assalamu'alaikum Wr. Wb.

Bapak/Ibu Warga Desa Cenrana yang terhormat,

Dengan hormat kami sampaikan bahwa:

[ISI PENGUMUMAN ANDA DI SINI]

Demikian informasi ini kami sampaikan. Mohon untuk disebarluaskan.

Wassalamu'alaikum Wr. Wb.

_Pemerintah Desa Cenrana_`
        },
        {
            name: "📅 Undangan Rapat/Kegiatan",
            template: `🏘️ *UNDANGAN KEGIATAN DESA*

Assalamu'alaikum Wr. Wb.

Kepada Yth. Warga Desa Cenrana,

Dengan hormat mengundang Bapak/Ibu untuk hadir pada:

📋 *Kegiatan:* [Nama Kegiatan]
📆 *Hari/Tanggal:* [Hari, Tanggal]
⏰ *Waktu:* [Jam] WITA
📍 *Tempat:* [Lokasi]

Kehadiran Bapak/Ibu sangat kami harapkan.

Wassalamu'alaikum Wr. Wb.

_Pemerintah Desa Cenrana_`
        },
        {
            name: "🏥 Info Kesehatan/Posyandu",
            template: `🏥 *INFO KESEHATAN DESA CENRANA*

Kepada Warga Desa Cenrana,

Diinformasikan bahwa akan dilaksanakan:

📋 *Kegiatan:* Posyandu Balita & Lansia
📆 *Tanggal:* [Tanggal]
⏰ *Waktu:* 08:00 - 12:00 WITA
📍 *Tempat:* [Lokasi Posyandu]

Mohon membawa:
✅ Buku KIA/KMS
✅ Kartu Identitas

Gratis untuk seluruh warga!

_Puskesmas & Pemerintah Desa Cenrana_`
        },
        {
            name: "💰 Info Bantuan/BLT",
            template: `💰 *INFORMASI BANTUAN DESA*

Kepada Warga Desa Cenrana,

Diberitahukan bahwa pencairan bantuan [Nama Bantuan] akan dilaksanakan:

📆 *Tanggal:* [Tanggal]
⏰ *Waktu:* [Jam] WITA
📍 *Tempat:* Kantor Desa Cenrana

Syarat yang harus dibawa:
✅ KTP Asli
✅ Kartu Keluarga
✅ Buku Rekening (jika ada)

Harap hadir tepat waktu.

_Pemerintah Desa Cenrana_`
        },
        {
            name: "🎉 Ucapan/Hari Besar",
            template: `🎉 *SELAMAT HARI [NAMA HARI]*

Pemerintah Desa Cenrana mengucapkan:

✨ *Selamat [Nama Perayaan]* ✨

Semoga [doa/harapan yang relevan].

Terima kasih atas partisipasi seluruh warga dalam memeriahkan perayaan ini.

Salam hangat,
_Kepala Desa & Perangkat Desa Cenrana_`
        }
    ];


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

    // Handle Image Upload from Device
    const handleNewsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Ukuran file maksimal 5MB!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setNewsImagePreview(base64);
                setNewsForm(prev => ({ ...prev, image: base64 }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Reset News Form
    const resetNewsForm = () => {
        setNewsForm({
            title: "",
            excerpt: "",
            content: "",
            category: "Pengumuman",
            author: "Admin Desa Cenrana",
            tags: "",
            status: "published",
            date: new Date().toISOString().split('T')[0],
            image: ""
        });
        setNewsImagePreview("");
        setEditingNewsId(null);
    };

    // Handle Edit News
    const handleEditNews = (item: any) => {
        setEditingNewsId(item.id);
        setNewsForm({
            title: item.title || "",
            excerpt: item.excerpt || "",
            content: item.content || "",
            category: item.category || "Pengumuman",
            author: item.author || "Admin Desa Cenrana",
            tags: item.tags || "",
            status: item.status || "published",
            date: item.date ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            image: item.image || ""
        });
        setNewsImagePreview(item.image || "");
        setNewsSubTab("create");
    };

    const handleAddNews = () => {
        if (!newsForm.title || !newsForm.excerpt) {
            alert("Harap isi Judul dan Ringkasan!");
            return;
        }

        const formattedDate = new Date(newsForm.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        addNews({
            title: newsForm.title,
            excerpt: newsForm.excerpt,
            category: newsForm.category,
            image: newsForm.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
            date: formattedDate,
            author: newsForm.author,
            tags: newsForm.tags,
            content: newsForm.content,
            status: newsForm.status  // ← FIX: Pass status from form
        });

        resetNewsForm();
        setNewsSubTab("list");
        alert("✅ Berita berhasil ditambahkan!");
    };

    const handleDeleteItem = (type: "news" | "lapak" | "aspirasi", id: number | string) => {
        if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
            if (type === "news") deleteNews(id as number);
            else if (type === "lapak") deleteLapak(id as number);
            else if (type === "aspirasi") deleteAspirasi(id as string);
        }
    };

    // 🔥 Lazy Load Photo Function
    const handleViewPhoto = async (ticketCode: string) => {
        setModalTicketCode(ticketCode);
        setShowPhotoModal(true);
        setIsLoadingPhoto(true);
        setModalPhoto("");
        try {
            const photoData = await fetchPhotoById(ticketCode);
            setModalPhoto(photoData);
        } catch (error) {
            console.error('Error loading photo:', error);
        } finally {
            setIsLoadingPhoto(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Hero Banner for Admin - Compact */}
                <motion.div
                    className="relative rounded-2xl overflow-hidden mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-green-500 rounded-2xl opacity-30 blur-sm"></div>
                    <div className="relative bg-gradient-to-r from-slate-900/95 to-emerald-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <div className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold mb-3">
                                    Administrator Panel
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    Selamat Datang, <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Admin</span>
                                </h1>
                                <p className="text-emerald-200/80 text-sm max-w-md">
                                    Kelola konten website, aspirasi warga, dan lapak UMKM dari satu tempat.
                                </p>
                            </div>

                            {/* CMS Toggle Switch - Compact */}
                            <motion.div
                                className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-col items-center"
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className="text-white/80 font-bold mb-2 text-xs uppercase tracking-wider">Mode CMS</span>
                                <button
                                    onClick={toggleEditMode}
                                    className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${isEditMode ? "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30" : "bg-slate-700"}`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${isEditMode ? "translate-x-7" : "translate-x-0"}`}
                                    >
                                        {isEditMode ? <Edit3 className="w-3 h-3 text-emerald-600" /> : <Eye className="w-3 h-3 text-slate-600" />}
                                    </div>
                                </button>
                                <p className={`text-[10px] mt-2 font-bold ${isEditMode ? "text-emerald-400" : "text-white/50"}`}>
                                    {isEditMode ? "AKTIF" : "NON-AKTIF"}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Sidebar - Compact */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative rounded-xl overflow-hidden sticky top-28">
                            <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500/30 to-emerald-500/30 rounded-xl blur-sm opacity-50"></div>
                            <div className="relative p-3 rounded-xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)]">
                                <nav className="space-y-1">
                                    <motion.button
                                        onClick={() => setActiveTab("dashboard")}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "dashboard"
                                            ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg shadow-cyan-500/30"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveTab("news")}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "news"
                                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        <Newspaper className="w-4 h-4 mr-2" />
                                        Berita
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveTab("lapak")}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "lapak"
                                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/30"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        <ShoppingBag className="w-4 h-4 mr-2" />
                                        Lapak
                                        {pendingLapak.length > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                {pendingLapak.length}
                                            </span>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveTab("aspirasi")}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "aspirasi"
                                            ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg shadow-green-500/30"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Aspirasi
                                        {pendingAspirasi.length > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                {pendingAspirasi.length}
                                            </span>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveTab("pengumuman")}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "pengumuman"
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        <Megaphone className="w-4 h-4 mr-2" />
                                        Pengumuman
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveTab("subscriber")}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === "subscriber"
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]"}`}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Subscriber WA
                                        {waSubscribers.length > 0 && (
                                            <span className="ml-auto bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                                {waSubscribers.length}
                                            </span>
                                        )}
                                    </motion.button>
                                    <motion.button
                                        onClick={() => router.push('/admin/surat')}
                                        whileHover={{ x: 3 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center px-3 py-2.5 rounded-lg font-bold text-sm bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all mb-1 mt-1 border border-blue-200 dark:border-blue-800"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Manajemen Surat
                                    </motion.button>

                                    <div className="pt-2 mt-2 border-t border-[var(--border-color)] space-y-1">
                                        <motion.button
                                            onClick={() => router.push('/admin/penduduk')}
                                            whileHover={{ x: 3 }}
                                            className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)] transition-all"
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Data Penduduk
                                        </motion.button>
                                        <motion.button
                                            onClick={() => router.push('/admin/settings')}
                                            whileHover={{ x: 3 }}
                                            className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 transition-all"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Status Kehadiran
                                        </motion.button>
                                        <motion.button
                                            onClick={() => router.push('/admin/emergency-disclosure')}
                                            whileHover={{ x: 3 }}
                                            className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-bold text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 transition-all"
                                        >
                                            <AlertTriangle className="w-4 h-4 mr-2" />
                                            Emergency
                                            <Shield className="w-3 h-3 ml-auto" />
                                        </motion.button>
                                    </div>

                                    <div className="pt-2 mt-2 border-t border-[var(--border-color)]">
                                        <motion.button
                                            onClick={logout}
                                            whileHover={{ x: 3 }}
                                            className="w-full flex items-center px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </motion.button>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Area */}
                    <div className="lg:col-span-4">
                        {activeTab === "dashboard" && (
                            <div className="space-y-8 animate-fade-in">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-cyan-500">
                                        <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Total Berita</h3>
                                        <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{news.length}</p>
                                    </div>
                                    <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-blue-500">
                                        <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Total Aspirasi</h3>
                                        <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{aspirasi.length}</p>
                                    </div>
                                    <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-emerald-500">
                                        <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Lapak Aktif</h3>
                                        <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{lapak.filter(l => l.status === "Active").length}</p>
                                    </div>
                                    <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-amber-500">
                                        <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Menunggu (Aspirasi)</h3>
                                        <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{pendingAspirasi.length}</p>
                                    </div>
                                    <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-purple-500">
                                        <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Menunggu (Produk)</h3>
                                        <p className="text-3xl md:text-4xl font-bold text-[var(--text-primary)]">{pendingLapak.length}</p>
                                    </div>
                                    <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-pink-500">
                                        <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Mode CMS</h3>
                                        <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">{isEditMode ? "AKTIF ✓" : "NON-AKTIF"}</p>
                                    </div>
                                    <div
                                        onClick={() => router.push('/admin/surat')}
                                        className="glass-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-4 border-indigo-500 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg hover:shadow-indigo-500/20"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-[var(--text-secondary)] font-bold text-xs md:text-sm mb-2">Layanan Surat</h3>
                                                <p className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Kelola Request</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "news" && (
                            <motion.div
                                className="max-w-4xl mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Header with Tabs */}
                                <div className="glass-panel rounded-2xl p-6 mb-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                                <Newspaper className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-[var(--text-primary)]">Manajemen Berita</h2>
                                                <p className="text-xs text-[var(--text-secondary)]">{news.length} berita tersedia</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-color)]">
                                            <button
                                                onClick={() => { setNewsSubTab("create"); resetNewsForm(); }}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${newsSubTab === "create"
                                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                    }`}
                                            >
                                                <Plus className="w-4 h-4" />
                                                Buat Berita
                                            </button>
                                            <button
                                                onClick={() => setNewsSubTab("list")}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${newsSubTab === "list"
                                                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                                    }`}
                                            >
                                                <Newspaper className="w-4 h-4" />
                                                Daftar Berita
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* CREATE TAB */}
                                {newsSubTab === "create" && (
                                    <motion.div
                                        className="glass-panel rounded-2xl p-6"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                                {editingNewsId ? (
                                                    <>
                                                        <Edit3 className="w-5 h-5 text-amber-500" />
                                                        Edit Berita
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus className="w-5 h-5 text-blue-500" />
                                                        Buat Berita Baru
                                                    </>
                                                )}
                                            </h3>
                                            <button
                                                onClick={() => { resetNewsForm(); setNewsSubTab("list"); }}
                                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                                            >
                                                <XCircle className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* Left Column - Image Upload */}
                                            <div className="lg:col-span-1">
                                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Gambar Berita</label>
                                                <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--bg-panel)] border-2 border-dashed border-[var(--border-color)] hover:border-blue-500/50 transition-colors group">
                                                    {newsImagePreview ? (
                                                        <>
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={newsImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <label className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg cursor-pointer hover:bg-white/30 transition-colors text-sm font-bold">
                                                                    Ganti Gambar
                                                                    <input type="file" accept="image/*" onChange={handleNewsImageUpload} className="hidden" />
                                                                </label>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                                                            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                                                                <Plus className="w-6 h-6 text-blue-500" />
                                                            </div>
                                                            <span className="text-sm font-bold text-[var(--text-secondary)]">Pilih Gambar</span>
                                                            <span className="text-xs text-[var(--text-secondary)]/60">Max 5MB</span>
                                                            <input type="file" accept="image/*" onChange={handleNewsImageUpload} className="hidden" />
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right Column - Form Fields */}
                                            <div className="lg:col-span-2 space-y-4">
                                                {/* Title */}
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        Judul Berita <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newsForm.title}
                                                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value.slice(0, 100) })}
                                                        className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                        placeholder="Masukkan judul berita..."
                                                    />
                                                    <p className="text-xs text-[var(--text-secondary)] mt-1 text-right">{newsForm.title.length}/100</p>
                                                </div>

                                                {/* Row: Category, Date, Author */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Kategori</label>
                                                        <select
                                                            value={newsForm.category}
                                                            onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                                                            className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all"
                                                        >
                                                            <option>Pengumuman</option>
                                                            <option>Kegiatan</option>
                                                            <option>Pembangunan</option>
                                                            <option>Kesehatan</option>
                                                            <option>Pendidikan</option>
                                                            <option>Lainnya</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">📅 Tanggal</label>
                                                        <input
                                                            type="date"
                                                            value={newsForm.date}
                                                            onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                                                            className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">✍️ Penulis</label>
                                                        <input
                                                            type="text"
                                                            value={newsForm.author}
                                                            onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                                                            className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all"
                                                            placeholder="Nama penulis..."
                                                        />
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">🏷️ Tags (pisahkan dengan koma)</label>
                                                    <input
                                                        type="text"
                                                        value={newsForm.tags}
                                                        onChange={(e) => setNewsForm({ ...newsForm, tags: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all"
                                                        placeholder="desa, pembangunan, kegiatan..."
                                                    />
                                                </div>

                                                {/* Excerpt */}
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                                        Ringkasan <span className="text-red-500">*</span>
                                                    </label>
                                                    <textarea
                                                        value={newsForm.excerpt}
                                                        onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value.slice(0, 200) })}
                                                        className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all min-h-[80px] resize-none"
                                                        placeholder="Ringkasan singkat untuk preview..."
                                                    />
                                                    <p className="text-xs text-[var(--text-secondary)] mt-1 text-right">{newsForm.excerpt.length}/200</p>
                                                </div>

                                                {/* Content */}
                                                <div>
                                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">📝 Konten Lengkap</label>
                                                    <textarea
                                                        value={newsForm.content}
                                                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                                                        className="w-full p-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all min-h-[150px] resize-y"
                                                        placeholder="Isi lengkap berita..."
                                                    />
                                                </div>

                                                {/* Status */}
                                                <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)]">
                                                    <span className="text-sm font-bold text-[var(--text-secondary)]">Status:</span>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            checked={newsForm.status === "draft"}
                                                            onChange={() => setNewsForm({ ...newsForm, status: "draft" })}
                                                            className="w-4 h-4 text-gray-500"
                                                        />
                                                        <span className="text-sm text-[var(--text-secondary)]">Draft</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="status"
                                                            checked={newsForm.status === "published"}
                                                            onChange={() => setNewsForm({ ...newsForm, status: "published" })}
                                                            className="w-4 h-4 text-emerald-500"
                                                        />
                                                        <span className="text-sm text-emerald-500 font-bold">Publish</span>
                                                    </label>
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    onClick={handleAddNews}
                                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2"
                                                >
                                                    {editingNewsId ? (
                                                        <>
                                                            <CheckCircle className="w-5 h-5" />
                                                            Update Berita
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="w-5 h-5" />
                                                            Publikasikan Berita
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* LIST TAB */}
                                {newsSubTab === "list" && (
                                    <motion.div
                                        className="glass-panel rounded-2xl p-6"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {/* Search */}
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex-1 relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                                                <input
                                                    type="text"
                                                    value={newsSearchQuery}
                                                    onChange={(e) => setNewsSearchQuery(e.target.value)}
                                                    placeholder="Cari berita..."
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-all text-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* News List */}
                                        <div className="space-y-3">
                                            {news
                                                .filter(item =>
                                                    newsSearchQuery === "" ||
                                                    item.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) ||
                                                    item.category?.toLowerCase().includes(newsSearchQuery.toLowerCase())
                                                )
                                                .map((item, index) => (
                                                    <motion.div
                                                        key={item.id}
                                                        className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-blue-500/30 hover:shadow-lg transition-all group"
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                    >
                                                        {/* Thumbnail */}
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                        </div>

                                                        {/* Content */}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-[var(--text-primary)] truncate group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                                            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-1 flex-wrap">
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="w-3 h-3" />
                                                                    {item.date}
                                                                </span>
                                                                <span>•</span>
                                                                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-bold">{item.category}</span>
                                                                <button
                                                                    onClick={() => {
                                                                        const newStatus = item.status === 'draft' ? 'published' : 'draft';
                                                                        updateNews(item.id, { status: newStatus });
                                                                    }}
                                                                    className={`px-2 py-0.5 rounded-full font-bold cursor-pointer hover:scale-105 transition-all ${item.status === 'draft'
                                                                        ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                                                        : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                                                        }`}
                                                                    title="Klik untuk toggle status"
                                                                >
                                                                    {item.status === 'draft' ? '📝 Draft' : '✅ Published'}
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">{item.excerpt}</p>
                                                        </div>

                                                        {/* Actions - Always Visible */}
                                                        <div className="flex items-center gap-2 flex-shrink-0 z-10">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditNews(item)}
                                                                className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                                                                title="Edit"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={async () => {
                                                                    if (window.confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
                                                                        await deleteNews(item.id);
                                                                    }
                                                                }}
                                                                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            }
                                            {news.length === 0 && (
                                                <div className="text-center py-12">
                                                    <div className="w-16 h-16 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-4">
                                                        <Newspaper className="w-8 h-8 text-[var(--text-secondary)]/40" />
                                                    </div>
                                                    <p className="text-[var(--text-secondary)]">Belum ada berita</p>
                                                    <button
                                                        onClick={() => setNewsSubTab("create")}
                                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm hover:bg-blue-600 transition-colors"
                                                    >
                                                        + Buat Berita Pertama
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* KELOLA LAPAK WARGA - REDESIGNED WITH TABS */}
                        {activeTab === "lapak" && (
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
                                        {/* Pending Products - Compact */}
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
                                                            style={{
                                                                animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                                                            }}
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

                                        {/* Active Products - Compact Grid */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                    Produk Aktif ({lapak.filter(i => i.status === "Active").length})
                                                </h3>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto pr-2">
                                                {lapak.filter(item => item.status === "Active").map((item, index) => (
                                                    <div
                                                        key={item.id}
                                                        className="bg-[var(--bg-card)] rounded-xl p-3 border border-[var(--border-color)] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                                                        style={{
                                                            animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`
                                                        }}
                                                    >
                                                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 mb-2">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                            <button
                                                                onClick={() => handleDeleteItem("lapak", item.id)}
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
                                        {/* Stats Cards - Responsive */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white shadow-lg transform hover:scale-105 transition-transform duration-300">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="text-blue-100 text-xs font-bold mb-1">Total Views</p>
                                                        <p className="text-2xl sm:text-3xl font-bold">
                                                            {lapak.filter(p => p.status === 'Active').reduce((sum, p) => sum + (p.view_count || 0), 0)}
                                                        </p>
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
                                                        <p className="text-2xl sm:text-3xl font-bold">
                                                            {lapak.filter(p => p.status === 'Active').reduce((sum, p) => sum + (p.wa_click_count || 0), 0)}
                                                        </p>
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
                                                        <p className="text-2xl sm:text-3xl font-bold">
                                                            {(() => {
                                                                const activeProducts = lapak.filter(p => p.status === 'Active');
                                                                const totalViews = activeProducts.reduce((sum, p) => sum + (p.view_count || 0), 0);
                                                                const totalClicks = activeProducts.reduce((sum, p) => sum + (p.wa_click_count || 0), 0);
                                                                return totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';
                                                            })()}%
                                                        </p>
                                                    </div>
                                                    <div className="bg-white/20 p-2 rounded-lg">
                                                        <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Top Products Table - Compact */}
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
                                                        {lapak
                                                            .filter(p => p.status === 'Active')
                                                            .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                                                            .slice(0, 10)
                                                            .map((product, index) => (
                                                                <tr
                                                                    key={product.id}
                                                                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-panel)] transition-colors"
                                                                    style={{
                                                                        animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
                                                                    }}
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
                                                {lapak.filter(p => p.status === 'Active').length === 0 && (
                                                    <p className="text-center py-8 text-[var(--text-secondary)] text-sm">Belum ada produk aktif.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                        filteredAspirasi.map((item, index) => (
                                            <div key={`aspirasi-${item.id}-${index}`} className="bg-[var(--bg-card)] p-4 md:p-6 rounded-2xl border border-[var(--border-color)]">
                                                {/* Header - Stack on mobile, side-by-side on desktop */}
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className="font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded text-xs sm:text-sm">{item.id}</span>
                                                            {item.is_anonymous && (
                                                                <span className="flex items-center text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-500 whitespace-nowrap">
                                                                    <Shield className="w-3 h-3 mr-1" /> Anonim
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="font-bold text-[var(--text-primary)] text-sm sm:text-base truncate">
                                                            {item.is_anonymous
                                                                ? <span className="text-blue-500 flex items-center"><Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 shrink-0" />Pelapor Anonim</span>
                                                                : item.nama
                                                            }
                                                        </h3>
                                                        <p className="text-[10px] sm:text-xs text-[var(--text-secondary)] mt-1">
                                                            {item.date} • {item.kategori} • {item.is_anonymous ? "Dusun Dirahasiakan" : item.dusun}
                                                        </p>
                                                    </div>
                                                    {/* Status & Actions */}
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center whitespace-nowrap ${item.status === "Selesai" ? "bg-emerald-500/20 text-emerald-500" :
                                                            item.status === "Diproses" ? "bg-blue-500/20 text-blue-500" :
                                                                item.status === "Rejected" ? "bg-red-500/20 text-red-500" :
                                                                    "bg-amber-500/20 text-amber-500"
                                                            }`}>
                                                            {item.status === "Selesai" && <CheckCircle className="w-3 h-3 mr-1" />}
                                                            {item.status === "Diproses" && <Clock className="w-3 h-3 mr-1 text-blue-500" />}
                                                            {item.status === "Rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                                            {item.status === "Pending" && <Clock className="w-3 h-3 mr-1" />}
                                                            {item.status}
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteItem("aspirasi", item.id)}
                                                            className="p-1.5 sm:p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <p className="text-[var(--text-primary)] mb-4 leading-relaxed">{item.laporan}</p>


                                                {/* 🔥 Photo Button - Conditional (only if has photo) */}
                                                {item.hasPhoto && (
                                                    <button
                                                        onClick={() => handleViewPhoto(item.id)}
                                                        className="mb-4 px-4 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        📷 Lihat Foto
                                                    </button>
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
                                                                {item.rating || 0}/5
                                                            </span>
                                                        </div>
                                                        {/* Rating section - TypeScript fix applied */}
                                                        <div className="flex items-center gap-1.5 mb-4">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-7 h-7 ${i < (item.rating || 0) ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"}`}
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

                        {/* PENGUMUMAN TAB - Inside Content Area */}
                        {activeTab === "pengumuman" && (
                            <motion.div
                                className="space-y-4 md:space-y-6 animate-fade-in"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Header */}
                                <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                                            <Megaphone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg md:text-xl font-black text-[var(--text-primary)]">Kelola Pengumuman</h2>
                                            <p className="text-xs md:text-sm text-[var(--text-secondary)]">Muncul di running text homepage</p>
                                        </div>
                                    </div>

                                    {/* Add New Pengumuman - Responsive */}
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <input
                                            type="text"
                                            value={newPengumumanText}
                                            onChange={(e) => setNewPengumumanText(e.target.value)}
                                            placeholder="Tulis pengumuman baru..."
                                            className="flex-1 px-3 md:px-4 py-2.5 md:py-3 rounded-lg md:rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm md:text-base focus:outline-none focus:border-amber-500 transition-all"
                                        />
                                        <button
                                            onClick={() => {
                                                if (newPengumumanText.trim()) {
                                                    addPengumuman(newPengumumanText.trim());
                                                    setNewPengumumanText("");
                                                }
                                            }}
                                            className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg md:rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 text-sm md:text-base"
                                        >
                                            <Plus className="w-4 h-4 md:w-5 md:h-5" />
                                            Tambah
                                        </button>
                                    </div>
                                </div>

                                {/* Pengumuman List */}
                                <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        Daftar Pengumuman ({cmsContent.pengumuman?.length || 0})
                                    </h3>

                                    {cmsContent.pengumuman?.length === 0 ? (
                                        <div className="text-center py-8 md:py-12 text-[var(--text-secondary)]">
                                            <Megaphone className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 opacity-30" />
                                            <p className="text-sm md:text-base">Belum ada pengumuman</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 md:space-y-3">
                                            {cmsContent.pengumuman?.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className={`p-3 md:p-4 rounded-lg md:rounded-xl border transition-all ${item.active
                                                        ? 'bg-green-500/10 border-green-500/30'
                                                        : 'bg-gray-500/10 border-gray-500/30 opacity-60'}`}
                                                >
                                                    {editingPengumumanId === item.id ? (
                                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                                            <input
                                                                type="text"
                                                                value={editPengumumanText}
                                                                onChange={(e) => setEditPengumumanText(e.target.value)}
                                                                className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-blue-500"
                                                            />
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        updatePengumuman(item.id, editPengumumanText, item.active);
                                                                        setEditingPengumumanId(null);
                                                                    }}
                                                                    className="flex-1 sm:flex-none px-3 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 text-sm"
                                                                >
                                                                    Simpan
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingPengumumanId(null)}
                                                                    className="flex-1 sm:flex-none px-3 py-2 bg-gray-500 text-white font-bold rounded-lg hover:bg-gray-600 text-sm"
                                                                >
                                                                    Batal
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[var(--text-primary)] font-medium text-sm md:text-base break-words">
                                                                    📢 {item.text}
                                                                </p>
                                                                <span className={`text-xs font-bold ${item.active ? 'text-green-500' : 'text-gray-500'}`}>
                                                                    {item.active ? '✅ Aktif' : '⚪ Non-aktif'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                <button
                                                                    onClick={() => updatePengumuman(item.id, item.text, !item.active)}
                                                                    className={`px-2 md:px-3 py-1 md:py-1.5 text-xs font-bold rounded-lg transition-all ${item.active
                                                                        ? 'bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30'
                                                                        : 'bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30'
                                                                        }`}
                                                                >
                                                                    <span className="hidden sm:inline">{item.active ? 'Nonaktifkan' : 'Aktifkan'}</span>
                                                                    <span className="sm:hidden">{item.active ? 'Off' : 'On'}</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingPengumumanId(item.id);
                                                                        setEditPengumumanText(item.text);
                                                                    }}
                                                                    className="p-1.5 md:p-2 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all"
                                                                >
                                                                    <Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('Hapus pengumuman ini?')) {
                                                                            deletePengumuman(item.id);
                                                                        }
                                                                    }}
                                                                    className="p-1.5 md:p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Info Box */}
                                <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6 border-l-4 border-blue-500">
                                    <h4 className="font-bold text-[var(--text-primary)] mb-2 text-sm md:text-base">💡 Tips</h4>
                                    <ul className="text-xs md:text-sm text-[var(--text-secondary)] space-y-1">
                                        <li>• Pengumuman aktif muncul di running text homepage</li>
                                        <li>• Agenda Kegiatan otomatis tampil di running text</li>
                                        <li>• Gunakan emoji untuk lebih menarik 🎉</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}

                        {/* SUBSCRIBER WA TAB */}
                        {activeTab === "subscriber" && (
                            <motion.div
                                className="space-y-4 md:space-y-6 animate-fade-in"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Header */}
                                <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 md:p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                                            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg md:text-xl font-black text-[var(--text-primary)]">Subscriber WhatsApp</h2>
                                            <p className="text-xs md:text-sm text-[var(--text-secondary)]">Daftar warga yang ingin dapat info via WA</p>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                                            <p className="text-2xl md:text-3xl font-black text-green-500">{waSubscribers.length}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">Total Subscriber</p>
                                        </div>
                                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                                            <p className="text-2xl md:text-3xl font-black text-blue-500">{waSubscribers.filter(s => {
                                                const date = new Date(s.subscribed_at);
                                                const now = new Date();
                                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                            }).length}</p>
                                            <p className="text-xs text-[var(--text-secondary)]">Bulan Ini</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscriber List */}
                                <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                        <Users className="w-5 h-5" />
                                        Daftar Subscriber ({waSubscribers.length})
                                    </h3>

                                    {waSubscribers.length === 0 ? (
                                        <div className="text-center py-8 text-[var(--text-secondary)]">
                                            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                            <p>Belum ada subscriber</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                            {waSubscribers.map((subscriber, index) => (
                                                <div
                                                    key={subscriber.id}
                                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 md:p-4 bg-[var(--bg-panel)] rounded-xl border border-[var(--border-color)] hover:border-green-500/30 transition-all"
                                                >
                                                    {/* User Info */}
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                                                            {index + 1}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-[var(--text-primary)] text-sm sm:text-base truncate">{subscriber.name}</p>
                                                            <p className="text-xs sm:text-sm text-[var(--text-secondary)] flex items-center gap-1">
                                                                <Phone className="w-3 h-3 shrink-0" />
                                                                <span className="truncate">+{subscriber.whatsapp}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {/* Action Buttons */}
                                                    <div className="flex items-center justify-end gap-2 shrink-0">
                                                        {/* Copy Number */}
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(subscriber.whatsapp);
                                                                alert('Nomor disalin!');
                                                            }}
                                                            className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 transition-all"
                                                            title="Salin Nomor"
                                                        >
                                                            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                        {/* Chat WA */}
                                                        <a
                                                            href={`https://wa.me/${subscriber.whatsapp}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 sm:p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition-all"
                                                            title="Chat WhatsApp"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </a>
                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => {
                                                                if (confirm(`Hapus ${subscriber.name} dari subscriber?`)) {
                                                                    deleteWASubscriber(subscriber.id);
                                                                }
                                                            }}
                                                            className="p-1.5 sm:p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Tools */}
                                <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-4">🛠️ Tools Cepat</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                const numbers = waSubscribers.map(s => s.whatsapp).join(', ');
                                                navigator.clipboard.writeText(numbers);
                                                alert('Semua nomor disalin ke clipboard!');
                                            }}
                                            className="flex items-center justify-center gap-2 p-3 bg-blue-500/20 text-blue-500 rounded-xl font-bold hover:bg-blue-500/30 transition-all"
                                        >
                                            <Copy className="w-5 h-5" />
                                            Salin Semua Nomor
                                        </button>
                                        <button
                                            onClick={() => {
                                                const csv = waSubscribers.map(s => `${s.name},${s.whatsapp}`).join('\n');
                                                const blob = new Blob([`Nama,WhatsApp\n${csv}`], { type: 'text/csv' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = 'subscriber-wa.csv';
                                                a.click();
                                            }}
                                            className="flex items-center justify-center gap-2 p-3 bg-green-500/20 text-green-500 rounded-xl font-bold hover:bg-green-500/30 transition-all"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                            Export CSV
                                        </button>
                                    </div>
                                </div>

                                {/* 📢 Broadcast Panel */}
                                <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-green-500/30">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                        <Send className="w-5 h-5 text-green-500" />
                                        Kirim Broadcast WhatsApp
                                    </h3>

                                    {/* Template Selection */}
                                    <div className="mb-4">
                                        <label className="text-sm font-bold text-[var(--text-secondary)] mb-2 block">Pilih Template:</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {messageTemplates.map((template, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setBroadcastMessage(template.template)}
                                                    className="p-2 text-xs font-bold bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg hover:border-green-500/50 hover:bg-green-500/10 transition-all text-left"
                                                >
                                                    {template.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Message Textarea */}
                                    <div className="mb-4">
                                        <label className="text-sm font-bold text-[var(--text-secondary)] mb-2 block">Pesan Broadcast:</label>
                                        <textarea
                                            value={broadcastMessage}
                                            onChange={(e) => setBroadcastMessage(e.target.value)}
                                            placeholder="Tulis pesan broadcast Anda di sini... atau pilih template di atas"
                                            className="w-full h-48 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-green-500 resize-none text-sm"
                                        />
                                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                                            💡 Teks dalam [kurung] adalah placeholder - ganti dengan info sebenarnya
                                        </p>
                                    </div>

                                    {/* Broadcast Progress */}
                                    {isBroadcasting && (
                                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                                            <p className="text-sm font-bold text-green-500">
                                                📤 Progress: {broadcastSentIndex}/{waSubscribers.length} terkirim
                                            </p>
                                            <div className="w-full bg-[var(--bg-panel)] rounded-full h-2 mt-2">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full transition-all"
                                                    style={{ width: `${(broadcastSentIndex / waSubscribers.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Send Buttons */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                if (!broadcastMessage.trim()) {
                                                    alert('Tulis pesan dulu!');
                                                    return;
                                                }
                                                if (waSubscribers.length === 0) {
                                                    alert('Tidak ada subscriber!');
                                                    return;
                                                }
                                                setIsBroadcasting(true);
                                                setBroadcastSentIndex(0);

                                                // Open first subscriber
                                                const encoded = encodeURIComponent(broadcastMessage);
                                                window.open(`https://wa.me/${waSubscribers[0].whatsapp}?text=${encoded}`, '_blank');
                                                setBroadcastSentIndex(1);
                                            }}
                                            disabled={!broadcastMessage.trim() || waSubscribers.length === 0}
                                            className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            Mulai Kirim Broadcast
                                        </button>

                                        {isBroadcasting && broadcastSentIndex < waSubscribers.length && (
                                            <button
                                                onClick={() => {
                                                    const nextIndex = broadcastSentIndex;
                                                    if (nextIndex < waSubscribers.length) {
                                                        const encoded = encodeURIComponent(broadcastMessage);
                                                        window.open(`https://wa.me/${waSubscribers[nextIndex].whatsapp}?text=${encoded}`, '_blank');
                                                        setBroadcastSentIndex(nextIndex + 1);
                                                    }
                                                    if (broadcastSentIndex + 1 >= waSubscribers.length) {
                                                        setIsBroadcasting(false);
                                                        alert('✅ Broadcast selesai!');
                                                    }
                                                }}
                                                className="flex items-center justify-center gap-2 p-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all"
                                            >
                                                <Send className="w-5 h-5" />
                                                Kirim ke {waSubscribers[broadcastSentIndex]?.name || 'Selanjutnya'}
                                            </button>
                                        )}

                                        {isBroadcasting && (
                                            <button
                                                onClick={() => {
                                                    setIsBroadcasting(false);
                                                    setBroadcastSentIndex(0);
                                                }}
                                                className="flex items-center justify-center gap-2 p-3 bg-gray-500/20 text-gray-500 rounded-xl font-bold hover:bg-gray-500/30 transition-all"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Batal
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="glass-panel rounded-xl p-4 border-l-4 border-green-500">
                                    <h4 className="font-bold text-[var(--text-primary)] mb-2">📖 Cara Pakai Broadcast</h4>
                                    <ol className="text-xs md:text-sm text-[var(--text-secondary)] space-y-1 list-decimal list-inside">
                                        <li>Pilih template atau tulis pesan sendiri</li>
                                        <li>Edit placeholder [dalam kurung] sesuai kebutuhan</li>
                                        <li>Klik <strong>"Mulai Kirim Broadcast"</strong></li>
                                        <li>WhatsApp akan terbuka - tekan <strong>Send</strong></li>
                                        <li>Kembali ke sini, klik <strong>"Selanjutnya"</strong></li>
                                        <li>Ulangi sampai selesai</li>
                                    </ol>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* 🔥 Photo Modal - Lazy Load */}
            {showPhotoModal && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowPhotoModal(false)}
                >
                    <div
                        className="bg-[var(--bg-card)] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-[var(--text-primary)]">
                                    Detail Aspirasi - {modalTicketCode}
                                </h3>
                                <button
                                    onClick={() => setShowPhotoModal(false)}
                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                            {isLoadingPhoto ? (
                                <div className="flex flex-col items-center justify-center p-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                                    <p className="text-[var(--text-secondary)]">Memuat foto...</p>
                                </div>
                            ) : modalPhoto ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={modalPhoto}
                                    alt="Foto Aspirasi"
                                    className="w-full max-h-[600px] object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12">
                                    <AlertTriangle className="w-16 h-16 text-amber-500 mb-4" />
                                    <p className="text-[var(--text-secondary)]">Tidak ada foto atau gagal memuat</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


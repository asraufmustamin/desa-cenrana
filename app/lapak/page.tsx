
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Phone, Tag, Search, ShoppingBag, Plus, X, Trophy, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function LapakWarga() {
    const { lapak, submitLapak, isLoading } = useAppContext();
    const [activeTab, setActiveTab] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Form State
    const [form, setForm] = useState({
        title: "",
        category: "Hasil Tani",
        price: "",
        seller: "",
        phone: "",
        image: "",
        description: "",
    });

    const categories = ["Semua", "Hasil Tani", "Produk UMKM", "Jasa Warga"];

    // Filter Active Items Only (Defensive Coding)
    const safeLapak = Array.isArray(lapak) ? lapak : [];
    const activeLapak = safeLapak.filter(item => item && item.status === "Active");

    const filteredLapak = activeLapak.filter((item) => {
        const matchesCategory = activeTab === "Semua" || item.category === activeTab;
        // Defensive Coding: Check if title exists, fallback to empty string
        // Also check for 'name' property just in case the DB returns that instead of title
        const itemTitle = item.title || (item as any).name || "";
        const matchesSearch = itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Top 5 Logic (Mocking "Best Seller" by taking first 5 for now)
    const top5Items = activeLapak.slice(0, 5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitLapak(form);
        setShowModal(false);
        setForm({ title: "", category: "Hasil Tani", price: "", seller: "", phone: "", image: "", description: "" });
        alert("Produk berhasil diajukan! Menunggu persetujuan Admin.");
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-bold text-[var(--text-secondary)]">Memuat data lapak...</p>
            </div>
        );
    }

    if (!safeLapak) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <p className="text-xl font-bold text-red-500">Gagal memuat data lapak. Silakan coba lagi nanti.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 text-glow">Lapak Warga</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Dukung ekonomi lokal dengan membeli produk asli dari warga Desa Cenrana.
                    </p>
                </div>

                {/* Top 5 Widget */}
                <div className="mb-16">
                    <div className="flex items-center mb-6">
                        <Trophy className="w-6 h-6 text-amber-500 mr-2" />
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Paling Laris</h2>
                        <div className="ml-auto flex space-x-2">
                            <button onClick={() => scroll("left")} className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => scroll("right")} className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
                    >
                        {top5Items?.length > 0 && top5Items.map((item) => (
                            <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center glass-card rounded-3xl overflow-hidden flex flex-col group">
                                <div className="relative h-48">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                                        Top Product
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-[var(--text-primary)] line-clamp-1 mb-1">{item.title}</h3>
                                    <p className="text-emerald-500 font-bold text-sm">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
                    {/* Tabs */}
                    <div className="flex p-1 bg-[var(--bg-card)] backdrop-blur-md rounded-2xl border border-[var(--border-color)] overflow-x-auto max-w-full hide-scrollbar w-full lg:w-auto">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveTab(category)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${activeTab === category
                                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3.5 text-[var(--text-secondary)] w-5 h-5" />
                        </div>

                        {/* Promote Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all flex items-center justify-center whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Promosikan Produk
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {filteredLapak.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredLapak?.map((item) => {
                            const isInvalidImage = item.image.includes("whatsapp") || item.image.includes("wa.me");
                            const safeImage = isInvalidImage
                                ? "https://images.unsplash.com/photo-1589923188900-85dae5233271?auto=format&fit=crop&w=800&q=80"
                                : item.image;

                            return (
                                <div key={item.id} className="glass-card rounded-3xl overflow-hidden flex flex-col group h-full">
                                    <div className="relative aspect-square overflow-hidden bg-[var(--bg-card)]">
                                        <Image
                                            src={safeImage}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-bold text-[var(--text-primary)] text-sm md:text-base line-clamp-2 mb-2 group-hover:text-blue-500 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-[var(--text-secondary)] mb-4">Oleh: {item.seller}</p>

                                        <div className="mt-auto">
                                            <p className="text-emerald-500 font-bold text-base md:text-lg mb-3">{item.price}</p>
                                            <a
                                                href={`https://wa.me/${item.phone}?text=Halo, saya tertarik dengan produk ${item.title} di Lapak Desa Cenrana.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-xs md:text-sm font-bold flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                                            >
                                                <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                                Hubungi
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 glass-panel rounded-[2rem] border-dashed border-[var(--border-color)]">
                        <ShoppingBag className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Produk tidak ditemukan</h3>
                        <p className="text-[var(--text-secondary)]">Coba kata kunci lain atau kategori berbeda.</p>
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-lg rounded-[2rem] p-8 relative animate-fade-in-up max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Promosikan Produk</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Nama Produk</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="Contoh: Keripik Pisang Khas Cenrana"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Kategori</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    >
                                        <option className="bg-[var(--bg-panel)]" value="Hasil Tani">Hasil Tani</option>
                                        <option className="bg-[var(--bg-panel)]" value="Produk UMKM">Produk UMKM</option>
                                        <option className="bg-[var(--bg-panel)]" value="Jasa Warga">Jasa Warga</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Harga</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                        placeholder="Rp 15.000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Nama Penjual</label>
                                <input
                                    type="text"
                                    required
                                    value={form.seller}
                                    onChange={(e) => setForm({ ...form, seller: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="Nama Anda / Toko"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Nomor WhatsApp</label>
                                <input
                                    type="text"
                                    required
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="628123456789"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">URL Foto Produk</label>
                                <input
                                    type="url"
                                    required
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Deskripsi Singkat</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="Jelaskan keunggulan produk Anda..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg hover:bg-emerald-500 transition-all mt-4"
                            >
                                Ajukan Produk
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

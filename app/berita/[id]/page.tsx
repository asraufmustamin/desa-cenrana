"use client";

import { useAppContext, NewsItem } from "@/context/AppContext";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidebarTopBerita from "@/components/SidebarTopBerita";
import BeritaComments from "@/components/BeritaComments";

export default function NewsDetailPage() {
    const { news } = useAppContext();
    const params = useParams();
    const [item, setItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (params.id && news.length > 0) {
            const newsId = Number(params.id);
            const found = news.find((n) => n.id === newsId);
            if (found) {
                setItem(found);
            }
            setLoading(false);
        } else if (news.length > 0) {
            setLoading(false);
        }
    }, [params.id, news]);

    const getCurrentUrl = () => {
        if (typeof window !== "undefined") {
            return window.location.href;
        }
        return "";
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getCurrentUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            alert("Gagal menyalin link");
        }
    };

    const shareToWhatsApp = () => {
        const url = encodeURIComponent(getCurrentUrl());
        const text = encodeURIComponent(`📰 ${item?.title || "Berita Desa Cenrana"}\n\n`);
        window.open(`https://wa.me/?text=${text}${url}`, "_blank");
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(getCurrentUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    };

    const shareToTwitter = () => {
        const url = encodeURIComponent(getCurrentUrl());
        const text = encodeURIComponent(`📰 ${item?.title || "Berita Desa Cenrana"}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    };

    const shareToTelegram = () => {
        const url = encodeURIComponent(getCurrentUrl());
        const text = encodeURIComponent(`📰 ${item?.title || "Berita Desa Cenrana"}`);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-32 px-4 text-center">
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Berita tidak ditemukan</h1>
                <p className="text-[var(--text-secondary)] mb-8">Maaf, berita yang Anda cari tidak tersedia atau telah dihapus.</p>
                <Link
                    href="/informasi/berita"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Berita
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link
                        href="/informasi/berita"
                        className="inline-flex items-center text-[var(--text-secondary)] hover:text-blue-500 mb-6 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Daftar Berita
                    </Link>
                </motion.div>

                {/* Main Layout: Content + Sidebar */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <motion.article
                            className="bg-[var(--bg-card)] backdrop-blur-xl rounded-2xl shadow-xl border border-[var(--border-color)] overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {/* Hero Image */}
                            <div className="relative h-[300px] sm:h-[400px] w-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
                                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-xs font-bold mb-4">
                                        {item.category || "Berita Desa"}
                                    </span>
                                    <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-4">
                                        {item.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-200">
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {item.date}
                                        </div>
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            {(item as any).author || "Admin Desa"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 md:p-10">
                                <div className="prose prose-lg max-w-none text-[var(--text-primary)]">
                                    <p className="text-lg text-[var(--text-secondary)] mb-8 font-medium border-l-4 border-blue-500 pl-6 italic">
                                        {item.excerpt}
                                    </p>
                                    {item.content ? (
                                        <div className="whitespace-pre-wrap leading-relaxed text-[var(--text-primary)]">{item.content}</div>
                                    ) : (
                                        <div className="space-y-4 text-[var(--text-secondary)]">
                                            <p>Konten lengkap berita ini belum tersedia. Silakan hubungi admin untuk informasi lebih lanjut.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tags */}
                                {(item as any).tags && (
                                    <div className="mt-8 flex flex-wrap gap-2">
                                        {((item as any).tags as string).split(',').map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold">
                                                #{tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Share Section */}
                                <div className="mt-10 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="text-[var(--text-secondary)] text-sm font-medium">
                                        Bagikan berita ini:
                                    </div>
                                    <div className="flex gap-2">
                                        {/* WhatsApp */}
                                        <button
                                            onClick={shareToWhatsApp}
                                            className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"
                                            title="Bagikan ke WhatsApp"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </button>

                                        {/* Facebook */}
                                        <button
                                            onClick={shareToFacebook}
                                            className="p-3 rounded-xl bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                                            title="Bagikan ke Facebook"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </button>

                                        {/* Twitter/X */}
                                        <button
                                            onClick={shareToTwitter}
                                            className="p-3 rounded-xl bg-gray-500/10 text-[var(--text-primary)] hover:bg-gray-700 hover:text-white transition-all"
                                            title="Bagikan ke X/Twitter"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </button>

                                        {/* Telegram */}
                                        <button
                                            onClick={shareToTelegram}
                                            className="p-3 rounded-xl bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all"
                                            title="Bagikan ke Telegram"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                            </svg>
                                        </button>

                                        {/* Copy Link */}
                                        <button
                                            onClick={handleCopyLink}
                                            className={`p-3 rounded-xl transition-all ${copied
                                                ? "bg-green-500 text-white"
                                                : "bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-blue-500 hover:text-white"
                                                }`}
                                            title="Salin Link"
                                        >
                                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.article>

                        {/* Comments Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-8"
                        >
                            <BeritaComments beritaId={item.id} />
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 flex-shrink-0">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <SidebarTopBerita news={news} currentNewsId={item.id} />
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

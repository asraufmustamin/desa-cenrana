
"use client";

import { useAppContext, NewsItem } from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function NewsDetailPage() {
    const { news } = useAppContext();
    const params = useParams();
    const [item, setItem] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-desa-green border-t-transparent"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 pt-32 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Berita tidak ditemukan</h1>
                <p className="text-gray-600 mb-8">Maaf, berita yang Anda cari tidak tersedia atau telah dihapus.</p>
                <Link
                    href="/berita"
                    className="inline-flex items-center px-6 py-3 bg-desa-green text-white rounded-full hover:bg-desa-dark transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Berita
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/berita"
                    className="inline-flex items-center text-gray-500 hover:text-desa-green mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Daftar Berita
                </Link>

                <article className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="relative h-[400px] w-full">
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
                            <span className="inline-block px-3 py-1 bg-desa-gold rounded-full text-xs font-bold mb-4 text-desa-dark">
                                {item.category || "Berita Desa"}
                            </span>
                            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-shadow">
                                {item.title}
                            </h1>
                            <div className="flex items-center space-x-6 text-sm font-medium text-gray-200">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {item.date}
                                </div>
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Admin Desa
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12">
                        <div className="prose prose-lg max-w-none text-gray-700">
                            <p className="lead text-xl text-gray-600 mb-8 font-medium border-l-4 border-desa-green pl-6 italic">
                                {item.excerpt}
                            </p>
                            {item.content ? (
                                <div className="whitespace-pre-wrap leading-relaxed">{item.content}</div>
                            ) : (
                                <div className="space-y-4">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                    <p>
                                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                            <div className="text-gray-500 text-sm font-medium">
                                Bagikan berita ini:
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-3 rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}

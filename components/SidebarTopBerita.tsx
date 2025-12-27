"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { NewsItem } from "@/context/AppContext";

interface SidebarTopBeritaProps {
    news: NewsItem[];
    currentNewsId?: number;
}

export default function SidebarTopBerita({ news, currentNewsId }: SidebarTopBeritaProps) {
    // Filter out current news and get top 5 latest
    const topNews = news
        .filter(n => n.id !== currentNewsId && n.status !== 'draft')
        .slice(0, 5);

    if (topNews.length === 0) {
        return null;
    }

    return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 sticky top-24">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-[var(--text-primary)]">Berita Terpopuler</h3>
            </div>

            {/* News List */}
            <div className="space-y-4">
                {topNews.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={`/berita/${item.id}`} className="group flex gap-3">
                            {/* Thumbnail */}
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Number Badge */}
                                <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-white">{index + 1}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 group-hover:text-blue-500 transition-colors leading-tight">
                                    {item.title}
                                </h4>
                                <div className="flex items-center gap-1 mt-1.5 text-xs text-[var(--text-secondary)]">
                                    <Calendar className="w-3 h-3" />
                                    <span>{item.date}</span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* View All Link */}
            <Link
                href="/informasi/berita"
                className="mt-5 pt-4 border-t border-[var(--border-color)] flex items-center justify-center gap-1 text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
            >
                Lihat Semua Berita
                <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
    );
}

"use client";

import { useAppContext } from "@/context/AppContext";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight } from "lucide-react";

export default function BeritaPage() {
    const { news } = useAppContext();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        Kabar Desa
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Informasi terkini dan kegiatan terbaru dari Pemerintah Desa Cenrana.
                    </p>
                </div>

                {news.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {news.map((item, index) => {
                            // Defensive coding: Check for invalid image URLs
                            const isInvalidImage = item.image.includes("whatsapp") ||
                                item.image.includes("wa.me") ||
                                item.image.includes("mediacorp.sg");
                            const safeImage = isInvalidImage
                                ? "https://images.unsplash.com/photo-1589923188900-85dae5233271?auto=format&fit=crop&w=800&q=80"
                                : item.image;

                            return (
                                <div
                                    key={item.id}
                                    className="glass-card rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        <Image
                                            src={safeImage}
                                            alt={item.title}
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/10">
                                            {item.category || "Berita"}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col h-[calc(100%-10rem)]">
                                        <div className="flex items-center text-[var(--text-secondary)] text-[10px] mb-2 font-bold uppercase tracking-wider">
                                            <Calendar className="w-3 h-3 mr-1.5" />
                                            {item.date}
                                        </div>
                                        <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-3 mb-4 flex-grow">
                                            {item.excerpt}
                                        </p>
                                        <Link
                                            href={`/berita/${item.id}`}
                                            className="inline-flex items-center text-blue-500 font-bold text-xs hover:translate-x-2 transition-transform mt-auto"
                                        >
                                            Baca Selengkapnya <ChevronRight className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 rounded-full bg-[var(--bg-card)] mb-4">
                            <Calendar className="w-12 h-12 text-[var(--text-secondary)]" />
                        </div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Belum ada berita</h3>
                        <p className="text-[var(--text-secondary)]">Silakan kembali lagi nanti untuk informasi terbaru.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

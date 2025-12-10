
"use client";

import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, User } from "lucide-react";

export default function BeritaPage() {
    const { news } = useAppContext();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 text-glow">Kabar Desa</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Berita terbaru, agenda kegiatan, dan pengumuman resmi dari Pemerintah Desa Cenrana.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news.map((item) => {
                        // Defensive coding: Check for invalid WhatsApp URLs in image field
                        const isInvalidImage = item.image.includes("whatsapp") || item.image.includes("wa.me");
                        const safeImage = isInvalidImage
                            ? "https://images.unsplash.com/photo-1589923188900-85dae5233271?auto=format&fit=crop&w=800&q=80"
                            : item.image;

                        return (
                            <Link href={`/berita/${item.id}`} key={item.id} className="group h-full">
                                <div className="glass-card rounded-[2.5rem] overflow-hidden h-full flex flex-col">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={safeImage}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                                            {item.category || "Berita"}
                                        </div>
                                    </div>
                                    <div className="p-8 flex-grow flex flex-col">
                                        <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs mb-4 font-medium uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                <span>{item.date}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <User className="w-3 h-3 mr-1" />
                                                <span>Admin</span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4 group-hover:text-blue-500 transition-colors line-clamp-2 leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                                            {item.excerpt}
                                        </p>
                                        <div className="flex items-center text-blue-500 font-bold text-sm mt-auto group-hover:translate-x-2 transition-transform">
                                            Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

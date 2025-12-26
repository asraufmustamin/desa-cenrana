/**
 * Global Search API
 * GET /api/search?q=keyword
 * 
 * Mencari di semua konten: Berita, Produk Lapak, Layanan
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface SearchResult {
    type: "berita" | "lapak" | "layanan";
    id: number | string;
    title: string;
    description: string;
    url: string;
    image?: string;
    meta?: Record<string, unknown>;
}

// Data layanan statis (tidak ada di database)
const LAYANAN_DATA = [
    { id: "aspirasi", title: "Layanan Aspirasi", description: "Sampaikan aspirasi dan keluhan Anda", url: "/aspirasi", icon: "MessageSquare" },
    { id: "surat", title: "Layanan Surat Online", description: "Ajukan permohonan surat secara online", url: "/layanan/surat", icon: "FileText" },
    { id: "lapak", title: "Lapak Warga", description: "Jual beli produk UMKM desa", url: "/lapak", icon: "ShoppingBag" },
    { id: "berita", title: "Berita Desa", description: "Informasi dan berita terbaru desa", url: "/informasi/berita", icon: "Newspaper" },
    { id: "galeri", title: "Galeri Foto", description: "Dokumentasi kegiatan desa", url: "/informasi/galeri", icon: "Image" },
    { id: "peta", title: "Peta Desa", description: "Lihat peta wilayah desa", url: "/informasi/peta", icon: "Map" },
    { id: "profil", title: "Profil Desa", description: "Sejarah dan visi misi desa", url: "/profil", icon: "Info" },
    { id: "sotk", title: "Struktur Organisasi", description: "Struktur pemerintahan desa", url: "/profil/sotk", icon: "Users" },
];

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q")?.toLowerCase().trim();
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.length < 2) {
        return NextResponse.json({
            success: false,
            error: "Query minimal 2 karakter",
            results: []
        });
    }

    try {
        const results: SearchResult[] = [];

        // 1. Cari di Berita
        const { data: beritaData } = await supabase
            .from("berita")
            .select("id, title, excerpt, image, date")
            .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
            .eq("status", "published")
            .limit(limit);

        if (beritaData) {
            beritaData.forEach((item) => {
                results.push({
                    type: "berita",
                    id: item.id,
                    title: item.title,
                    description: item.excerpt || "",
                    url: `/berita/${item.id}`,
                    image: item.image,
                    meta: { date: item.date }
                });
            });
        }

        // 2. Cari di Lapak (hanya yang Active)
        const { data: lapakData } = await supabase
            .from("lapak")
            .select("id, title, description, image, price, category")
            .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
            .eq("status", "Active")
            .limit(limit);

        if (lapakData) {
            lapakData.forEach((item) => {
                results.push({
                    type: "lapak",
                    id: item.id,
                    title: item.title,
                    description: item.description || item.category,
                    url: `/lapak?product=${item.id}`,
                    image: item.image,
                    meta: { price: item.price, category: item.category }
                });
            });
        }

        // 3. Cari di Layanan (statis)
        const layananResults = LAYANAN_DATA.filter(
            (l) =>
                l.title.toLowerCase().includes(query) ||
                l.description.toLowerCase().includes(query)
        );

        layananResults.forEach((item) => {
            results.push({
                type: "layanan",
                id: item.id,
                title: item.title,
                description: item.description,
                url: item.url,
                meta: { icon: item.icon }
            });
        });

        // Sort: Layanan first, then berita, then lapak
        results.sort((a, b) => {
            const order = { layanan: 0, berita: 1, lapak: 2 };
            return order[a.type] - order[b.type];
        });

        return NextResponse.json({
            success: true,
            query,
            count: results.length,
            results: results.slice(0, limit)
        });
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json({
            success: false,
            error: "Terjadi kesalahan saat mencari",
            results: []
        }, { status: 500 });
    }
}

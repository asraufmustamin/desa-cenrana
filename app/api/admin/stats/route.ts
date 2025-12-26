/**
 * Admin Stats API
 * GET /api/admin/stats
 * 
 * Endpoint untuk mengambil statistik dashboard
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        // Parallel queries untuk performa
        const [
            aspirasiResult,
            lapakResult,
            beritaResult,
            pendudukResult,
            waSubscribersResult
        ] = await Promise.all([
            // Aspirasi stats
            supabase.from("aspirasi").select("status", { count: "exact" }),

            // Lapak stats
            supabase.from("lapak").select("status, view_count", { count: "exact" }),

            // Berita stats
            supabase.from("berita").select("status", { count: "exact" }),

            // Penduduk count
            supabase.from("penduduk").select("*", { count: "exact", head: true }),

            // WA Subscribers count
            supabase.from("wa_subscribers").select("*", { count: "exact", head: true })
        ]);

        // Process aspirasi stats
        const aspirasiData = aspirasiResult.data || [];
        const aspirasiStats = {
            total: aspirasiResult.count || 0,
            pending: aspirasiData.filter(a => a.status === "Pending").length,
            diproses: aspirasiData.filter(a => a.status === "Diproses").length,
            selesai: aspirasiData.filter(a => a.status === "Selesai").length,
        };

        // Process lapak stats
        const lapakData = lapakResult.data || [];
        const lapakStats = {
            total: lapakResult.count || 0,
            pending: lapakData.filter(l => l.status === "Pending").length,
            active: lapakData.filter(l => l.status === "Active").length,
            totalViews: lapakData.reduce((sum, l) => sum + (l.view_count || 0), 0),
        };

        // Process berita stats
        const beritaData = beritaResult.data || [];
        const beritaStats = {
            total: beritaResult.count || 0,
            published: beritaData.filter(b => b.status === "published").length,
            draft: beritaData.filter(b => b.status === "draft").length,
        };

        return NextResponse.json({
            success: true,
            stats: {
                aspirasi: aspirasiStats,
                lapak: lapakStats,
                berita: beritaStats,
                penduduk: {
                    total: pendudukResult.count || 0,
                },
                waSubscribers: {
                    total: waSubscribersResult.count || 0,
                },
            },
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}

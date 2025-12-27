import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch today's guest list
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get("all") === "true";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let query = supabase
            .from("buku_tamu")
            .select("*")
            .order("waktu_datang", { ascending: false });

        // If not showing all, only show today's entries
        if (!showAll) {
            query = query.gte("waktu_datang", today.toISOString());
        }

        const { data: guests, error } = await query.limit(100);

        if (error) {
            console.error("Error fetching guests:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get queue statistics
        const todayGuests = (guests || []).filter(g =>
            new Date(g.waktu_datang) >= today
        );
        const waiting = todayGuests.filter(g => g.status === "menunggu").length;
        const serving = todayGuests.filter(g => g.status === "dilayani").length;
        const completed = todayGuests.filter(g => g.status === "selesai").length;

        return NextResponse.json({
            guests: guests || [],
            stats: { waiting, serving, completed, total: todayGuests.length }
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Register new guest
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nama, nik, no_hp, alamat, tujuan, keperluan } = body;

        // Validation
        if (!nama || nama.trim().length < 3) {
            return NextResponse.json({ error: "Nama minimal 3 karakter" }, { status: 400 });
        }
        if (!tujuan) {
            return NextResponse.json({ error: "Tujuan kunjungan wajib dipilih" }, { status: 400 });
        }

        // Insert guest
        const { data: newGuest, error } = await supabase
            .from("buku_tamu")
            .insert([{
                nama: nama.trim(),
                nik: nik?.trim() || null,
                no_hp: no_hp?.trim() || null,
                alamat: alamat?.trim() || null,
                tujuan,
                keperluan: keperluan?.trim() || null,
                status: "menunggu"
            }])
            .select()
            .single();

        if (error) {
            console.error("Error inserting guest:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get queue number (count of today's guests)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { count } = await supabase
            .from("buku_tamu")
            .select("*", { count: "exact", head: true })
            .gte("waktu_datang", today.toISOString());

        return NextResponse.json({
            guest: newGuest,
            queueNumber: count || 1,
            message: "Pendaftaran berhasil!"
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

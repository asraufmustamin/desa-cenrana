import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Fetch comments for a specific berita
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const beritaId = parseInt(id);

        if (isNaN(beritaId)) {
            return NextResponse.json({ error: "Invalid berita ID" }, { status: 400 });
        }

        const { data: comments, error } = await supabase
            .from("berita_comments")
            .select("*")
            .eq("berita_id", beritaId)
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) {
            console.error("Error fetching comments:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ comments: comments || [] });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Add new comment
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const beritaId = parseInt(id);

        if (isNaN(beritaId)) {
            return NextResponse.json({ error: "Invalid berita ID" }, { status: 400 });
        }

        const body = await request.json();
        const { nama, komentar } = body;

        // Validation
        if (!nama || nama.trim().length < 2) {
            return NextResponse.json({ error: "Nama minimal 2 karakter" }, { status: 400 });
        }
        if (!komentar || komentar.trim().length < 5) {
            return NextResponse.json({ error: "Komentar minimal 5 karakter" }, { status: 400 });
        }
        if (komentar.trim().length > 1000) {
            return NextResponse.json({ error: "Komentar maksimal 1000 karakter" }, { status: 400 });
        }

        // Insert comment
        const { data: newComment, error } = await supabase
            .from("berita_comments")
            .insert([{
                berita_id: beritaId,
                nama: nama.trim(),
                komentar: komentar.trim()
            }])
            .select()
            .single();

        if (error) {
            console.error("Error inserting comment:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ comment: newComment, message: "Komentar berhasil ditambahkan" });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

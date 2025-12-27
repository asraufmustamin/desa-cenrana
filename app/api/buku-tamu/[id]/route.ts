import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PATCH - Update guest status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const guestId = parseInt(id);

        if (isNaN(guestId)) {
            return NextResponse.json({ error: "Invalid guest ID" }, { status: 400 });
        }

        const body = await request.json();
        const { status, catatan_admin } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (catatan_admin !== undefined) updateData.catatan_admin = catatan_admin;

        // Set waktu_selesai if status is 'selesai'
        if (status === "selesai") {
            updateData.waktu_selesai = new Date().toISOString();
        }

        const { data, error } = await supabase
            .from("buku_tamu")
            .update(updateData)
            .eq("id", guestId)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ guest: data, message: "Status berhasil diupdate" });
    } catch (error) {
        console.error("Error updating guest:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// DELETE - Remove guest entry
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const guestId = parseInt(id);

        if (isNaN(guestId)) {
            return NextResponse.json({ error: "Invalid guest ID" }, { status: 400 });
        }

        const { error } = await supabase
            .from("buku_tamu")
            .delete()
            .eq("id", guestId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Data berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting guest:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

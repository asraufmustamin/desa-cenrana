import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// DELETE - Delete admin user by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const adminId = parseInt(id);

        if (isNaN(adminId)) {
            return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
        }

        // Prevent deleting the last admin
        const { count } = await supabase
            .from("admin_users")
            .select("*", { count: "exact", head: true });

        if (count && count <= 1) {
            return NextResponse.json({ error: "Tidak dapat menghapus admin terakhir" }, { status: 400 });
        }

        const { error } = await supabase
            .from("admin_users")
            .delete()
            .eq("id", adminId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Admin berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

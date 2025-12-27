import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

// POST - Reset admin password
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const adminId = parseInt(id);

        if (isNaN(adminId)) {
            return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
        }

        const body = await request.json();
        const { password } = body;

        if (!password || password.length < 6) {
            return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
        }

        // Hash new password
        const password_hash = await hashPassword(password);

        // Update password
        const { error } = await supabase
            .from("admin_users")
            .update({ password_hash })
            .eq("id", adminId);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Password berhasil direset" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

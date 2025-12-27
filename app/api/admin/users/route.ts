import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

// GET - Fetch all admin users
export async function GET() {
    try {
        const { data: users, error } = await supabase
            .from("admin_users")
            .select("id, username, role, created_at, last_login")
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ users: users || [] });
    } catch (error) {
        console.error("Error fetching admin users:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// POST - Create new admin user
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password, role = "admin" } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Username dan password wajib diisi" }, { status: 400 });
        }

        // Check if username already exists
        const { data: existing } = await supabase
            .from("admin_users")
            .select("id")
            .eq("username", username)
            .single();

        if (existing) {
            return NextResponse.json({ error: "Username sudah digunakan" }, { status: 400 });
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Insert new admin
        const { data: newUser, error } = await supabase
            .from("admin_users")
            .insert([{ username, password_hash, role }])
            .select("id, username, role, created_at")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ user: newUser, message: "Admin berhasil ditambahkan" });
    } catch (error) {
        console.error("Error creating admin user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

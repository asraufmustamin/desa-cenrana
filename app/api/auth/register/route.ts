/**
 * Register Admin API Route (SEMENTARA)
 * POST /api/auth/register
 * 
 * PENTING: Endpoint ini hanya untuk setup awal!
 * Setelah admin pertama dibuat, NONAKTIFKAN endpoint ini
 * dengan menghapus file atau mengembalikan error.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { hashPassword } from "@/lib/auth";

// Set ke false setelah admin pertama dibuat!
const ALLOW_REGISTRATION = false;

export async function POST(request: NextRequest) {
    // Cek apakah registrasi masih diizinkan
    if (!ALLOW_REGISTRATION) {
        return NextResponse.json(
            { error: "Registrasi tidak diizinkan" },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const { username, email, password } = body;

        // Validasi input
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "Username, email, dan password wajib diisi" },
                { status: 400 }
            );
        }

        // Cek password minimal 8 karakter
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password minimal 8 karakter" },
                { status: 400 }
            );
        }

        // Cek apakah username sudah ada
        const { data: existingUser } = await supabase
            .from("admin_users")
            .select("id")
            .eq("username", username)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: "Username sudah digunakan" },
                { status: 400 }
            );
        }

        // Hash password
        const password_hash = await hashPassword(password);

        // Insert ke database
        const { data, error } = await supabase
            .from("admin_users")
            .insert({
                username,
                email,
                password_hash,
                role: "admin",
                is_active: true,
            })
            .select("id, username, email, role")
            .single();

        if (error) {
            console.error("Register error:", error);
            return NextResponse.json(
                { error: "Gagal membuat akun: " + error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Admin berhasil dibuat! Silakan login.",
            user: data,
        });
    } catch (err) {
        console.error("Register error:", err);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

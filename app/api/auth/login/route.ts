/**
 * Login API Route
 * POST /api/auth/login
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth";
import { logFailedLogin, logSecurityEvent } from "@/lib/errorLogger";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validasi input
        if (!username || !password) {
            return NextResponse.json(
                { error: "Username dan password wajib diisi" },
                { status: 400 }
            );
        }

        // Cari user di database
        const { data: user, error } = await supabase
            .from("admin_users")
            .select("id, username, email, password_hash, role, is_active")
            .eq("username", username)
            .single();

        if (error || !user) {
            // Log failed attempt
            await logFailedLogin({ username, reason: "User not found" });
            return NextResponse.json(
                { error: "Username atau password salah" },
                { status: 401 }
            );
        }

        // Cek apakah user aktif
        if (!user.is_active) {
            await logSecurityEvent("Inactive user login attempt", "auth", { username });
            return NextResponse.json(
                { error: "Akun tidak aktif. Hubungi administrator." },
                { status: 403 }
            );
        }

        // Verifikasi password
        const isValid = await verifyPassword(password, user.password_hash);

        if (!isValid) {
            await logFailedLogin({ username, reason: "Invalid password" });
            return NextResponse.json(
                { error: "Username atau password salah" },
                { status: 401 }
            );
        }

        // Buat token
        const token = await createToken({
            userId: user.id,
            username: user.username,
            role: user.role,
        });

        // Set cookie
        await setSessionCookie(token);

        // Update last_login
        await supabase
            .from("admin_users")
            .update({ last_login: new Date().toISOString() })
            .eq("id", user.id);

        // Log successful login
        await logSecurityEvent("Successful login", "auth", { username });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json(
            { error: "Terjadi kesalahan server" },
            { status: 500 }
        );
    }
}

/**
 * Logout API Route
 * POST /api/auth/logout
 */

import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/errorLogger";

export async function POST() {
    try {
        // Get current session for logging
        const session = await getSession();

        if (session) {
            await logSecurityEvent("User logged out", "auth", {
                username: session.username
            });
        }

        // Clear the session cookie
        await clearSessionCookie();

        return NextResponse.json({ success: true, message: "Logout berhasil" });
    } catch (err) {
        console.error("Logout error:", err);
        return NextResponse.json(
            { error: "Terjadi kesalahan saat logout" },
            { status: 500 }
        );
    }
}

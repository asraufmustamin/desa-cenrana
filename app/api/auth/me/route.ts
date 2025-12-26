/**
 * Session Check API Route
 * GET /api/auth/me
 * 
 * Returns current user info if logged in
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                { authenticated: false, user: null },
                { status: 401 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: session.userId,
                username: session.username,
                role: session.role,
            },
        });
    } catch (err) {
        console.error("Session check error:", err);
        return NextResponse.json(
            { authenticated: false, user: null, error: "Session invalid" },
            { status: 401 }
        );
    }
}

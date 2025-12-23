/**
 * Health Check API Endpoint
 * =========================
 * 
 * Endpoint untuk monitoring status website dan database
 * URL: /api/health
 * 
 * Response:
 * - status: "healthy" | "degraded" | "unhealthy"
 * - timestamp: ISO date string
 * - checks: Detail status setiap komponen
 */

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    const startTime = Date.now();

    const checks = {
        api: { status: "healthy" as const, latency: 0 },
        database: { status: "healthy" as "healthy" | "unhealthy", latency: 0 },
    };

    // Check Database Connection
    try {
        const dbStart = Date.now();
        const { error } = await supabase
            .from("berita")
            .select("id")
            .limit(1);

        checks.database.latency = Date.now() - dbStart;

        if (error) {
            checks.database.status = "unhealthy";
        }
    } catch {
        checks.database.status = "unhealthy";
        checks.database.latency = Date.now() - startTime;
    }

    // Determine overall status
    const isHealthy =
        checks.api.status === "healthy" &&
        checks.database.status === "healthy";

    const isDegraded =
        checks.database.latency > 2000; // More than 2 seconds is degraded

    const overallStatus = !isHealthy
        ? "unhealthy"
        : isDegraded
            ? "degraded"
            : "healthy";

    checks.api.latency = Date.now() - startTime;

    const response = {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        checks,
    };

    // Return appropriate HTTP status
    const httpStatus = overallStatus === "healthy" ? 200 :
        overallStatus === "degraded" ? 200 : 503;

    return NextResponse.json(response, { status: httpStatus });
}

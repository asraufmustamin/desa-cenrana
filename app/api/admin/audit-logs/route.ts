/**
 * Audit Logs API
 * GET /api/admin/audit-logs
 * 
 * Endpoint untuk melihat audit logs (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getRecentAuditLogs, getAuditLogsByEntity, EntityType } from "@/lib/auditLog";

export async function GET(request: NextRequest) {
    // Cek autentikasi
    const session = await getSession();
    if (!session) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 }
        );
    }

    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get("entity_type") as EntityType | null;
    const entityId = searchParams.get("entity_id");
    const limit = parseInt(searchParams.get("limit") || "50");

    try {
        let logs;

        if (entityType && entityId) {
            // Filter by specific entity
            logs = await getAuditLogsByEntity(entityType, entityId);
        } else {
            // Get recent logs
            logs = await getRecentAuditLogs(limit);
        }

        return NextResponse.json({
            success: true,
            count: logs.length,
            logs,
        });
    } catch (error) {
        console.error("Audit logs error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch audit logs" },
            { status: 500 }
        );
    }
}

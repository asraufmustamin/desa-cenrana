/**
 * Audit Logging Utility
 * =====================
 * 
 * Mencatat semua aktivitas admin ke database untuk:
 * - Tracking perubahan data
 * - Security monitoring
 * - Compliance dan accountability
 */

import { supabase } from "@/lib/supabase";

// Tipe aksi yang bisa dicatat
export type AuditAction =
    | "LOGIN"
    | "LOGOUT"
    | "CREATE"
    | "UPDATE"
    | "DELETE"
    | "APPROVE"
    | "REJECT"
    | "VIEW"
    | "EXPORT"
    | "SETTINGS_CHANGE";

// Tipe entity yang bisa di-audit
export type EntityType =
    | "user"
    | "berita"
    | "lapak"
    | "aspirasi"
    | "surat"
    | "penduduk"
    | "agenda"
    | "hukum"
    | "pengumuman"
    | "cms"
    | "settings";

interface AuditLogEntry {
    userId?: number;
    username?: string;
    action: AuditAction;
    entityType?: EntityType;
    entityId?: string | number;
    oldValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
}

/**
 * Catat aktivitas ke audit log
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
    try {
        const { error } = await supabase.from("audit_logs").insert({
            user_id: entry.userId || null,
            username: entry.username || "system",
            action: entry.action,
            entity_type: entry.entityType || null,
            entity_id: entry.entityId?.toString() || null,
            old_value: entry.oldValue ? JSON.stringify(entry.oldValue) : null,
            new_value: entry.newValue ? JSON.stringify(entry.newValue) : null,
            description: entry.description || null,
            ip_address: entry.ipAddress || null,
            user_agent: entry.userAgent || null,
        });

        if (error) {
            console.error("Failed to write audit log:", error);
        }
    } catch (error) {
        // Jangan throw error - audit log failure tidak boleh block operasi utama
        console.error("Audit log error:", error);
    }
}

/**
 * Helper: Log aksi CREATE
 */
export async function logCreate(
    entityType: EntityType,
    entityId: string | number,
    newValue: Record<string, unknown>,
    username?: string
): Promise<void> {
    await logAudit({
        username,
        action: "CREATE",
        entityType,
        entityId,
        newValue,
        description: `Created new ${entityType}`,
    });
}

/**
 * Helper: Log aksi UPDATE
 */
export async function logUpdate(
    entityType: EntityType,
    entityId: string | number,
    oldValue: Record<string, unknown>,
    newValue: Record<string, unknown>,
    username?: string
): Promise<void> {
    await logAudit({
        username,
        action: "UPDATE",
        entityType,
        entityId,
        oldValue,
        newValue,
        description: `Updated ${entityType}`,
    });
}

/**
 * Helper: Log aksi DELETE
 */
export async function logDelete(
    entityType: EntityType,
    entityId: string | number,
    oldValue: Record<string, unknown>,
    username?: string
): Promise<void> {
    await logAudit({
        username,
        action: "DELETE",
        entityType,
        entityId,
        oldValue,
        description: `Deleted ${entityType}`,
    });
}

/**
 * Helper: Log LOGIN/LOGOUT
 */
export async function logAuth(
    action: "LOGIN" | "LOGOUT",
    username: string,
    ipAddress?: string,
    userAgent?: string
): Promise<void> {
    await logAudit({
        username,
        action,
        entityType: "user",
        description: `User ${action.toLowerCase()}`,
        ipAddress,
        userAgent,
    });
}

/**
 * Helper: Log APPROVE/REJECT
 */
export async function logModeration(
    action: "APPROVE" | "REJECT",
    entityType: EntityType,
    entityId: string | number,
    reason?: string,
    username?: string
): Promise<void> {
    await logAudit({
        username,
        action,
        entityType,
        entityId,
        description: reason || `${action} ${entityType}`,
    });
}

/**
 * Ambil audit logs terbaru
 */
export async function getRecentAuditLogs(limit: number = 50): Promise<unknown[]> {
    const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Failed to fetch audit logs:", error);
        return [];
    }

    return data || [];
}

/**
 * Ambil audit logs by entity
 */
export async function getAuditLogsByEntity(
    entityType: EntityType,
    entityId: string | number
): Promise<unknown[]> {
    const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId.toString())
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to fetch audit logs by entity:", error);
        return [];
    }

    return data || [];
}

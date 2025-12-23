/**
 * Error Logging Utility
 * =====================
 * 
 * Mencatat error ke console dan Supabase untuk investigasi
 * Berguna untuk mendeteksi serangan atau bug
 */

import { supabase } from "@/lib/supabase";

interface ErrorLog {
    type: "error" | "warning" | "security";
    message: string;
    source: string;
    details?: Record<string, any>;
    userAgent?: string;
}

/**
 * Log error ke console dan database
 */
export async function logError(log: ErrorLog): Promise<void> {
    const timestamp = new Date().toISOString();

    // Always log to console
    console.error(`[${log.type.toUpperCase()}] ${timestamp}`, {
        source: log.source,
        message: log.message,
        details: log.details,
    });

    // Try to log to Supabase (non-blocking)
    try {
        await supabase.from("error_logs").insert({
            type: log.type,
            message: log.message,
            source: log.source,
            details: log.details,
            user_agent: log.userAgent,
            created_at: timestamp,
        });
    } catch (err) {
        // Silently fail - don't want logging to break the app
        console.warn("Failed to log to database:", err);
    }
}

/**
 * Log security event (login gagal, akses terlarang, dll)
 */
export async function logSecurityEvent(
    event: string,
    source: string,
    details?: Record<string, any>
): Promise<void> {
    await logError({
        type: "security",
        message: event,
        source,
        details,
    });
}

/**
 * Log rate limit violation
 */
export async function logRateLimitViolation(
    formType: string,
    details?: Record<string, any>
): Promise<void> {
    await logError({
        type: "security",
        message: `Rate limit exceeded for ${formType}`,
        source: "rate_limiter",
        details,
    });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(
    details?: Record<string, any>
): Promise<void> {
    await logError({
        type: "security",
        message: "Failed login attempt",
        source: "admin_auth",
        details,
    });
}

/**
 * Log suspicious activity
 */
export async function logSuspiciousActivity(
    activity: string,
    source: string,
    details?: Record<string, any>
): Promise<void> {
    await logError({
        type: "security",
        message: `Suspicious: ${activity}`,
        source,
        details,
    });
}

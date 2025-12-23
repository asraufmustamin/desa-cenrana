/**
 * Input Sanitization Utilities
 * ============================
 * 
 * Fungsi untuk membersihkan input user sebelum disimpan ke database
 * Mencegah XSS dan injection attacks
 */

/**
 * Sanitize string input - hapus HTML tags dan trim whitespace
 */
export function sanitizeString(input: string | undefined | null): string {
    if (!input) return "";

    return input
        // Remove HTML tags
        .replace(/<[^>]*>/g, "")
        // Remove script tags specifically
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
        // Trim whitespace
        .trim();
}

/**
 * Sanitize phone number - hanya angka dan beberapa karakter khusus
 */
export function sanitizePhone(input: string | undefined | null): string {
    if (!input) return "";

    return input
        // Hanya izinkan: angka, +, -, spasi, (, )
        .replace(/[^\d+\-\s()]/g, "")
        .trim();
}

/**
 * Sanitize price - hanya angka dan titik/koma
 */
export function sanitizePrice(input: string | undefined | null): string {
    if (!input) return "";

    return input
        // Hanya izinkan: angka, titik, koma, Rp
        .replace(/[^\d.,Rp\s]/g, "")
        .trim();
}

/**
 * Sanitize NIK - hanya 16 digit angka
 */
export function sanitizeNIK(input: string | undefined | null): string {
    if (!input) return "";

    return input
        .replace(/\D/g, "")
        .slice(0, 16);
}

/**
 * Escape HTML entities untuk display aman
 */
export function escapeHtml(input: string): string {
    const htmlEntities: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    };

    return input.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

/**
 * Validasi dan sanitize URL
 */
export function sanitizeUrl(input: string | undefined | null): string {
    if (!input) return "";

    const trimmed = input.trim();

    // Block javascript: dan data: URLs
    if (trimmed.toLowerCase().startsWith("javascript:") ||
        trimmed.toLowerCase().startsWith("data:")) {
        return "";
    }

    return trimmed;
}

/**
 * Sanitize objek form data lengkap
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") {
            sanitized[key] = sanitizeString(value);
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

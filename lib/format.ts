/**
 * Format Utilities
 * ================
 * 
 * Helper functions untuk formatting data
 */

/**
 * Format angka ke format Rupiah
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format angka dengan separator ribuan
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat("id-ID").format(num);
}

/**
 * Format nomor HP Indonesia
 */
export function formatPhone(phone: string): string {
    // Remove non-digits
    const cleaned = phone.replace(/\D/g, "");

    // Format: 0812-3456-7890
    if (cleaned.startsWith("62")) {
        const local = "0" + cleaned.slice(2);
        return local.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
    }

    return cleaned.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
}

/**
 * Format NIK dengan separator
 */
export function formatNIK(nik: string): string {
    const cleaned = nik.replace(/\D/g, "");
    // Format: 7201-0123-4567-0001
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1-$2-$3-$4");
}

/**
 * Truncate text dengan ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitalize each word
 */
export function capitalizeWords(text: string): string {
    return text
        .split(" ")
        .map((word) => capitalize(word))
        .join(" ");
}

/**
 * Slugify text
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

/**
 * Generate random string
 */
export function randomString(length: number = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}

/**
 * Generate unique ID
 */
export function generateId(): string {
    return Date.now().toString(36) + randomString(4);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Parse query string from URL
 */
export function parseQueryString(query: string): Record<string, string> {
    return Object.fromEntries(new URLSearchParams(query));
}

/**
 * Build query string from object
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
    const filtered = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => [key, String(value)]);

    return new URLSearchParams(filtered).toString();
}

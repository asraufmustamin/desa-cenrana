/**
 * Date Utilities
 * ==============
 * 
 * Helper functions untuk manipulasi dan formatting tanggal
 */

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === "string" ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...options,
    };

    return new Intl.DateTimeFormat("id-ID", defaultOptions).format(d);
}

/**
 * Format tanggal singkat (1 Jan 2024)
 */
export function formatDateShort(date: Date | string): string {
    return formatDate(date, { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Format tanggal dengan waktu
 */
export function formatDateTime(date: Date | string): string {
    return formatDate(date, {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Format waktu saja
 */
export function formatTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Format relative time (5 menit yang lalu, kemarin, dll)
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) return "Baru saja";
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay === 1) return "Kemarin";
    if (diffDay < 7) return `${diffDay} hari yang lalu`;
    if (diffWeek < 4) return `${diffWeek} minggu yang lalu`;
    if (diffMonth < 12) return `${diffMonth} bulan yang lalu`;
    return `${diffYear} tahun yang lalu`;
}

/**
 * Cek apakah tanggal adalah hari ini
 */
export function isToday(date: Date | string): boolean {
    const d = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    return d.toDateString() === today.toDateString();
}

/**
 * Cek apakah tanggal adalah kemarin
 */
export function isYesterday(date: Date | string): boolean {
    const d = typeof date === "string" ? new Date(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return d.toDateString() === yesterday.toDateString();
}

/**
 * Tambah hari ke tanggal
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Hitung selisih hari antara dua tanggal
 */
export function daysBetween(date1: Date, date2: Date): number {
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Parse string ke Date dengan timezone Indonesia
 */
export function parseDate(dateString: string): Date {
    return new Date(dateString);
}

/**
 * Format tanggal untuk input type="date"
 */
export function toInputDate(date: Date): string {
    return date.toISOString().split("T")[0];
}

/**
 * Nama hari dalam bahasa Indonesia
 */
export const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/**
 * Nama bulan dalam bahasa Indonesia
 */
export const MONTHS_ID = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

/**
 * Get nama hari
 */
export function getDayName(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return DAYS_ID[d.getDay()];
}

/**
 * Get nama bulan
 */
export function getMonthName(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return MONTHS_ID[d.getMonth()];
}

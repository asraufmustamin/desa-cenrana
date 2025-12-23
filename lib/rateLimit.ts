/**
 * Rate Limiting Utilities
 * Prevents spam submissions using localStorage
 * Cooldown: 60 seconds between submissions
 * Daily Limit: 5 submissions per day per form type
 */

const COOLDOWN_SECONDS = 60; // 1 minute cooldown
const STORAGE_KEY_PREFIX = 'lastSubmit_';
const DAILY_COUNT_PREFIX = 'dailyCount_';
const MAX_DAILY_SUBMISSIONS = 5; // Maximum 5 submissions per day

/**
 * Check if user can submit based on cooldown period
 * @param formType - 'aspirasi' or 'lapak'
 * @returns true if can submit, false if still on cooldown
 */
export function canSubmit(formType: string): boolean {
    if (typeof window === 'undefined') return true; // SSR safety

    const key = `${STORAGE_KEY_PREFIX}${formType}`;
    const lastSubmitStr = localStorage.getItem(key);

    if (!lastSubmitStr) return true; // No previous submit

    const lastSubmitTime = parseInt(lastSubmitStr, 10);
    const now = Date.now();
    const elapsed = (now - lastSubmitTime) / 1000; // Convert to seconds

    return elapsed >= COOLDOWN_SECONDS;
}

/**
 * Check if user has exceeded daily limit
 * @param formType - 'aspirasi' or 'lapak'
 * @returns true if under limit, false if exceeded
 */
export function checkDailyLimit(formType: string): boolean {
    if (typeof window === 'undefined') return true;

    const today = new Date().toDateString();
    const key = `${DAILY_COUNT_PREFIX}${formType}`;
    const stored = localStorage.getItem(key);

    if (!stored) return true;

    try {
        const { date, count } = JSON.parse(stored);
        if (date !== today) return true; // New day, reset
        return count < MAX_DAILY_SUBMISSIONS;
    } catch {
        return true;
    }
}

/**
 * Get remaining daily submissions
 * @param formType - 'aspirasi' or 'lapak'
 */
export function getRemainingDailySubmissions(formType: string): number {
    if (typeof window === 'undefined') return MAX_DAILY_SUBMISSIONS;

    const today = new Date().toDateString();
    const key = `${DAILY_COUNT_PREFIX}${formType}`;
    const stored = localStorage.getItem(key);

    if (!stored) return MAX_DAILY_SUBMISSIONS;

    try {
        const { date, count } = JSON.parse(stored);
        if (date !== today) return MAX_DAILY_SUBMISSIONS;
        return Math.max(0, MAX_DAILY_SUBMISSIONS - count);
    } catch {
        return MAX_DAILY_SUBMISSIONS;
    }
}

/**
 * Record current submission timestamp and daily count
 * @param formType - 'aspirasi' or 'lapak'
 */
export function recordSubmit(formType: string): void {
    if (typeof window === 'undefined') return; // SSR safety

    // Record last submit time
    const key = `${STORAGE_KEY_PREFIX}${formType}`;
    const now = Date.now();
    localStorage.setItem(key, now.toString());

    // Update daily count
    const today = new Date().toDateString();
    const countKey = `${DAILY_COUNT_PREFIX}${formType}`;
    const stored = localStorage.getItem(countKey);

    let count = 1;
    if (stored) {
        try {
            const data = JSON.parse(stored);
            if (data.date === today) {
                count = data.count + 1;
            }
        } catch {
            // Ignore parse errors
        }
    }

    localStorage.setItem(countKey, JSON.stringify({ date: today, count }));
}

/**
 * Get remaining cooldown time in seconds
 * @param formType - 'aspirasi' or 'lapak'
 * @returns seconds remaining, or 0 if can submit
 */
export function getRemainingTime(formType: string): number {
    if (typeof window === 'undefined') return 0; // SSR safety

    const key = `${STORAGE_KEY_PREFIX}${formType}`;
    const lastSubmitStr = localStorage.getItem(key);

    if (!lastSubmitStr) return 0; // No previous submit

    const lastSubmitTime = parseInt(lastSubmitStr, 10);
    const now = Date.now();
    const elapsed = (now - lastSubmitTime) / 1000; // Convert to seconds
    const remaining = COOLDOWN_SECONDS - elapsed;

    return Math.max(0, Math.ceil(remaining)); // Round up, never negative
}

/**
 * Clear submit record (useful for testing/debugging)
 * @param formType - 'aspirasi' or 'lapak'
 */
export function clearSubmitRecord(formType: string): void {
    if (typeof window === 'undefined') return; // SSR safety

    const key = `${STORAGE_KEY_PREFIX}${formType}`;
    const countKey = `${DAILY_COUNT_PREFIX}${formType}`;
    localStorage.removeItem(key);
    localStorage.removeItem(countKey);
}

/**
 * Get cooldown duration constant
 * @returns cooldown duration in seconds
 */
export function getCooldownDuration(): number {
    return COOLDOWN_SECONDS;
}

/**
 * Get max daily submissions constant
 */
export function getMaxDailySubmissions(): number {
    return MAX_DAILY_SUBMISSIONS;
}


/**
 * Rate Limiting Utilities
 * Prevents spam submissions using localStorage
 * Cooldown: 60 seconds between submissions
 */

const COOLDOWN_SECONDS = 60; // 1 minute cooldown
const STORAGE_KEY_PREFIX = 'lastSubmit_';

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
 * Record current submission timestamp
 * @param formType - 'aspirasi' or 'lapak'
 */
export function recordSubmit(formType: string): void {
    if (typeof window === 'undefined') return; // SSR safety

    const key = `${STORAGE_KEY_PREFIX}${formType}`;
    const now = Date.now();
    localStorage.setItem(key, now.toString());
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
    localStorage.removeItem(key);
}

/**
 * Get cooldown duration constant
 * @returns cooldown duration in seconds
 */
export function getCooldownDuration(): number {
    return COOLDOWN_SECONDS;
}

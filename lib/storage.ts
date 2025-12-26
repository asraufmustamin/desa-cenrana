/**
 * Storage Utilities
 * =================
 * 
 * Helper functions untuk localStorage dan sessionStorage
 */

/**
 * Safe localStorage getter with JSON parsing
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
}

/**
 * Safe localStorage setter with JSON stringify
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false;

    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Remove item from localStorage
 */
export function removeLocalStorage(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): boolean {
    if (typeof window === "undefined") return false;

    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error("Error clearing localStorage:", error);
        return false;
    }
}

/**
 * Session storage helpers
 */
export function getSessionStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;

    try {
        const item = sessionStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading sessionStorage key "${key}":`, error);
        return defaultValue;
    }
}

export function setSessionStorage<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false;

    try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
        return false;
    }
}

/**
 * Get storage size info
 */
export function getStorageSize(): { used: number; limit: number; percent: number } {
    if (typeof window === "undefined") {
        return { used: 0, limit: 0, percent: 0 };
    }

    let totalSize = 0;
    for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            totalSize += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
        }
    }

    const limit = 5 * 1024 * 1024; // 5MB typical limit
    return {
        used: totalSize,
        limit,
        percent: Math.round((totalSize / limit) * 100),
    };
}

/**
 * Storage keys yang digunakan di aplikasi
 */
export const STORAGE_KEYS = {
    THEME: "desa-cenrana-theme",
    AUTH_TOKEN: "desa-cenrana-token",
    USER_PREFERENCES: "desa-cenrana-prefs",
    SEARCH_HISTORY: "desa-cenrana-search-history",
    DRAFT_ASPIRASI: "desa-cenrana-draft-aspirasi",
    DRAFT_LAPAK: "desa-cenrana-draft-lapak",
    LAST_VISIT: "desa-cenrana-last-visit",
};

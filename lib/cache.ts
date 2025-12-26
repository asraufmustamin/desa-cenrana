/**
 * Client-Side Caching Utility
 * ============================
 * 
 * Cache data di memory dan localStorage untuk mengurangi
 * request ke database dan mempercepat load time.
 */

interface CacheItem<T> {
    data: T;
    timestamp: number;
    expiry: number; // dalam milidetik
}

// In-memory cache
const memoryCache = new Map<string, CacheItem<unknown>>();

// Default expiry times (dalam milidetik)
export const CACHE_DURATION = {
    SHORT: 1 * 60 * 1000,      // 1 menit
    MEDIUM: 5 * 60 * 1000,     // 5 menit
    LONG: 30 * 60 * 1000,      // 30 menit
    HOUR: 60 * 60 * 1000,      // 1 jam
    DAY: 24 * 60 * 60 * 1000,  // 1 hari
};

/**
 * Set data ke cache
 */
export function setCache<T>(key: string, data: T, expiryMs: number = CACHE_DURATION.MEDIUM): void {
    const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: expiryMs,
    };

    // Simpan ke memory cache
    memoryCache.set(key, cacheItem);

    // Simpan juga ke localStorage untuk persistensi
    try {
        if (typeof window !== "undefined") {
            localStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
        }
    } catch (error) {
        // localStorage mungkin penuh atau disabled
        console.warn("Failed to save cache to localStorage:", error);
    }
}

/**
 * Get data dari cache
 * Returns null jika tidak ada atau sudah expired
 */
export function getCache<T>(key: string): T | null {
    // Cek memory cache dulu (lebih cepat)
    const memoryItem = memoryCache.get(key) as CacheItem<T> | undefined;

    if (memoryItem) {
        if (Date.now() - memoryItem.timestamp < memoryItem.expiry) {
            return memoryItem.data;
        }
        // Expired, hapus dari memory
        memoryCache.delete(key);
    }

    // Cek localStorage
    try {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(`cache_${key}`);
            if (stored) {
                const cacheItem: CacheItem<T> = JSON.parse(stored);

                if (Date.now() - cacheItem.timestamp < cacheItem.expiry) {
                    // Masih valid, restore ke memory cache
                    memoryCache.set(key, cacheItem);
                    return cacheItem.data;
                }

                // Expired, hapus dari localStorage
                localStorage.removeItem(`cache_${key}`);
            }
        }
    } catch (error) {
        console.warn("Failed to read cache from localStorage:", error);
    }

    return null;
}

/**
 * Hapus cache tertentu
 */
export function clearCache(key: string): void {
    memoryCache.delete(key);

    try {
        if (typeof window !== "undefined") {
            localStorage.removeItem(`cache_${key}`);
        }
    } catch (error) {
        console.warn("Failed to clear cache:", error);
    }
}

/**
 * Hapus semua cache
 */
export function clearAllCache(): void {
    memoryCache.clear();

    try {
        if (typeof window !== "undefined") {
            const keysToRemove: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith("cache_")) {
                    keysToRemove.push(key);
                }
            }

            keysToRemove.forEach((key) => localStorage.removeItem(key));
        }
    } catch (error) {
        console.warn("Failed to clear all cache:", error);
    }
}

/**
 * Get data dengan cache-first strategy
 * Jika cache ada dan valid, return cache
 * Jika tidak, fetch data baru dan cache hasilnya
 */
export async function getCachedData<T>(
    key: string,
    fetchFn: () => Promise<T>,
    expiryMs: number = CACHE_DURATION.MEDIUM
): Promise<T> {
    // Cek cache dulu
    const cached = getCache<T>(key);
    if (cached !== null) {
        console.log(`📦 Cache hit: ${key}`);
        return cached;
    }

    // Fetch data baru
    console.log(`🔄 Cache miss, fetching: ${key}`);
    const data = await fetchFn();

    // Simpan ke cache
    setCache(key, data, expiryMs);

    return data;
}

/**
 * Invalidate cache yang match pattern
 * Contoh: invalidateCachePattern("berita") akan menghapus semua cache yang key-nya mengandung "berita"
 */
export function invalidateCachePattern(pattern: string): void {
    // Memory cache
    const keysToDelete: string[] = [];
    memoryCache.forEach((_, key) => {
        if (key.includes(pattern)) {
            keysToDelete.push(key);
        }
    });
    keysToDelete.forEach((key) => memoryCache.delete(key));

    // localStorage
    try {
        if (typeof window !== "undefined") {
            const localKeysToRemove: string[] = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith("cache_") && key.includes(pattern)) {
                    localKeysToRemove.push(key);
                }
            }

            localKeysToRemove.forEach((key) => localStorage.removeItem(key));
        }
    } catch (error) {
        console.warn("Failed to invalidate cache pattern:", error);
    }
}

/**
 * Cache keys untuk konsistensi
 */
export const CACHE_KEYS = {
    BERITA: "berita_list",
    LAPAK: "lapak_list",
    ASPIRASI: "aspirasi_list",
    CMS_CONTENT: "cms_content",
    PENDUDUK: "penduduk_list",
    AGENDA: "agenda_list",
    HUKUM: "hukum_list",
    PENGUMUMAN: "pengumuman_list",
};

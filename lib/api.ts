/**
 * API Utilities
 * =============
 * 
 * Helper functions untuk API calls
 */

interface APIResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

/**
 * Fetch wrapper dengan error handling
 */
export async function fetchAPI<T>(
    url: string,
    options: RequestInit = {}
): Promise<APIResponse<T>> {
    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error || data.message || `Error ${response.status}`,
                status: response.status,
            };
        }

        return {
            data: data as T,
            error: null,
            status: response.status,
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : "Network error",
            status: 0,
        };
    }
}

/**
 * GET request
 */
export async function get<T>(url: string): Promise<APIResponse<T>> {
    return fetchAPI<T>(url, { method: "GET" });
}

/**
 * POST request
 */
export async function post<T>(url: string, body: unknown): Promise<APIResponse<T>> {
    return fetchAPI<T>(url, {
        method: "POST",
        body: JSON.stringify(body),
    });
}

/**
 * PUT request
 */
export async function put<T>(url: string, body: unknown): Promise<APIResponse<T>> {
    return fetchAPI<T>(url, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request
 */
export async function del<T>(url: string): Promise<APIResponse<T>> {
    return fetchAPI<T>(url, { method: "DELETE" });
}

/**
 * Upload file
 */
export async function uploadFile<T>(
    url: string,
    file: File,
    fieldName: string = "file"
): Promise<APIResponse<T>> {
    try {
        const formData = new FormData();
        formData.append(fieldName, file);

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                data: null,
                error: data.error || `Error ${response.status}`,
                status: response.status,
            };
        }

        return {
            data: data as T,
            error: null,
            status: response.status,
        };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : "Upload failed",
            status: 0,
        };
    }
}

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: "/api/auth/login",
    AUTH_LOGOUT: "/api/auth/logout",
    AUTH_ME: "/api/auth/me",
    AUTH_REGISTER: "/api/auth/register",

    // Data
    BERITA: "/api/berita",
    ASPIRASI: "/api/aspirasi",
    LAPAK: "/api/lapak",
    PENDUDUK: "/api/penduduk",
    SURAT: "/api/surat",

    // Admin
    ADMIN_STATS: "/api/admin/stats",
    ADMIN_AUDIT: "/api/admin/audit-logs",

    // Utils
    SEARCH: "/api/search",
    HEALTH: "/api/health",
};

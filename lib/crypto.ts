/**
 * Crypto Utilities
 * Hash NIK for privacy-preserving validation
 */

export async function hashNIK(nik: string): Promise<string> {
    // Use Web Crypto API for SHA-256 hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(nik);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

/**
 * Validate NIK format
 * NIK must be exactly 16 digits
 */
export function validateNIKFormat(nik: string): boolean {
    return /^\d{16}$/.test(nik);
}

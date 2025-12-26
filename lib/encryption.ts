/**
 * Encryption Utility for Sensitive Data
 * ======================================
 * 
 * Enkripsi data sensitif (NIK, NoHP) menggunakan AES-256-GCM
 * Data bisa di-encrypt dan di-decrypt (two-way)
 * 
 * PENTING: Tambahkan ENCRYPTION_KEY ke .env:
 * ENCRYPTION_KEY=your-32-character-secret-key-here
 */

// Encryption key dari environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key-change-in-production!";

/**
 * Convert string ke Uint8Array
 */
function stringToBytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}

/**
 * Convert Uint8Array ke string
 */
function bytesToString(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
}

/**
 * Convert Uint8Array ke Base64
 */
function bytesToBase64(bytes: Uint8Array): string {
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

/**
 * Convert Base64 ke Uint8Array
 */
function base64ToBytes(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

/**
 * Generate key dari string menggunakan PBKDF2
 */
async function getKey(): Promise<CryptoKey> {
    const keyBytes = stringToBytes(ENCRYPTION_KEY);
    const saltBytes = stringToBytes("desa-cenrana-salt");

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        keyBytes.buffer as ArrayBuffer,
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: saltBytes.buffer as ArrayBuffer,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypt data sensitif (NIK, NoHP, dll)
 * @param plaintext - Data yang akan dienkripsi
 * @returns Base64 encoded encrypted data
 */
export async function encryptData(plaintext: string): Promise<string> {
    try {
        const key = await getKey();
        const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
        const plaintextBytes = stringToBytes(plaintext);

        const encrypted = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
            key,
            plaintextBytes.buffer as ArrayBuffer
        );

        // Combine IV + encrypted data
        const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
        combined.set(iv);
        combined.set(new Uint8Array(encrypted), iv.length);

        return bytesToBase64(combined);
    } catch (error) {
        console.error("Encryption error:", error);
        throw new Error("Gagal mengenkripsi data");
    }
}

/**
 * Decrypt data sensitif
 * @param ciphertext - Base64 encoded encrypted data
 * @returns Decrypted plaintext
 */
export async function decryptData(ciphertext: string): Promise<string> {
    try {
        const key = await getKey();
        const combined = base64ToBytes(ciphertext);

        // Extract IV (first 12 bytes) and encrypted data
        const iv = combined.slice(0, 12);
        const encrypted = combined.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv.buffer as ArrayBuffer },
            key,
            encrypted.buffer as ArrayBuffer
        );

        return bytesToString(new Uint8Array(decrypted));
    } catch (error) {
        console.error("Decryption error:", error);
        throw new Error("Gagal mendekripsi data");
    }
}

/**
 * Mask NIK untuk tampilan publik (hanya tampilkan 4 digit terakhir)
 * @param nik - NIK asli atau terenkripsi
 * @returns NIK dengan mask (contoh: ****-****-****-1234)
 */
export function maskNIK(nik: string): string {
    if (!nik || nik.length < 4) return "****";
    const lastFour = nik.slice(-4);
    return `****-****-****-${lastFour}`;
}

/**
 * Mask nomor HP untuk tampilan publik
 * @param phone - Nomor HP asli
 * @returns Nomor HP dengan mask (contoh: 0812****5678)
 */
export function maskPhone(phone: string): string {
    if (!phone || phone.length < 8) return "****";
    const first = phone.slice(0, 4);
    const last = phone.slice(-4);
    return `${first}****${last}`;
}

/**
 * Cek apakah string adalah data terenkripsi (Base64 dengan panjang tertentu)
 */
export function isEncrypted(data: string): boolean {
    // Encrypted data biasanya lebih panjang dari data asli
    // NIK 16 digit + IV + overhead = > 40 karakter Base64
    if (!data || data.length < 40) return false;

    // Cek apakah valid Base64
    try {
        atob(data);
        return true;
    } catch {
        return false;
    }
}

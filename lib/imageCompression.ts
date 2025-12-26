/**
 * Image Compression Utility
 * =========================
 * 
 * Mengompresi gambar sebelum upload ke database
 * Mengurangi ukuran file hingga 70-90% tanpa kehilangan kualitas yang signifikan
 */

interface CompressOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;  // 0.1 - 1.0
    format?: "jpeg" | "webp";
}

const defaultOptions: CompressOptions = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    format: "webp",  // WebP lebih kecil dari JPEG
};

/**
 * Kompres gambar dari File object
 * @param file - File gambar dari input
 * @param options - Opsi kompresi
 * @returns Promise<string> - Base64 string gambar terkompresi
 */
export async function compressImage(
    file: File,
    options: CompressOptions = {}
): Promise<string> {
    const opts = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let { width, height } = img;

                // Hitung dimensi baru dengan menjaga rasio aspek
                if (width > opts.maxWidth! || height > opts.maxHeight!) {
                    const ratio = Math.min(
                        opts.maxWidth! / width,
                        opts.maxHeight! / height
                    );
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }

                // Gambar dengan kualitas tinggi
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, width, height);

                // Konversi ke format yang diinginkan
                const mimeType = opts.format === "webp" ? "image/webp" : "image/jpeg";
                const base64 = canvas.toDataURL(mimeType, opts.quality);

                resolve(base64);
            };

            img.onerror = () => {
                reject(new Error("Failed to load image"));
            };

            img.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Kompres gambar dari URL atau Base64
 * @param src - URL atau Base64 string gambar
 * @param options - Opsi kompresi
 * @returns Promise<string> - Base64 string gambar terkompresi
 */
export async function compressImageFromSrc(
    src: string,
    options: CompressOptions = {}
): Promise<string> {
    const opts = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;

            // Hitung dimensi baru
            if (width > opts.maxWidth! || height > opts.maxHeight!) {
                const ratio = Math.min(
                    opts.maxWidth! / width,
                    opts.maxHeight! / height
                );
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
                reject(new Error("Canvas context not available"));
                return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            const mimeType = opts.format === "webp" ? "image/webp" : "image/jpeg";
            const base64 = canvas.toDataURL(mimeType, opts.quality);

            resolve(base64);
        };

        img.onerror = () => {
            reject(new Error("Failed to load image from source"));
        };

        img.src = src;
    });
}

/**
 * Dapatkan ukuran file dalam bytes dari Base64 string
 */
export function getBase64Size(base64: string): number {
    // Hapus header data:image/...;base64,
    const base64Data = base64.split(",")[1] || base64;
    // Hitung ukuran
    const padding = base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0;
    return Math.floor((base64Data.length * 3) / 4) - padding;
}

/**
 * Format ukuran file ke string yang mudah dibaca
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Cek apakah Base64 string terlalu besar untuk database
 * Rekomendasi: Max 500KB untuk Base64 di Supabase
 */
export function isImageTooLarge(base64: string, maxKB: number = 500): boolean {
    const size = getBase64Size(base64);
    return size > maxKB * 1024;
}

import { supabase } from "./supabase";

/**
 * Upload image to Supabase Storage with auto-compression
 * @param file - Image file to upload
 * @param ticketCode - Ticket code for unique filename
 * @returns Public URL of uploaded image
 */
export async function uploadAspirasiImage(
    file: File,
    ticketCode: string
): Promise<string> {
    try {
        // Compress image if needed
        const compressedFile = await compressImage(file);

        // Generate unique filename
        const timestamp = Date.now();
        const fileExt = file.name.split('.').pop();
        const fileName = `${ticketCode}_${timestamp}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('aspirasi-images')
            .upload(fileName, compressedFile, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            throw new Error(`Gagal upload gambar: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('aspirasi-images')
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (error: any) {
        console.error('Upload failed:', error);
        throw new Error(error.message || 'Gagal upload gambar');
    }
}

/**
 * Compress image to reduce file size
 * Max width: 1920px, Quality: 0.8, Max size: 1MB
 */
async function compressImage(file: File): Promise<File> {
    // If file is already small enough, return as is
    if (file.size <= 1024 * 1024) { // 1MB
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 1920;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Gagal compress gambar'));
                        }
                    },
                    'image/webp',
                    0.8 // Quality
                );
            };
            img.onerror = () => reject(new Error('Gagal load gambar'));
        };
        reader.onerror = () => reject(new Error('Gagal baca file'));
    });
}

/**
 * Validate image file
 * @param file - File to validate
 * @returns true if valid, throws error if invalid
 */
export function validateImageFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Format file harus JPG, PNG, atau WebP');
    }

    if (file.size > maxSize) {
        throw new Error('Ukuran file maksimal 5MB');
    }

    return true;
}

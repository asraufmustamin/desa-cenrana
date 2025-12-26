/**
 * WhatsApp Notification Utility
 * =============================
 * 
 * Mengirim notifikasi WhatsApp ke warga menggunakan WhatsApp API link
 * Note: Ini menggunakan wa.me link untuk membuka WhatsApp dengan pesan pre-filled
 * Untuk auto-send, diperlukan WhatsApp Business API (berbayar)
 */

/**
 * Generate WhatsApp link untuk notifikasi
 * @param phone - Nomor HP warga (format: 08xxx atau 628xxx)
 * @param message - Pesan yang akan dikirim
 * @returns URL WhatsApp yang bisa dibuka di browser
 */
export function generateWhatsAppLink(phone: string, message: string): string {
    // Normalize phone number
    let normalizedPhone = phone.replace(/\D/g, ""); // Hapus semua non-digit

    // Ubah 08xx ke 628xx
    if (normalizedPhone.startsWith("0")) {
        normalizedPhone = "62" + normalizedPhone.slice(1);
    }

    // Encode message
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

/**
 * Generate pesan notifikasi aspirasi
 */
export function generateAspirasiNotification(data: {
    ticketCode: string;
    status: string;
    reply?: string;
    category?: string;
}): string {
    const statusEmoji = {
        "Pending": "⏳",
        "Diproses": "🔄",
        "Selesai": "✅",
    }[data.status] || "📋";

    let message = `*NOTIFIKASI ASPIRASI DESA CENRANA* ${statusEmoji}\n\n`;
    message += `Kode Tiket: *${data.ticketCode}*\n`;
    message += `Status: *${data.status}*\n`;

    if (data.category) {
        message += `Kategori: ${data.category}\n`;
    }

    if (data.reply) {
        message += `\n📝 *Balasan Admin:*\n${data.reply}\n`;
    }

    message += `\n---\n`;
    message += `_Pesan ini dikirim otomatis dari Sistem Informasi Desa Cenrana_`;

    return message;
}

/**
 * Generate pesan notifikasi lapak
 */
export function generateLapakNotification(data: {
    productName: string;
    status: "Active" | "Rejected";
    reason?: string;
}): string {
    const statusEmoji = data.status === "Active" ? "✅" : "❌";
    const statusText = data.status === "Active" ? "DISETUJUI" : "DITOLAK";

    let message = `*NOTIFIKASI LAPAK WARGA* ${statusEmoji}\n\n`;
    message += `Produk: *${data.productName}*\n`;
    message += `Status: *${statusText}*\n`;

    if (data.status === "Active") {
        message += `\n🎉 Selamat! Produk Anda sudah tayang di Lapak Warga Desa Cenrana.\n`;
    } else if (data.reason) {
        message += `\n❌ Alasan: ${data.reason}\n`;
    }

    message += `\n---\n`;
    message += `_Pesan ini dikirim otomatis dari Sistem Informasi Desa Cenrana_`;

    return message;
}

/**
 * Generate pesan notifikasi surat
 */
export function generateSuratNotification(data: {
    jenisSurat: string;
    status: string;
    catatan?: string;
}): string {
    const statusEmoji = {
        "Diterima": "📥",
        "Diproses": "🔄",
        "Selesai": "✅",
        "Ditolak": "❌",
    }[data.status] || "📋";

    let message = `*NOTIFIKASI LAYANAN SURAT* ${statusEmoji}\n\n`;
    message += `Jenis Surat: *${data.jenisSurat}*\n`;
    message += `Status: *${data.status}*\n`;

    if (data.status === "Selesai") {
        message += `\n✅ Surat Anda sudah siap diambil di Kantor Desa Cenrana.\n`;
    }

    if (data.catatan) {
        message += `\n📝 *Catatan:*\n${data.catatan}\n`;
    }

    message += `\n---\n`;
    message += `_Pesan ini dikirim otomatis dari Sistem Informasi Desa Cenrana_`;

    return message;
}

/**
 * Buka WhatsApp di tab baru (untuk digunakan di client-side)
 */
export function openWhatsApp(phone: string, message: string): void {
    if (typeof window !== "undefined") {
        const link = generateWhatsAppLink(phone, message);
        window.open(link, "_blank");
    }
}

/**
 * Copy pesan ke clipboard dan buka WhatsApp
 */
export async function copyAndOpenWhatsApp(phone: string, message: string): Promise<boolean> {
    if (typeof window !== "undefined") {
        try {
            await navigator.clipboard.writeText(message);
            openWhatsApp(phone, message);
            return true;
        } catch (error) {
            console.error("Failed to copy message:", error);
            openWhatsApp(phone, message);
            return false;
        }
    }
    return false;
}

/**
 * QR Code Generator
 * =================
 * 
 * Generate QR code untuk berbagai keperluan
 * Menggunakan API eksternal untuk generate QR
 */

/**
 * Generate URL QR code dari text
 */
export function getQRCodeURL(text: string, size: number = 200): string {
    const encoded = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
}

/**
 * Generate QR code untuk aspirasi tracking
 */
export function getAspirasiQRCode(ticketCode: string, baseUrl: string = ""): string {
    const trackingUrl = `${baseUrl}/aspirasi/track?code=${ticketCode}`;
    return getQRCodeURL(trackingUrl);
}

/**
 * Generate QR code untuk WhatsApp
 */
export function getWhatsAppQRCode(phone: string, message: string = ""): string {
    let normalizedPhone = phone.replace(/\D/g, "");
    if (normalizedPhone.startsWith("0")) {
        normalizedPhone = "62" + normalizedPhone.slice(1);
    }
    const waUrl = `https://wa.me/${normalizedPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
    return getQRCodeURL(waUrl);
}

/**
 * Generate QR code untuk produk lapak
 */
export function getLapakQRCode(productId: string, baseUrl: string = ""): string {
    const productUrl = `${baseUrl}/lapak?id=${productId}`;
    return getQRCodeURL(productUrl);
}

/**
 * Generate QR code untuk surat keterangan
 */
export function getSuratQRCode(suratId: string, baseUrl: string = ""): string {
    const verifyUrl = `${baseUrl}/verify/${suratId}`;
    return getQRCodeURL(verifyUrl);
}

/**
 * Generate QR code untuk vCard (contact)
 */
export function getVCardQRCode(contact: {
    name: string;
    phone?: string;
    email?: string;
    organization?: string;
    address?: string;
}): string {
    const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${contact.name}`,
        contact.organization && `ORG:${contact.organization}`,
        contact.phone && `TEL:${contact.phone}`,
        contact.email && `EMAIL:${contact.email}`,
        contact.address && `ADR:;;${contact.address};;;;`,
        "END:VCARD"
    ].filter(Boolean).join("\n");

    return getQRCodeURL(vcard, 250);
}

/**
 * Generate QR code untuk WiFi
 */
export function getWiFiQRCode(ssid: string, password: string, encryption: "WPA" | "WEP" | "nopass" = "WPA"): string {
    const wifi = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    return getQRCodeURL(wifi);
}

/**
 * Download QR code sebagai image
 */
export async function downloadQRCode(text: string, filename: string = "qrcode"): Promise<void> {
    try {
        const response = await fetch(getQRCodeURL(text, 500));
        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to download QR code:", error);
    }
}

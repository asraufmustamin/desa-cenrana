/**
 * Share Utilities
 * ===============
 * 
 * Functions untuk share content ke berbagai platform
 */

/**
 * Share menggunakan Web Share API (mobile)
 */
export async function shareNative(data: {
    title: string;
    text?: string;
    url?: string;
}): Promise<boolean> {
    if (typeof navigator !== "undefined" && navigator.share) {
        try {
            await navigator.share(data);
            return true;
        } catch (error) {
            console.log("Share cancelled or failed");
            return false;
        }
    }
    return false;
}

/**
 * Share ke WhatsApp
 */
export function shareWhatsApp(text: string, url?: string): void {
    const message = url ? `${text}\n\n${url}` : text;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
}

/**
 * Share ke Facebook
 */
export function shareFacebook(url: string): void {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
}

/**
 * Share ke Twitter/X
 */
export function shareTwitter(text: string, url?: string): void {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${url ? `&url=${encodeURIComponent(url)}` : ""}`;
    window.open(tweetUrl, "_blank", "width=600,height=400");
}

/**
 * Share ke Telegram
 */
export function shareTelegram(text: string, url?: string): void {
    const message = url ? `${text}\n${url}` : text;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url || "")}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, "_blank");
}

/**
 * Share via Email
 */
export function shareEmail(subject: string, body: string): void {
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
}

/**
 * Copy link to clipboard
 */
export async function copyLink(url: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(url);
        return true;
    } catch (error) {
        console.error("Failed to copy link:", error);
        return false;
    }
}

/**
 * Get current page URL
 */
export function getCurrentUrl(): string {
    if (typeof window !== "undefined") {
        return window.location.href;
    }
    return "";
}

/**
 * Share berita
 */
export async function shareBerita(berita: {
    title: string;
    url: string;
}): Promise<void> {
    const shared = await shareNative({
        title: berita.title,
        text: `Baca berita: ${berita.title}`,
        url: berita.url,
    });

    if (!shared) {
        // Fallback to WhatsApp
        shareWhatsApp(`${berita.title}`, berita.url);
    }
}

/**
 * Share produk lapak
 */
export async function shareLapak(produk: {
    title: string;
    price: string;
    url: string;
}): Promise<void> {
    const text = `📦 ${produk.title}\n💰 ${produk.price}\n\nLihat di Lapak Warga Desa Cenrana`;

    const shared = await shareNative({
        title: produk.title,
        text,
        url: produk.url,
    });

    if (!shared) {
        shareWhatsApp(text, produk.url);
    }
}

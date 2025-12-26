/**
 * SEO Metadata Generator
 * ======================
 * 
 * Helper untuk generate metadata SEO yang konsisten
 */

interface SEOConfig {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "product";
    publishedTime?: string;
    author?: string;
    keywords?: string[];
}

const SITE_NAME = "Desa Cenrana";
const BASE_URL = "https://desacenrana.id";
const DEFAULT_IMAGE = "/og-image.png";
const DEFAULT_DESCRIPTION = "Website Resmi Pemerintah Desa Cenrana - Layanan publik digital, aspirasi warga, lapak UMKM, dan informasi desa.";

/**
 * Generate metadata object untuk Next.js
 */
export function generateMetadata(config: SEOConfig) {
    const {
        title,
        description = DEFAULT_DESCRIPTION,
        image = DEFAULT_IMAGE,
        url = BASE_URL,
        type = "website",
        publishedTime,
        author = "Pemerintah Desa Cenrana",
        keywords = [],
    } = config;

    const fullTitle = `${title} | ${SITE_NAME}`;
    const imageUrl = image.startsWith("http") ? image : `${BASE_URL}${image}`;

    return {
        title: fullTitle,
        description,
        keywords: [
            "Desa Cenrana",
            "Kabupaten Maros",
            "Sulawesi Selatan",
            "Website Desa",
            ...keywords,
        ],
        authors: [{ name: author }],
        openGraph: {
            title: fullTitle,
            description,
            url,
            siteName: SITE_NAME,
            images: [{ url: imageUrl, width: 1200, height: 630 }],
            locale: "id_ID",
            type,
            ...(publishedTime && { publishedTime }),
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}

/**
 * Generate metadata untuk halaman berita
 */
export function generateBeritaMetadata(berita: {
    title: string;
    excerpt?: string;
    image?: string;
    slug?: string;
    published_at?: string;
    author?: string;
}) {
    return generateMetadata({
        title: berita.title,
        description: berita.excerpt,
        image: berita.image,
        url: `${BASE_URL}/berita/${berita.slug}`,
        type: "article",
        publishedTime: berita.published_at,
        author: berita.author,
        keywords: ["berita desa", "informasi desa", "pengumuman"],
    });
}

/**
 * Generate metadata untuk halaman produk lapak
 */
export function generateLapakMetadata(produk: {
    title: string;
    description?: string;
    image?: string;
    id?: string;
    price?: number;
}) {
    return generateMetadata({
        title: produk.title,
        description: produk.description || `Beli ${produk.title} di Lapak Warga Desa Cenrana`,
        image: produk.image,
        url: `${BASE_URL}/lapak?id=${produk.id}`,
        type: "product",
        keywords: ["lapak warga", "UMKM desa", "produk lokal", "belanja online"],
    });
}

/**
 * Generate JSON-LD structured data untuk berita
 */
export function generateBeritaJSONLD(berita: {
    title: string;
    description?: string;
    image?: string;
    published_at?: string;
    author?: string;
    slug?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: berita.title,
        description: berita.description,
        image: berita.image,
        datePublished: berita.published_at,
        author: {
            "@type": "Organization",
            name: berita.author || "Pemerintah Desa Cenrana",
        },
        publisher: {
            "@type": "Organization",
            name: "Pemerintah Desa Cenrana",
            logo: {
                "@type": "ImageObject",
                url: `${BASE_URL}/logo-desa.png`,
            },
        },
    };
}

/**
 * Generate JSON-LD structured data untuk organisasi
 */
export function generateOrganizationJSONLD() {
    return {
        "@context": "https://schema.org",
        "@type": "GovernmentOrganization",
        name: "Pemerintah Desa Cenrana",
        url: BASE_URL,
        logo: `${BASE_URL}/logo-desa.png`,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Cenrana",
            addressRegion: "Sulawesi Selatan",
            addressCountry: "ID",
        },
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "Indonesian",
        },
    };
}

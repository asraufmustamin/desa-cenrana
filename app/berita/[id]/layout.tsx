import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Detail Berita | Desa Cenrana",
    description: "Baca berita lengkap dari Desa Cenrana, Kabupaten Maros. Informasi terkini tentang kegiatan, pembangunan, dan program desa.",
    openGraph: {
        title: "Detail Berita | Desa Cenrana",
        description: "Baca berita lengkap dari Desa Cenrana, Kabupaten Maros. Informasi terkini tentang kegiatan, pembangunan, dan program desa.",
        type: "article",
        siteName: "Sistem Informasi Desa Cenrana",
    },
    twitter: {
        card: "summary_large_image",
        title: "Detail Berita | Desa Cenrana",
        description: "Baca berita lengkap dari Desa Cenrana, Kabupaten Maros.",
    },
};

export default function BeritaDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

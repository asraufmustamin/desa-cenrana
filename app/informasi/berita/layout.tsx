import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Berita Desa - Kabar Terbaru",
    description: "Berita, pengumuman, dan informasi terbaru dari Pemerintah Desa Cenrana. Ikuti perkembangan kegiatan dan pembangunan desa.",
    keywords: [
        "Berita Desa Cenrana",
        "Kabar Desa",
        "Pengumuman Desa",
        "Kegiatan Desa Maros"
    ],
    openGraph: {
        title: "Berita Desa Cenrana",
        description: "Berita dan pengumuman terbaru dari Desa Cenrana",
        type: "website",
    },
};

export default function BeritaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

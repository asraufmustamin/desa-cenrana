import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Galeri Desa - Dokumentasi Foto",
    description: "Galeri foto kegiatan, pembangunan, dan momen penting Desa Cenrana. Dokumentasi visual kehidupan masyarakat desa.",
    keywords: [
        "Galeri Desa Cenrana",
        "Foto Desa",
        "Dokumentasi Desa",
        "Kegiatan Desa Maros"
    ],
    openGraph: {
        title: "Galeri Foto Desa Cenrana",
        description: "Dokumentasi foto kegiatan dan momen penting Desa Cenrana",
        type: "website",
    },
};

export default function GaleriLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

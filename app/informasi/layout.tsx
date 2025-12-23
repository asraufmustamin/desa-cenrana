import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Informasi Desa",
    description: "Informasi lengkap Desa Cenrana: berita, agenda kegiatan, galeri foto, infografis, peta desa, transparansi anggaran, dan produk hukum.",
    keywords: [
        "Informasi Desa Cenrana",
        "Berita Desa",
        "Agenda Desa",
        "Transparansi Desa",
        "Peta Desa Maros"
    ],
    openGraph: {
        title: "Informasi Desa Cenrana",
        description: "Berita, agenda, galeri, dan informasi publik Desa Cenrana",
        type: "website",
    },
};

export default function InformasiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

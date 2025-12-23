import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Struktur Organisasi - SOTK Desa",
    description: "Struktur Organisasi dan Tata Kerja (SOTK) Pemerintah Desa Cenrana. Profil perangkat desa, BPD, dan lembaga kemasyarakatan.",
    keywords: [
        "SOTK Desa Cenrana",
        "Struktur Organisasi Desa",
        "Perangkat Desa",
        "BPD Desa Cenrana"
    ],
    openGraph: {
        title: "Struktur Organisasi Desa Cenrana",
        description: "SOTK dan profil perangkat Pemerintah Desa Cenrana",
        type: "website",
    },
};

export default function SOTKLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

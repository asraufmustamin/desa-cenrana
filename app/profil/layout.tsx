import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profil Desa",
    description: "Profil lengkap Desa Cenrana: sejarah desa, visi misi, sambutan Kepala Desa, struktur organisasi (SOTK), lembaga desa, potensi, dan sarana prasarana.",
    keywords: [
        "Profil Desa Cenrana",
        "Sejarah Desa",
        "Visi Misi Desa",
        "SOTK Desa",
        "Kepala Desa Cenrana"
    ],
    openGraph: {
        title: "Profil Desa Cenrana",
        description: "Sejarah, visi misi, dan struktur organisasi Desa Cenrana",
        type: "website",
    },
};

export default function ProfilLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

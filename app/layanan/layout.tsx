import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Layanan Desa",
    description: "Layanan publik Desa Cenrana: pengajuan surat, verifikasi dokumen, dan layanan administrasi lainnya secara online.",
    keywords: [
        "Layanan Desa Cenrana",
        "Surat Online Desa",
        "Administrasi Desa",
        "Pelayanan Publik",
        "E-Government Desa"
    ],
    openGraph: {
        title: "Layanan Desa Cenrana",
        description: "Layanan administrasi dan surat-menyurat online",
        type: "website",
    },
};

export default function LayananLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Layanan Aspirasi - Pengaduan Warga",
    description: "Sampaikan aspirasi, laporan, atau keluhan Anda kepada Pemerintah Desa Cenrana. Layanan pengaduan transparan dengan tracking status realtime.",
    keywords: [
        "Aspirasi Warga",
        "Pengaduan Desa",
        "Lapor Desa Cenrana",
        "Layanan Publik",
        "Keluhan Warga"
    ],
    openGraph: {
        title: "Layanan Aspirasi - Pengaduan Warga Desa Cenrana",
        description: "Sampaikan aspirasi dan keluhan Anda dengan tracking status realtime",
        type: "website",
    },
};

export default function AspirasiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

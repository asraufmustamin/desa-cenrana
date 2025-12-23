import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lapak Warga - Marketplace UMKM Desa",
    description: "Jual beli produk UMKM warga Desa Cenrana. Temukan hasil tani, produk kerajinan, jasa warga, dan barang bekas dengan harga terjangkau.",
    keywords: [
        "Lapak Warga",
        "UMKM Desa Cenrana",
        "Jual Beli Desa",
        "Produk Lokal Maros",
        "Marketplace Desa"
    ],
    openGraph: {
        title: "Lapak Warga - Marketplace UMKM Desa Cenrana",
        description: "Jual beli produk UMKM warga desa dengan harga terjangkau",
        type: "website",
    },
};

export default function LapakLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

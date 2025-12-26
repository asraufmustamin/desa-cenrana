
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/context/AppContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/Toast";
import { ScrollToTop } from "@/components/FloatingActionButton";
import PWAProvider from "@/components/PWAProvider";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: {
        default: "Sistem Informasi Desa Cenrana",
        template: "%s | Desa Cenrana"
    },
    description: "Website Resmi Pemerintah Desa Cenrana, Kabupaten Maros - Layanan publik digital, aspirasi warga, lapak UMKM, dan informasi desa.",
    keywords: [
        "Desa Cenrana",
        "Sistem Informasi Desa",
        "Kabupaten Maros",
        "Sulawesi Selatan",
        "Pelayanan Desa",
        "Aspirasi Warga",
        "Lapak UMKM Desa",
        "Website Desa"
    ],
    authors: [{ name: "Pemerintah Desa Cenrana" }],
    creator: "Pemerintah Desa Cenrana",
    publisher: "Pemerintah Desa Cenrana",
    openGraph: {
        title: "Sistem Informasi Desa Cenrana",
        description: "Layanan publik digital untuk warga Desa Cenrana - Aspirasi, Lapak UMKM, Surat Online",
        url: "https://desacenrana.id",
        siteName: "Desa Cenrana",
        locale: "id_ID",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sistem Informasi Desa Cenrana",
        description: "Layanan publik digital untuk warga Desa Cenrana",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    icons: {
        icon: "/favicon.ico",
        apple: "/icons/icon-192x192.png",
    },
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "Desa Cenrana",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="id" suppressHydrationWarning>
            <body className={`${plusJakarta.className} ${playfair.variable} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    storageKey="desa-cenrana-theme-v2"
                >
                    <ToastProvider>
                        <AppProvider>
                            <PWAProvider />
                            <Navbar />
                            <ErrorBoundary>
                                <main className="flex-grow w-full max-w-[100vw] overflow-x-hidden">{children}</main>
                            </ErrorBoundary>
                            <ScrollToTop />
                            <Footer />
                        </AppProvider>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

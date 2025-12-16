
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/context/AppContext";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-playfair" });

export const metadata: Metadata = {
    title: "Sistem Informasi Desa Cenrana",
    description: "Website Resmi Pemerintah Desa Cenrana, Kabupaten Maros",
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
                    <AppProvider>
                        <Navbar />
                        <main className="flex-grow w-full max-w-[100vw] overflow-x-hidden">{children}</main>
                        <Footer />
                    </AppProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

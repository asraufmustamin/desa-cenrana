
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

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
            <body className={`${inter.className} flex flex-col min-h-screen`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AppProvider>
                        <Navbar />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </AppProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

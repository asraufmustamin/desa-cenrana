"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAppContext } from "@/context/AppContext";
import EditModeIndicator from "@/components/EditModeIndicator";
import OrgChart from "@/components/OrgChart";
import { Users, ArrowLeft, Building2 } from "lucide-react";

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function SOTKPage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedTheme === "dark" : true;
    const bgColor = isDark ? "#0A0F1A" : "#F8FAFC";
    const textColor = isDark ? "#FFFFFF" : "#1E293B";
    const subtextColor = isDark ? "#9CA3AF" : "#64748B";

    return (
        <div
            className="min-h-screen pt-28 pb-20 px-4"
            style={{ backgroundColor: bgColor }}
        >
            <EditModeIndicator />

            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="mb-8"
                >
                    <Link
                        href="/profil"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:gap-3"
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            color: subtextColor
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Profil
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                        style={{
                            backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.1)',
                            border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.4)'}`,
                            color: isDark ? '#A78BFA' : '#7C3AED'
                        }}
                    >
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">Profil Desa</span>
                    </div>

                    <h1
                        className="text-4xl md:text-5xl font-extrabold mb-4"
                        style={{ color: textColor }}
                    >
                        Struktur{" "}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{
                                backgroundImage: isDark
                                    ? 'linear-gradient(to right, #A78BFA, #0EA5E9)'
                                    : 'linear-gradient(to right, #7C3AED, #059669)'
                            }}
                        >
                            Organisasi
                        </span>
                    </h1>
                    <p
                        className="text-lg max-w-2xl mx-auto"
                        style={{ color: subtextColor }}
                    >
                        Bagan Struktur Organisasi Tata Kerja (SOTK) Pemerintah Desa Cenrana
                    </p>
                </motion.div>

                {/* Org Chart Container */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="rounded-3xl border overflow-hidden"
                    style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                        boxShadow: `0 4px 30px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
                    }}
                >
                    <div className="p-6 md:p-10">
                        <OrgChart />
                    </div>
                </motion.div>

                {/* Navigation Links */}
                <motion.div
                    className="mt-12 flex flex-wrap justify-center gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <Link
                        href="/profil/sejarah"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            color: isDark ? '#0EA5E9' : '#059669',
                            border: `1px solid ${isDark ? 'rgba(14, 165, 233, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
                        }}
                    >
                        Sejarah Desa
                    </Link>
                    <Link
                        href="/profil/visi-misi"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            color: isDark ? '#10B981' : '#059669',
                            border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
                        }}
                    >
                        Visi & Misi
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";
import { Target, Award, Check, ArrowLeft, Sparkles } from "lucide-react";

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

export default function VisiMisiPage() {
    const { cmsContent } = useAppContext();
    const { profil } = cmsContent;
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

            <div className="max-w-5xl mx-auto">
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
                    className="text-center mb-16"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                        style={{
                            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                            border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.4)'}`,
                            color: isDark ? '#10B981' : '#059669'
                        }}
                    >
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-semibold">Profil Desa</span>
                    </div>

                    <h1
                        className="text-4xl md:text-5xl font-extrabold mb-4"
                        style={{ color: textColor }}
                    >
                        Visi &{" "}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{
                                backgroundImage: isDark
                                    ? 'linear-gradient(to right, #10B981, #0EA5E9)'
                                    : 'linear-gradient(to right, #059669, #10B981)'
                            }}
                        >
                            Misi
                        </span>
                    </h1>
                    <p
                        className="text-lg max-w-2xl mx-auto"
                        style={{ color: subtextColor }}
                    >
                        Arah dan tujuan pembangunan Desa Cenrana untuk mewujudkan kesejahteraan masyarakat
                    </p>
                </motion.div>

                {/* Visi Section */}
                <motion.div
                    className="mb-12"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div
                        className="p-8 md:p-12 rounded-3xl border relative overflow-hidden"
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                            borderColor: isDark ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.4)',
                            boxShadow: `0 4px 30px ${isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.15)'}`,
                        }}
                    >
                        {/* Decorative gradient */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div
                                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center"
                                    style={{ boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)' }}
                                >
                                    <Target className="w-7 h-7 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: textColor }}>
                                    VISI
                                </h2>
                            </div>

                            <div
                                className="text-xl md:text-2xl font-medium italic leading-relaxed pl-4 border-l-4"
                                style={{
                                    color: textColor,
                                    borderColor: isDark ? '#10B981' : '#059669'
                                }}
                            >
                                "<Editable section="profil" field="visionText" type="textarea" />"
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Misi Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <div
                        className="p-8 md:p-12 rounded-3xl border relative overflow-hidden"
                        style={{
                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                            borderColor: isDark ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.4)',
                            boxShadow: `0 4px 30px ${isDark ? 'rgba(14, 165, 233, 0.1)' : 'rgba(14, 165, 233, 0.15)'}`,
                        }}
                    >
                        {/* Decorative gradient */}
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/20 to-blue-500/10 blur-3xl rounded-full -ml-20 -mb-20"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div
                                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
                                    style={{ boxShadow: '0 8px 20px rgba(14, 165, 233, 0.4)' }}
                                >
                                    <Award className="w-7 h-7 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold" style={{ color: textColor }}>
                                    MISI
                                </h2>
                            </div>

                            <motion.div
                                className="space-y-4"
                                variants={staggerContainer}
                            >
                                {profil.missionList.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        variants={scaleIn}
                                        className="flex items-start gap-4 p-4 rounded-xl transition-all hover:scale-[1.01]"
                                        style={{
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(14, 165, 233, 0.05)',
                                            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(14, 165, 233, 0.1)'}`,
                                        }}
                                    >
                                        <div
                                            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                                            style={{
                                                background: 'linear-gradient(135deg, #0EA5E9, #10B981)'
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                        <p
                                            className="flex-1 text-base md:text-lg leading-relaxed pt-1.5"
                                            style={{ color: subtextColor }}
                                        >
                                            {item}
                                        </p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="mt-12 text-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                >
                    <Link
                        href="/profil/sotk"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:gap-3 hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #0EA5E9, #10B981)',
                            boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'
                        }}
                    >
                        <Sparkles className="w-5 h-5" />
                        Lihat Struktur Organisasi
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Award, Check, History, Target, Users, ArrowRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";
import OrgChart from "@/components/OrgChart";

export default function Profil() {
    const { officials, cmsContent } = useAppContext();
    const [activeTab, setActiveTab] = useState("sejarah");
    const { profil } = cmsContent;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <EditModeIndicator />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 text-glow">Profil Desa</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Mengenal lebih dekat sejarah, visi misi, dan struktur pemerintahan Desa Cenrana.
                    </p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="glass-panel p-1 rounded-2xl inline-flex overflow-x-auto max-w-full">
                        {["sejarah", "visi-misi", "struktur"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl font-bold transition-all capitalize whitespace-nowrap ${activeTab === tab
                                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                                    }`}
                            >
                                {tab.replace("-", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="glass-panel rounded-[2rem] p-8 md:p-12 min-h-[500px]">
                    {activeTab === "sejarah" && (
                        <div className="animate-fade-in">
                            <div className="flex flex-col lg:flex-row items-center gap-12">
                                <div className="lg:w-1/2 relative group">
                                    <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 aspect-video">
                                        <Editable
                                            type="image"
                                            section="profil"
                                            field="historyBanner"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                                <div className="lg:w-1/2 space-y-6">
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        <History className="w-4 h-4 mr-2" />
                                        <span className="text-sm font-bold uppercase tracking-wider">Sejarah Desa</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight">
                                        <Editable section="profil" field="historyTitle" />
                                    </h2>
                                    <div className="text-[var(--text-secondary)] text-lg leading-relaxed space-y-4">
                                        <Editable section="profil" field="historyText" type="textarea" />
                                    </div>
                                    <Link
                                        href="/profil/sejarah"
                                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all group"
                                    >
                                        Baca Selengkapnya
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "visi-misi" && (
                        <div className="animate-fade-in">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Visi & Misi</h2>
                                <p className="text-[var(--text-secondary)]">Arah dan tujuan pembangunan Desa Cenrana.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Visi Card */}
                                <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group hover:bg-[var(--bg-panel)] transition-all duration-500 border border-white/10">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-20 -mt-20 transition-opacity group-hover:opacity-30"></div>
                                    <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                            <Target className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">VISI</h3>
                                        <div className="text-xl md:text-2xl font-medium text-[var(--text-primary)] italic leading-relaxed">
                                            "<Editable section="profil" field="visionText" type="textarea" />"
                                        </div>
                                    </div>
                                </div>

                                {/* Misi Card */}
                                <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden group hover:bg-[var(--bg-panel)] transition-all duration-500 border border-white/10">
                                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -ml-20 -mb-20 transition-opacity group-hover:opacity-30"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center mb-8">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mr-4 group-hover:scale-110 transition-transform">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-[var(--text-primary)]">MISI</h3>
                                        </div>
                                        <div className="text-[var(--text-secondary)] space-y-4">
                                            {/* We can use the list from CMS or just a textarea for flexibility */}
                                            <ul className="space-y-4">
                                                {profil.missionList.map((item, index) => (
                                                    <li key={index} className="flex items-start glass-card p-4 rounded-2xl">
                                                        <span className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center font-bold mr-4 mt-0.5">
                                                            {index + 1}
                                                        </span>
                                                        <div className="text-[var(--text-secondary)] flex-1">
                                                            {item}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* Or if we want to make it fully editable as a block */}
                                            {/* <Editable section="profil" field="missionText" type="textarea" /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "struktur" && (
                        <div className="animate-fade-in">
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4 text-center">Struktur Pemerintahan</h2>
                            <p className="text-[var(--text-secondary)] text-center mb-12">Bagan Struktur Organisasi Tata Kerja (SOTK) Pemerintah Desa.</p>

                            <OrgChart />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

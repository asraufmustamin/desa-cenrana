"use client";

"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { MapPin, Compass, Maximize, Info } from "lucide-react";

export default function PetaPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-10 relative">
            <div className="container mx-auto px-4">

                {/* Page Title & Intro */}
                <div className="mb-8 text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Peta Digital Desa</h1>
                    <p className="text-[var(--text-secondary)]">Informasi geografis dan batas wilayah administratif.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* 1. MAP CONTAINER (Left: Spans 2 Cols) */}
                    <div className="lg:col-span-2 h-[600px] w-full rounded-3xl overflow-hidden shadow-xl border border-white/20 relative group">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63577.8682887648!2d119.7289895!3d-4.9666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe570000000001%3A0x0!2sCenrana%2C%20Camba%2C%20Maros%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1625630000000!5m2!1sen!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            className="absolute inset-0 grayscale-[20%] contrast-[1.1] group-hover:grayscale-0 transition-all duration-500"
                        ></iframe>

                        {/* Mobile Hint Overlay */}
                        <div className="absolute bottom-4 left-4 lg:hidden bg-black/50 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full pointer-events-none">
                            Geser untuk navigasi peta
                        </div>
                    </div>

                    {/* 2. INFO CARDS (Right: Spans 1 Col) */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Card 1: Wilayah & Luas */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg rounded-3xl p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/30">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Wilayah Desa</h2>
                                    <p className="text-xs font-medium text-[var(--text-secondary)]">Data Geografis</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-black/20 p-5 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] flex items-center">
                                        <Maximize className="w-4 h-4 mr-2 text-blue-500" /> Luas Wilayah
                                    </span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-black text-[var(--text-primary)] mr-2 tracking-tight">
                                        <Editable section="peta" field="luasWilayah" />
                                    </span>
                                    <span className="text-lg font-bold text-[var(--text-secondary)]">km²</span>
                                </div>
                            </div>

                            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 flex items-center">
                                    <Info className="w-4 h-4 mr-2" />
                                    Detail Lokasi
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] text-[var(--text-secondary)] mb-0.5 uppercase tracking-wider">Alamat Kantor</p>
                                        <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                                            <Editable section="peta" field="alamatKantor" />
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-[10px] text-[var(--text-secondary)] mb-0.5 uppercase tracking-wider">Koordinat</p>
                                            <p className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                <Editable section="peta" field="koordinat" />
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[var(--text-secondary)] mb-0.5 uppercase tracking-wider">Jarak Kab.</p>
                                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                                                <Editable section="peta" field="jarakKabupaten" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Batas Wilayah */}
                        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg rounded-3xl p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4 flex items-center">
                                <Compass className="w-4 h-4 mr-2 text-emerald-500" />
                                Batas Wilayah
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { label: "UTARA", field: "batasUtara", color: "text-blue-500" },
                                    { label: "SELATAN", field: "batasSelatan", color: "text-purple-500" },
                                    { label: "BARAT", field: "batasBarat", color: "text-orange-500" },
                                    { label: "TIMUR", field: "batasTimur", color: "text-emerald-500" }
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-colors group">
                                        <span className={`text-[10px] font-bold ${item.color} w-16`}>{item.label}</span>
                                        <span className="text-sm font-semibold text-[var(--text-primary)] text-right flex-1 group-hover:text-blue-500 transition-colors">
                                            <Editable section="peta" field={item.field} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

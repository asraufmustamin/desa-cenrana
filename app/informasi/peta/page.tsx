"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { MapPin, Compass, Maximize, Info, ArrowLeft, Sparkles, Navigation } from "lucide-react";

export default function PetaPage() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/informasi" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Peta Digital</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-black mb-1 text-[var(--text-primary)]">
                        Peta{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Digital</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]">Informasi geografis dan batas wilayah</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                    {/* Map Container */}
                    <motion.div
                        className="lg:col-span-2 h-[400px] w-full rounded-2xl overflow-hidden relative group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 rounded-2xl blur-sm"></div>
                        <div className="relative h-full rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63577.8682887648!2d119.7289895!3d-4.9666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe570000000001%3A0x0!2sCenrana%2C%20Camba%2C%20Maros%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1625630000000!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                className="grayscale-[20%] contrast-[1.1] group-hover:grayscale-0 transition-all duration-500"
                            ></iframe>
                        </div>
                    </motion.div>

                    {/* Info Cards */}
                    <motion.div
                        className="lg:col-span-1 space-y-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Wilayah Card */}
                        <div className="p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-[var(--text-primary)]">Wilayah Desa</h2>
                                    <p className="text-[10px] font-medium text-[var(--text-secondary)]">Data Geografis</p>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-3">
                                <div className="flex items-center mb-1">
                                    <Maximize className="w-3 h-3 mr-1.5 text-emerald-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">Luas</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-black text-[var(--text-primary)]">
                                        <Editable section="peta" field="luasWilayah" />
                                    </span>
                                    <span className="text-sm font-bold text-[var(--text-secondary)] ml-1">km²</span>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-2">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center text-cyan-400">
                                    <Info className="w-3 h-3 mr-1.5" /> Detail
                                </h3>
                                <div>
                                    <p className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">Alamat Kantor</p>
                                    <p className="text-xs font-semibold text-[var(--text-primary)]">
                                        <Editable section="peta" field="alamatKantor" />
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">Koordinat</p>
                                        <p className="text-[10px] font-mono font-semibold text-[var(--text-secondary)]">
                                            <Editable section="peta" field="koordinat" />
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">Jarak Kab</p>
                                        <p className="text-xs font-semibold text-[var(--text-primary)]">
                                            <Editable section="peta" field="jarakKabupaten" />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Batas Wilayah Card */}
                        <div className="p-4 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg">
                            <h3 className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center text-[var(--text-secondary)]">
                                <Compass className="w-3 h-3 mr-1.5 text-emerald-400" /> Batas Wilayah
                            </h3>
                            <div className="space-y-1.5">
                                {[
                                    { label: "UTARA", field: "batasUtara", color: "text-blue-400" },
                                    { label: "SELATAN", field: "batasSelatan", color: "text-violet-400" },
                                    { label: "BARAT", field: "batasBarat", color: "text-orange-400" },
                                    { label: "TIMUR", field: "batasTimur", color: "text-emerald-400" }
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-[var(--bg-panel)] border border-[var(--border-color)]">
                                        <span className={`text-[9px] font-bold w-14 ${item.color}`}>{item.label}</span>
                                        <span className="text-xs font-semibold text-right flex-1 text-[var(--text-primary)]">
                                            <Editable section="peta" field={item.field} />
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

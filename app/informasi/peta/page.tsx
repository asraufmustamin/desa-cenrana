"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { MapPin, Compass, Maximize } from "lucide-react";

export default function PetaPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-0 relative flex flex-col">
            {/* Map Container */}
            <div className="flex-grow relative w-full h-[calc(100vh-6rem)]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63577.8682887648!2d119.7289895!3d-4.9666667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe570000000001%3A0x0!2sCenrana%2C%20Camba%2C%20Maros%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1625630000000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 grayscale-[50%] contrast-[1.1] hover:grayscale-0 transition-all duration-500"
                ></iframe>

                {/* Floating Info Card */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 w-[calc(100%-2rem)] md:w-96">
                    <div className="glass-panel p-6 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 animate-fade-in-left">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">Wilayah Desa</h2>
                                <p className="text-xs text-[var(--text-secondary)]">Data Geografis</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Luas Wilayah */}
                            <div className="bg-[var(--bg-panel)] p-4 rounded-xl border border-[var(--border-color)]">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--text-secondary)] flex items-center">
                                        <Maximize className="w-4 h-4 mr-2" /> Luas Wilayah
                                    </span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-bold text-[var(--text-primary)] mr-1">
                                        <Editable section="peta" field="luasWilayah" />
                                    </span>
                                    <span className="text-sm text-[var(--text-secondary)]">km²</span>
                                </div>
                            </div>

                            {/* Batas Wilayah */}
                            <div>
                                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center">
                                    <Compass className="w-4 h-4 mr-2 text-emerald-500" />
                                    Batas Wilayah
                                </h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex items-center justify-between p-3 bg-[var(--bg-panel)] rounded-lg border border-[var(--border-color)]">
                                        <span className="text-xs font-bold text-blue-400 w-16">UTARA</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right flex-1">
                                            <Editable section="peta" field="batasUtara" />
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-[var(--bg-panel)] rounded-lg border border-[var(--border-color)]">
                                        <span className="text-xs font-bold text-blue-400 w-16">SELATAN</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right flex-1">
                                            <Editable section="peta" field="batasSelatan" />
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-[var(--bg-panel)] rounded-lg border border-[var(--border-color)]">
                                        <span className="text-xs font-bold text-blue-400 w-16">BARAT</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right flex-1">
                                            <Editable section="peta" field="batasBarat" />
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-[var(--bg-panel)] rounded-lg border border-[var(--border-color)]">
                                        <span className="text-xs font-bold text-blue-400 w-16">TIMUR</span>
                                        <span className="text-sm text-[var(--text-primary)] text-right flex-1">
                                            <Editable section="peta" field="batasTimur" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

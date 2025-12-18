
"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight, MessageCircle, CheckCircle, Loader2 } from "lucide-react";
import Editable from "@/components/Editable";
import { useAppContext } from "@/context/AppContext";

export default function Footer() {
    const { subscribeWhatsApp } = useAppContext();
    const [name, setName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !whatsapp.trim()) {
            setErrorMessage("Mohon isi nama dan nomor WhatsApp");
            setSubmitStatus("error");
            return;
        }

        let formattedWA = whatsapp.replace(/\D/g, "");
        if (formattedWA.startsWith("0")) {
            formattedWA = "62" + formattedWA.slice(1);
        }
        if (!formattedWA.startsWith("62")) {
            formattedWA = "62" + formattedWA;
        }

        if (formattedWA.length < 11 || formattedWA.length > 15) {
            setErrorMessage("Nomor WhatsApp tidak valid");
            setSubmitStatus("error");
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            await subscribeWhatsApp(name.trim(), formattedWA);
            setSubmitStatus("success");
            setName("");
            setWhatsapp("");
            setTimeout(() => setSubmitStatus("idle"), 5000);
        } catch {
            setErrorMessage("Gagal mendaftar. Mungkin nomor sudah terdaftar.");
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="bg-dark-base border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-48 bg-neon-blue/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logo-maros.png" alt="Logo Maros" className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">
                                    <Editable section="footer" field="brandName" />
                                </h3>
                                <p className="text-slate-400 text-sm">Kabupaten Maros</p>
                            </div>
                        </div>
                        <div className="text-slate-400 leading-relaxed">
                            <Editable section="footer" field="brandDesc" type="textarea" />
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Jelajahi</h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Profil Desa", href: "/profil" },
                                { name: "Kabar Terkini", href: "/informasi/berita" },
                                { name: "Lapak Warga", href: "/lapak" },
                                { name: "Layanan Aspirasi", href: "/aspirasi" },
                                { name: "Transparansi", href: "/transparansi" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Hubungi Kami</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start space-x-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600/20 transition-colors">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <Editable section="footer" field="address" type="textarea" />
                                </div>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600/20 transition-colors">
                                    <Phone className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <Editable section="footer" field="phone" />
                                </div>
                            </li>
                            <li className="flex items-center space-x-4 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600/20 transition-colors">
                                    <Mail className="w-5 h-5 text-violet-400" />
                                </div>
                                <div className="text-slate-400 group-hover:text-slate-200 transition-colors">
                                    <Editable section="footer" field="email" />
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* WhatsApp Notification */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-green-500" />
                            Info Desa via WhatsApp
                        </h4>
                        <p className="text-slate-400 mb-4 text-sm">Daftar untuk dapat info desa langsung ke WhatsApp Anda.</p>

                        {submitStatus === "success" ? (
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                                <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                                <div>
                                    <p className="text-green-400 font-bold text-sm">Berhasil Terdaftar!</p>
                                    <p className="text-green-400/70 text-xs">Anda akan menerima info desa via WA</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nama Lengkap"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm"
                                />
                                <input
                                    type="tel"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    placeholder="No. WhatsApp (08xxxxxxxxxx)"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm"
                                />
                                {submitStatus === "error" && (
                                    <p className="text-red-400 text-xs">{errorMessage}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Mendaftar...
                                        </>
                                    ) : (
                                        <>
                                            <MessageCircle className="w-4 h-4" />
                                            Daftar Sekarang
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-slate-500 text-sm mb-4 md:mb-0">
                        <Editable section="footer" field="copyright" />
                    </div>
                    <div className="flex space-x-6 text-sm text-slate-500">
                        <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                        <a href="#" className="hover:text-white transition-colors">Peta Situs</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

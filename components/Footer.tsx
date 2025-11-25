
"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import Editable from "@/components/Editable";

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/10 pt-20 pb-10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

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
                            {["Profil Desa", "Kabar Terkini", "Lapak Warga", "Layanan Aspirasi", "Transparansi"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center group">
                                        <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        {item}
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

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Buletin Desa</h4>
                        <p className="text-slate-400 mb-6">Dapatkan informasi terbaru langsung ke email Anda.</p>
                        <form className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Alamat Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02] transition-all">
                                Berlangganan
                            </button>
                        </form>
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

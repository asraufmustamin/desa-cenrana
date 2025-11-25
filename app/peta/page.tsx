
"use client";

import { MapPin } from "lucide-react";

export default function PetaPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-glow">Peta Wilayah Desa</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Menjelajahi batas wilayah dan lokasi strategis di Desa Cenrana, Kecamatan Camba, Kabupaten Maros.
                    </p>
                </div>

                <div className="glass-panel rounded-[2rem] overflow-hidden p-2 md:p-4 h-[600px] relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none z-10"></div>

                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63630.57357788464!2d119.7891234!3d-4.9345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbe4e0a0a0a0a0a%3A0x0!2sCenrana%2C%20Camba%2C%20Maros%20Regency%2C%20South%20Sulawesi!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid&maptype=satellite"
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: "1.5rem", filter: "grayscale(20%) contrast(1.2)" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full rounded-[1.5rem]"
                    ></iframe>

                    <div className="absolute bottom-8 left-8 z-20">
                        <div className="glass-card p-6 rounded-2xl max-w-sm">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/40">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Kantor Desa Cenrana</h3>
                                    <p className="text-slate-300 text-sm">
                                        Pusat pelayanan administrasi dan pemerintahan desa. Buka Senin - Jumat, 08.00 - 16.00 WITA.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    {[
                        { title: "Luas Wilayah", value: "1,250 Ha", desc: "Terdiri dari hutan, sawah, dan pemukiman." },
                        { title: "Batas Utara", value: "Desa Patanyamang", desc: "Berbatasan langsung dengan hutan lindung." },
                        { title: "Batas Selatan", value: "Desa Sawaru", desc: "Dibatasi oleh Sungai Cenrana." },
                    ].map((item, index) => (
                        <div key={index} className="glass-card p-8 rounded-3xl text-center">
                            <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{item.title}</h3>
                            <p className="text-3xl font-bold text-white mb-2">{item.value}</p>
                            <p className="text-slate-500 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

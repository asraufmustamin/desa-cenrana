"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ChevronLeft, ChevronRight, Landmark, MessageSquareText,
  Store, Laptop, HeartPulse, Home as HomeIcon, Lightbulb, Map,
  Users, MapPin, FileText, Phone, Building2, Wallet, Megaphone
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";

// Hero Slideshow Images
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c7dd1?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=2000"
];

export default function Home() {
  const { cmsContent, updateContent, news } = useAppContext();
  const { home, sotk_new, programs } = cmsContent;
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero Slideshow Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Derive officials from SOTK structure for the slider
  const displayOfficials = [
    { ...sotk_new.kades, id: 'kades', type: 'kades' },
    { ...sotk_new.sekdes, id: 'sekdes', type: 'sekdes' },
    ...(sotk_new.kaur?.map((item, i) => ({ ...item, id: `kaur-${i}`, type: 'kaur', index: i })) || []),
    ...(sotk_new.kadus?.map((item, i) => ({ ...item, id: `kadus-${i}`, type: 'kadus', index: i })) || []),
  ];

  const updateOfficial = (official: any, field: string, value: string) => {
    if (official.type === 'kades') {
      updateContent("sotk_new", "kades", { ...sotk_new.kades, [field]: value });
    } else if (official.type === 'sekdes') {
      updateContent("sotk_new", "sekdes", { ...sotk_new.sekdes, [field]: value });
    } else if (official.type === 'kaur' && typeof official.index === 'number') {
      const newKaurs = [...sotk_new.kaur];
      newKaurs[official.index] = { ...newKaurs[official.index], [field]: value };
      updateContent("sotk_new", "kaur", newKaurs);
    } else if (official.type === 'kadus' && typeof official.index === 'number') {
      const newKadus = [...sotk_new.kadus];
      newKadus[official.index] = { ...newKadus[official.index], [field]: value };
      updateContent("sotk_new", "kadus", newKadus);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
      <EditModeIndicator />

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        {HERO_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={img}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-bold tracking-widest uppercase shadow-lg">
            Selamat Datang di Website Resmi
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
            <Editable section="home" field="heroTitle" />
          </h1>
          <div className="text-lg md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            <Editable section="home" field="heroSubtitle" type="textarea" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profil"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 group"
            >
              <Landmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Profil Desa
            </Link>
            <Link
              href="/aspirasi"
              className="px-8 py-4 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 group"
            >
              <MessageSquareText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Layanan Aspirasi
            </Link>
            <Link
              href="/lapak"
              className="px-8 py-4 bg-emerald-600/80 hover:bg-emerald-600 backdrop-blur-md text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 group"
            >
              <Store className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Lapak Warga
            </Link>
          </div>
        </div>
      </section>

      {/* 2. UNIFIED STATS DASHBOARD */}
      <section className="relative z-30 -mt-20 px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-6 rounded-3xl shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Stat 1: Penduduk */}
              <div className="text-center p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  <Editable section="home" field="statsVal1" />
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Editable section="home" field="statsLabel1" />
                </p>
              </div>

              {/* Stat 2: Luas Wilayah */}
              <div className="text-center p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  <Editable section="home" field="statsVal2" />
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Editable section="home" field="statsLabel2" />
                </p>
              </div>

              {/* Stat 3: Indeks Desa */}
              <div className="text-center p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  <Editable section="home" field="statsVal3" />
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Editable section="home" field="statsLabel3" />
                </p>
              </div>

              {/* Stat 4: KK */}
              <div className="text-center p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HomeIcon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  <Editable section="home" field="statsVal4" />
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Editable section="home" field="statsLabel4" />
                </p>
              </div>

              {/* Stat 5: UMKM */}
              <div className="text-center p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  <Editable section="home" field="statsVal5" />
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Editable section="home" field="statsLabel5" />
                </p>
              </div>

              {/* Stat 6: Dana Desa */}
              <div className="text-center p-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 mx-auto mb-3 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">
                  <Editable section="home" field="statsVal6" />
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Editable section="home" field="statsLabel6" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN UNGGULAN */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Layanan Unggulan</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Akses berbagai layanan publik dan informasi desa dengan mudah dan cepat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Lapak Warga", desc: "Marketplace produk lokal UMKM.", icon: <Store className="w-6 h-6" />, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-500/10", link: "/lapak" },
              { title: "Transparansi", desc: "Laporan APBDes & Dana Desa.", icon: <FileText className="w-6 h-6" />, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/10", link: "/informasi/transparansi" },
              { title: "Peta Desa", desc: "Peta digital wilayah desa.", icon: <Map className="w-6 h-6" />, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10", link: "/informasi/peta" },
              { title: "Pengaduan", desc: "Saluran aspirasi masyarakat.", icon: <Phone className="w-6 h-6" />, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/10", link: "/aspirasi" }
            ].map((item, idx) => (
              <Link href={item.link} key={idx} className="group">
                <div className="h-full p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-xl hover:shadow-blue-500/5 hover:scale-105 transition-all duration-300">
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform">
                    Akses Layanan <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROGRAM UNGGULAN */}
      <section className="py-16 px-4 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="mb-6 md:mb-0 text-center md:text-left w-full md:w-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Program Unggulan</h2>
              <p className="text-slate-600 dark:text-slate-400">Inisiatif strategis Desa Cenrana.</p>
            </div>
            <Link href="/informasi/program" className="hidden md:flex items-center px-6 py-3 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/20 transition-all">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs?.slice(0, 4).map((program, index) => {
              // Simple icon mapping
              const IconComponent = {
                "Road": Map, "Laptop": Laptop, "HeartPulse": HeartPulse, "Home": HomeIcon
              }[program.icon] || Lightbulb;

              return (
                <div key={program.id} className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:shadow-xl hover:scale-105 transition-all duration-300 group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${program.status === "Selesai" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" :
                      program.status === "Berjalan" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" :
                        "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                    }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{program.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">{program.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${program.status === "Selesai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" :
                        program.status === "Berjalan" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                          "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                      }`}>
                      {program.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/informasi/program" className="inline-flex items-center px-6 py-3 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-white/20 transition-all">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PERANGKAT DESA (SOTK) */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Perangkat Desa</h2>
            <p className="text-slate-600 dark:text-slate-400">Jajaran pemerintahan Desa Cenrana.</p>
          </div>

          <div className="relative group/slider">
            <div className="overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory scroll-smooth">
              <div className="flex flex-row gap-6 px-4 w-max mx-auto">
                {displayOfficials.map((official) => (
                  <div key={official.id} className="snap-center flex flex-col items-center group w-56 flex-shrink-0">
                    <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-slate-200 dark:border-white/10 group-hover:border-blue-500 transition-colors shadow-lg">
                      <Editable
                        type="image"
                        value={official.image}
                        onSave={(val) => updateOfficial(official, "image", val)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="text-center w-full">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                        <Editable
                          value={official.name}
                          onSave={(val) => updateOfficial(official, "name", val)}
                        />
                      </h3>
                      <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                        <Editable
                          value={official.role}
                          onSave={(val) => updateOfficial(official, "role", val)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BERITA TERKINI */}
      <section className="py-16 px-4 bg-slate-100 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Kabar Desa</h2>
              <p className="text-slate-600 dark:text-slate-400">Berita terkini seputar Desa Cenrana.</p>
            </div>
            <Link href="/informasi/berita" className="hidden md:flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">
              Lihat Semua <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news && news.length > 0 ? (
              news.slice(0, 4).map((item) => (
                <div key={item.id} className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] mb-2 font-bold uppercase tracking-wider">
                      {item.date}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 mb-4">
                      {item.excerpt}
                    </p>
                    <Link href={`/informasi/berita`} className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold text-xs hover:translate-x-2 transition-transform">
                      Baca Selengkapnya <ChevronRight className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-slate-500 dark:text-slate-400">
                Belum ada berita terkini.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

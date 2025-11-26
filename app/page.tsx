"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, ChevronLeft, ChevronRight, Landmark, MessageSquareText,
  Store, Laptop, HeartPulse, Home as HomeIcon, Lightbulb, Map,
  Users, MapPin, FileText, Phone, Building2, Wallet, Sprout
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
  const sotkScrollRef = useRef<HTMLDivElement>(null);

  // Hero Slideshow Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // SOTK Scroll Handlers
  const scrollSotk = (direction: 'left' | 'right') => {
    if (sotkScrollRef.current) {
      const scrollAmount = 300;
      sotkScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Derive officials from SOTK structure for the slider
  let displayOfficials = [
    { ...sotk_new.kades, id: 'kades', type: 'kades' },
    { ...sotk_new.sekdes, id: 'sekdes', type: 'sekdes' },
    ...(sotk_new.kaur?.map((item, i) => ({ ...item, id: `kaur-${i}`, type: 'kaur', index: i })) || []),
    ...(sotk_new.kadus?.map((item, i) => ({ ...item, id: `kadus-${i}`, type: 'kadus', index: i })) || []),
  ];

  // Fallback if no officials
  if (displayOfficials.length === 0 || (displayOfficials.length === 2 && !displayOfficials[0].name)) {
    displayOfficials = [
      { id: 'dummy-1', name: 'Pejabat 1', role: 'Kepala Desa', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400', type: 'dummy' },
      { id: 'dummy-2', name: 'Pejabat 2', role: 'Sekretaris Desa', image: 'https://images.unsplash.com/photo-1573496359-7013ac2bebb5?auto=format&fit=crop&q=80&w=400', type: 'dummy' },
      { id: 'dummy-3', name: 'Pejabat 3', role: 'Kaur Keuangan', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400', type: 'dummy' },
      { id: 'dummy-4', name: 'Pejabat 4', role: 'Kaur Umum', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400', type: 'dummy' },
    ];
  }

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

  // Stats Configuration
  const statItems = [
    { labelField: "statsLabel1", valField: "statsVal1", icon: Users, placeholderLabel: "Penduduk", placeholderVal: "3500" },
    { labelField: "statsLabel2", valField: "statsVal2", icon: MapPin, placeholderLabel: "Luas Wilayah", placeholderVal: "12" },
    { labelField: "statsLabel3", valField: "statsVal3", icon: FileText, placeholderLabel: "Layanan Digital", placeholderVal: "98" },
    { labelField: "statsLabel4", valField: "statsVal4", icon: HomeIcon, placeholderLabel: "Kepala Keluarga", placeholderVal: "850" },
    { labelField: "statsLabel5", valField: "statsVal5", icon: Building2, placeholderLabel: "UMKM Aktif", placeholderVal: "45" },
    { labelField: "statsLabel6", valField: "statsVal6", icon: Wallet, placeholderLabel: "Total Dana Desa", placeholderVal: "1.2M" },
    { labelField: "statsLabel7", valField: "statsVal7", icon: Sprout, placeholderLabel: "Kelompok Tani", placeholderVal: "8" },
    { labelField: "statsLabel8", valField: "statsVal8", icon: HeartPulse, placeholderLabel: "Fasilitas Kesehatan", placeholderVal: "5" },
  ];

  // Common Card Style using CSS Variables (glass-card)
  // This ensures reliable theme switching via globals.css
  const cardStyle = "glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]";

  return (
    <div className="min-h-screen overflow-x-hidden">
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
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-bold tracking-widest uppercase shadow-lg">
            Selamat Datang di Website Resmi
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight drop-shadow-lg">
            <Editable section="home" field="heroTitle" />
          </h1>
          <div className="text-lg md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            <Editable section="home" field="heroSubtitle" type="textarea" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/profil"
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-500/40 hover:scale-105 hover:shadow-orange-500/60"
            >
              <Landmark className="w-5 h-5" />
              Profil Desa
            </Link>
            <Link
              href="/aspirasi"
              className="px-8 py-4 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-md text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20 hover:scale-105"
            >
              <MessageSquareText className="w-5 h-5" />
              Layanan Aspirasi
            </Link>
            <Link
              href="/lapak"
              className="px-8 py-4 bg-emerald-600/80 hover:bg-emerald-600 backdrop-blur-md text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 hover:scale-105"
            >
              <Store className="w-5 h-5" />
              Lapak Warga
            </Link>
          </div>
        </div>
      </section>

      {/* 2. UNIFIED STATS DASHBOARD */}
      <section className="relative z-30 -mt-20 px-4 mb-20 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        <div className="max-w-7xl mx-auto">
          <div className={`${cardStyle} shadow-xl`}>
            {/* Grid Layout: Compact Crystal Glass (4 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statItems.map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white/30 bg-white/80 dark:bg-black/40 backdrop-blur-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/20 group"
                >
                  {/* Icon - Compact & Clean */}
                  <item.icon className="w-8 h-8 mb-3 text-emerald-600 dark:text-emerald-400 drop-shadow-sm transition-transform group-hover:scale-110" />

                  {/* Number - Big & Sharp */}
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight drop-shadow-sm">
                    <Editable section="home" field={item.valField} placeholder={item.placeholderVal} />
                  </h3>

                  {/* Label - Small & Precise */}
                  <p className="text-xs font-bold tracking-widest uppercase text-slate-700 dark:text-slate-300 mb-2">
                    <Editable section="home" field={item.labelField} placeholder={item.placeholderLabel} />
                  </p>

                  {/* Subtle Glow on Hover (Dark Mode) */}
                  <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/0 group-hover:bg-emerald-400/5 transition-colors duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LAYANAN UNGGULAN */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Layanan Unggulan</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
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
              <Link href={item.link} key={idx} className="group h-full">
                <div className={`h-full ${cardStyle} flex flex-col`}>
                  <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 flex-grow">
                    {item.desc}
                  </p>
                  <div className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-2 transition-transform mt-auto">
                    Akses Layanan <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROGRAM UNGGULAN */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="mb-6 md:mb-0 text-center md:text-left w-full md:w-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Program Unggulan</h2>
              <p className="text-[var(--text-secondary)]">Inisiatif strategis Desa Cenrana.</p>
            </div>
            <Link href="/informasi/program" className="hidden md:flex items-center px-6 py-3 rounded-full bg-white/10 border border-slate-200 dark:border-white/10 text-[var(--text-primary)] font-bold hover:bg-slate-100 dark:hover:bg-white/20 transition-all">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs?.slice(0, 4).map((program, index) => {
              const IconComponent = {
                "Road": Map, "Laptop": Laptop, "HeartPulse": HeartPulse, "Home": HomeIcon
              }[program.icon] || Lightbulb;

              return (
                <div key={program.id} className={`${cardStyle} group h-full flex flex-col`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${program.status === "Selesai" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                    program.status === "Berjalan" ? "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" :
                      "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                    }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-1">{program.title}</h3>
                  <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-4 flex-grow">{program.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${program.status === "Selesai" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" :
                      program.status === "Berjalan" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" :
                        "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      }`}>
                      {program.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/informasi/program" className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 border border-slate-200 dark:border-white/10 text-[var(--text-primary)] font-bold hover:bg-slate-100 dark:hover:bg-white/20 transition-all">
              Lihat Semua <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. PERANGKAT DESA (SOTK) */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div className="text-center md:text-left w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Perangkat Desa</h2>
              <p className="text-[var(--text-secondary)]">Jajaran pemerintahan Desa Cenrana.</p>
            </div>
            {/* Manual Controls */}
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scrollSotk('left')}
                className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-white" />
              </button>
              <button
                onClick={() => scrollSotk('right')}
                className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-white" />
              </button>
            </div>
          </div>

          <div className="relative group/slider">
            {/* Fixed SOTK Carousel Container with Ref */}
            <div
              ref={sotkScrollRef}
              className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide px-4 scroll-smooth"
            >
              {displayOfficials.map((official) => (
                <div key={official.id} className="snap-center flex flex-col items-center group min-w-[220px] flex-shrink-0">
                  <div className="relative w-40 h-40 mb-6 rounded-full overflow-hidden border-4 border-slate-200 dark:border-white/10 group-hover:border-blue-500 transition-colors shadow-lg">
                    <Editable
                      type="image"
                      value={official.image}
                      onSave={(val) => updateOfficial(official, "image", val)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="text-center w-full">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                      <Editable
                        value={official.name}
                        onSave={(val) => updateOfficial(official, "name", val)}
                      />
                    </h3>
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
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
      </section>

      {/* 6. BERITA TERKINI */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Kabar Desa</h2>
              <p className="text-[var(--text-secondary)]">Berita terkini seputar Desa Cenrana.</p>
            </div>
            <Link href="/informasi/berita" className="hidden md:flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline transition-all">
              Lihat Semua <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news && news.length > 0 ? (
              news.slice(0, 4).map((item) => (
                <div key={item.id} className={`${cardStyle} overflow-hidden group h-full flex flex-col`}>
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] mb-2 font-bold uppercase tracking-wider">
                      {item.date}
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-xs leading-relaxed line-clamp-2 mb-4 flex-grow">
                      {item.excerpt}
                    </p>
                    <Link href={`/informasi/berita`} className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold text-xs hover:translate-x-2 transition-transform mt-auto">
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
    </div>
  );
}

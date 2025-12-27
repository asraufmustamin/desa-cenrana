"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight, ChevronLeft, ChevronRight, Landmark, MessageSquareText,
  Store, Laptop, HeartPulse, Home as HomeIcon, Lightbulb, Map,
  Users, MapPin, FileText, Phone, Building2, Wallet, Sprout, Search, Zap
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";
import PollWidget from "@/components/PollWidget";

// Animation Variants with proper typing
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

export default function Home() {
  const { cmsContent, updateContent, news, kepalaDesaStatus } = useAppContext();
  const { home, sotk_new, programs } = cmsContent;
  const sotkScrollRef = useRef<HTMLDivElement>(null);

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
    { labelField: "statsLabel1", valField: "statsVal1", icon: Users, placeholderLabel: "Penduduk", placeholderVal: "3,500", color: "neon-blue" },
    { labelField: "statsLabel2", valField: "statsVal2", icon: MapPin, placeholderLabel: "Luas Wilayah", placeholderVal: "12 km²", color: "neon-emerald" },
    { labelField: "statsLabel3", valField: "statsVal3", icon: FileText, placeholderLabel: "Layanan Digital", placeholderVal: "98%", color: "neon-purple" },
    { labelField: "statsLabel4", valField: "statsVal4", icon: HomeIcon, placeholderLabel: "Kepala Keluarga", placeholderVal: "850", color: "neon-orange" },
  ];

  // Services Data
  const services = [
    { title: "Layanan Aspirasi", desc: "Sampaikan kritik & saran", icon: MessageSquareText, color: "blue", link: "/aspirasi" },
    { title: "Transparansi", desc: "Laporan keuangan desa", icon: FileText, color: "purple", link: "/informasi/transparansi" },
  ];

  // Get theme for inline styling (bypassing Tailwind dark: variants)
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Light Mode Live Wallpaper - Documentary photos for hero section
  const [currentWallpaperIndex, setCurrentWallpaperIndex] = useState(0);
  const documentaryPhotos = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80', // Rice field
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1920&q=80', // Rural landscape
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1920&q=80', // Village life
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80', // Nature scenery
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1920&q=80', // Community farming
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Light mode wallpaper rotation effect
  useEffect(() => {
    if (mounted && resolvedTheme === 'light') {
      const interval = setInterval(() => {
        setCurrentWallpaperIndex((prev) => (prev + 1) % documentaryPhotos.length);
      }, 8000); // Change every 8 seconds
      return () => clearInterval(interval);
    }
  }, [mounted, resolvedTheme, documentaryPhotos.length]);

  const isDark = mounted ? resolvedTheme === "dark" : true; // Default to dark during SSR
  const bgColor = isDark ? "#0A0F1A" : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : "#1E293B";

  return (
    <div
      className="min-h-screen overflow-x-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <EditModeIndicator />

      {/* 1. HERO SECTION - Mobile Optimized */}
      <section
        className="relative flex flex-col items-center justify-start sm:justify-center overflow-hidden pt-28 pb-16 sm:pt-24 sm:pb-20 md:min-h-screen"
        style={{
          background: isDark
            ? 'linear-gradient(to bottom, #0A0F1A, #111827)'
            : 'linear-gradient(to bottom, #F8FAFC, #FFFFFF)'
        }}
      >
        {/* Light Mode Live Wallpaper - Documentary Photos */}
        {mounted && !isDark && (
          <>
            {/* Current Image */}
            <div
              className="absolute inset-0 transition-opacity duration-1500"
              style={{
                backgroundImage: `url(${documentaryPhotos[currentWallpaperIndex]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.5,
              }}
            />
            {/* Preload next image */}
            <div
              className="absolute inset-0 opacity-0"
              style={{
                backgroundImage: `url(${documentaryPhotos[(currentWallpaperIndex + 1) % documentaryPhotos.length]})`,
              }}
            />
            {/* Light overlay for better text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(248,250,252,0.5) 50%, rgba(255,255,255,0.55) 100%)'
              }}
            />
          </>
        )}

        {/* Animated Background Orbs - Hidden on mobile for performance (Dark mode only) */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden hidden sm:block">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-neon-emerald/15 rounded-full blur-[80px] animate-float" style={{ animationDelay: '-4s' }}></div>
          </div>
        )}

        {/* Simpler background for mobile (Dark mode) */}
        {isDark && (
          <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-neon-blue/5 via-transparent to-neon-emerald/5"></div>
        )}

        {/* Grid Pattern Overlay - Dark mode only */}
        {isDark && (
          <div className="absolute inset-0 opacity-[0.015] hidden sm:block" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        )}

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-5 sm:px-4 max-w-4xl mx-auto w-full"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Status Kehadiran Kepala Desa Badge - Desktop/Tablet Only (Mobile is in Navbar) */}
          {(() => {
            const statusConfig = {
              'di_kantor': {
                label: 'Kepala Desa di Kantor',
                color: isDark ? '#10B981' : '#047857',
                bgColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)',
                borderColor: isDark ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.8)',
                icon: '🟢'
              },
              'rapat': {
                label: 'Kepala Desa Sedang Rapat',
                color: isDark ? '#F59E0B' : '#B45309',
                bgColor: isDark ? 'rgba(245, 158, 11, 0.1)' : 'rgba(245, 158, 11, 0.2)',
                borderColor: isDark ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.8)',
                icon: '🟡'
              },
              'tidak_hadir': {
                label: 'Kepala Desa Tidak di Kantor',
                color: isDark ? '#EF4444' : '#B91C1C',
                bgColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.2)',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.8)',
                icon: '🔴'
              }
            };
            const config = statusConfig[kepalaDesaStatus] || statusConfig['di_kantor'];

            return (
              <motion.div
                variants={fadeInUp}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide mb-6 cursor-default transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: isDark ? config.bgColor : 'rgba(255,255,255,0.95)',
                  border: `2px solid ${config.borderColor}`,
                  color: config.color,
                  boxShadow: isDark ? `0 0 20px ${config.bgColor}` : `0 4px 20px rgba(0,0,0,0.15)`,
                  backdropFilter: 'blur(10px)'
                }}
                title={`Status: ${config.label}`}
              >
                <span className="text-base animate-pulse">{config.icon}</span>
                <span>Status Kehadiran</span>
                <span>• {config.label}</span>
              </motion.div>
            );
          })()}

          {/* Main Headline - Mobile First with Wave Animation */}
          <motion.h1
            variants={fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 tracking-tight leading-snug sm:leading-tight hero-title-animate"
            style={{ fontWeight: 900 }}
          >
            <span
              className="inline-block text-transparent bg-clip-text bg-[length:200%_auto] animate-shimmer"
              style={{
                backgroundImage: isDark
                  ? 'linear-gradient(90deg, #FFFFFF 0%, #0EA5E9 25%, #10B981 50%, #0EA5E9 75%, #FFFFFF 100%)'
                  : 'linear-gradient(90deg, #1E293B 0%, #059669 25%, #0EA5E9 50%, #059669 75%, #1E293B 100%)',
                fontWeight: 900,
                WebkitTextStroke: isDark ? '0.5px rgba(255,255,255,0.3)' : '0.5px rgba(0,0,0,0.2)'
              }}
            >
              Selamat Datang di Website{" "}
            </span>
            <span
              className="inline-block whitespace-nowrap text-transparent bg-clip-text bg-[length:200%_auto] animate-shimmer-delay"
              style={{
                backgroundImage: isDark
                  ? 'linear-gradient(90deg, #0EA5E9 0%, #10B981 25%, #22D3EE 50%, #10B981 75%, #0EA5E9 100%)'
                  : 'linear-gradient(90deg, #059669 0%, #0EA5E9 25%, #10B981 50%, #0EA5E9 75%, #059669 100%)',
                fontWeight: 900,
                WebkitTextStroke: isDark ? '0.5px rgba(14,165,233,0.5)' : '0.5px rgba(5,150,105,0.3)'
              }}
            >
              Desa Cenrana
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md sm:max-w-xl mx-auto leading-relaxed px-2 sm:px-0 font-medium"
            style={{
              color: isDark ? '#E5E7EB' : '#1F2937',
              textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Portal digital pemerintahan desa modern, transparan, dan inovatif.
            Melayani masyarakat dengan teknologi terkini.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4 mb-6 sm:mb-10">
            {/* Left: Buat Surat (New Feature) */}
            <Link
              href="/layanan/surat"
              className="group w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden text-sm sm:text-base"
              style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.5)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <FileText className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Buat Surat Online</span>
            </Link>

            {/* Center: Buat Aspirasi (Primary) */}
            <Link
              href="/aspirasi"
              className="group w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden ring-4 ring-white/10 dark:ring-black/10 text-sm sm:text-base"
              style={{ background: 'linear-gradient(135deg, #0EA5E9 0%, #10B981 100%)', boxShadow: '0 0 20px rgba(14, 165, 233, 0.5)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <MessageSquareText className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Buat Aspirasi</span>
            </Link>

            {/* Right: Lapak Warga */}
            <Link
              href="/lapak"
              className="group w-full sm:w-auto px-5 sm:px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 relative overflow-hidden text-sm sm:text-base"
              style={{ background: 'linear-gradient(135deg, #F97316 0%, #F59E0B 100%)', boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.5)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <Store className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Lapak Warga</span>
            </Link>
          </motion.div>

          {/* Announcement Ticker / Papan Pengumuman Berjalan */}
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto">
            <div
              className="relative overflow-hidden rounded-xl backdrop-blur-sm py-3 px-4"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '2px solid #CBD5E1',
                boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-center gap-3">
                <span className="shrink-0 px-2.5 py-1 bg-neon-blue/10 text-neon-blue text-xs font-bold rounded-md uppercase tracking-wider border border-neon-blue/20">
                  Info
                </span>
                <div className="overflow-hidden flex-1 mask-linear-fade">
                  <div
                    className="animate-marquee whitespace-nowrap flex items-center"
                    style={{ animationDuration: '120s' }}
                  >
                    {/* Dynamic Pengumuman from CMS */}
                    {cmsContent.pengumuman?.filter(p => p.active).map((item) => (
                      <span key={item.id} className="text-sm mx-16 font-medium" style={{ color: isDark ? '#D1D5DB' : '#475569' }}>
                        📢 {item.text}
                      </span>
                    ))}
                    {/* Upcoming Agenda Items - Auto from Agenda Kegiatan */}
                    {cmsContent.agenda?.slice(0, 3).map((item) => (
                      <span key={`agenda-${item.id}`} className="text-sm mx-16 font-medium" style={{ color: isDark ? '#D1D5DB' : '#475569' }}>
                        📅 <strong>{item.title}</strong> — {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} pukul {item.time}
                      </span>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {cmsContent.pengumuman?.filter(p => p.active).map((item) => (
                      <span key={`dup-${item.id}`} className="text-sm mx-16 font-medium" style={{ color: isDark ? '#D1D5DB' : '#475569' }}>
                        📢 {item.text}
                      </span>
                    ))}
                    {cmsContent.agenda?.slice(0, 3).map((item) => (
                      <span key={`dup-agenda-${item.id}`} className="text-sm mx-16 font-medium" style={{ color: isDark ? '#D1D5DB' : '#475569' }}>
                        📅 <strong>{item.title}</strong> — {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} pukul {item.time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 bg-neon-blue rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* 2. STATS SECTION - Glowing Numbers */}
      <section
        className="relative py-20 px-4 border-y border-gray-200 dark:border-white/5"
        style={{ backgroundColor: isDark ? '#111827' : '#F9FAFB' }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {statItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={scaleIn}
                className="text-center group cursor-default"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl icon-glow group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${item.color}`} />
                </div>
                <h3
                  className="text-2xl sm:text-4xl md:text-5xl font-black mb-1 sm:mb-2 tracking-tight"
                  style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                >
                  <Editable section="home" field={item.valField} placeholder={item.placeholderVal} />
                </h3>
                <p
                  className="text-sm uppercase tracking-widest font-medium"
                  style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                >
                  <Editable section="home" field={item.labelField} placeholder={item.placeholderLabel} />
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* POLLING WARGA SECTION */}
      <section
        className="py-12 px-4"
        style={{ backgroundColor: isDark ? '#0D1421' : '#F1F5F9' }}
      >
        <div className="max-w-xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <PollWidget />
          </motion.div>
        </div>
      </section>

      {/* 3. SERVICES - Equal Grid */}
      <section
        className="py-16 px-4"
        style={{ backgroundColor: isDark ? '#0A0F1A' : '#FFFFFF' }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
            >
              Layanan <span
                className="animate-shimmer bg-clip-text text-transparent bg-[length:200%_100%]"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(90deg, #0EA5E9, #06B6D4, #0EA5E9)'
                    : 'linear-gradient(90deg, #059669, #10B981, #059669)'
                }}
              >Digital</span>
            </h2>
            <p
              className="max-w-lg mx-auto text-sm"
              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
            >
              Akses berbagai layanan publik digital dengan mudah dan cepat.
            </p>
          </motion.div>

          {/* Equal 2x2 Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {/* Aspirasi */}
            <motion.div variants={scaleIn}>
              <Link href="/aspirasi" className="block h-full group">
                <div className="glow-card h-full p-4 sm:p-6 neon-border-blue">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-blue/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <MessageSquareText className="w-5 h-5 sm:w-6 sm:h-6 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                      >Layanan Aspirasi</h3>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                      >Sampaikan kritik, saran, atau pengaduan langsung ke pemerintah desa.</p>
                      <div className="inline-flex items-center text-neon-blue text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Buat Laporan <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Lapak Warga */}
            <motion.div variants={scaleIn}>
              <Link href="/lapak" className="block h-full group">
                <div className="glow-card h-full p-4 sm:p-6 neon-border-orange">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neon-orange/20 to-neon-orange/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Store className="w-5 h-5 sm:w-6 sm:h-6 text-neon-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                      >Lapak Warga</h3>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                      >Marketplace produk UMKM lokal Desa Cenrana.</p>
                      <div className="inline-flex items-center text-neon-orange text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Belanja <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Peta Digital */}
            <motion.div variants={scaleIn}>
              <Link href="/informasi/peta" className="block h-full group">
                <div className="glow-card h-full p-4 sm:p-6 neon-border-emerald">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neon-emerald/20 to-neon-emerald/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Map className="w-5 h-5 sm:w-6 sm:h-6 text-neon-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                      >Peta Digital</h3>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                      >Jelajahi wilayah dan potensi Desa Cenrana.</p>
                      <div className="inline-flex items-center text-neon-emerald text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Lihat Peta <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Layanan Surat (Replaces Transparansi) */}
            <motion.div variants={scaleIn}>
              <Link href="/layanan/surat" className="block h-full group">
                <div className="glow-card h-full p-4 sm:p-6 neon-border-purple">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-purple/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-neon-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                      >Surat Online</h3>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                      >Buat surat keterangan usaha, domisili, dan lainnya secara online.</p>
                      <div className="inline-flex items-center text-neon-purple text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Buat Surat <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* View All Link */}
          <motion.div
            className="text-center mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Link href="/layanan" className="inline-flex items-center text-neon-blue font-medium hover:underline">
              Lihat Semua Layanan <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 4. PROGRAM UNGGULAN */}
      <section
        className="py-16 px-4 border-t border-gray-200 dark:border-white/5"
        style={{ backgroundColor: isDark ? '#0A0F1A' : '#FFFFFF' }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
              >
                Program <span
                  className="animate-shimmer bg-clip-text text-transparent bg-[length:200%_100%]"
                  style={{
                    backgroundImage: isDark
                      ? 'linear-gradient(90deg, #0EA5E9, #06B6D4, #0EA5E9)'
                      : 'linear-gradient(90deg, #059669, #10B981, #059669)'
                  }}
                >Unggulan</span>
              </h2>
              <p
                className="text-sm"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >Inisiatif strategis Desa Cenrana</p>
            </div>
            <Link href="/informasi/program" className="inline-flex items-center text-neon-blue font-medium hover:underline text-sm">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {programs?.slice(0, 4).map((program, index) => {
              const IconComponent = {
                "Road": Map, "Laptop": Laptop, "HeartPulse": HeartPulse, "Home": HomeIcon
              }[program.icon] || Lightbulb;

              const statusColors = {
                "Selesai": { bg: "from-neon-emerald/20 to-neon-emerald/5", text: "text-neon-emerald", badge: "bg-neon-emerald/10 text-neon-emerald" },
                "Berjalan": { bg: "from-neon-blue/20 to-neon-blue/5", text: "text-neon-blue", badge: "bg-neon-blue/10 text-neon-blue" },
                "Rencana": { bg: "from-neon-orange/20 to-neon-orange/5", text: "text-neon-orange", badge: "bg-neon-orange/10 text-neon-orange" },
              }[program.status] || { bg: "from-neon-purple/20 to-neon-purple/5", text: "text-neon-purple", badge: "bg-neon-purple/10 text-neon-purple" };

              return (
                <motion.div key={program.id} variants={scaleIn}>
                  <div className="glow-card p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${statusColors.bg} flex items-center justify-center shrink-0`}>
                        <IconComponent className={`w-6 h-6 ${statusColors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-lg font-bold mb-1 line-clamp-1"
                          style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                        >{program.title}</h3>
                        <p
                          className="text-sm line-clamp-2 mb-3"
                          style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                        >{program.description}</p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusColors.badge}`}>
                          {program.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 5. PERANGKAT DESA (SOTK) */}
      <section
        className="py-16 px-4 border-t border-gray-200 dark:border-white/5"
        style={{ backgroundColor: isDark ? '#0A0F1A' : '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col items-center text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
            >
              Perangkat <span
                className="animate-shimmer bg-clip-text text-transparent bg-[length:200%_100%]"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(90deg, #0EA5E9, #06B6D4, #0EA5E9)'
                    : 'linear-gradient(90deg, #059669, #10B981, #059669)'
                }}
              >Desa</span>
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
            >Jajaran pemerintahan Desa Cenrana</p>
            <div className="flex gap-3">
              <button onClick={() => scrollSotk('left')} className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-neon-blue/30 transition-all">
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-white" />
              </button>
              <button onClick={() => scrollSotk('right')} className="p-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 hover:border-neon-blue/30 transition-all">
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-white" />
              </button>
            </div>
          </motion.div>

          <div ref={sotkScrollRef} className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar scroll-smooth">
            {displayOfficials.map((official, idx) => (
              <motion.div
                key={official.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-[240px] group"
              >
                <div className="glow-card p-6 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-neon-blue/50 transition-colors">
                    <Editable
                      type="image"
                      value={official.image}
                      onSave={(val) => updateOfficial(official, "image", val)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                  >
                    <Editable value={official.name} onSave={(val) => updateOfficial(official, "name", val)} />
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue text-xs font-medium">
                    <Editable value={official.role} onSave={(val) => updateOfficial(official, "role", val)} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BERITA TERKINI */}
      <section
        className="py-16 px-4 border-t border-gray-200 dark:border-white/5"
        style={{ backgroundColor: isDark ? '#0A0F1A' : '#FFFFFF' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex justify-between items-end mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
              >
                Kabar <span
                  className="animate-shimmer bg-clip-text text-transparent bg-[length:200%_100%]"
                  style={{
                    backgroundImage: isDark
                      ? 'linear-gradient(90deg, #0EA5E9, #06B6D4, #0EA5E9)'
                      : 'linear-gradient(90deg, #059669, #10B981, #059669)'
                  }}
                >Terkini</span>
              </h2>
              <p
                className="text-sm"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >Berita dan informasi seputar Desa Cenrana</p>
            </div>
            <Link href="/informasi/berita" className="hidden md:flex items-center text-neon-blue font-medium hover:underline">
              Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {news && news.length > 0 ? (
              news.filter(n => n.status !== 'draft').slice(0, 4).map((item, idx) => (
                <motion.div key={item.id} variants={scaleIn}>
                  <div className="glow-card overflow-hidden group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="text-gray-500 text-[10px] mb-2 uppercase tracking-wider font-medium">
                        {item.date}
                      </div>
                      <h3
                        className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-neon-blue transition-colors"
                        style={{ color: isDark ? '#FFFFFF' : '#1E293B' }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-xs leading-relaxed line-clamp-2 mb-4 flex-grow"
                        style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                      >
                        {item.excerpt}
                      </p>
                      <Link href="/informasi/berita" className="inline-flex items-center text-neon-blue text-xs font-medium hover:translate-x-1 transition-transform mt-auto">
                        Baca <ChevronRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div
                className="col-span-4 text-center py-12"
                style={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
              >
                Belum ada berita terkini.
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20"></div>
    </div>
  );
}

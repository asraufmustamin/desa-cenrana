"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User, Sun, Moon, Search } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import GlobalSearch from "./GlobalSearch";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { isLoggedIn, theme, toggleTheme, kepalaDesaStatus } = useAppContext();
    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "/" },
        {
            name: "Profil",
            href: "/profil",
            dropdown: [
                { name: "Sambutan Kades", href: "/profil#sambutan" },
                { name: "Sejarah", href: "/profil#sejarah" },
                { name: "Visi Misi", href: "/profil#visi-misi" },
                { name: "Struktur Organisasi", href: "/profil#struktur" },
                { name: "Lembaga Kemasyarakatan", href: "/profil#lembaga" },
                { name: "Sarana & Prasarana", href: "/profil#sarana" },
                { name: "Potensi Desa", href: "/profil#potensi" },
            ],
        },
        {
            name: "Informasi",
            href: "/informasi",
            dropdown: [
                { name: "Berita Desa", href: "/informasi/berita" },
                { name: "Transparansi", href: "/informasi/transparansi" },
                { name: "Peta Desa", href: "/informasi/peta" },
                { name: "Program Kerja", href: "/informasi/program" },
                { name: "Galeri Desa", href: "/informasi/galeri" },
                { name: "Infografis", href: "/informasi/infografis" },
                { name: "Produk Hukum", href: "/informasi/hukum" },
                { name: "Agenda Kegiatan", href: "/informasi/agenda" },
            ],
        },
        {
            name: "Layanan",
            href: "/layanan",
            dropdown: [
                { name: "Buat Aspirasi", href: "/aspirasi" },
                { name: "Buat Surat Online", href: "/layanan/surat" },
                { name: "Lacak Status Aspirasi", href: "/aspirasi/track" },
                ...(isLoggedIn ? [{ name: "Data Penduduk", href: "/admin/penduduk" }] : []),
            ],
        },
        { name: "Lapak Warga", href: "/lapak" },
    ];

    // Futuristic Smart Village 2030 Navbar
    // In light mode when scrolled: use white bg with dark text
    // In light mode not scrolled: use dark text (overlay on hero)
    // In dark mode: always use light text
    const isLightMode = mounted && theme === 'light';

    const navBgClass = scrolled
        ? isLightMode
            ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg"
            : "nav-futuristic border-b border-white/5"
        : "bg-transparent";

    // Theme-aware text color for nav links
    // Light mode: always use dark text (whether scrolled or not)
    const textColorClass = isLightMode ? "text-slate-800" : "text-white";

    return (
        <>
            <nav
                className={`fixed w-full z-50 transition-all duration-300 ${navBgClass}`}
                role="navigation"
                aria-label="Navigasi Utama"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/logo-maros.png" alt="Logo Maros" className="w-full h-full object-contain drop-shadow-md" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg tracking-tight leading-none transition-colors">
                                    <span style={{ color: mounted && theme === 'light' ? '#059669' : '#00D4FF' }}>Desa</span>{" "}
                                    <span style={{ color: mounted && theme === 'light' ? '#10B981' : '#00D4FF' }}>Cenrana</span>
                                </span>
                                <span className="text-xs font-medium tracking-wider text-gray-400">
                                    Kabupaten Maros
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation - Shows on tablet landscape (768px+) */}
                        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                            {navLinks.map((link) => (
                                <div
                                    key={link.name}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={link.href}
                                        className={`flex items-center font-bold text-sm lg:text-base transition-colors py-2 ${textColorClass} hover:text-emerald-500`}
                                        style={{
                                            textShadow: isLightMode ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        {link.name}
                                        {link.dropdown && (
                                            <ChevronDown className="ml-1 w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                                        )}
                                    </Link>

                                    {/* Dropdown Menu */}
                                    {link.dropdown && (
                                        <div
                                            className={`absolute top-full left-0 w-56 pt-2 transition-all duration-300 transform origin-top-left ${activeDropdown === link.name
                                                ? "opacity-100 scale-100 visible"
                                                : "opacity-0 scale-95 invisible"
                                                }`}
                                        >
                                            <div className="rounded-2xl overflow-hidden p-2 shadow-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="block px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                            {/* Search Button */}
                            <button
                                onClick={() => setShowSearch(true)}
                                className="w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300
                                bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:border-emerald-500/50
                                dark:from-slate-800 dark:to-slate-900 dark:border-slate-700 dark:hover:border-emerald-500/50"
                                aria-label="Cari"
                            >
                                <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </button>

                            {/* Theme Toggle - Animated */}
                            <button
                                onClick={toggleTheme}
                                className="relative w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-500 overflow-hidden group
                                bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:border-neon-blue/50
                                dark:from-slate-800 dark:to-slate-900 dark:border-slate-700 dark:hover:border-neon-blue/50"
                                aria-label="Toggle Theme"
                            >
                                {/* Sun Icon */}
                                <Sun className={`absolute w-5 h-5 text-amber-500 transition-all duration-500 
                                ${mounted && theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
                                {/* Moon Icon */}
                                <Moon className={`absolute w-5 h-5 text-slate-700 dark:text-neon-blue transition-all duration-500 
                                ${mounted && theme === "light" ? "opacity-100 rotate-0 scale-100" : mounted && theme === "dark" ? "opacity-0 rotate-90 scale-50" : "opacity-0"}`} />
                                {/* Glow Effect */}
                                <div className="absolute inset-0 rounded-full bg-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            {isLoggedIn ? (
                                <Link
                                    href="/admin"
                                    className="px-4 lg:px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-full text-sm lg:text-base font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all flex items-center"
                                >
                                    <User className="w-4 h-4 mr-1 lg:mr-2" />
                                    <span className="hidden lg:inline">Dashboard</span>
                                    <span className="inline lg:hidden">Admin</span>
                                </Link>
                            ) : (
                                <Link
                                    href="/admin/login"
                                    className={`px-4 lg:px-6 py-2.5 rounded-full text-sm lg:text-base font-bold border transition-all flex items-center bg-white border-slate-200 text-slate-800 hover:bg-slate-50 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:hover:bg-slate-700`}
                                >
                                    <span className="hidden lg:inline">Masuk Admin</span>
                                    <span className="inline lg:hidden">Admin</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center space-x-2">
                            {/* Mobile Search Button */}
                            <button
                                onClick={() => setShowSearch(true)}
                                className="w-10 h-10 flex items-center justify-center rounded-full border transition-all
                                    bg-slate-100 border-slate-300 dark:bg-slate-800 dark:border-slate-700"
                                aria-label="Cari"
                            >
                                <Search className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </button>

                            {/* Status Kehadiran Ring Indicator - Mobile Only */}
                            {(() => {
                                const statusConfig = {
                                    'di_kantor': {
                                        label: 'Di Kantor',
                                        ringColor: '#10B981',
                                        bgColor: 'rgba(16, 185, 129, 0.15)'
                                    },
                                    'rapat': {
                                        label: 'Sedang Rapat',
                                        ringColor: '#F59E0B',
                                        bgColor: 'rgba(245, 158, 11, 0.15)'
                                    },
                                    'tidak_hadir': {
                                        label: 'Tidak Hadir',
                                        ringColor: '#EF4444',
                                        bgColor: 'rgba(239, 68, 68, 0.15)'
                                    }
                                };
                                const config = statusConfig[kepalaDesaStatus] || statusConfig['di_kantor'];

                                return (
                                    <div
                                        className="relative w-10 h-10 flex items-center justify-center cursor-pointer"
                                        onClick={() => setShowStatusPopup(!showStatusPopup)}
                                    >
                                        {/* Popup Text */}
                                        {showStatusPopup && (
                                            <div
                                                className="absolute top-12 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap z-50 shadow-lg animate-fade-in-up"
                                                style={{
                                                    backgroundColor: config.bgColor,
                                                    border: `2px solid ${config.ringColor}`,
                                                    color: config.ringColor,
                                                    boxShadow: `0 4px 15px ${config.ringColor}30`
                                                }}
                                            >
                                                <div className="flex items-center gap-1.5">
                                                    <span>👤</span>
                                                    <span>Kepala Desa: {config.label}</span>
                                                </div>
                                                {/* Arrow pointer */}
                                                <div
                                                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
                                                    style={{
                                                        borderLeft: '6px solid transparent',
                                                        borderRight: '6px solid transparent',
                                                        borderBottom: `6px solid ${config.ringColor}`
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {/* Outer animated ping */}
                                        <div
                                            className="absolute inset-0 rounded-full animate-ping opacity-20"
                                            style={{ backgroundColor: config.ringColor }}
                                        />
                                        {/* Ring border */}
                                        <div
                                            className="absolute inset-1 rounded-full"
                                            style={{
                                                border: `2px solid ${config.ringColor}`,
                                                backgroundColor: config.bgColor
                                            }}
                                        />
                                        {/* Center dot */}
                                        <div
                                            className="relative w-3 h-3 rounded-full animate-pulse"
                                            style={{
                                                backgroundColor: config.ringColor,
                                                boxShadow: `0 0 10px ${config.ringColor}`
                                            }}
                                        />
                                    </div>
                                );
                            })()}

                            {/* Mobile Theme Toggle - Animated */}
                            <button
                                onClick={toggleTheme}
                                className="relative w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-500 overflow-hidden
                                bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300
                                dark:from-slate-800 dark:to-slate-900 dark:border-slate-700"
                                aria-label="Toggle Theme"
                            >
                                <Sun className={`absolute w-5 h-5 text-amber-500 transition-all duration-500 
                                ${mounted && theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`} />
                                <Moon className={`absolute w-5 h-5 text-slate-700 transition-all duration-500 
                                ${mounted && theme === "light" ? "opacity-100 rotate-0 scale-100" : mounted && theme === "dark" ? "opacity-0 rotate-90 scale-50" : "opacity-0"}`} />
                            </button>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-800 dark:text-white"
                                aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
                                aria-expanded={isOpen}
                                aria-controls="mobile-menu"
                            >
                                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Only on mobile, hidden on tablet+ */}
                <div
                    id="mobile-menu"
                    className={`md:hidden absolute w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ${isOpen ? "max-h-[calc(100vh-5rem)] opacity-100" : "max-h-0 opacity-0"
                        } overflow-y-auto overflow-x-hidden`}
                    aria-hidden={!isOpen}
                >
                    <div className="px-4 pt-4 pb-8 space-y-2">
                        {navLinks.map((link) => (
                            <div key={link.name}>
                                {link.dropdown ? (
                                    <div className="space-y-2">
                                        {link.href && link.href !== "#" ? (
                                            <Link
                                                href={link.href}
                                                className="block px-4 py-3 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider hover:text-blue-600 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ) : (
                                            <div className="px-4 py-3 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider">
                                                {link.name}
                                            </div>
                                        )}
                                        {link.dropdown.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="block px-4 py-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors ml-4"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="block px-4 py-3 text-slate-800 dark:text-slate-100 font-medium hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4">
                            <Link
                                href={isLoggedIn ? "/admin" : "/admin/login"}
                                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20"
                                onClick={() => setIsOpen(false)}
                            >
                                {isLoggedIn ? "Dashboard Admin" : "Masuk Admin"}
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Global Search Modal */}
            <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
        </>
    );
}

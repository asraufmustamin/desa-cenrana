"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, User, Sun, Moon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const { isLoggedIn, theme, toggleTheme } = useAppContext();

    useEffect(() => {
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
            href: "#",
            dropdown: [
                { name: "Sejarah", href: "/profil?tab=sejarah" },
                { name: "Visi Misi", href: "/profil?tab=visi" },
                { name: "SOTK", href: "/profil?tab=sotk" },
            ],
        },
        {
            name: "Informasi",
            href: "#",
            dropdown: [
                { name: "Berita Desa", href: "/informasi/berita" },
                { name: "Transparansi", href: "/informasi/transparansi" },
                { name: "Peta Desa", href: "/informasi/peta" },
                { name: "Program Kerja", href: "/informasi/program" },
                { name: "Galeri Desa", href: "/informasi/galeri" },
            ],
        },
        {
            name: "Layanan",
            href: "#",
            dropdown: [
                { name: "Buat Aspirasi", href: "/aspirasi" },
                { name: "Cek Status", href: "/aspirasi" },
            ],
        },
        { name: "Lapak Warga", href: "/lapak" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-[var(--bg-panel)] backdrop-blur-xl border-b border-[var(--border-color)] shadow-lg"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {/* Kabupaten Maros Logo */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/logo-maros.png" alt="Logo Maros" className="w-full h-full object-contain drop-shadow-md" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-bold text-lg tracking-tight leading-none transition-colors md:text-shadow-sm ${scrolled ? "text-[var(--text-primary)] group-hover:text-emerald-500" : "text-[var(--text-primary)] md:text-white group-hover:text-emerald-500 md:group-hover:text-emerald-400"}`}>
                                Desa Cenrana
                            </span>
                            <span className={`text-xs font-bold tracking-wider ${scrolled ? "text-[var(--text-secondary)]" : "text-[var(--text-secondary)] md:text-white/80"}`}>
                                Kabupaten Maros
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <div
                                key={link.name}
                                className="relative group"
                                onMouseEnter={() => setActiveDropdown(link.name)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <Link
                                    href={link.href}
                                    className={`flex items-center font-bold transition-colors py-2 md:text-shadow-sm ${scrolled ? "text-[var(--text-primary)] hover:text-blue-600" : "text-[var(--text-primary)] md:text-white hover:text-blue-600 md:hover:text-emerald-400"}`}
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
                                        <div className="glass-panel rounded-2xl overflow-hidden p-2 shadow-xl border border-[var(--border-color)] bg-[var(--bg-panel)] backdrop-blur-xl">
                                            {link.dropdown.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="block px-4 py-3 text-sm text-[var(--text-primary)] hover:text-blue-600 hover:bg-[var(--bg-card)] rounded-xl transition-colors font-medium"
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
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-panel)] transition-all"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isLoggedIn ? (
                            <Link
                                href="/admin"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-105 transition-all flex items-center"
                            >
                                <User className="w-4 h-4 mr-2" />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/admin/login"
                                className="px-6 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-full font-bold hover:bg-[var(--bg-panel)] transition-all flex items-center backdrop-blur-md"
                            >
                                Masuk Admin
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)]"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[var(--text-primary)] p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute w-full bg-[var(--bg-panel)] backdrop-blur-xl border-b border-[var(--border-color)] transition-all duration-300 overflow-hidden ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="px-4 pt-4 pb-8 space-y-2">
                    {navLinks.map((link) => (
                        <div key={link.name}>
                            {link.dropdown ? (
                                <div className="space-y-2">
                                    <div className="px-4 py-3 text-[var(--text-secondary)] font-bold uppercase text-xs tracking-wider">
                                        {link.name}
                                    </div>
                                    {link.dropdown.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="block px-4 py-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-xl transition-colors ml-4"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link
                                    href={link.href}
                                    className="block px-4 py-3 text-[var(--text-primary)] font-medium hover:bg-[var(--bg-card)] rounded-xl transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            )}
                        </div>
                    ))}
                    <div className="pt-4 border-t border-[var(--border-color)] mt-4">
                        <Link
                            href={isLoggedIn ? "/admin" : "/admin/login"}
                            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            {isLoggedIn ? "Dashboard Admin" : "Masuk Admin"}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

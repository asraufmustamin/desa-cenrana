"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

/**
 * Breadcrumb Component
 * ====================
 * 
 * Navigasi breadcrumb otomatis berdasarkan path
 */

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
}

// Mapping path ke label yang lebih readable
const PATH_LABELS: Record<string, string> = {
    profil: "Profil Desa",
    informasi: "Informasi",
    layanan: "Layanan",
    lapak: "Lapak Warga",
    aspirasi: "Aspirasi",
    admin: "Dashboard",
    berita: "Berita",
    agenda: "Agenda",
    galeri: "Galeri",
    transparansi: "Transparansi",
    hukum: "Produk Hukum",
    program: "Program Kerja",
    infografis: "Infografis",
    peta: "Peta Desa",
    sambutan: "Sambutan",
    sejarah: "Sejarah",
    "visi-misi": "Visi & Misi",
    sotk: "Struktur Organisasi",
    lembaga: "Lembaga",
    potensi: "Potensi Desa",
    sarana: "Sarana & Prasarana",
    surat: "Layanan Surat",
    track: "Lacak Status",
    check: "Cek Status Surat",
    form: "Formulir",
    success: "Berhasil",
    login: "Login",
    setup: "Setup",
    settings: "Pengaturan",
    penduduk: "Data Penduduk",
    emergency: "Emergency",
};

export default function Breadcrumb({ items, className = "", showHome = true }: BreadcrumbProps) {
    const pathname = usePathname();

    // Generate breadcrumb items dari pathname jika tidak di-provide
    const breadcrumbItems: BreadcrumbItem[] = items || generateBreadcrumbs(pathname);

    if (breadcrumbItems.length === 0 && !showHome) return null;

    return (
        <nav className={`flex items-center gap-1 text-sm ${className}`} aria-label="Breadcrumb">
            {showHome && (
                <>
                    <Link
                        href="/"
                        className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-emerald-500 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Beranda</span>
                    </Link>
                    {breadcrumbItems.length > 0 && (
                        <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                    )}
                </>
            )}

            {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                    <div key={item.href} className="flex items-center gap-1">
                        {isLast ? (
                            <span className="font-bold text-[var(--text-primary)] truncate max-w-[200px]">
                                {item.label}
                            </span>
                        ) : (
                            <>
                                <Link
                                    href={item.href}
                                    className="text-[var(--text-secondary)] hover:text-emerald-500 transition-colors truncate max-w-[150px]"
                                >
                                    {item.label}
                                </Link>
                                <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
                            </>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

/**
 * Generate breadcrumb items dari pathname
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = PATH_LABELS[segment] || capitalizeFirst(segment);

        return { label, href };
    });
}

/**
 * Capitalize first letter
 */
function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, " ");
}

/**
 * Breadcrumb dengan container styling
 */
export function BreadcrumbContainer({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
    return (
        <div className={`py-4 px-4 md:px-8 bg-[var(--bg-panel)] ${className}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Breadcrumb />
                {children}
            </div>
        </div>
    );
}

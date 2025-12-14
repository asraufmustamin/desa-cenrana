"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import { newsItems, lapakItems } from "@/data/mockData";

// Define types (Keep existing interfaces)
export interface NewsItem {
    id: number;
    title: string;
    date: string;
    excerpt: string;
    image: string;
    category?: string;
    content?: string;
}

export interface LapakItem {
    id: number;
    title: string;
    category: string;
    price: string;
    seller: string;
    phone: string;
    image: string;
    status: "Active" | "Pending" | "Rejected";
    description?: string;
    created_at?: string;
    // Analytics fields
    view_count?: number;
    wa_click_count?: number;
    last_viewed_at?: string;
}

export interface AspirasiItem {
    id: string;
    nama: string;
    nik?: string; // OPTIONAL: Column removed from DB for privacy
    dusun: string;
    kategori: string;
    laporan: string;
    status: "Pending" | "Diproses" | "Selesai" | "Rejected";
    date: string;
    reply?: string;
    is_anonymous?: boolean;
    image?: string;
    priority?: "Low" | "Medium" | "High" | "Emergency";
    rating?: number; // 1-5 stars
    feedback_text?: string;
}

export interface Official {
    id: number;
    name: string;
    role: string;
    image: string;
}

export interface Program {
    id: number;
    title: string;
    status: "Berjalan" | "Selesai" | "Rencana";
    description: string;
    icon: string;
}

export interface GalleryItem {
    id: number;
    title: string;
    image: string;
}

export interface InfografisData {
    gender: { name: string; value: number; fill: string }[];
    education: { name: string; value: number; fill: string }[];
    job: { name: string; value: number; fill: string }[];
}

export interface HukumItem {
    id: number;
    jenis: "Perdes" | "SK Kades" | "Perkada";
    nomor: string;
    tahun: string;
    judul: string;
    downloadUrl: string;
}

export interface AgendaItem {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
}

export interface CMSContent {
    home: {
        heroTitle: string;
        heroSubtitle: string;
        heroDesc: string;
        statsLabel1: string; statsVal1: string;
        statsLabel2: string; statsVal2: string;
        statsLabel3: string; statsVal3: string;
        statsLabel4: string; statsVal4: string;
        statsLabel5: string; statsVal5: string;
        statsLabel6: string; statsVal6: string;
    };
    footer: {
        brandName: string;
        brandDesc: string;
        address: string;
        phone: string;
        email: string;
        copyright: string;
    };
    navbar: {
        brandName: string;
    };
    profil: {
        historyTitle: string;
        historyText: string;
        historyFullText: string;
        historyBanner: string;
        visionTitle: string;
        visionText: string;
        missionTitle: string;
        missionList: string[];
    };
    transparansi: {
        title: string;
        items: { label: string; target: string; realization: string; percentage: string }[];
        budget: {
            pendapatan: { target: number; realisasi: number };
            belanja: { target: number; realisasi: number };
        };
    };
    officials: Official[];
    sotk_new: {
        kades: { name: string; role: string; image: string };
        sekdes: { name: string; role: string; image: string };
        kaur: { name: string; role: string; image: string }[];
        kadus: { name: string; role: string; image: string }[];
    };
    programs: Program[];
    gallery: GalleryItem[];
    peta: {
        batasUtara: string;
        batasSelatan: string;
        batasBarat: string;
        batasTimur: string;
        luasWilayah: string;
        alamatKantor: string;
        koordinat: string;
        jarakKabupaten: string;
    };
    infografis: InfografisData;
    hukum: HukumItem[];
    agenda: AgendaItem[];
}

type Theme = "dark" | "light";

interface AppContextType {
    news: NewsItem[];
    lapak: LapakItem[];
    aspirasi: AspirasiItem[];
    officials: Official[];
    cmsContent: CMSContent;
    isEditMode: boolean;
    isLoading: boolean; // Added loading state
    toggleEditMode: () => void;
    updateContent: (section: keyof CMSContent, field: string, value: any) => Promise<void>;
    isLoggedIn: boolean;
    theme: string | undefined;
    login: () => void;
    logout: () => void;
    toggleTheme: () => void;
    addNews: (item: Omit<NewsItem, "id">) => Promise<void>;
    deleteNews: (id: number) => Promise<void>;
    updateNews: (id: number, item: Partial<NewsItem>) => Promise<void>;
    checkNikAvailability: (nik: string) => Promise<boolean>;
    addAspirasi: (item: Omit<AspirasiItem, "id" | "status" | "date">) => Promise<string>;
    verifyAspirasi: (id: string, status: "Diproses" | "Rejected") => Promise<void>;
    replyAspirasi: (id: string, reply: string) => Promise<void>;
    getAspirasiByTicket: (ticketId: string) => AspirasiItem | undefined;
    deleteAspirasi: (id: string) => Promise<void>;
    submitRating: (ticketId: string, rating: number, feedback?: string) => Promise<void>;
    submitLapak: (item: Omit<LapakItem, "id" | "status">) => Promise<void>;
    approveLapak: (id: number) => Promise<void>;
    rejectLapak: (id: number) => Promise<void>;
    deleteLapak: (id: number) => Promise<void>;
    addGalleryItem: (item: Omit<GalleryItem, "id">) => Promise<void>;
    addProgram: () => Promise<void>;
    deleteProgram: (id: number) => Promise<void>;
    updateProgram: (id: number, updates: Partial<Program>) => Promise<void>;
    addHukum: () => Promise<void>;
    deleteHukum: (id: number) => Promise<void>;
    updateHukum: (id: number, updates: Partial<HukumItem>) => Promise<void>;
    addAgenda: () => Promise<void>;
    deleteAgenda: (id: number) => Promise<void>;
    updateAgenda: (id: number, updates: Partial<AgendaItem>) => Promise<void>;
    // Analytics tracking functions
    trackProductView: (productId: number) => Promise<void>;
    trackWAClick: (productId: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Default CMS Content (Fallback)
const defaultCMSContent: CMSContent = {
    home: {
        heroTitle: "Desa Cenrana",
        heroSubtitle: "Mewujudkan desa yang mandiri, sejahtera, dan berbudaya melalui pelayanan publik yang transparan dan inovatif.",
        heroDesc: "Pusat informasi dan layanan digital untuk warga Desa Cenrana.",
        statsLabel1: "Penduduk", statsVal1: "3,500+",
        statsLabel2: "Kepala Keluarga", statsVal2: "850",
        statsLabel3: "Dusun", statsVal3: "4",
        statsLabel4: "Luas Wilayah", statsVal4: "12 km²",
        statsLabel5: "UMKM", statsVal5: "45+",
        statsLabel6: "Indeks Desa", statsVal6: "Maju",
    },
    footer: {
        brandName: "Desa Cenrana",
        brandDesc: "Website resmi Pemerintah Desa Cenrana, Kabupaten Maros.",
        address: "Jl. AB Situru Dusun Benteng, Kec. Camba, Kab. Maros, Sulawesi Selatan",
        phone: "+62 812-3456-7890",
        email: "admin@desacenrana.id",
        copyright: "© 2026 Pemerintah Desa Cenrana. All rights reserved.",
    },
    navbar: {
        brandName: "Desa Cenrana",
    },
    profil: {
        historyTitle: "Sejarah Desa Cenrana",
        historyText: "Desa Cenrana memiliki sejarah panjang yang berakar dari nilai-nilai gotong royong dan kearifan lokal. Didirikan pada tahun 1950-an, desa ini awalnya merupakan pemukiman kecil para petani yang kemudian berkembang menjadi pusat kegiatan ekonomi dan sosial di wilayah ini.",
        historyFullText: `Desa Cenrana memiliki sejarah panjang yang berakar dari nilai-nilai gotong royong dan kearifan lokal. Didirikan pada tahun 1950-an, desa ini awalnya merupakan pemukiman kecil para petani yang kemudian berkembang menjadi pusat kegiatan ekonomi dan sosial di wilayah ini.

**Awal Mula Pembentukan**

Sejarah Desa Cenrana tidak terlepas dari perjuangan para pendahulu yang datang ke wilayah ini dengan membawa semangat untuk membangun kehidupan yang lebih baik. Pada awalnya, wilayah ini adalah lahan pertanian yang luas dengan sistem irigasi tradisional yang dikelola secara komunal oleh para petani.

**Perkembangan Ekonomi**

Seiring berjalannya waktu, Desa Cenrana berkembang pesat menjadi sentra ekonomi lokal. Sektor pertanian menjadi pilar utama perekonomian desa, dengan hasil panen padi, jagung, dan palawija yang melimpah. Sistem gotong royong yang diterapkan dalam pengolahan lahan pertanian menjadi kunci keberhasilan produksi pertanian desa.

**Perubahan Administrasi**

Pada tahun 1970-an, Desa Cenrana resmi ditetapkan sebagai desa definitif dengan struktur pemerintahan yang terorganisir. Kepala Desa pertama yang dilantik membawa visi pembangunan infrastruktur dan peningkatan kesejahteraan masyarakat.

**Era Modernisasi**

Memasuki abad ke-21, Desa Cenrana mulai bertransformasi dengan pembangunan infrastruktur modern seperti jalan beraspal, jaringan listrik yang merata, dan akses internet. Pemerintah desa juga mulai menerapkan sistem administrasi digital untuk meningkatkan kualitas pelayanan publik.

**Warisan Budaya**

Hingga kini, Desa Cenrana tetap mempertahankan nilai-nilai budaya dan tradisi lokal. Berbagai upacara adat dan kegiatan keagamaan masih dijalankan dengan penuh hikmat, menjadi pengikat kuat antar generasi dan memperkuat identitas masyarakat desa.

**Tantangan dan Harapan Masa Depan**

Dengan semangat pembangunan berkelanjutan, Desa Cenrana terus berupaya meningkatkan kualitas hidup warganya melalui program-program pemberdayaan ekonomi, pendidikan, dan kesehatan. Visi untuk menjadi desa mandiri, sejahtera, dan berbudaya menjadi panduan dalam setiap langkah pembangunan yang dilakukan.`,
        historyBanner: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
        visionTitle: "Visi",
        visionText: "Terwujudnya Desa Cenrana yang Mandiri, Sejahtera, dan Berbudaya dengan Tata Kelola Pemerintahan yang Baik.",
        missionTitle: "Misi",
        missionList: [
            "Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel.",
            "Meningkatkan pembangunan infrastruktur dasar desa yang merata.",
            "Mengembangkan potensi ekonomi lokal berbasis pertanian dan UMKM.",
        ],
    },
    transparansi: {
        title: "Transparansi Anggaran 2024",
        items: [
            { label: "Pendapatan Asli Desa", target: "150000000", realization: "125000000", percentage: "83" },
            { label: "Dana Desa", target: "1200000000", realization: "1200000000", percentage: "100" },
            { label: "Bagi Hasil Pajak & Retribusi", target: "45000000", realization: "40000000", percentage: "88" },
            { label: "Belanja Pegawai", target: "350000000", realization: "320000000", percentage: "91" },
            { label: "Pembangunan Infrastruktur", target: "800000000", realization: "750000000", percentage: "93" },
        ],
        budget: {
            pendapatan: { target: 1500000000, realisasi: 1250000000 },
            belanja: { target: 1500000000, realisasi: 1100000000 }
        }
    },
    officials: [
        { id: 1, name: "H. Abdullah", role: "Kepala Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 2, name: "Siti Aminah", role: "Sekretaris Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 3, name: "Budi Santoso", role: "Kaur Keuangan", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 4, name: "Rina Wati", role: "Kaur Umum", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 5, name: "Ahmad Rizki", role: "Kepala Dusun Benteng", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
    ],
    sotk_new: {
        kades: { name: "H. Abdullah", role: "Kepala Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Cpath fill='%239ca3af' d='M200 200a60 60 0 1 0 0-120 60 60 0 0 0 0 120zm0 20c-66 0-120 40-120 90v10h240v-10c0-50-54-90-120-90z'/%3E%3C/svg%3E" },
        sekdes: { name: "Siti Aminah", role: "Sekretaris Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Cpath fill='%239ca3af' d='M200 200a60 60 0 1 0 0-120 60 60 0 0 0 0 120zm0 20c-66 0-120 40-120 90v10h240v-10c0-50-54-90-120-90z'/%3E%3C/svg%3E" },
        kaur: [
            { name: "Budi Santoso", role: "Kaur Keuangan", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Rina Wati", role: "Kaur Umum", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Joko Susilo", role: "Kaur Perencanaan", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
        ],
        kadus: [
            { name: "Ahmad Rizki", role: "Kadus Benteng", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Dewi Sartika", role: "Kadus Cemara", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Bambang Pamungkas", role: "Kadus Melati", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
        ]
    },
    programs: [
        { id: 1, title: "Pembangunan Jalan Tani", status: "Berjalan", description: "Pembangunan jalan tani sepanjang 2km di Dusun Benteng untuk memudahkan akses petani.", icon: "Road" },
        { id: 2, title: "Pelatihan Digital UMKM", status: "Selesai", description: "Pelatihan pemasaran digital bagi pelaku UMKM desa untuk meningkatkan jangkauan pasar.", icon: "Laptop" },
        { id: 3, title: "Renovasi Posyandu", status: "Rencana", description: "Rencana renovasi dan penambahan fasilitas kesehatan untuk Posyandu Melati.", icon: "HeartPulse" },
    ],
    gallery: [
        { id: 1, title: "Panen Raya Padi", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400" },
        { id: 2, title: "Musyawarah Desa", image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=400" },
        { id: 3, title: "Gotong Royong", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400" },
        { id: 4, title: "Pemandangan Sawah", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400" },
        { id: 5, title: "Kegiatan PKK", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400" },
    ],
    peta: {
        batasUtara: "Desa Labuaja",
        batasSelatan: "Desa Limapoccoe",
        batasBarat: "Kecamatan Bantimurung",
        batasTimur: "Hutan Lindung",
        luasWilayah: "12.5",
        alamatKantor: "Jl. Poros Cenrana No. 123, Kec. Cenrana",
        koordinat: "-4.9666667, 119.7289895",
        jarakKabupaten: "35 km"
    },
    infografis: {
        gender: [
            { name: "Laki-laki", value: 1250, fill: "#3b82f6" },
            { name: "Perempuan", value: 1180, fill: "#ec4899" }
        ],
        education: [
            { name: "SD", value: 450, fill: "#f59e0b" },
            { name: "SMP", value: 380, fill: "#10b981" },
            { name: "SMA", value: 520, fill: "#3b82f6" },
            { name: "S1/D3", value: 210, fill: "#8b5cf6" }
        ],
        job: [
            { name: "Petani", value: 600, fill: "#10b981" },
            { name: "Pedagang", value: 150, fill: "#f59e0b" },
            { name: "PNS/TNI/Polri", value: 80, fill: "#3b82f6" },
            { name: "Wiraswasta", value: 200, fill: "#8b5cf6" },
            { name: "Lainnya", value: 120, fill: "#64748b" }
        ]
    },
    hukum: [
        { id: 1, jenis: "Perdes", nomor: "01", tahun: "2024", judul: "Anggaran Pendapatan dan Belanja Desa Tahun 2024", downloadUrl: "#" },
        { id: 2, jenis: "SK Kades", nomor: "05", tahun: "2024", judul: "Pembentukan Tim Pelaksana Kegiatan Pembangunan Desa", downloadUrl: "#" },
        { id: 3, jenis: "Perdes", nomor: "03", tahun: "2023", judul: "Rencana Pembangunan Jangka Menengah Desa (RPJMDes) 2023-2029", downloadUrl: "#" }
    ],
    agenda: [
        { id: 1, title: "Musyawarah Perencanaan Pembangunan (Musrenbang)", date: "2024-02-15", time: "09:00 WITA", location: "Aula Kantor Desa", description: "Pembahasan prioritas pembangunan desa tahun anggaran 2025." },
        { id: 2, title: "Posyandu Balita & Lansia", date: "2024-02-20", time: "08:00 WITA", location: "Posyandu Melati", description: "Pemeriksaan kesehatan rutin untuk balita dan lansia." },
        { id: 3, title: "Kerja Bakti Lingkungan", date: "2024-02-25", time: "07:00 WITA", location: "Dusun Benteng", description: "Membersihkan saluran irigasi dan jalan desa." }
    ]
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [lapak, setLapak] = useState<LapakItem[]>([]);
    const [aspirasi, setAspirasi] = useState<AspirasiItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { theme, setTheme } = useTheme();

    const [lastActivity, setLastActivity] = useState<number>(Date.now());
    const [isEditMode, setIsEditMode] = useState(false);
    const [cmsContent, setCmsContent] = useState<CMSContent>(defaultCMSContent);

    // Derived officials from CMS Content
    const officials = cmsContent.officials || [];

    // Load CMS Content from Supabase (Phase 3)
    useEffect(() => {
        const loadCMSFromSupabase = async () => {
            try {
                const { data, error } = await supabase
                    .from('cms_content')
                    .select('data')
                    .eq('id', 1)
                    .single();

                if (error) {
                    console.warn('⚠️ Supabase load failed:', error.message);
                    console.log('📦 Using default CMS content');
                    return;
                }

                // Validate data structure
                if (data?.data && typeof data.data === 'object' && Object.keys(data.data).length > 0) {
                    console.log('✅ CMS loaded from Supabase (global)');
                    setCmsContent(data.data as CMSContent);
                    // Backup to localStorage
                    try {
                        localStorage.setItem('cmsContent', JSON.stringify(data.data));
                    } catch (err) {
                        console.warn('Failed to backup to localStorage:', err);
                    }
                } else {
                    console.log('📝 Supabase data empty, using defaults');
                }
            } catch (err) {
                console.error('❌ Exception loading CMS:', err);
                console.log('📦 Falling back to default content');
            }
        };

        loadCMSFromSupabase();
    }, []);

    // Fetch Initial Data from Supabase
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // ⚡ OPTIMIZATION: Fetch with LIMIT to reduce data transfer
                // Fetch News (limit 50 latest)
                const { data: newsData } = await supabase
                    .from('berita')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);
                if (newsData) setNews(newsData);
                else setNews(newsItems); // Fallback

                // Fetch Lapak (limit 100 products)
                const { data: lapakData } = await supabase
                    .from('lapak')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);
                if (lapakData) {
                    // Map DB 'name' to 'title' if necessary
                    const mappedLapak = lapakData.map((item: any) => ({
                        ...item,
                        title: item.title || item.name || "Produk Tanpa Nama", // Fallback
                        status: item.status || "Active" // Ensure status exists
                    }));
                    setLapak(mappedLapak);
                }
                else setLapak(lapakItems.map(item => ({ ...item, status: "Active" as const })));

                // Fetch Aspirasi dengan semua data termasuk photo
                // Note: Mungkin agak lambat karena photo base64, tapi perlu untuk display
                try {
                    const { data: aspirasiData, error: aspirasiError } = await supabase
                        .from('aspirasi')
                        .select('ticket_code, name, nik, dusun, category, message, status, date, created_at, reply, is_anonymous, priority, rating, feedback_text, photo')
                        .order('created_at', { ascending: false })
                        .limit(50); // Reduce to 50 for better performance // ⚡ LIMIT 100 for faster loading!
                    if (aspirasiData && !aspirasiError) {
                        const mappedAspirasi = aspirasiData.map((item: any) => ({
                            id: item.ticket_code,
                            nama: item.name,
                            nik: item.nik || "",
                            dusun: item.dusun,
                            kategori: item.category,
                            laporan: item.message,
                            status: item.status,
                            date: item.date || (item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''),
                            reply: item.reply,
                            is_anonymous: item.is_anonymous || false,
                            image: item.photo || "", // ✅ Photo from database
                            priority: item.priority || "Medium",
                            rating: item.rating || undefined,
                            feedback_text: item.feedback_text || undefined
                        }));
                        ;
                        setAspirasi(mappedAspirasi);
                    } else {
                        console.log("No aspirasi data or error:", aspirasiError);
                        setAspirasi([]); // Set empty array on error
                    }
                } catch (aspirasiErr) {
                    console.error("Error fetching aspirasi:", aspirasiErr);
                    setAspirasi([]); // Set empty array to not block loading
                }

                // Fetch Programs
                const { data: programsData } = await supabase.from('programs').select('*').order('id', { ascending: false });

                // Fetch Gallery
                const { data: galleryData } = await supabase.from('gallery').select('*').order('id', { ascending: false });

                // Fetch CMS Content (Assuming a single row with id=1 or similar)
                // Wrapped in try-catch to handle if table doesn't exist
                try {
                    const { data: cmsData, error: cmsError } = await supabase.from('cms_content').select('data').single();

                    if (!cmsError && cmsData) {
                        setCmsContent(prev => ({
                            ...prev,
                            ...(cmsData?.data || {}),
                            programs: programsData || prev.programs,
                            gallery: galleryData || prev.gallery
                        }));
                    } else {
                        // If table doesn't exist or is empty, just use defaults with fetched programs/gallery
                        setCmsContent(prev => ({
                            ...prev,
                            programs: programsData || prev.programs,
                            gallery: galleryData || prev.gallery
                        }));
                    }
                } catch (cmsErr) {
                    console.log("CMS content table not found, using defaults");
                    setCmsContent(prev => ({
                        ...prev,
                        programs: programsData || prev.programs,
                        gallery: galleryData || prev.gallery
                    }));
                }

            } catch (error) {
                console.error("Error fetching data from Supabase:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    // Session timeout checker
    useEffect(() => {
        if (!isLoggedIn) return;
        const checkSession = () => {
            if (Date.now() - lastActivity > SESSION_TIMEOUT) {
                logout();
                alert("Sesi Anda telah berakhir. Silakan login kembali.");
            }
        };
        const interval = setInterval(checkSession, 60000);
        return () => clearInterval(interval);
    }, [isLoggedIn, lastActivity]);

    // Update last activity
    useEffect(() => {
        const updateActivity = () => setLastActivity(Date.now());
        window.addEventListener("click", updateActivity);
        window.addEventListener("keypress", updateActivity);
        return () => {
            window.removeEventListener("click", updateActivity);
            window.removeEventListener("keypress", updateActivity);
        };
    }, []);

    // Auth Persistence (Optional: Supabase Auth is better, but keeping simple for now)
    useEffect(() => {
        const storedAuth = localStorage.getItem("isAdmin");
        if (storedAuth === "true") setIsLoggedIn(true);
    }, []);

    useEffect(() => {
        if (isLoggedIn) localStorage.setItem("isAdmin", "true");
        else localStorage.removeItem("isAdmin");
    }, [isLoggedIn]);

    const login = () => {
        setIsLoggedIn(true);
        setLastActivity(Date.now());
    };

    const logout = () => {
        setIsLoggedIn(false);
        setIsEditMode(false);
        setLastActivity(0);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    const toggleEditMode = () => {
        setIsEditMode(prev => !prev);
        setLastActivity(Date.now());
    };

    // CMS Update (Phase 4: with Supabase sync)
    const updateContent = async (section: keyof CMSContent, field: string, value: any) => {
        setCmsContent(prev => {
            const updated = {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            };

            // Save to localStorage (optional, may fail if quota exceeded)
            try {
                localStorage.setItem('cmsContent', JSON.stringify(updated));
                console.log('💾 Saved to localStorage');
            } catch (err) {
                if (err instanceof DOMException && err.name === 'QuotaExceededError') {
                    console.warn('⚠️ localStorage quota exceeded, skipping local backup');
                    console.log('✅ Will save to Supabase only (no limit)');
                } else {
                    console.error('Failed to save to localStorage:', err);
                }
            }

            // Sync to Supabase in background (non-blocking)
            supabase
                .from('cms_content')
                .upsert({
                    id: 1,
                    data: updated,
                    updated_at: new Date().toISOString()
                })
                .then(({ error }) => {
                    if (error) {
                        console.warn('⚠️ Supabase sync failed:', error.message);
                        console.log('📦 Changes saved locally only');
                    } else {
                        console.log('✅ Synced to Supabase (global)');
                    }
                });

            return updated;
        });
        setLastActivity(Date.now());
    };

    // News Management
    const addNews = async (item: Omit<NewsItem, "id">) => {
        const newItem = { ...item, id: Date.now() }; // Temporary ID, Supabase should generate real one if Serial
        // Optimistic
        setNews(prev => [newItem, ...prev]);

        const { data, error } = await supabase.from('berita').insert([item]).select();
        if (error) {
            console.error("Error adding news:", error);
            // Rollback or handle error
        } else if (data) {
            // Update ID with real one from DB
            setNews(prev => prev.map(n => n.id === newItem.id ? data[0] : n));
        }
        setLastActivity(Date.now());
    };

    const deleteNews = async (id: number) => {
        setNews(prev => prev.filter(item => item.id !== id));
        await supabase.from('berita').delete().eq('id', id);
        setLastActivity(Date.now());
    };

    const updateNews = async (id: number, updates: Partial<NewsItem>) => {
        setNews(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        await supabase.from('berita').update(updates).eq('id', id);
        setLastActivity(Date.now());
    };

    // Aspirasi Management
    const checkNikAvailability = async (nik: string): Promise<boolean> => {
        try {
            // Step 1: Verify NIK exists in penduduk table
            const { data: pendudukData, error: pendudukError } = await supabase
                .from('penduduk')
                .select('nik')
                .eq('nik', nik)
                .single();

            if (pendudukError || !pendudukData) {
                console.error("NIK not found in penduduk table:", pendudukError);
                return false;
            }

            // Step 2: Import hash function dynamically
            const { hashNIK } = await import('@/lib/crypto');

            // Hash NIK for privacy-preserving validation
            const nikHash = await hashNIK(nik);

            // Step 3: UPSERT to nik_validation table
            // CRITICAL: Explicitly set created_at to ensure FRESH timestamp for reverse lookup!
            const { error: upsertError } = await supabase
                .from('nik_validation')
                .upsert(
                    {
                        nik_hash: nikHash,
                        created_at: new Date().toISOString() // EXPLICIT timestamp - critical for time proximity!
                    },
                    {
                        onConflict: 'nik_hash' // Update existing record if hash already exists
                    }
                );

            if (upsertError) {
                console.error("Error upserting NIK hash:", upsertError);
                return false;
            }

            // Return true (NIK is valid and hash saved)
            return true;
        } catch (error) {
            console.error("Exception checking NIK:", error);
            return false;
        }
    };

    const addAspirasi = async (item: Omit<AspirasiItem, "id" | "status" | "date">) => {
        // Step 1: Validate NIK is provided
        if (!item.nik) {
            throw new Error("NIK harus diisi untuk validasi");
        }

        // Step 2: Validate NIK against penduduk table
        const nikExists = await checkNikAvailability(item.nik);
        if (!nikExists) {
            throw new Error("Validasi Gagal: NIK tidak ditemukan di data penduduk.");
        }

        // Step 2: Fetch real count from DB to avoid collisions
        const { count } = await supabase.from('aspirasi').select('*', { count: 'exact', head: true });
        const nextId = (count || 0) + 1;
        const ticketId = `ASP-${String(nextId).padStart(3, '0')}`;

        const newItem: AspirasiItem = {
            ...item,
            id: ticketId,
            status: "Pending",
            date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        };

        // Optimistic update
        setAspirasi(prev => [newItem, ...prev]);

        // Step 3: Map to DB columns - Include ALL required fields
        const dbPayload = {
            ticket_code: ticketId,
            name: item.nama,
            nik: item.nik, // ✅ FIXED: Include NIK (validated above)
            dusun: item.dusun,
            category: item.kategori,
            message: item.laporan,
            status: 'Pending',
            date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }), // ✅ FIXED: Include formatted date
            is_anonymous: item.is_anonymous || false,
            priority: item.priority || 'Medium',
            photo: item.image || null,
            reply: null
        };

        const { error } = await supabase.from('aspirasi').insert([dbPayload]);
        if (error) {
            console.error("Error adding aspirasi:", error.message, error.details, error.hint);
            // Revert optimistic update on error
            setAspirasi(prev => prev.filter(p => p.id !== ticketId));
            throw new Error(`Gagal mengirim aspirasi: ${error.message}`);
        }
        return ticketId;
    };

    const verifyAspirasi = async (id: string, status: "Diproses" | "Rejected") => {
        setAspirasi(prev => prev.map(item => item.id === id ? { ...item, status } : item));
        await supabase.from('aspirasi').update({ status }).eq('ticket_code', id);
        setLastActivity(Date.now());
    };

    const replyAspirasi = async (id: string, reply: string) => {
        // Auto-set status to 'Selesai' when admin provides a reply
        setAspirasi(prev => prev.map(item => item.id === id ? { ...item, reply, status: "Selesai" } : item));
        await supabase.from('aspirasi').update({ reply, status: "Selesai" }).eq('ticket_code', id);
        setLastActivity(Date.now());
    };

    const getAspirasiByTicket = (ticketId: string) => {
        return aspirasi.find(item => item.id === ticketId);
    };

    const deleteAspirasi = async (id: string) => {
        setAspirasi(prev => prev.filter(item => item.id !== id));
        await supabase.from('aspirasi').delete().eq('ticket_code', id);
        setLastActivity(Date.now());
    };

    const submitRating = async (ticketId: string, rating: number, feedback?: string) => {
        setAspirasi(prev => prev.map(item =>
            item.id === ticketId ? { ...item, rating, feedback_text: feedback } : item
        ));
        await supabase.from('aspirasi').update({
            rating,
            feedback_text: feedback || null
        }).eq('ticket_code', ticketId);
        setLastActivity(Date.now());
    };

    // Lapak Management
    const submitLapak = async (item: Omit<LapakItem, "id" | "status">) => {
        const newItem = { ...item, id: Date.now(), status: "Pending" as const };
        setLapak(prev => [newItem, ...prev]);

        // Map to DB columns: { name, price, category, description, phone, image, seller_name, status }
        const dbPayload = {
            name: item.title,
            price: item.price,
            category: item.category,
            description: item.description || "",
            phone: item.phone,
            image: item.image,
            seller_name: item.seller,
            status: "Pending"
        };

        const { data } = await supabase.from('lapak').insert([dbPayload]).select();
        if (data) {
            // Update with real ID if needed, but for now just keeping local sync
            // setLapak(prev => prev.map(n => n.id === newItem.id ? { ...n, id: data[0].id } : n));
        }
    };

    const approveLapak = async (id: number) => {
        setLapak(prev => prev.map(item => item.id === id ? { ...item, status: "Active" } : item));
        await supabase.from('lapak').update({ status: "Active" }).eq('id', id);
        setLastActivity(Date.now());
    };

    const rejectLapak = async (id: number) => {
        setLapak(prev => prev.map(item => item.id === id ? { ...item, status: "Rejected" } : item));
        await supabase.from('lapak').update({ status: "Rejected" }).eq('id', id);
        setLastActivity(Date.now());
    };

    const deleteLapak = async (id: number) => {
        setLapak(prev => prev.filter(item => item.id !== id));
        await supabase.from('lapak').delete().eq('id', id);
        setLastActivity(Date.now());
    };

    // Analytics Tracking Functions
    const trackProductView = async (productId: number) => {
        try {
            // Increment view count atomically
            const { error } = await supabase.rpc('increment_view_count', { product_id: productId });

            // Fallback if RPC doesn't exist - just log the error
            if (error) {
                console.warn('View count increment failed:', error);
                // Silently fail - view counts are not critical
            }

            // Update local state (optional, for real-time UI update)
            setLapak(prev => prev.map(item =>
                item.id === productId
                    ? { ...item, view_count: (item.view_count || 0) + 1, last_viewed_at: new Date().toISOString() }
                    : item
            ));
        } catch (error) {
            console.error('Track view error:', error);
            // Fail silently - don't block UI
        }
    };

    const trackWAClick = async (productId: number) => {
        try {
            // Increment WA click count atomically  
            const { error } = await supabase.rpc('increment_wa_click_count', { product_id: productId });

            // Fallback if RPC doesn't exist - just log
            if (error) {
                console.warn('WA click count increment failed:', error);
                // Silently fail - click counts are not critical
            }

            // Update local state
            setLapak(prev => prev.map(item =>
                item.id === productId
                    ? { ...item, wa_click_count: (item.wa_click_count || 0) + 1 }
                    : item
            ));
        } catch (error) {
            console.error('Track WA click error:', error);
            // Fail silently
        }
    };

    // Gallery Management
    const addGalleryItem = async (item: Omit<GalleryItem, "id">) => {
        const newItem = { ...item, id: Date.now() };

        // Optimistic Update
        setCmsContent(prev => ({ ...prev, gallery: [newItem, ...prev.gallery] }));

        // Insert into 'gallery' table
        await supabase.from('gallery').insert([{ title: item.title, image: item.image }]);
        setLastActivity(Date.now());
    };

    // Program Management
    const addProgram = async () => {
        const newProgram: Program = {
            id: Date.now(),
            title: "Program Baru",
            description: "Deskripsi program...",
            status: "Rencana",
            icon: "Lightbulb"
        };

        // Optimistic Update
        setCmsContent(prev => ({ ...prev, programs: [newProgram, ...prev.programs] }));

        // Insert into 'programs' table
        // DB columns: { title, description, status, icon }
        const dbPayload = {
            title: newProgram.title,
            description: newProgram.description,
            status: newProgram.status,
            icon: newProgram.icon
        };
        await supabase.from('programs').insert([dbPayload]);
        setLastActivity(Date.now());
    };

    const deleteProgram = async (id: number) => {
        setCmsContent(prev => ({ ...prev, programs: prev.programs.filter(p => p.id !== id) }));
        await supabase.from('programs').delete().eq('id', id);
        setLastActivity(Date.now());
    };

    const updateProgram = async (id: number, updates: Partial<Program>) => {
        setCmsContent(prev => ({ ...prev, programs: prev.programs.map(p => p.id === id ? { ...p, ...updates } : p) }));
        await supabase.from('programs').update(updates).eq('id', id);
        setLastActivity(Date.now());
    };

    // Hukum Management
    const addHukum = async () => {
        const newItem: HukumItem = {
            id: Date.now(),
            jenis: "Perdes",
            nomor: "XX",
            tahun: new Date().getFullYear().toString(),
            judul: "Judul Produk Hukum Baru",
            downloadUrl: "#"
        };
        setCmsContent(prev => {
            const updated = { ...prev, hukum: [newItem, ...prev.hukum] };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    const deleteHukum = async (id: number) => {
        setCmsContent(prev => {
            const updated = { ...prev, hukum: prev.hukum.filter(i => i.id !== id) };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    const updateHukum = async (id: number, updates: Partial<HukumItem>) => {
        setCmsContent(prev => {
            const updated = { ...prev, hukum: prev.hukum.map(i => i.id === id ? { ...i, ...updates } : i) };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    // Agenda Management
    const addAgenda = async () => {
        const newItem: AgendaItem = {
            id: Date.now(),
            title: "Agenda Baru",
            date: new Date().toISOString().split('T')[0],
            time: "09:00",
            location: "Lokasi...",
            description: "Deskripsi kegiatan..."
        };
        setCmsContent(prev => {
            const updated = { ...prev, agenda: [newItem, ...prev.agenda] };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    const deleteAgenda = async (id: number) => {
        setCmsContent(prev => {
            const updated = { ...prev, agenda: prev.agenda.filter(i => i.id !== id) };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    const updateAgenda = async (id: number, updates: Partial<AgendaItem>) => {
        setCmsContent(prev => {
            const updated = { ...prev, agenda: prev.agenda.map(i => i.id === id ? { ...i, ...updates } : i) };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    return (
        <AppContext.Provider value={{
            news, lapak, aspirasi, officials,
            cmsContent, isEditMode, isLoading, toggleEditMode, updateContent,
            isLoggedIn, theme,
            login, logout, toggleTheme,
            addNews, deleteNews, updateNews,
            checkNikAvailability, addAspirasi, verifyAspirasi, replyAspirasi, getAspirasiByTicket, deleteAspirasi, submitRating,
            submitLapak, approveLapak, rejectLapak, deleteLapak,
            addGalleryItem,
            addProgram, deleteProgram, updateProgram,
            addHukum, deleteHukum, updateHukum,
            addAgenda, deleteAgenda, updateAgenda,
            trackProductView, trackWAClick
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within a AppProvider");
    }
    return context;
};


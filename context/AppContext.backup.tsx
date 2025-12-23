"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";

// Define types (Keep existing interfaces)
export interface NewsItem {
    id: number;
    title: string;
    date: string;
    excerpt: string;
    image: string;
    category?: string;
    content?: string;
    author?: string;
    tags?: string;
    status?: 'published' | 'draft';
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
    image: string;
    priority?: "Low" | "Medium" | "High" | "Emergency";
    rating?: number; // 1-5 stars
    feedback_text?: string;
    hasPhoto?: boolean; // ✅ Flag untuk conditional button
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

export interface WASubscriber {
    id: number;
    name: string;
    whatsapp: string;
    subscribed_at: string;
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
    sambutan: {
        fotoKades: string;
        namaKades: string;
        isiSambutan: string;
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
    pengumuman: { id: number; text: string; active: boolean }[];
}

// Kepala Desa Presence Status Type
export type KepalaDesaStatus = 'di_kantor' | 'rapat' | 'tidak_hadir';


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
    fetchPhotoById: (ticketCode: string) => Promise<string>;
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
    // Pengumuman CRUD
    addPengumuman: (text: string) => Promise<void>;
    deletePengumuman: (id: number) => Promise<void>;
    updatePengumuman: (id: number, text: string, active: boolean) => Promise<void>;
    // Analytics tracking functions
    trackProductView: (productId: number) => Promise<void>;
    trackWAClick: (productId: number) => Promise<void>;
    // Kepala Desa Status
    kepalaDesaStatus: KepalaDesaStatus;
    setKepalaDesaStatus: (status: KepalaDesaStatus) => Promise<void>;
    // WhatsApp Subscriber
    subscribeWhatsApp: (name: string, whatsapp: string) => Promise<void>;
    waSubscribers: WASubscriber[];
    deleteWASubscriber: (id: number) => Promise<void>;
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
    sambutan: {
        fotoKades: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='260'%3E%3Crect fill='%23e5e7eb' width='200' height='260'/%3E%3Cpath fill='%239ca3af' d='M100 110a35 35 0 1 0 0-70 35 35 0 0 0 0 70zm0 12c-40 0-72 24-72 54v6h144v-6c0-30-32-54-72-54z'/%3E%3C/svg%3E",
        namaKades: "H. Abdullah",
        isiSambutan: "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nPuji syukur kita panjatkan kepada Allah SWT atas segala limpahan rahmat dan karunia-Nya. Selamat datang di Website Resmi Desa Cenrana.\n\nSebagai Kepala Desa, saya mengajak seluruh warga untuk bersama-sama membangun desa yang lebih maju, mandiri, dan sejahtera. Website ini hadir sebagai wujud komitmen kami dalam memberikan pelayanan publik yang transparan dan mudah diakses.\n\nMari kita jaga kebersamaan dan gotong royong sebagai modal utama pembangunan desa. Semoga Allah SWT senantiasa memberikan keberkahan dalam setiap langkah kita.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh."
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
    ],
    pengumuman: [
        { id: 1, text: "📢 Pendaftaran BLT Desa tahun 2025 dibuka mulai 15 Januari", active: true },
        { id: 2, text: "🏥 Jadwal Posyandu bulan ini: Setiap Kamis minggu pertama", active: true },
        { id: 3, text: "🎉 Peringatan HUT RI ke-80 akan diadakan di Lapangan Desa", active: true },
        { id: 4, text: "📝 Pengurusan surat-menyurat buka Senin-Jumat 08:00-15:00", active: true }
    ],
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [lapak, setLapak] = useState<LapakItem[]>([]);
    const [aspirasi, setAspirasi] = useState<AspirasiItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize from localStorage for instant hydration (no flash)
    const [kepalaDesaStatus, setKepalaDesaStatusState] = useState<KepalaDesaStatus>(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('kepalaDesaStatus');
            if (cached && ['di_kantor', 'dinas_luar', 'cuti', 'sakit'].includes(cached)) {
                return cached as KepalaDesaStatus;
            }
        }
        return 'di_kantor';
    });
    const [waSubscribers, setWaSubscribers] = useState<WASubscriber[]>([]);

    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Force Body Background Injection (Nuclear Option for persistent white background)
    useEffect(() => {
        if (!mounted) return;

        const isDark = resolvedTheme === "dark";
        // Apply to Document Element (html) and Body
        const targetColor = isDark ? "#0A0F1A" : "#FFFFFF"; // Dark Base vs White

        document.documentElement.style.backgroundColor = targetColor;
        document.body.style.backgroundColor = targetColor;
        document.documentElement.style.colorScheme = isDark ? "dark" : "light";

        // CRITICAL: Add/remove 'dark' class to <html> for Tailwind dark: variants
        if (isDark) {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
        } else {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        }
    }, [mounted, resolvedTheme]);

    // ... (keep existing code)

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

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

                    // Merge with default content to ensure new fields (like sotk_new) exist if missing in DB
                    const mergedContent = { ...defaultCMSContent, ...data.data };

                    // Ensure sotk_new explicitly exists (safety check)
                    if (!mergedContent.sotk_new) {
                        mergedContent.sotk_new = defaultCMSContent.sotk_new;
                    }

                    setCmsContent(mergedContent as CMSContent);

                    // Backup to localStorage
                    try {
                        localStorage.setItem('cmsContent', JSON.stringify(mergedContent));
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
            console.log("🚀 Starting data fetch from Supabase...");

            try {
                // ⚡ Fetch News (limit 50 latest)
                const { data: newsData, error: newsError } = await supabase
                    .from('berita')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50);

                console.log("📰 Berita fetch result:", { count: newsData?.length, error: newsError?.message });
                if (newsData && !newsError) {
                    setNews(newsData);
                } else {
                    console.error("❌ Berita fetch error:", newsError);
                }

                // Fetch Lapak (limit 100 products)
                const { data: lapakData, error: lapakError } = await supabase
                    .from('lapak')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100);

                console.log("🏪 Lapak fetch result:", { count: lapakData?.length, error: lapakError?.message });
                if (lapakData && !lapakError) {
                    // Map DB 'name' to 'title' if necessary
                    const mappedLapak = lapakData.map((item: any) => ({
                        ...item,
                        title: item.title || item.name || "Produk Tanpa Nama",
                        status: item.status || "Active"
                    }));
                    setLapak(mappedLapak);
                } else {
                    console.error("❌ Lapak fetch error:", lapakError);
                }

                // ⚡ OPTIMIZED: Fetch aspirasi WITHOUT photo untuk fast initial load
                // Photo akan di-load on-demand saat admin buka detail (lazy load)
                // Tapi kita fetch metadata (has_photo) untuk conditional button
                // Ini mencegah timeout dan membuat list loading < 2 detik
                try {
                    const { data: aspirasiData, error: aspirasiError } = await supabase
                        .from('aspirasi')
                        .select('ticket_code, nama, dusun, kategori, laporan, status, created_at, reply, is_anonymous, image, priority, rating, feedback_text')
                        .order('created_at', { ascending: false })
                        .limit(50);
                    if (aspirasiData && !aspirasiError) {
                        const mappedAspirasi = aspirasiData.map((item: any) => ({
                            id: item.ticket_code,
                            nama: item.nama,
                            dusun: item.dusun,
                            kategori: item.kategori,
                            laporan: item.laporan,
                            status: item.status,
                            date: item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
                            reply: item.reply,
                            is_anonymous: item.is_anonymous || false,
                            image: item.image || "",
                            hasPhoto: !!item.image,
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
        const newItem = { ...item, id: Date.now() }; // Temporary ID
        // Optimistic update
        setNews(prev => [newItem, ...prev]);

        // Only insert columns that exist in the database
        const dbPayload = {
            title: item.title,
            excerpt: item.excerpt,
            content: item.content || '',
            image: item.image,
            category: item.category,
            date: item.date,
            status: item.status || 'published'
        };

        const { data, error } = await supabase.from('berita').insert([dbPayload]).select();
        if (error) {
            console.error("Error adding news:", error);
            // Rollback optimistic update
            setNews(prev => prev.filter(n => n.id !== newItem.id));
            alert(`Gagal menambahkan berita: ${error.message}`);
        } else if (data) {
            // Update ID with real one from DB
            setNews(prev => prev.map(n => n.id === newItem.id ? { ...newItem, ...data[0] } : n));
        }
        setLastActivity(Date.now());
    };

    const deleteNews = async (id: number) => {
        console.log(`🗑️ Deleting news ID: ${id}`);

        // Delete from database first
        const { error } = await supabase.from('berita').delete().eq('id', id);

        if (error) {
            console.error("❌ Error deleting news:", error);
            alert(`Gagal menghapus berita: ${error.message}`);
        } else {
            console.log("✅ News deleted successfully");
        }

        // Always refetch to ensure sync with database
        const { data } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
        if (data) {
            setNews(data);
        }
        setLastActivity(Date.now());
    };

    const updateNews = async (id: number, updates: Partial<NewsItem>) => {
        console.log(`📝 Updating news ID: ${id}`, updates);

        // Update in database first
        const { error } = await supabase.from('berita').update(updates).eq('id', id);

        if (error) {
            console.error("❌ Error updating news:", error);
            alert(`Gagal mengupdate berita: ${error.message}`);
        } else {
            console.log("✅ News updated successfully");
        }

        // Always refetch to ensure sync with database
        const { data } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
        if (data) {
            setNews(data);
        }
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

        // Step 3: Generate sequential ticket number
        // Get the latest ticket code from database
        const { data: lastTicket } = await supabase
            .from('aspirasi')
            .select('ticket_code')
            .order('id', { ascending: false })
            .limit(1)
            .single();

        // Parse last number and increment, start from 1 if no tickets
        const lastNumber = lastTicket?.ticket_code ? parseInt(lastTicket.ticket_code) : 0;
        const ticketCode = String(lastNumber + 1).padStart(3, '0'); // Format: 001, 002, 003...

        // Step 4: Prepare database payload
        const dbPayload = {
            ticket_code: ticketCode,
            nama: item.nama,
            dusun: item.dusun,
            kategori: item.kategori,
            laporan: item.laporan,
            status: 'Pending',
            is_anonymous: item.is_anonymous || false,
            priority: item.priority || 'Medium',
            image: item.image || null,
            reply: null
        };

        // Step 5: Insert to database
        const { error } = await supabase
            .from('aspirasi')
            .insert([dbPayload]);

        if (error) {
            console.error("Error adding aspirasi:", error?.message, error?.details, error?.hint);
            throw new Error(`Gagal mengirim aspirasi: ${error?.message || 'Unknown error'}`);
        }

        // Step 6: Create local item for optimistic update
        const newItem: AspirasiItem = {
            ...item,
            id: ticketCode,
            status: "Pending",
            date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        };

        // Optimistic update
        setAspirasi(prev => [newItem, ...prev]);

        return ticketCode;
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
        try {
            console.log('Deleting aspirasi:', id);
            // 1. Delete from Supabase
            const { error } = await supabase.from('aspirasi').delete().eq('ticket_code', id);

            if (error) {
                console.error('Delete error:', error);
                alert('Gagal menghapus aspirasi: ' + error.message);
                return;
            }

            // 2. Update local state
            setAspirasi(prev => prev.filter(item => item.id !== id));
            setLastActivity(Date.now());
            console.log('Delete successful');
        } catch (err) {
            console.error('Exception deleting aspirasi:', err);
            alert('Gagal menghapus aspirasi');
        }
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

    // 🔥 LAZY LOAD: Fetch photo on-demand untuk specific aspirasi
    // Dipanggil saat admin buka detail modal
    const fetchPhotoById = async (ticketCode: string): Promise<string> => {
        try {
            const { data, error } = await supabase
                .from('aspirasi')
                .select('image')
                .eq('ticket_code', ticketCode)
                .single();

            if (error || !data) {
                console.error('Error fetching photo:', error);
                return '';
            }

            return data.image || '';
        } catch (err) {
            console.error('Exception fetching photo:', err);
            return '';
        }
    };

    // Lapak Management
    const submitLapak = async (item: Omit<LapakItem, "id" | "status">) => {
        // Map to DB columns: { title, price, category, description, phone, image, seller, status }
        // Note: DB likely uses 'title' not 'name', and 'seller' not 'seller_name'
        const dbPayload = {
            title: item.title,
            price: item.price,
            category: item.category,
            description: item.description || "",
            phone: item.phone,
            image: item.image,
            seller: item.seller, // Changed from seller_name
            status: "Pending"
        };

        try {
            const { data, error } = await supabase.from('lapak').insert([dbPayload]).select();

            if (error) {
                console.error('Error inserting lapak:', error);
                throw error;
            }

            if (data && data[0]) {
                // Create local item with database ID
                const newItem: LapakItem = {
                    id: data[0].id,
                    title: item.title,
                    price: item.price,
                    category: item.category,
                    description: item.description || "",
                    phone: item.phone,
                    image: item.image,
                    seller: item.seller,
                    status: "Pending",
                    view_count: 0,
                    wa_click_count: 0
                };
                setLapak(prev => [newItem, ...prev]);
                console.log('✅ Lapak submitted successfully:', newItem);
            }

            setLastActivity(Date.now());
        } catch (err) {
            console.error('Failed to submit lapak:', err);
            throw err;
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

    // Pengumuman Management
    const addPengumuman = async (text: string) => {
        const newItem = {
            id: Date.now(),
            text: text,
            active: true
        };
        setCmsContent(prev => {
            const updated = { ...prev, pengumuman: [newItem, ...prev.pengumuman] };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    const deletePengumuman = async (id: number) => {
        setCmsContent(prev => {
            const updated = { ...prev, pengumuman: prev.pengumuman.filter(i => i.id !== id) };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    const updatePengumuman = async (id: number, text: string, active: boolean) => {
        setCmsContent(prev => {
            const updated = { ...prev, pengumuman: prev.pengumuman.map(i => i.id === id ? { ...i, text, active } : i) };
            supabase.from('cms_content').upsert({ id: 1, data: updated });
            return updated;
        });
        setLastActivity(Date.now());
    };

    // Set Kepala Desa Status (with Supabase + localStorage persistence)
    const setKepalaDesaStatus = async (status: KepalaDesaStatus) => {
        setKepalaDesaStatusState(status);

        // Save to localStorage for instant hydration (no flash on refresh)
        if (typeof window !== 'undefined') {
            localStorage.setItem('kepalaDesaStatus', status);
        }

        // Persist to Supabase site_settings table
        try {
            await supabase.from('site_settings').upsert({
                id: 1,
                kepala_desa_status: status,
                updated_at: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error saving kepala desa status:', error);
        }
        setLastActivity(Date.now());
    };

    // WhatsApp Subscriber Functions
    const subscribeWhatsApp = async (name: string, whatsapp: string) => {
        // Check for duplicate
        const { data: existing } = await supabase
            .from('wa_subscribers')
            .select('id')
            .eq('whatsapp', whatsapp)
            .single();

        if (existing) {
            throw new Error('Nomor sudah terdaftar');
        }

        const { data, error } = await supabase
            .from('wa_subscribers')
            .insert({ name, whatsapp })
            .select()
            .single();

        if (error) throw error;

        if (data) {
            setWaSubscribers(prev => [data, ...prev]);
        }
    };

    const deleteWASubscriber = async (id: number) => {
        await supabase.from('wa_subscribers').delete().eq('id', id);
        setWaSubscribers(prev => prev.filter(s => s.id !== id));
    };

    // Fetch WA subscribers on mount
    useEffect(() => {
        const fetchWASubscribers = async () => {
            const { data } = await supabase
                .from('wa_subscribers')
                .select('*')
                .order('subscribed_at', { ascending: false });
            if (data) setWaSubscribers(data);
        };
        fetchWASubscribers();
    }, []);

    // Fetch Kepala Desa Status on mount
    useEffect(() => {
        const fetchKepalaDesaStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('kepala_desa_status')
                    .eq('id', 1)
                    .single();

                if (data?.kepala_desa_status) {
                    setKepalaDesaStatusState(data.kepala_desa_status as KepalaDesaStatus);
                    console.log('Status loaded:', data.kepala_desa_status);
                }
                if (error) console.log('Settings fetch error:', error);
            } catch (error) {
                console.log('No settings found, using default status');
            }
        };
        fetchKepalaDesaStatus();
    }, []);

    // Determine theme for wrapper (fallback to dark)
    const currentTheme = mounted ? resolvedTheme : 'dark';
    const isDark = currentTheme === 'dark';

    return (
        <AppContext.Provider value={{
            news, lapak, aspirasi, officials,
            cmsContent, isEditMode, isLoading, toggleEditMode, updateContent,
            isLoggedIn, theme,
            login, logout, toggleTheme,
            addNews, deleteNews, updateNews,
            checkNikAvailability, addAspirasi, verifyAspirasi, replyAspirasi, getAspirasiByTicket, deleteAspirasi, submitRating, fetchPhotoById,
            submitLapak, approveLapak, rejectLapak, deleteLapak,
            addGalleryItem,
            addProgram, deleteProgram, updateProgram,
            addHukum, deleteHukum, updateHukum,
            addAgenda, deleteAgenda, updateAgenda,
            addPengumuman, deletePengumuman, updatePengumuman,
            trackProductView, trackWAClick,
            kepalaDesaStatus, setKepalaDesaStatus,
            subscribeWhatsApp, waSubscribers, deleteWASubscriber
        }}>
            <div
                id="theme-root"
                className={`flex flex-col min-h-screen transition-colors duration-300 ${isDark ? "dark bg-[#0A0F1A] text-slate-100" : "bg-white text-slate-900"
                    }`}
            >
                {children}
            </div>
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


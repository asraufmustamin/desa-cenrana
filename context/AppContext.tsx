"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { newsItems, lapakItems } from "@/data/mockData";

// Define types
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
}

export interface AspirasiItem {
    id: string;
    nama: string;
    nik: string;
    dusun: string;
    kategori: string;
    laporan: string;
    status: "Pending" | "Verified" | "Rejected";
    date: string;
    reply?: string;
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
    officials: Official[]; // Keep for backward compatibility / homepage
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

    // CMS State
    cmsContent: CMSContent;
    isEditMode: boolean;
    toggleEditMode: () => void;
    updateContent: (section: keyof CMSContent, field: string, value: any) => void;

    isLoggedIn: boolean;
    theme: string | undefined; // Updated to match next-themes
    login: () => void;
    logout: () => void;
    toggleTheme: () => void;

    // News Management
    addNews: (item: Omit<NewsItem, "id">) => void;
    deleteNews: (id: number) => void;
    updateNews: (id: number, item: Partial<NewsItem>) => void;

    // Aspirasi Management
    addAspirasi: (item: Omit<AspirasiItem, "id" | "status" | "date">) => string;
    verifyAspirasi: (id: string, status: "Verified" | "Rejected") => void;
    replyAspirasi: (id: string, reply: string) => void;
    getAspirasiByTicket: (ticketId: string) => AspirasiItem | undefined;
    deleteAspirasi: (id: string) => void;

    // Lapak Management
    submitLapak: (item: Omit<LapakItem, "id" | "status">) => void;
    approveLapak: (id: number) => void;
    rejectLapak: (id: number) => void;
    deleteLapak: (id: number) => void;

    // Gallery Management
    addGalleryItem: (item: Omit<GalleryItem, "id">) => void;

    // Program Management
    addProgram: () => void;
    deleteProgram: (id: number) => void;
    updateProgram: (id: number, updates: Partial<Program>) => void;

    // Hukum Management
    addHukum: () => void;
    deleteHukum: (id: number) => void;
    updateHukum: (id: number, updates: Partial<HukumItem>) => void;

    // Agenda Management
    addAgenda: () => void;
    deleteAgenda: (id: number) => void;
    updateAgenda: (id: number, updates: Partial<AgendaItem>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [lapak, setLapak] = useState<LapakItem[]>([]);
    const [aspirasi, setAspirasi] = useState<AspirasiItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Theme management via next-themes
    const { theme, setTheme } = useTheme();

    const [isInitialized, setIsInitialized] = useState(false);
    const [lastActivity, setLastActivity] = useState<number>(Date.now());

    // CMS State
    const [isEditMode, setIsEditMode] = useState(false);
    const [cmsContent, setCmsContent] = useState<CMSContent>({
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
            address: "Jl. Poros Cenrana No. 123, Kec. Cenrana, Kab. Maros, Sulawesi Selatan",
            phone: "+62 812-3456-7890",
            email: "admin@desacenrana.id",
            copyright: "© 2024 Pemerintah Desa Cenrana. All rights reserved.",
        },
        navbar: {
            brandName: "Desa Cenrana",
        },
        profil: {
            historyTitle: "Sejarah Desa Cenrana",
            historyText: "Desa Cenrana memiliki sejarah panjang yang berakar dari nilai-nilai gotong royong dan kearifan lokal. Didirikan pada tahun 1950-an, desa ini awalnya merupakan pemukiman kecil para petani yang kemudian berkembang menjadi pusat kegiatan ekonomi dan sosial di wilayah ini.",
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
            { id: 1, name: "H. Abdullah", role: "Kepala Desa", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" },
            { id: 2, name: "Siti Aminah", role: "Sekretaris Desa", image: "https://images.unsplash.com/photo-1573496359-7013ac2bebb5?auto=format&fit=crop&q=80&w=200" },
            { id: 3, name: "Budi Santoso", role: "Kaur Keuangan", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
            { id: 4, name: "Rina Wati", role: "Kaur Umum", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
            { id: 5, name: "Ahmad Rizki", role: "Kepala Dusun Benteng", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
        ],
        sotk_new: {
            kades: { name: "H. Abdullah", role: "Kepala Desa", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
            sekdes: { name: "Siti Aminah", role: "Sekretaris Desa", image: "https://images.unsplash.com/photo-1573496359-7013ac2bebb5?auto=format&fit=crop&q=80&w=400" },
            kaur: [
                { name: "Budi Santoso", role: "Kaur Keuangan", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300" },
                { name: "Rina Wati", role: "Kaur Umum", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300" },
                { name: "Joko Susilo", role: "Kaur Perencanaan", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300" },
            ],
            kadus: [
                { name: "Ahmad Rizki", role: "Kadus Benteng", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" },
                { name: "Dewi Sartika", role: "Kadus Cemara", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300" },
                { name: "Bambang Pamungkas", role: "Kadus Melati", image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=300" },
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
    });

    // Derived officials from CMS Content for backward compatibility
    const officials = cmsContent.officials || [];

    // Session timeout checker
    useEffect(() => {
        if (!isLoggedIn) return;

        const checkSession = () => {
            const now = Date.now();
            if (now - lastActivity > SESSION_TIMEOUT) {
                setIsLoggedIn(false);
                setIsEditMode(false);
                alert("Sesi Anda telah berakhir. Silakan login kembali.");
            }
        };

        const interval = setInterval(checkSession, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [isLoggedIn, lastActivity]);

    // Update last activity on any user interaction
    useEffect(() => {
        const updateActivity = () => setLastActivity(Date.now());

        window.addEventListener("click", updateActivity);
        window.addEventListener("keypress", updateActivity);

        return () => {
            window.removeEventListener("click", updateActivity);
            window.removeEventListener("keypress", updateActivity);
        };
    }, []);

    // Load initial data
    useEffect(() => {
        const storedNews = localStorage.getItem("desa_news");
        const storedLapak = localStorage.getItem("desa_lapak");
        const storedAspirasi = localStorage.getItem("desa_aspirasi");
        const storedAuth = localStorage.getItem("isAdmin");
        const storedCMSContent = localStorage.getItem("desa_cms_content");
        const storedEditMode = localStorage.getItem("desa_edit_mode");
        const storedLastActivity = localStorage.getItem("last_activity");

        if (storedNews) setNews(JSON.parse(storedNews));
        else setNews(newsItems);

        if (storedLapak) setLapak(JSON.parse(storedLapak));
        else setLapak(lapakItems.map(item => ({ ...item, status: "Active" })));

        if (storedAspirasi) setAspirasi(JSON.parse(storedAspirasi));

        if (storedCMSContent) {
            const parsedContent = JSON.parse(storedCMSContent);
            // Merge with default content to ensure new fields (programs, gallery, peta) exist
            setCmsContent(prev => ({
                ...prev, ...parsedContent,
                programs: parsedContent.programs || prev.programs,
                gallery: parsedContent.gallery || prev.gallery,
                peta: parsedContent.peta || prev.peta,
                sotk_new: parsedContent.sotk_new || prev.sotk_new
            }));
        }

        if (storedAuth === "true") {
            // Check if session is still valid
            if (storedLastActivity) {
                const lastTime = parseInt(storedLastActivity, 10);
                if (Date.now() - lastTime < SESSION_TIMEOUT) {
                    setIsLoggedIn(true);
                    setLastActivity(lastTime);
                } else {
                    localStorage.removeItem("isAdmin");
                }
            } else {
                localStorage.removeItem("isAdmin");
            }
        }

        if (storedEditMode === "true" && isLoggedIn) setIsEditMode(true);

        setIsInitialized(true);
    }, []);

    // Persistence
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("desa_news", JSON.stringify(news));
            localStorage.setItem("desa_lapak", JSON.stringify(lapak));
            localStorage.setItem("desa_aspirasi", JSON.stringify(aspirasi));
            localStorage.setItem("desa_cms_content", JSON.stringify(cmsContent));
            localStorage.setItem("desa_edit_mode", String(isEditMode));
            localStorage.setItem("last_activity", String(lastActivity));

            if (isLoggedIn) {
                localStorage.setItem("isAdmin", "true");
            } else {
                localStorage.removeItem("isAdmin");
                setIsEditMode(false);
            }
        }
    }, [news, lapak, aspirasi, cmsContent, isEditMode, isLoggedIn, isInitialized, lastActivity]);

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

    const updateContent = (section: keyof CMSContent, field: string, value: any) => {
        setCmsContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setLastActivity(Date.now());
    };

    // News Management
    const addNews = (item: Omit<NewsItem, "id">) => {
        const newItem = { ...item, id: Date.now() };
        setNews((prev) => [newItem, ...prev]);
        setLastActivity(Date.now());
    };

    const deleteNews = (id: number) => {
        setNews((prev) => prev.filter(item => item.id !== id));
        setLastActivity(Date.now());
    };

    const updateNews = (id: number, updates: Partial<NewsItem>) => {
        setNews((prev) => prev.map(item => item.id === id ? { ...item, ...updates } : item));
        setLastActivity(Date.now());
    };

    // Aspirasi Management
    const addAspirasi = (item: Omit<AspirasiItem, "id" | "status" | "date">) => {
        const count = aspirasi.length + 1;
        const ticketId = `ASP-${String(count).padStart(3, '0')}`;
        const newItem: AspirasiItem = {
            ...item,
            id: ticketId,
            status: "Pending",
            date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        };
        setAspirasi((prev) => [newItem, ...prev]);
        return ticketId;
    };

    const verifyAspirasi = (id: string, status: "Verified" | "Rejected") => {
        setAspirasi((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
        setLastActivity(Date.now());
    };

    const replyAspirasi = (id: string, reply: string) => {
        setAspirasi((prev) => prev.map((item) => (item.id === id ? { ...item, reply } : item)));
        setLastActivity(Date.now());
    };

    const getAspirasiByTicket = (ticketId: string) => {
        return aspirasi.find((item) => item.id === ticketId);
    };

    const deleteAspirasi = (id: string) => {
        setAspirasi((prev) => prev.filter(item => item.id !== id));
        setLastActivity(Date.now());
    };

    // Lapak Management
    const submitLapak = (item: Omit<LapakItem, "id" | "status">) => {
        const newItem: LapakItem = { ...item, id: Date.now(), status: "Pending" };
        setLapak((prev) => [newItem, ...prev]);
    };

    const approveLapak = (id: number) => {
        setLapak((prev) => prev.map(item => item.id === id ? { ...item, status: "Active" } : item));
        setLastActivity(Date.now());
    };

    const rejectLapak = (id: number) => {
        setLapak((prev) => prev.map(item => item.id === id ? { ...item, status: "Rejected" } : item));
        setLastActivity(Date.now());
    };

    const deleteLapak = (id: number) => {
        setLapak((prev) => prev.filter(item => item.id !== id));
        setLastActivity(Date.now());
    };

    // Gallery Management
    const addGalleryItem = (item: Omit<GalleryItem, "id">) => {
        const newItem = { ...item, id: Date.now() };
        setCmsContent(prev => ({
            ...prev,
            gallery: [newItem, ...prev.gallery]
        }));
        setLastActivity(Date.now());
    };

    // Program Management
    const addProgram = () => {
        const newProgram: Program = {
            id: Date.now(),
            title: "Program Baru",
            description: "Deskripsi program...",
            status: "Rencana",
            icon: "Lightbulb"
        };
        setCmsContent(prev => ({
            ...prev,
            programs: [newProgram, ...prev.programs]
        }));
        setLastActivity(Date.now());
    };

    const deleteProgram = (id: number) => {
        setCmsContent(prev => ({
            ...prev,
            programs: prev.programs.filter(p => p.id !== id)
        }));
        setLastActivity(Date.now());
    };

    const updateProgram = (id: number, updates: Partial<Program>) => {
        setCmsContent(prev => ({
            ...prev,
            programs: prev.programs.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
        setLastActivity(Date.now());
    };

    // Hukum Management
    const addHukum = () => {
        const newItem: HukumItem = {
            id: Date.now(),
            jenis: "Perdes",
            nomor: "XX",
            tahun: new Date().getFullYear().toString(),
            judul: "Judul Produk Hukum Baru",
            downloadUrl: "#"
        };
        setCmsContent(prev => ({ ...prev, hukum: [newItem, ...prev.hukum] }));
        setLastActivity(Date.now());
    };

    const deleteHukum = (id: number) => {
        setCmsContent(prev => ({ ...prev, hukum: prev.hukum.filter(i => i.id !== id) }));
        setLastActivity(Date.now());
    };

    const updateHukum = (id: number, updates: Partial<HukumItem>) => {
        setCmsContent(prev => ({ ...prev, hukum: prev.hukum.map(i => i.id === id ? { ...i, ...updates } : i) }));
        setLastActivity(Date.now());
    };

    // Agenda Management
    const addAgenda = () => {
        const newItem: AgendaItem = {
            id: Date.now(),
            title: "Agenda Baru",
            date: new Date().toISOString().split('T')[0],
            time: "09:00",
            location: "Lokasi...",
            description: "Deskripsi kegiatan..."
        };
        setCmsContent(prev => ({ ...prev, agenda: [newItem, ...prev.agenda] }));
        setLastActivity(Date.now());
    };

    const deleteAgenda = (id: number) => {
        setCmsContent(prev => ({ ...prev, agenda: prev.agenda.filter(i => i.id !== id) }));
        setLastActivity(Date.now());
    };

    const updateAgenda = (id: number, updates: Partial<AgendaItem>) => {
        setCmsContent(prev => ({ ...prev, agenda: prev.agenda.map(i => i.id === id ? { ...i, ...updates } : i) }));
        setLastActivity(Date.now());
    };

    return (
        <AppContext.Provider value={{
            news, lapak, aspirasi, officials,
            cmsContent, isEditMode, toggleEditMode, updateContent,
            isLoggedIn, theme,
            login, logout, toggleTheme,
            addNews, deleteNews, updateNews,
            addAspirasi, verifyAspirasi, replyAspirasi, getAspirasiByTicket, deleteAspirasi,
            submitLapak, approveLapak, rejectLapak, deleteLapak,
            addGalleryItem,
            addProgram, deleteProgram, updateProgram,
            addHukum, deleteHukum, updateHukum,
            addAgenda, deleteAgenda, updateAgenda
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

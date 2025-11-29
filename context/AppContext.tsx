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
    addAspirasi: (item: Omit<AspirasiItem, "id" | "status" | "date">) => Promise<string>;
    verifyAspirasi: (id: string, status: "Verified" | "Rejected") => Promise<void>;
    replyAspirasi: (id: string, reply: string) => Promise<void>;
    getAspirasiByTicket: (ticketId: string) => AspirasiItem | undefined;
    deleteAspirasi: (id: string) => Promise<void>;
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

    // Fetch Initial Data from Supabase
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                // Fetch News
                const { data: newsData } = await supabase.from('berita').select('*').order('created_at', { ascending: false });
                if (newsData) setNews(newsData);
                else setNews(newsItems); // Fallback

                // Fetch Lapak
                const { data: lapakData } = await supabase.from('lapak').select('*').order('created_at', { ascending: false });
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

                // Fetch Aspirasi
                const { data: aspirasiData } = await supabase.from('aspirasi').select('*').order('created_at', { ascending: false });
                if (aspirasiData) {
                    // Map back to local interface if needed, or ensure DB columns match
                    // Assuming DB columns: ticket_code, name, nik, dusun, category, message, status, date, reply, photo
                    const mappedAspirasi = aspirasiData.map((item: any) => ({
                        id: item.ticket_code, // Map ticket_code to id
                        nama: item.name,      // Map name to nama
                        nik: item.nik,
                        dusun: item.dusun,
                        kategori: item.category,
                        laporan: item.message, // Map message to laporan
                        status: item.status,
                        date: item.date,
                        reply: item.reply      // Ensure reply is mapped
                    }));
                    setAspirasi(mappedAspirasi);
                }

                // Fetch Programs
                const { data: programsData } = await supabase.from('programs').select('*').order('id', { ascending: false });

                // Fetch Gallery
                const { data: galleryData } = await supabase.from('gallery').select('*').order('id', { ascending: false });

                // Fetch CMS Content (Assuming a single row with id=1 or similar)
                const { data: cmsData } = await supabase.from('cms_content').select('data').single();

                setCmsContent(prev => ({
                    ...prev,
                    ...(cmsData?.data || {}),
                    programs: programsData || prev.programs,
                    gallery: galleryData || prev.gallery
                }));

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

    // CMS Update
    const updateContent = async (section: keyof CMSContent, field: string, value: any) => {
        // Optimistic update
        setCmsContent(prev => {
            const updated = {
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            };
            // Sync to Supabase
            supabase.from('cms_content').upsert({ id: 1, data: updated }).then(({ error }) => {
                if (error) console.error("Error updating CMS content:", error);
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
    const addAspirasi = async (item: Omit<AspirasiItem, "id" | "status" | "date">) => {
        // Fetch real count from DB to avoid collisions
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

        // Map to DB columns: { nik, name, message, photo, ticket_code, status: 'Pending', dusun, category, reply }
        const dbPayload = {
            ticket_code: ticketId,
            name: item.nama,
            nik: item.nik,
            dusun: item.dusun,
            category: item.kategori,
            message: item.laporan,
            status: 'Pending',
            // date: newItem.date, // Remove date from payload, let Supabase handle created_at
            reply: null // Ensure reply is null initially
            // photo: item.image // If image exists in item
        };

        const { error } = await supabase.from('aspirasi').insert([dbPayload]);
        if (error) {
            console.error("Error adding aspirasi:", error.message, error.details, error.hint);
            // Revert optimistic update on error
            setAspirasi(prev => prev.filter(p => p.id !== ticketId));
            alert(`Gagal mengirim aspirasi: ${error.message}`);
        }
        return ticketId;
    };

    const verifyAspirasi = async (id: string, status: "Verified" | "Rejected") => {
        setAspirasi(prev => prev.map(item => item.id === id ? { ...item, status } : item));
        await supabase.from('aspirasi').update({ status }).eq('id', id);
        setLastActivity(Date.now());
    };

    const replyAspirasi = async (id: string, reply: string) => {
        setAspirasi(prev => prev.map(item => item.id === id ? { ...item, reply } : item));
        await supabase.from('aspirasi').update({ reply }).eq('id', id);
        setLastActivity(Date.now());
    };

    const getAspirasiByTicket = (ticketId: string) => {
        return aspirasi.find(item => item.id === ticketId);
    };

    const deleteAspirasi = async (id: string) => {
        setAspirasi(prev => prev.filter(item => item.id !== id));
        await supabase.from('aspirasi').delete().eq('id', id);
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


"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

// --- FULL CMS CONTENT STRUCTURE ---
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
    theme: Theme;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [lapak, setLapak] = useState<LapakItem[]>([]);
    const [aspirasi, setAspirasi] = useState<AspirasiItem[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [theme, setTheme] = useState<Theme>("dark");
    const [isInitialized, setIsInitialized] = useState(false);
    const [lastActivity, setLastActivity] = useState<number>(Date.now());

    // CMS State
    const [isEditMode, setIsEditMode] = useState(false);
    const [cmsContent, setCmsContent] = useState<CMSContent>({
        home: {
            heroTitle: "Desa Cenrana",
            heroSubtitle: "Mewujudkan desa yang mandiri, sejahtera, dan berbudaya melalui pelayanan publik yang transparan dan inovatif.",
            heroDesc: "Selamat Datang di Website Resmi Desa Cenrana.",
            statsLabel1: "Penduduk", statsVal1: "3500",
            statsLabel2: "Luas Wilayah", statsVal2: "12",
            statsLabel3: "Layanan Digital", statsVal3: "98",
            statsLabel4: "Kepala Keluarga", statsVal4: "850",
            statsLabel5: "UMKM Aktif", statsVal5: "45",
            statsLabel6: "Total Dana Desa", statsVal6: "1200000000",
        },
        footer: {
            brandName: "Desa Cenrana",
            brandDesc: "Mewujudkan pemerintahan desa yang transparan, akuntabel, dan melayani dengan hati.",
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
        }
    });

    // Mock SOTK Data
    const officials: Official[] = [
        { id: 1, name: "H. Abdullah", role: "Kepala Desa", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" },
        { id: 2, name: "Siti Aminah", role: "Sekretaris Desa", image: "https://images.unsplash.com/photo-1573496359-7013ac2bebb5?auto=format&fit=crop&q=80&w=200" },
        { id: 3, name: "Budi Santoso", role: "Kaur Keuangan", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
        { id: 4, name: "Rina Wati", role: "Kaur Umum", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
        { id: 5, name: "Ahmad Rizki", role: "Kepala Dusun Benteng", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    ];

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
        const storedTheme = localStorage.getItem("theme") as Theme;
        const storedCMSContent = localStorage.getItem("desa_cms_content");
        const storedEditMode = localStorage.getItem("desa_edit_mode");
        const storedLastActivity = localStorage.getItem("last_activity");

        if (storedNews) setNews(JSON.parse(storedNews));
        else setNews(newsItems);

        if (storedLapak) setLapak(JSON.parse(storedLapak));
        else setLapak(lapakItems.map(item => ({ ...item, status: "Active" })));

        if (storedAspirasi) setAspirasi(JSON.parse(storedAspirasi));

        if (storedCMSContent) setCmsContent(JSON.parse(storedCMSContent));

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

        if (storedTheme) setTheme(storedTheme);

        setIsInitialized(true);
    }, []);

    // Apply theme
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

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
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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

    return (
        <AppContext.Provider value={{
            news, lapak, aspirasi, officials,
            cmsContent, isEditMode, toggleEditMode, updateContent,
            isLoggedIn, theme,
            login, logout, toggleTheme,
            addNews, deleteNews, updateNews,
            addAspirasi, verifyAspirasi, replyAspirasi, getAspirasiByTicket, deleteAspirasi,
            submitLapak, approveLapak, rejectLapak, deleteLapak
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


"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { newsItems, lapakItems, villageStats } from "@/data/mockData";

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
}

export interface AspirasiItem {
    id: string; // Ticket ID (e.g., #ASP-1234)
    nama: string;
    nik: string;
    dusun: string;
    kategori: string;
    laporan: string;
    status: "Pending" | "Verified" | "Rejected";
    date: string;
}

export interface Official {
    id: number;
    name: string;
    role: string;
    image: string;
}

interface AppContextType {
    news: NewsItem[];
    lapak: LapakItem[];
    aspirasi: AspirasiItem[];
    officials: Official[];
    addNews: (item: Omit<NewsItem, "id">) => void;
    addAspirasi: (item: Omit<AspirasiItem, "id" | "status" | "date">) => string; // Returns Ticket ID
    verifyAspirasi: (id: string) => void;
    getAspirasiByTicket: (ticketId: string) => AspirasiItem | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [lapak, setLapak] = useState<LapakItem[]>([]);
    const [aspirasi, setAspirasi] = useState<AspirasiItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Mock SOTK Data
    const officials: Official[] = [
        { id: 1, name: "H. Abdullah", role: "Kepala Desa", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" },
        { id: 2, name: "Siti Aminah", role: "Sekretaris Desa", image: "https://images.unsplash.com/photo-1573496359-7013ac2bebb5?auto=format&fit=crop&q=80&w=200" },
        { id: 3, name: "Budi Santoso", role: "Kaur Keuangan", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200" },
        { id: 4, name: "Rina Wati", role: "Kaur Umum", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200" },
        { id: 5, name: "Ahmad Rizki", role: "Kepala Dusun Benteng", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    ];

    // Load initial data
    useEffect(() => {
        const storedNews = localStorage.getItem("desa_news");
        const storedLapak = localStorage.getItem("desa_lapak");
        const storedAspirasi = localStorage.getItem("desa_aspirasi");

        if (storedNews) {
            setNews(JSON.parse(storedNews));
        } else {
            setNews(newsItems);
        }

        if (storedLapak) {
            setLapak(JSON.parse(storedLapak));
        } else {
            setLapak(lapakItems);
        }

        if (storedAspirasi) {
            setAspirasi(JSON.parse(storedAspirasi));
        }

        setIsInitialized(true);
    }, []);

    // Save to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("desa_news", JSON.stringify(news));
        }
    }, [news, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("desa_lapak", JSON.stringify(lapak));
        }
    }, [lapak, isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("desa_aspirasi", JSON.stringify(aspirasi));
        }
    }, [aspirasi, isInitialized]);

    const addNews = (item: Omit<NewsItem, "id">) => {
        const newItem = { ...item, id: Date.now() };
        setNews((prev) => [newItem, ...prev]);
    };

    const addAspirasi = (item: Omit<AspirasiItem, "id" | "status" | "date">) => {
        const ticketId = `#ASP-${Math.floor(1000 + Math.random() * 9000)}`;
        const newItem: AspirasiItem = {
            ...item,
            id: ticketId,
            status: "Pending",
            date: new Date().toLocaleDateString("id-ID"),
        };
        setAspirasi((prev) => [newItem, ...prev]);
        return ticketId;
    };

    const verifyAspirasi = (id: string) => {
        setAspirasi((prev) =>
            prev.map((item) => (item.id === id ? { ...item, status: "Verified" } : item))
        );
    };

    const getAspirasiByTicket = (ticketId: string) => {
        return aspirasi.find((item) => item.id === ticketId);
    };

    return (
        <AppContext.Provider value={{ news, lapak, aspirasi, officials, addNews, addAspirasi, verifyAspirasi, getAspirasiByTicket }}>
            {children}
        </AppContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
};

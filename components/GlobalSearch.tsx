"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Newspaper, ShoppingBag, Compass, Loader2 } from "lucide-react";
import Image from "next/image";

interface SearchResult {
    type: "berita" | "lapak" | "layanan";
    id: number | string;
    title: string;
    description: string;
    url: string;
    image?: string;
    meta?: Record<string, unknown>;
}

interface GlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search with debounce
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
                const data = await response.json();
                if (data.success) {
                    setResults(data.results);
                }
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            e.preventDefault();
            navigateTo(results[selectedIndex].url);
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    const navigateTo = (url: string) => {
        router.push(url);
        onClose();
        setQuery("");
        setResults([]);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "berita": return <Newspaper className="w-4 h-4 text-blue-400" />;
            case "lapak": return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
            case "layanan": return <Compass className="w-4 h-4 text-purple-400" />;
            default: return <Search className="w-4 h-4" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "berita": return "Berita";
            case "lapak": return "Produk";
            case "layanan": return "Layanan";
            default: return type;
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Search Container */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(-1);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Cari berita, produk, layanan..."
                            className="w-full pl-12 pr-12 py-4 text-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery("");
                                    setResults([]);
                                    inputRef.current?.focus();
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700/50 rounded-full transition"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {/* Results Dropdown */}
                    {(results.length > 0 || isLoading) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl max-h-[60vh] overflow-y-auto"
                        >
                            {isLoading ? (
                                <div className="p-6 flex items-center justify-center gap-2 text-[var(--text-secondary)]">
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Mencari...</span>
                                </div>
                            ) : (
                                <div className="py-2">
                                    {results.map((result, index) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => navigateTo(result.url)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={`w-full px-4 py-3 flex items-start gap-3 text-left transition ${selectedIndex === index
                                                    ? "bg-emerald-500/10"
                                                    : "hover:bg-[var(--bg-panel)]"
                                                }`}
                                        >
                                            {/* Image or Icon */}
                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-panel)] flex items-center justify-center">
                                                {result.image ? (
                                                    <Image
                                                        src={result.image}
                                                        alt={result.title}
                                                        width={48}
                                                        height={48}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    getTypeIcon(result.type)
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-[var(--text-primary)] truncate">
                                                        {result.title}
                                                    </span>
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-[var(--bg-panel)] text-[var(--text-secondary)]">
                                                        {getTypeLabel(result.type)}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                                                    {result.description}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* No Results */}
                    {query.length >= 2 && !isLoading && results.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-center"
                        >
                            <Search className="w-10 h-10 text-[var(--text-secondary)]/30 mx-auto mb-2" />
                            <p className="text-[var(--text-secondary)]">
                                Tidak ditemukan hasil untuk "{query}"
                            </p>
                        </motion.div>
                    )}

                    {/* Hint */}
                    <div className="mt-3 flex items-center justify-center gap-4 text-xs text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-[var(--bg-panel)] rounded">↑↓</kbd> Navigasi
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-[var(--bg-panel)] rounded">Enter</kbd> Pilih
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 bg-[var(--bg-panel)] rounded">Esc</kbd> Tutup
                        </span>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

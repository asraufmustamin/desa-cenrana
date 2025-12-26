"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import { SkeletonCard } from "./Skeleton";
import { Search, LayoutGrid, List } from "lucide-react";

/**
 * DataList Component
 * ==================
 * 
 * Generic data list dengan search, pagination, dan view toggle
 */

interface DataListProps<T> {
    data: T[];
    renderItem: (item: T, index: number) => ReactNode;
    keyExtractor: (item: T) => string;
    isLoading?: boolean;
    error?: string | null;
    emptyState?: {
        title: string;
        description?: string;
        action?: { label: string; onClick: () => void };
    };
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    itemsPerPage?: number;
    showSearch?: boolean;
    showViewToggle?: boolean;
    columns?: number;
    className?: string;
    loadingCount?: number;
}

export default function DataList<T extends Record<string, unknown>>({
    data,
    renderItem,
    keyExtractor,
    isLoading = false,
    error,
    emptyState = { title: "Tidak ada data" },
    searchPlaceholder = "Cari...",
    searchKeys = [],
    itemsPerPage = 12,
    showSearch = true,
    showViewToggle = true,
    columns = 3,
    className = "",
    loadingCount = 6,
}: DataListProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Filter data berdasarkan search
    const filteredData = searchQuery && searchKeys.length > 0
        ? data.filter((item) =>
            searchKeys.some((key) => {
                const value = item[key];
                return typeof value === "string" && value.toLowerCase().includes(searchQuery.toLowerCase());
            })
        )
        : data;

    // Pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    // Reset page when search changes
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    // Grid columns class
    const gridClasses = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };

    return (
        <div className={className}>
            {/* Toolbar */}
            {(showSearch || showViewToggle) && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    {/* Search */}
                    {showSearch && (
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        {/* Results count */}
                        <span className="text-sm text-[var(--text-secondary)]">
                            {filteredData.length} hasil
                        </span>

                        {/* View Toggle */}
                        {showViewToggle && (
                            <div className="flex rounded-xl border border-[var(--border-color)] overflow-hidden">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 ${viewMode === "grid" ? "bg-emerald-500 text-white" : "bg-[var(--bg-panel)] text-[var(--text-secondary)]"}`}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 ${viewMode === "list" ? "bg-emerald-500 text-white" : "bg-[var(--bg-panel)] text-[var(--text-secondary)]"}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 mb-6">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className={`grid gap-4 ${gridClasses[columns as keyof typeof gridClasses] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
                    {[...Array(loadingCount)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredData.length === 0 && (
                <EmptyState
                    title={searchQuery ? "Tidak Ditemukan" : emptyState.title}
                    description={searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : emptyState.description}
                    action={emptyState.action}
                />
            )}

            {/* Data Grid/List */}
            {!isLoading && paginatedData.length > 0 && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={
                            viewMode === "grid"
                                ? `grid gap-4 ${gridClasses[columns as keyof typeof gridClasses] || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`
                                : "flex flex-col gap-3"
                        }
                    >
                        {paginatedData.map((item, index) => (
                            <motion.div
                                key={keyExtractor(item)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                {renderItem(item, startIndex + index)}
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

/**
 * Pagination Component
 * ====================
 * 
 * Komponen pagination dengan berbagai variant
 */

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showFirstLast?: boolean;
    maxVisiblePages?: number;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    maxVisiblePages = 5,
    className = "",
    size = "md",
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const sizeClasses = {
        sm: "w-8 h-8 text-sm",
        md: "w-10 h-10 text-base",
        lg: "w-12 h-12 text-lg",
    };

    // Generate page numbers to show
    const getPageNumbers = (): (number | "ellipsis")[] => {
        const pages: (number | "ellipsis")[] = [];

        if (totalPages <= maxVisiblePages) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            if (start > 2) {
                pages.push("ellipsis");
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push("ellipsis");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className={`flex items-center justify-center gap-1 ${className}`}>
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                    ${sizeClasses[size]} rounded-xl flex items-center justify-center
                    bg-[var(--bg-panel)] text-[var(--text-secondary)]
                    hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                `}
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className={`${sizeClasses[size]} flex items-center justify-center text-[var(--text-secondary)]`}
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </span>
                        );
                    }

                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`
                                ${sizeClasses[size]} rounded-xl flex items-center justify-center font-bold
                                transition-all
                                ${isActive
                                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                                    : "bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                                }
                            `}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                    ${sizeClasses[size]} rounded-xl flex items-center justify-center
                    bg-[var(--bg-panel)] text-[var(--text-secondary)]
                    hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all
                `}
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
}

/**
 * Simple Pagination - hanya prev/next
 */
export function SimplePagination({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}) {
    if (totalPages <= 1) return null;

    return (
        <div className={`flex items-center justify-between gap-4 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
            </button>

            <span className="text-sm text-[var(--text-secondary)]">
                Halaman <span className="font-bold text-[var(--text-primary)]">{currentPage}</span> dari{" "}
                <span className="font-bold text-[var(--text-primary)]">{totalPages}</span>
            </span>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}

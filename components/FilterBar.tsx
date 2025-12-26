"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, SortAsc, SortDesc, X, Check, ChevronDown } from "lucide-react";

/**
 * FilterBar Component
 * ===================
 * 
 * Bar filter dan sort untuk list data
 */

interface FilterOption {
    value: string;
    label: string;
}

interface FilterBarProps {
    filters?: {
        key: string;
        label: string;
        options: FilterOption[];
    }[];
    sortOptions?: FilterOption[];
    activeFilters?: Record<string, string>;
    activeSort?: { key: string; direction: "asc" | "desc" };
    onFilterChange?: (key: string, value: string) => void;
    onSortChange?: (key: string, direction: "asc" | "desc") => void;
    onClearFilters?: () => void;
    className?: string;
}

export default function FilterBar({
    filters = [],
    sortOptions = [],
    activeFilters = {},
    activeSort,
    onFilterChange,
    onSortChange,
    onClearFilters,
    className = "",
}: FilterBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const hasActiveFilters = Object.keys(activeFilters).length > 0;

    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            {/* Filters */}
            {filters.map((filter) => (
                <FilterDropdown
                    key={filter.key}
                    label={filter.label}
                    options={filter.options}
                    value={activeFilters[filter.key] || ""}
                    onChange={(value) => onFilterChange?.(filter.key, value)}
                    isOpen={openDropdown === filter.key}
                    onToggle={() => setOpenDropdown(openDropdown === filter.key ? null : filter.key)}
                />
            ))}

            {/* Sort */}
            {sortOptions.length > 0 && (
                <SortDropdown
                    options={sortOptions}
                    activeSort={activeSort}
                    onChange={onSortChange}
                    isOpen={openDropdown === "sort"}
                    onToggle={() => setOpenDropdown(openDropdown === "sort" ? null : "sort")}
                />
            )}

            {/* Clear Filters */}
            {hasActiveFilters && onClearFilters && (
                <button
                    onClick={onClearFilters}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Reset
                </button>
            )}
        </div>
    );
}

/**
 * Filter Dropdown
 */
function FilterDropdown({
    label,
    options,
    value,
    onChange,
    isOpen,
    onToggle,
}: {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                    border transition-all
                    ${value
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }
                `}
            >
                <Filter className="w-4 h-4" />
                {selectedOption?.label || label}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={onToggle} />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full left-0 mt-2 z-50 min-w-[180px] p-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xl"
                        >
                            <button
                                onClick={() => {
                                    onChange("");
                                    onToggle();
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${!value ? "bg-emerald-500/10 text-emerald-400" : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)]"
                                    }`}
                            >
                                Semua
                                {!value && <Check className="w-4 h-4 ml-auto" />}
                            </button>
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        onToggle();
                                    }}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${value === opt.value ? "bg-emerald-500/10 text-emerald-400" : "text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                                        }`}
                                >
                                    {opt.label}
                                    {value === opt.value && <Check className="w-4 h-4 ml-auto" />}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/**
 * Sort Dropdown
 */
function SortDropdown({
    options,
    activeSort,
    onChange,
    isOpen,
    onToggle,
}: {
    options: FilterOption[];
    activeSort?: { key: string; direction: "asc" | "desc" };
    onChange?: (key: string, direction: "asc" | "desc") => void;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const SortIcon = activeSort?.direction === "desc" ? SortDesc : SortAsc;

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
            >
                <SortIcon className="w-4 h-4" />
                Urutkan
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={onToggle} />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-2 z-50 min-w-[200px] p-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] shadow-xl"
                        >
                            {options.map((opt) => (
                                <div key={opt.value} className="flex items-center">
                                    <button
                                        onClick={() => {
                                            onChange?.(opt.value, "asc");
                                            onToggle();
                                        }}
                                        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-l-lg text-sm transition-colors ${activeSort?.key === opt.value && activeSort.direction === "asc"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                                            }`}
                                    >
                                        <SortAsc className="w-4 h-4" />
                                        {opt.label}
                                    </button>
                                    <button
                                        onClick={() => {
                                            onChange?.(opt.value, "desc");
                                            onToggle();
                                        }}
                                        className={`px-3 py-2 rounded-r-lg border-l border-[var(--border-color)] transition-colors ${activeSort?.key === opt.value && activeSort.direction === "desc"
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel)]"
                                            }`}
                                    >
                                        <SortDesc className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

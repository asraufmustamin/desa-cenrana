"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
    threshold?: number;
    hasMore: boolean;
    isLoading: boolean;
    onLoadMore: () => void;
}

/**
 * useInfiniteScroll Hook
 * ======================
 * 
 * Load more data automatically when user scrolls to bottom
 */
export function useInfiniteScroll({
    threshold = 100,
    hasMore,
    isLoading,
    onLoadMore,
}: UseInfiniteScrollOptions) {
    const [isFetching, setIsFetching] = useState(false);

    const handleScroll = useCallback(() => {
        if (isLoading || !hasMore || isFetching) return;

        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollHeight - scrollTop - clientHeight < threshold) {
            setIsFetching(true);
            onLoadMore();
        }
    }, [threshold, hasMore, isLoading, isFetching, onLoadMore]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        if (!isLoading) {
            setIsFetching(false);
        }
    }, [isLoading]);

    return { isFetching };
}

/**
 * useIntersectionObserver Hook
 * ============================
 * 
 * Detect when element enters viewport
 * Useful for lazy loading
 */
export function useIntersectionObserver(
    options: IntersectionObserverInit = {}
) {
    const ref = useRef<HTMLDivElement>(null);
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
        }, {
            threshold: 0.1,
            ...options,
        });

        observer.observe(element);
        return () => observer.disconnect();
    }, [options]);

    return [ref, isIntersecting] as const;
}

/**
 * usePagination Hook
 * ==================
 * 
 * Handle pagination state
 */
export function usePagination<T>(
    items: T[],
    itemsPerPage: number = 10
) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
        currentPage,
        totalPages,
        paginatedItems,
        hasNextPage,
        hasPrevPage,
        goToPage,
        nextPage,
        prevPage,
        setCurrentPage,
    };
}

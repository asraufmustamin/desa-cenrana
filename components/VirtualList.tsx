"use client";

import { useState, useRef, useEffect, useCallback, ReactNode } from "react";

interface VirtualListProps<T> {
    items: T[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: T, index: number) => ReactNode;
    overscan?: number; // Extra items to render above/below viewport
    className?: string;
    emptyMessage?: string;
}

/**
 * VirtualList Component
 * =====================
 * 
 * Renders large lists efficiently by only rendering visible items.
 * Perfect for displaying hundreds/thousands of items without lag.
 */
export default function VirtualList<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 3,
    className = "",
    emptyMessage = "Tidak ada data",
}: VirtualListProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    // Calculate visible range
    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    const visibleItems = items.slice(startIndex, endIndex);

    // Handle scroll
    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            setScrollTop(containerRef.current.scrollTop);
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [handleScroll]);

    if (items.length === 0) {
        return (
            <div
                className={`flex items-center justify-center ${className}`}
                style={{ height: containerHeight }}
            >
                <p className="text-[var(--text-secondary)]">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`overflow-auto ${className}`}
            style={{ height: containerHeight }}
        >
            <div style={{ height: totalHeight, position: "relative" }}>
                {visibleItems.map((item, index) => (
                    <div
                        key={startIndex + index}
                        style={{
                            position: "absolute",
                            top: (startIndex + index) * itemHeight,
                            left: 0,
                            right: 0,
                            height: itemHeight,
                        }}
                    >
                        {renderItem(item, startIndex + index)}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * useVirtualScroll Hook
 * Alternative hook-based approach for more flexibility
 */
export function useVirtualScroll<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number,
    overscan: number = 3
) {
    const [scrollTop, setScrollTop] = useState(0);

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
        items.length,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    const visibleItems = items.slice(startIndex, endIndex);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    }, []);

    const getItemStyle = useCallback((index: number) => ({
        position: "absolute" as const,
        top: (startIndex + index) * itemHeight,
        left: 0,
        right: 0,
        height: itemHeight,
    }), [startIndex, itemHeight]);

    return {
        visibleItems,
        startIndex,
        totalHeight,
        handleScroll,
        getItemStyle,
    };
}

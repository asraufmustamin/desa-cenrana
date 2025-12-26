"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/**
 * LazyImage Component
 * ===================
 * 
 * Image dengan lazy loading dan blur placeholder
 */

interface LazyImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    objectFit?: "contain" | "cover" | "fill" | "none";
    priority?: boolean;
    placeholder?: "blur" | "empty";
    fallbackSrc?: string;
}

export default function LazyImage({
    src,
    alt,
    width,
    height,
    fill = false,
    className = "",
    objectFit = "cover",
    priority = false,
    placeholder = "empty",
    fallbackSrc = "/placeholder-image.png",
}: LazyImageProps) {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(priority);

    // Intersection observer for lazy loading
    useEffect(() => {
        if (priority || isVisible) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "50px" }
        );

        const element = containerRef.current;
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, [priority, isVisible]);

    // Update src when prop changes
    useEffect(() => {
        setImageSrc(src);
        setIsError(false);
        setIsLoaded(false);
    }, [src]);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setIsError(true);
        setImageSrc(fallbackSrc);
    };

    // Check if src is valid
    const isValidSrc = imageSrc && imageSrc.trim() !== "";

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
            style={!fill ? { width, height } : undefined}
        >
            {/* Loading skeleton */}
            {!isLoaded && !isError && (
                <div className="absolute inset-0 bg-[var(--bg-panel)] animate-pulse" />
            )}

            {/* Image */}
            {isVisible && isValidSrc && (
                <Image
                    src={imageSrc}
                    alt={alt}
                    width={!fill ? width : undefined}
                    height={!fill ? height : undefined}
                    fill={fill}
                    className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    style={{ objectFit }}
                    onLoad={handleLoad}
                    onError={handleError}
                    priority={priority}
                    unoptimized={imageSrc.startsWith("data:") || imageSrc.startsWith("blob:")}
                />
            )}

            {/* Error fallback */}
            {isError && (
                <div className="absolute inset-0 bg-[var(--bg-panel)] flex items-center justify-center">
                    <span className="text-[var(--text-secondary)] text-sm">Gagal memuat</span>
                </div>
            )}
        </div>
    );
}

/**
 * Avatar dengan fallback ke inisial
 */
export function Avatar({
    src,
    name,
    size = "md",
    className = "",
}: {
    src?: string;
    name: string;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
}) {
    const [showFallback, setShowFallback] = useState(!src);

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-14 h-14 text-base",
        xl: "w-20 h-20 text-xl",
    };

    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    if (showFallback || !src) {
        return (
            <div
                className={`flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold ${sizeClasses[size]} ${className}`}
            >
                {initials}
            </div>
        );
    }

    return (
        <div className={`relative rounded-full overflow-hidden ${sizeClasses[size]} ${className}`}>
            <Image
                src={src}
                alt={name}
                fill
                className="object-cover"
                onError={() => setShowFallback(true)}
            />
        </div>
    );
}

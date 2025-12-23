/**
 * Skeleton Loading Components
 * Komponen untuk menampilkan loading state yang lebih menarik dari spinner biasa.
 * Menggunakan animasi pulse untuk efek "shimmer" yang modern.
 */

// ============================================
// BASE SKELETON
// ============================================
export function Skeleton({
    className = "",
    width,
    height
}: {
    className?: string;
    width?: string | number;
    height?: string | number;
}) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-[var(--border-color)] ${className}`}
            style={{ width, height }}
        />
    );
}

// ============================================
// CARD SKELETON
// ============================================
export function CardSkeleton() {
    return (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 animate-pulse">
            {/* Image placeholder */}
            <div className="aspect-video rounded-xl bg-[var(--border-color)] mb-4" />
            {/* Title */}
            <div className="h-4 bg-[var(--border-color)] rounded-lg w-3/4 mb-3" />
            {/* Description */}
            <div className="h-3 bg-[var(--border-color)] rounded-lg w-full mb-2" />
            <div className="h-3 bg-[var(--border-color)] rounded-lg w-2/3" />
        </div>
    );
}

// ============================================
// PRODUCT CARD SKELETON (untuk Lapak)
// ============================================
export function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden animate-pulse">
            {/* Image */}
            <div className="aspect-square bg-[var(--border-color)]" />
            {/* Content */}
            <div className="p-3">
                {/* Title */}
                <div className="h-4 bg-[var(--border-color)] rounded-lg w-full mb-2" />
                {/* Seller */}
                <div className="h-3 bg-[var(--border-color)] rounded-lg w-1/2 mb-3" />
                {/* Price */}
                <div className="h-5 bg-[var(--border-color)] rounded-lg w-2/3 mb-3" />
                {/* Button */}
                <div className="h-8 bg-[var(--border-color)] rounded-lg w-full" />
            </div>
        </div>
    );
}

// ============================================
// NEWS CARD SKELETON
// ============================================
export function NewsCardSkeleton() {
    return (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] overflow-hidden animate-pulse">
            {/* Image */}
            <div className="h-48 bg-[var(--border-color)]" />
            {/* Content */}
            <div className="p-5">
                {/* Category badge */}
                <div className="h-5 bg-[var(--border-color)] rounded-full w-20 mb-3" />
                {/* Title */}
                <div className="h-5 bg-[var(--border-color)] rounded-lg w-full mb-2" />
                <div className="h-5 bg-[var(--border-color)] rounded-lg w-3/4 mb-4" />
                {/* Excerpt */}
                <div className="h-3 bg-[var(--border-color)] rounded-lg w-full mb-2" />
                <div className="h-3 bg-[var(--border-color)] rounded-lg w-5/6 mb-4" />
                {/* Footer */}
                <div className="flex justify-between">
                    <div className="h-3 bg-[var(--border-color)] rounded-lg w-24" />
                    <div className="h-3 bg-[var(--border-color)] rounded-lg w-20" />
                </div>
            </div>
        </div>
    );
}

// ============================================
// TABLE SKELETON
// ============================================
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="h-12 bg-[var(--border-color)] rounded-lg animate-pulse" />
            {/* Rows */}
            {Array.from({ length: rows }).map((_, i) => (
                <div
                    key={i}
                    className="h-14 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg animate-pulse"
                    style={{ animationDelay: `${i * 0.1}s` }}
                />
            ))}
        </div>
    );
}

// ============================================
// PROFILE CARD SKELETON (untuk SOTK)
// ============================================
export function ProfileCardSkeleton() {
    return (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 text-center animate-pulse">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[var(--border-color)] mx-auto mb-4" />
            {/* Name */}
            <div className="h-5 bg-[var(--border-color)] rounded-lg w-2/3 mx-auto mb-2" />
            {/* Role */}
            <div className="h-4 bg-[var(--border-color)] rounded-lg w-1/2 mx-auto" />
        </div>
    );
}

// ============================================
// STAT CARD SKELETON (untuk Dashboard)
// ============================================
export function StatCardSkeleton() {
    return (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 animate-pulse">
            {/* Label */}
            <div className="h-3 bg-[var(--border-color)] rounded-lg w-1/2 mb-3" />
            {/* Value */}
            <div className="h-10 bg-[var(--border-color)] rounded-lg w-1/3" />
        </div>
    );
}

// ============================================
// TEXT SKELETON
// ============================================
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-2 animate-pulse">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="h-4 bg-[var(--border-color)] rounded-lg"
                    style={{
                        width: i === lines - 1 ? '60%' : '100%',
                        animationDelay: `${i * 0.1}s`
                    }}
                />
            ))}
        </div>
    );
}

// ============================================
// PAGE SKELETON (Full page loading)
// ============================================
export function PageSkeleton() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 animate-pulse">
            <div className="max-w-7xl mx-auto">
                {/* Back button */}
                <div className="h-10 bg-[var(--border-color)] rounded-xl w-32 mb-8" />

                {/* Title */}
                <div className="h-10 bg-[var(--border-color)] rounded-lg w-1/2 mb-4 mx-auto" />
                <div className="h-4 bg-[var(--border-color)] rounded-lg w-1/3 mb-8 mx-auto" />

                {/* Content grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================
// ASPIRASI CARD SKELETON
// ============================================
export function AspirasiCardSkeleton() {
    return (
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 animate-pulse">
            <div className="flex justify-between items-start mb-4">
                {/* Ticket ID */}
                <div className="h-6 bg-[var(--border-color)] rounded-lg w-24" />
                {/* Status badge */}
                <div className="h-6 bg-[var(--border-color)] rounded-full w-20" />
            </div>
            {/* Content */}
            <div className="h-4 bg-[var(--border-color)] rounded-lg w-full mb-2" />
            <div className="h-4 bg-[var(--border-color)] rounded-lg w-3/4 mb-4" />
            {/* Footer */}
            <div className="flex gap-4">
                <div className="h-3 bg-[var(--border-color)] rounded-lg w-20" />
                <div className="h-3 bg-[var(--border-color)] rounded-lg w-24" />
            </div>
        </div>
    );
}

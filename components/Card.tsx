"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon, ChevronRight } from "lucide-react";

/**
 * Card Component
 * ==============
 * 
 * Reusable card dengan berbagai variant
 */

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className = "", hover = false, onClick }: CardProps) {
    const Component = onClick ? motion.button : motion.div;

    return (
        <Component
            onClick={onClick}
            whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
            whileTap={onClick ? { scale: 0.98 } : undefined}
            className={`
                rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]
                ${hover ? "hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5" : ""}
                ${onClick ? "cursor-pointer text-left w-full" : ""}
                transition-all
                ${className}
            `}
        >
            {children}
        </Component>
    );
}

/**
 * Card Header
 */
export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`p-5 border-b border-[var(--border-color)] ${className}`}>
            {children}
        </div>
    );
}

/**
 * Card Body
 */
export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`p-5 ${className}`}>{children}</div>;
}

/**
 * Card Footer
 */
export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <div className={`p-5 border-t border-[var(--border-color)] bg-[var(--bg-panel)] rounded-b-2xl ${className}`}>
            {children}
        </div>
    );
}

/**
 * Feature Card - untuk tampilkan fitur/layanan
 */
interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick?: () => void;
    gradient?: string;
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    onClick,
    gradient = "from-emerald-500 to-cyan-500",
}: FeatureCardProps) {
    return (
        <Card hover onClick={onClick} className="p-5">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            {onClick && (
                <div className="flex items-center gap-1 mt-4 text-emerald-500 text-sm font-bold">
                    <span>Selengkapnya</span>
                    <ChevronRight className="w-4 h-4" />
                </div>
            )}
        </Card>
    );
}

/**
 * Stat Card - untuk tampilkan statistik
 */
interface StatCardProps {
    icon?: LucideIcon;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: { value: number; isPositive: boolean };
    gradient?: string;
}

export function StatCard({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    gradient = "from-emerald-500 to-cyan-500",
}: StatCardProps) {
    return (
        <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
                {Icon && (
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                )}
                {trend && (
                    <span className={`text-sm font-bold ${trend.isPositive ? "text-emerald-400" : "text-red-400"}`}>
                        {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <p className="text-3xl font-black text-[var(--text-primary)] mb-1">
                {typeof value === "number" ? value.toLocaleString() : value}
            </p>
            <p className="text-sm font-bold text-[var(--text-primary)]">{title}</p>
            {subtitle && <p className="text-xs text-[var(--text-secondary)] mt-1">{subtitle}</p>}
        </Card>
    );
}

/**
 * Link Card - card yang navigasi ke halaman lain
 */
interface LinkCardProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    href: string;
    gradient?: string;
}

export function LinkCard({
    icon: Icon,
    title,
    description,
    href,
    gradient = "from-emerald-500 to-cyan-500",
}: LinkCardProps) {
    return (
        <a href={href} className="block">
            <Card hover className="p-5 group">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[var(--text-primary)] group-hover:text-emerald-500 transition-colors">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-sm text-[var(--text-secondary)] truncate">{description}</p>
                        )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-emerald-500 transition-colors" />
                </div>
            </Card>
        </a>
    );
}

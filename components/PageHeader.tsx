"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Breadcrumb from "./Breadcrumb";

/**
 * PageHeader Component
 * ====================
 * 
 * Header section untuk halaman dengan title, description, dan breadcrumb
 */

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    gradient?: string;
    actions?: ReactNode;
    children?: ReactNode;
    showBreadcrumb?: boolean;
    className?: string;
}

export default function PageHeader({
    title,
    description,
    icon: Icon,
    gradient = "from-emerald-500 to-cyan-500",
    actions,
    children,
    showBreadcrumb = true,
    className = "",
}: PageHeaderProps) {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-panel)] to-transparent" />
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br ${gradient} opacity-5 blur-3xl`} />

            <div className="relative px-4 md:px-8 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    {showBreadcrumb && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <Breadcrumb />
                        </motion.div>
                    )}

                    {/* Header Content */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            {Icon && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}
                                >
                                    <Icon className="w-7 h-7 text-white" />
                                </motion.div>
                            )}

                            {/* Title & Description */}
                            <div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl md:text-3xl font-black text-[var(--text-primary)]"
                                >
                                    {title}
                                </motion.h1>
                                {description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="mt-2 text-[var(--text-secondary)] max-w-2xl"
                                    >
                                        {description}
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {actions && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex-shrink-0"
                            >
                                {actions}
                            </motion.div>
                        )}
                    </div>

                    {/* Additional Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * Section Header - untuk sub-section dalam halaman
 */

interface SectionHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    actions?: ReactNode;
    className?: string;
}

export function SectionHeader({
    title,
    description,
    icon: Icon,
    actions,
    className = "",
}: SectionHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 ${className}`}>
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-[var(--bg-panel)] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-500" />
                    </div>
                )}
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
                    {description && (
                        <p className="text-sm text-[var(--text-secondary)]">{description}</p>
                    )}
                </div>
            </div>
            {actions && <div>{actions}</div>}
        </div>
    );
}

/**
 * Admin Page Header
 */

export function AdminHeader({
    title,
    description,
    actions,
    className = "",
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
}) {
    return (
        <div className={`pb-6 border-b border-[var(--border-color)] ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[var(--text-primary)]">{title}</h1>
                    {description && (
                        <p className="text-[var(--text-secondary)] mt-1">{description}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        </div>
    );
}

"use client";

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * Tabs Component
 * ==============
 * 
 * Tab navigation dengan animasi
 */

interface Tab {
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
    badge?: number | string;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    onChange?: (tabId: string) => void;
    className?: string;
    variant?: "pills" | "underline" | "boxed";
}

export default function Tabs({
    tabs,
    defaultTab,
    onChange,
    className = "",
    variant = "pills",
}: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        onChange?.(tabId);
    };

    const variantStyles = {
        pills: {
            container: "flex gap-2 p-1 bg-[var(--bg-panel)] rounded-xl",
            tab: "flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all",
            active: "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg",
            inactive: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]",
        },
        underline: {
            container: "flex gap-1 border-b border-[var(--border-color)]",
            tab: "flex items-center gap-2 px-4 py-3 font-bold text-sm transition-all border-b-2 -mb-px",
            active: "border-emerald-500 text-emerald-500",
            inactive: "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-color)]",
        },
        boxed: {
            container: "flex gap-1 border border-[var(--border-color)] rounded-xl p-1",
            tab: "flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex-1 justify-center",
            active: "bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm",
            inactive: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        },
    };

    const style = variantStyles[variant];

    return (
        <div className={className}>
            {/* Tab Headers */}
            <div className={style.container}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`
                            ${style.tab}
                            ${activeTab === tab.id ? style.active : style.inactive}
                        `}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.badge !== undefined && (
                            <span className={`
                                px-2 py-0.5 rounded-full text-xs font-bold
                                ${activeTab === tab.id
                                    ? "bg-white/20 text-white"
                                    : "bg-[var(--bg-panel)] text-[var(--text-secondary)]"}
                            `}>
                                {tab.badge}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={activeTab === tab.id ? "block" : "hidden"}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Accordion Component
 * ===================
 */

interface AccordionItem {
    id: string;
    title: string;
    content: ReactNode;
    icon?: ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultOpen?: string[];
    className?: string;
}

export function Accordion({
    items,
    allowMultiple = false,
    defaultOpen = [],
    className = "",
}: AccordionProps) {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (id: string) => {
        if (allowMultiple) {
            setOpenItems((prev) =>
                prev.includes(id)
                    ? prev.filter((item) => item !== id)
                    : [...prev, id]
            );
        } else {
            setOpenItems((prev) =>
                prev.includes(id) ? [] : [id]
            );
        }
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {items.map((item) => {
                const isOpen = openItems.includes(item.id);

                return (
                    <div
                        key={item.id}
                        className="rounded-xl border border-[var(--border-color)] overflow-hidden"
                    >
                        {/* Header */}
                        <button
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-center justify-between p-4 text-left bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                <span className="font-bold text-[var(--text-primary)]">
                                    {item.title}
                                </span>
                            </div>
                            <motion.span
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-[var(--text-secondary)]"
                            >
                                ▼
                            </motion.span>
                        </button>

                        {/* Content */}
                        <motion.div
                            initial={false}
                            animate={{
                                height: isOpen ? "auto" : 0,
                                opacity: isOpen ? 1 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-[var(--bg-panel)] text-[var(--text-secondary)]">
                                {item.content}
                            </div>
                        </motion.div>
                    </div>
                );
            })}
        </div>
    );
}

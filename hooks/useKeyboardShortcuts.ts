"use client";

import { useEffect, useCallback } from "react";

type KeyHandler = () => void;

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    handler: KeyHandler;
    description?: string;
}

/**
 * useKeyboardShortcuts Hook
 * =========================
 * 
 * Register keyboard shortcuts easily
 * 
 * @example
 * useKeyboardShortcuts([
 *   { key: "k", ctrl: true, handler: openSearch, description: "Open search" },
 *   { key: "Escape", handler: closeModal, description: "Close modal" },
 * ]);
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        // Don't trigger shortcuts when typing in inputs
        const target = event.target as HTMLElement;
        if (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable
        ) {
            // Only allow Escape to work in inputs
            if (event.key !== "Escape") return;
        }

        for (const shortcut of shortcuts) {
            const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
            const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
            const altMatch = shortcut.alt ? event.altKey : !event.altKey;
            const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

            if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                event.preventDefault();
                shortcut.handler();
                break;
            }
        }
    }, [shortcuts]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Common keyboard shortcuts untuk admin
 */
export const ADMIN_SHORTCUTS = {
    SEARCH: { key: "k", ctrl: true, description: "Buka pencarian" },
    SAVE: { key: "s", ctrl: true, description: "Simpan" },
    ESCAPE: { key: "Escape", description: "Tutup/Batal" },
    NEW: { key: "n", ctrl: true, description: "Buat baru" },
    DELETE: { key: "Delete", description: "Hapus" },
    DASHBOARD: { key: "1", alt: true, description: "Ke Dashboard" },
    BERITA: { key: "2", alt: true, description: "Ke Berita" },
    LAPAK: { key: "3", alt: true, description: "Ke Lapak" },
    ASPIRASI: { key: "4", alt: true, description: "Ke Aspirasi" },
};

/**
 * Hook untuk mendeteksi kombinasi key yang sedang ditekan
 */
export function useKeyPress(targetKey: string): boolean {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        const downHandler = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                setKeyPressed(true);
            }
        };

        const upHandler = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === targetKey.toLowerCase()) {
                setKeyPressed(false);
            }
        };

        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [targetKey]);

    return keyPressed;
}

// Import useState for useKeyPress
import { useState } from "react";

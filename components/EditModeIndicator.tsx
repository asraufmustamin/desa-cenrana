
"use client";

import { useAppContext } from "@/context/AppContext";
import { Pencil, X } from "lucide-react";

export default function EditModeIndicator() {
    const { isEditMode, toggleEditMode } = useAppContext();

    if (!isEditMode) return null;

    return (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in-up w-[95%] sm:w-auto max-w-md sm:max-w-none">
            <div className="bg-yellow-400 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-2xl flex items-center justify-center sm:space-x-4 space-x-2 border-2 border-white/20 backdrop-blur-md">
                <div className="flex items-center font-bold text-sm sm:text-base whitespace-nowrap">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-600 rounded-full animate-pulse mr-2 sm:mr-3"></div>
                    <Pencil className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">MODE EDIT AKTIF</span>
                    <span className="sm:hidden">EDIT ON</span>
                </div>
                <div className="h-4 w-px bg-black/20 hidden sm:block"></div>
                <span className="text-[10px] sm:text-xs font-medium opacity-80 hidden sm:inline">Klik elemen bergaris untuk edit</span>
                <button
                    onClick={toggleEditMode}
                    className="ml-1 sm:ml-2 p-1 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}


"use client";

import { useAppContext } from "@/context/AppContext";
import { Pencil, X } from "lucide-react";

export default function EditModeIndicator() {
    const { isEditMode, toggleEditMode } = useAppContext();

    if (!isEditMode) return null;

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[9999] animate-fade-in-up">
            <div className="bg-yellow-400 text-black px-6 py-3 rounded-full shadow-2xl flex items-center space-x-4 border-2 border-white/20 backdrop-blur-md">
                <div className="flex items-center font-bold">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse mr-3"></div>
                    <Pencil className="w-4 h-4 mr-2" />
                    MODE EDIT AKTIF
                </div>
                <div className="h-4 w-px bg-black/20"></div>
                <span className="text-xs font-medium opacity-80">Klik elemen bergaris putus-putus untuk mengedit</span>
                <button
                    onClick={toggleEditMode}
                    className="ml-2 p-1 bg-black/10 hover:bg-black/20 rounded-full transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

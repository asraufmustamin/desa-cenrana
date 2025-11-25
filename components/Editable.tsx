"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Pencil, X, Check, Upload, Link as LinkIcon } from "lucide-react";
import { useAppContext, CMSContent } from "@/context/AppContext";

interface EditableProps {
    section?: keyof CMSContent;
    field?: string;
    value?: any;
    onSave?: (value: any) => void;
    type?: "text" | "textarea" | "image";
    className?: string;
    placeholder?: string;
}

export default function Editable({ section, field, value: propValue, onSave, type = "text", className = "", placeholder }: EditableProps) {
    const { isEditMode, cmsContent, updateContent } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Safely retrieve value
    let displayValue = propValue;
    if (section && field) {
        const sectionData = cmsContent[section] as any;
        displayValue = sectionData ? sectionData[field] : "";
    }

    // Use displayValue if available, otherwise empty string
    const finalValue = displayValue !== undefined ? displayValue : "";

    const [tempValue, setTempValue] = useState(String(finalValue));
    const [uploadMethod, setUploadMethod] = useState<"url" | "file">("file");

    useEffect(() => {
        setTempValue(String(finalValue));
    }, [finalValue]);

    // Handle file upload and convert to Base64
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Harap pilih file gambar yang valid.");
            return;
        }

        // Validate file size (max 2MB to avoid localStorage issues)
        if (file.size > 2 * 1024 * 1024) {
            alert("Ukuran file terlalu besar. Maksimal 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setTempValue(base64String);
        };
        reader.readAsDataURL(file);
    };

    if (!isEditMode) {
        if (type === "image") {
            if (!finalValue) {
                return (
                    <div className={`flex items-center justify-center bg-slate-800 text-slate-500 text-xs border-dashed border border-slate-600 ${className}`}>
                        No Image
                    </div>
                );
            }
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={String(finalValue)} alt="Content" className={className} />;
        }
        return <>{finalValue || placeholder}</>;
    }

    const handleSave = () => {
        if (onSave) {
            onSave(tempValue);
        } else if (section && field) {
            updateContent(section, field, tempValue);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(String(finalValue));
        setIsEditing(false);
    };

    if (isEditing) {

        return createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleCancel}>
                <div className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border-color)] w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                        Edit {field}
                    </h3>

                    {type === "textarea" ? (
                        <textarea
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-full p-4 rounded-xl bg-[var(--bg-panel)] border border-blue-500 text-[var(--text-primary)] focus:outline-none min-h-[150px] resize-y"
                            placeholder={placeholder}
                            autoFocus
                        />
                    ) : type === "image" ? (
                        <div className="space-y-4">
                            {/* Upload Method Toggle */}
                            <div className="flex space-x-2 p-1 bg-[var(--bg-panel)] rounded-lg">
                                <button
                                    onClick={() => setUploadMethod("file")}
                                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${uploadMethod === "file"
                                        ? "bg-blue-600 text-white"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    <Upload className="w-4 h-4 inline mr-2" />
                                    Upload File
                                </button>
                                <button
                                    onClick={() => setUploadMethod("url")}
                                    className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${uploadMethod === "url"
                                        ? "bg-blue-600 text-white"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                        }`}
                                >
                                    <LinkIcon className="w-4 h-4 inline mr-2" />
                                    Link URL
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[var(--border-color)] bg-black/20">
                                {tempValue ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={tempValue} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[var(--text-secondary)]">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {uploadMethod === "file" ? (
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                        Pilih Gambar (Max 2MB)
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="w-full p-4 rounded-xl bg-[var(--bg-panel)] border border-blue-500 text-[var(--text-primary)] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 file:cursor-pointer"
                                    />
                                    <p className="text-xs text-[var(--text-secondary)] mt-2">
                                        Gambar akan disimpan sebagai Base64 di localStorage
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-[var(--bg-panel)] border border-blue-500 text-[var(--text-primary)] focus:outline-none"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-full p-4 rounded-xl bg-[var(--bg-panel)] border border-blue-500 text-[var(--text-primary)] focus:outline-none"
                            placeholder={placeholder}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave();
                                if (e.key === 'Escape') handleCancel();
                            }}
                        />
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors font-bold"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-bold flex items-center"
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Simpan
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );

    }

    // Edit Mode Active State (Visual Cues) - Fixed to avoid invalid HTML nesting
    if (type === "image") {
        return (
            <div
                className="relative group cursor-pointer inline-block"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                }}
            >
                <div className="relative border-2 border-dashed border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10 rounded-lg p-0.5 transition-all">
                    {finalValue ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={String(finalValue)} alt="Editable Content" className={className} />
                    ) : (
                        <div className={`flex items-center justify-center bg-slate-800 text-slate-500 text-xs border-dashed border border-slate-600 ${className}`}>
                            No Image
                        </div>
                    )}

                    {/* Hover Badge */}
                    <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 flex items-center">
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                    </div>
                </div>
            </div>
        );
    }

    // For text/textarea, use a span wrapper to avoid invalid nesting
    return (
        <span
            className="relative group cursor-pointer inline-block"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditing(true);
            }}
        >
            <span className={`border-2 border-dashed border-yellow-400/50 hover:border-yellow-400 hover:bg-yellow-400/10 rounded-lg px-1 transition-all ${className}`}>
                {finalValue || <span className="text-yellow-500 italic">[Empty {field || "Content"}]</span>}
            </span>

            {/* Hover Badge */}
            <span className="absolute -top-3 -right-3 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 whitespace-nowrap">
                <Pencil className="w-3 h-3 inline mr-1" />
                Edit
            </span>
        </span>
    );
}

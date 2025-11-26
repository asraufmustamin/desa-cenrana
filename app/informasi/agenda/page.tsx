"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { Calendar, Clock, MapPin, Plus, Trash2 } from "lucide-react";

export default function AgendaPage() {
    const { cmsContent, isEditMode, addAgenda, deleteAgenda, updateAgenda } = useAppContext();
    const { agenda } = cmsContent;

    // Helper to format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString("id-ID", { month: "short" }).toUpperCase(),
            year: date.getFullYear(),
            full: date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        };
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-10 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">Agenda Kegiatan</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Jadwal kegiatan pemerintahan dan kemasyarakatan Desa Cenrana.
                    </p>
                </div>

                {/* Admin Add Button */}
                {isEditMode && (
                    <div className="mb-8 flex justify-end">
                        <button
                            onClick={addAgenda}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Tambah Agenda
                        </button>
                    </div>
                )}

                {/* Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agenda.map((item) => {
                        const dateObj = formatDate(item.date);
                        return (
                            <div
                                key={item.id}
                                className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/50 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                {/* Delete Button (Admin Only) */}
                                {isEditMode && (
                                    <button
                                        onClick={() => deleteAgenda(item.id)}
                                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100"
                                        title="Hapus Agenda"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}

                                {/* Date Badge (Top) */}
                                <div className="bg-blue-600 p-4 text-center text-white">
                                    <div className="text-3xl font-black leading-none">{dateObj.day}</div>
                                    <div className="text-sm font-bold opacity-90">{dateObj.month} {dateObj.year}</div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight min-h-[56px]">
                                        <Editable
                                            value={item.title}
                                            onSave={(val) => updateAgenda(item.id, { title: val })}
                                        />
                                    </h3>

                                    <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                                            <Editable
                                                value={item.time}
                                                onSave={(val) => updateAgenda(item.id, { time: val })}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-red-500" />
                                            <Editable
                                                value={item.location}
                                                onSave={(val) => updateAgenda(item.id, { location: val })}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                        <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                                            <Editable
                                                type="textarea"
                                                value={item.description}
                                                onSave={(val) => updateAgenda(item.id, { description: val })}
                                            />
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {agenda.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
                            <Calendar className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <p className="text-[var(--text-secondary)]">Belum ada agenda kegiatan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

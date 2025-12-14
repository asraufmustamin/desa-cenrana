"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { Plus, Trash2, CheckCircle, Clock, Activity, Lightbulb, Map, Laptop, HeartPulse, Home } from "lucide-react";

export default function ProgramPage() {
    const { cmsContent, isEditMode, addProgram, deleteProgram, updateProgram } = useAppContext();
    const { programs } = cmsContent;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Selesai": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
            case "Berjalan": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            default: return "bg-amber-500/20 text-amber-400 border-amber-500/30";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Selesai": return <CheckCircle className="w-3 h-3 mr-1" />;
            case "Berjalan": return <Activity className="w-3 h-3 mr-1" />;
            default: return <Clock className="w-3 h-3 mr-1" />;
        }
    };

    const getIcon = (iconName: string) => {
        const icons: { [key: string]: any } = { Road: Map, Map, Laptop, HeartPulse, Home, Lightbulb };
        const IconComponent = icons[iconName] || Lightbulb;
        return <IconComponent className="w-6 h-6 text-white" />;
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-32 pb-10 px-4">
            <div className="container mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-3">Program Kerja Desa</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Transparansi rencana dan realisasi pembangunan desa untuk kesejahteraan masyarakat.
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programs.map((program) => (
                        <div
                            key={program.id}
                            className="group relative bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500/50 dark:hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Delete Button (Admin Only) */}
                            {isEditMode && (
                                <button
                                    onClick={() => deleteProgram(program.id)}
                                    className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors z-20 opacity-0 group-hover:opacity-100"
                                    title="Hapus Program"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}

                            {/* Header: Icon & Status */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl shadow-lg shadow-blue-600/20">
                                    {getIcon(program.icon)}
                                </div>
                                <div className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center ${getStatusColor(program.status)}`}>
                                    {getStatusIcon(program.status)}
                                    <Editable
                                        value={program.status}
                                        onSave={(val) => updateProgram(program.id, { status: val as any })}
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
                                    <Editable
                                        value={program.title}
                                        onSave={(val) => updateProgram(program.id, { title: val })}
                                        className="hover:text-blue-500 transition-colors"
                                    />
                                </h3>
                                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed min-h-[60px]">
                                    <Editable
                                        type="textarea"
                                        value={program.description}
                                        onSave={(val) => updateProgram(program.id, { description: val })}
                                    />
                                </div>
                            </div>

                            {/* Progress Bar (Visual Decoration) */}
                            <div className="mt-6 h-1 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${program.status === 'Selesai' ? 'bg-emerald-500 w-full' : program.status === 'Berjalan' ? 'bg-blue-500 w-1/2' : 'bg-amber-500 w-1/4'}`}
                                ></div>
                            </div>
                        </div>
                    ))}

                    {/* Add Button (Admin Only) */}
                    {isEditMode && (
                        <button
                            onClick={addProgram}
                            className="flex flex-col items-center justify-center h-full min-h-[250px] border-2 border-dashed border-slate-300 dark:border-white/10 rounded-2xl p-6 hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
                        >
                            <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-blue-500" />
                            </div>
                            <span className="font-bold text-[var(--text-secondary)] group-hover:text-blue-500">Tambah Program Baru</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

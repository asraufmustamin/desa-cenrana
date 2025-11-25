"use client";

import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import { CheckCircle2, Clock, CalendarDays, ArrowRight, Laptop, HeartPulse, Home, Leaf, Shield, Users, Lightbulb, GraduationCap, Truck, Wrench, Map } from "lucide-react";

// Icon mapping for dynamic rendering
const iconMap: { [key: string]: any } = {
    Laptop, HeartPulse, Home, Leaf, Shield, Users, Lightbulb, GraduationCap, Truck, Wrench, Map
};

export default function ProgramPage() {
    const { cmsContent } = useAppContext();
    const { programs } = cmsContent;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        Program Kerja
                    </h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Agenda pembangunan dan pemberdayaan masyarakat Desa Cenrana.
                    </p>
                </div>

                <div className="space-y-6">
                    {programs?.map((program, index) => {
                        const IconComponent = iconMap[program.icon] || Lightbulb; // Default to Lightbulb if icon not found

                        return (
                            <div
                                key={program.id}
                                className="glass-card p-6 rounded-2xl group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 animate-fade-in-up flex flex-col md:flex-row items-start md:items-center gap-6"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`p-4 rounded-xl flex-shrink-0 transition-colors ${program.status === "Selesai" ? "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white" :
                                    program.status === "Berjalan" ? "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white" :
                                        "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white"
                                    }`}>
                                    <IconComponent className="w-8 h-8" />
                                </div>

                                <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                        <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                                            <Editable section="programs" field={`[${index}].title`} />
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold w-fit mt-2 md:mt-0 flex items-center ${program.status === "Selesai" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                                            program.status === "Berjalan" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                                                "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                            }`}>
                                            {program.status === "Selesai" ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> :
                                                program.status === "Berjalan" ? <Clock className="w-3 h-3 mr-1.5" /> :
                                                    <CalendarDays className="w-3 h-3 mr-1.5" />}
                                            <Editable section="programs" field={`[${index}].status`} />
                                        </span>
                                    </div>
                                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
                                        <Editable section="programs" field={`[${index}].description`} />
                                    </p>
                                </div>

                                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-panel)] text-[var(--text-secondary)] group-hover:translate-x-2 transition-transform">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

"use client";

import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Editable from "@/components/Editable";
import EditModeIndicator from "@/components/EditModeIndicator";

export default function SejarahDetail() {
    const { cmsContent } = useAppContext();
    const { profil } = cmsContent;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <EditModeIndicator />

            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/profil?tab=sejarah"
                    className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-blue-500 mb-8 group transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Kembali ke Profil</span>
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
                        <History className="w-4 h-4 mr-2" />
                        <span className="text-sm font-bold uppercase tracking-wider">Sejarah Desa</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                        <Editable section="profil" field="historyTitle" />
                    </h1>
                </div>

                {/* Banner Image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl mb-12 aspect-video border border-white/10">
                    <Editable
                        type="image"
                        section="profil"
                        field="historyBanner"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Full Content */}
                <article className="glass-panel rounded-[2rem] p-8 md:p-12">
                    <div className="prose prose-lg prose-invert max-w-none">
                        <div className="text-[var(--text-secondary)] text-lg leading-relaxed space-y-6 whitespace-pre-line">
                            <Editable
                                section="profil"
                                field="historyFullText"
                                type="textarea"
                                className="whitespace-pre-line"
                            />
                        </div>
                    </div>
                </article>

                {/* Back to Top & Navigation */}
                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <Link
                        href="/profil?tab=sejarah"
                        className="px-6 py-3 bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] rounded-xl font-bold transition-all border border-[var(--border-color)] inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali ke Profil
                    </Link>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
                    >
                        Kembali ke Atas
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

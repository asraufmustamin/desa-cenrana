
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAppContext();
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Updated Credentials
        if (username === "desacenranaadmin" && password === "digitaldesacenrana") {
            login();
            router.push("/admin");
        } else {
            setError("Akses Ditolak, periksa kembali data Anda");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[var(--bg-primary)]">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/3 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Compact Glass Card with Gradient Glow */}
            <div className="w-full max-w-[360px] relative z-10">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-emerald-500 to-green-500 rounded-3xl opacity-40 blur-lg animate-pulse"></div>
                <div className="relative bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-color)] rounded-3xl shadow-2xl p-8">

                    {/* Header */}
                    <div className="text-center mb-6">
                        {/* Logo Maros */}
                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl opacity-20"></div>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/logo-maros.png"
                                alt="Logo Maros"
                                className="w-12 h-12 object-contain drop-shadow-lg relative z-10"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Admin Portal</h1>
                        <p className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-widest">Desa Cenrana</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                    placeholder="Username"
                                />
                                <User className="absolute left-3 top-3 text-[var(--text-secondary)] w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                        </div>
                        <div>
                            <div className="relative group">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                    placeholder="Password"
                                />
                                <Lock className="absolute left-3 top-3 text-[var(--text-secondary)] w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            Masuk Portal <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/" className="text-[var(--text-secondary)] hover:text-emerald-500 text-xs font-medium transition-colors">
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

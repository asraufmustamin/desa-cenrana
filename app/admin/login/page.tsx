
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
        if (username === "admin" && password === "admin123") {
            login();
            router.push("/admin");
        } else {
            setError("Username atau password salah!");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full glass-panel rounded-[2.5rem] p-10 relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                        <span className="text-white font-bold text-3xl">DC</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
                    <p className="text-slate-400">Masuk untuk mengelola sistem desa.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Username</label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all group-hover:bg-black/30"
                                placeholder="admin"
                            />
                            <User className="absolute left-4 top-4 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Password</label>
                        <div className="relative group">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-black/20 border border-white/10 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all group-hover:bg-black/30"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-4 top-4 text-slate-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl text-center font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] transition-all flex items-center justify-center text-lg"
                    >
                        Masuk Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-slate-500 hover:text-white text-sm font-medium transition-colors">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </div>
    );
}

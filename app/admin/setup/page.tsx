"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Eye, EyeOff, Shield, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminSetupPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validasi password match
        if (password !== confirmPassword) {
            setError("Password dan konfirmasi tidak sama");
            return;
        }

        // Validasi password length
        if (password.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registrasi gagal");
                setIsLoading(false);
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);
        } catch (err) {
            console.error("Register error:", err);
            setError("Terjadi kesalahan. Coba lagi.");
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center"
                >
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Admin Berhasil Dibuat!</h2>
                    <p className="text-slate-300">Mengalihkan ke halaman login...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Setup Admin</h1>
                        <p className="text-slate-300 text-sm">Buat akun admin pertama untuk Desa Cenrana</p>
                    </div>

                    {/* Warning */}
                    <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-6">
                        <p className="text-yellow-300 text-xs">
                            ⚠️ Halaman ini hanya untuk setup awal. Setelah admin dibuat, nonaktifkan halaman ini.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                                placeholder="admin"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                                placeholder="admin@desacenrana.id"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Minimal 8 karakter"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-300 mb-1">Konfirmasi Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500"
                                placeholder="Ulangi password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <UserPlus className="w-5 h-5" />
                            )}
                            {isLoading ? "Membuat..." : "Buat Admin"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/admin/login" className="text-slate-400 hover:text-emerald-400 text-sm flex items-center justify-center gap-1">
                            <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

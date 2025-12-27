"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Trash2, Key, Shield, Search, AlertCircle, CheckCircle, Loader2, X } from "lucide-react";

interface AdminUser {
    id: number;
    username: string;
    role: string;
    created_at: string;
    last_login?: string;
}

export default function AdminTab() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

    // Form states
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("admin");
    const [resetPassword, setResetPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Fetch admins
    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setAdmins(data.users || []);
            }
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim() || !newPassword.trim()) {
            setMessage({ type: "error", text: "Username dan password wajib diisi" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: newUsername, password: newPassword, role: newRole })
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Admin berhasil ditambahkan" });
                setNewUsername("");
                setNewPassword("");
                setNewRole("admin");
                setShowAddModal(false);
                fetchAdmins();
            } else {
                const data = await res.json();
                setMessage({ type: "error", text: data.error || "Gagal menambahkan admin" });
            }
        } catch {
            setMessage({ type: "error", text: "Terjadi kesalahan" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAdmin = async (admin: AdminUser) => {
        if (!confirm(`Hapus admin "${admin.username}"? Tindakan ini tidak dapat dibatalkan.`)) return;

        try {
            const res = await fetch(`/api/admin/users/${admin.id}`, { method: "DELETE" });
            if (res.ok) {
                setMessage({ type: "success", text: "Admin berhasil dihapus" });
                fetchAdmins();
            } else {
                setMessage({ type: "error", text: "Gagal menghapus admin" });
            }
        } catch {
            setMessage({ type: "error", text: "Terjadi kesalahan" });
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetPassword.trim() || !selectedAdmin) {
            setMessage({ type: "error", text: "Password baru wajib diisi" });
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/users/${selectedAdmin.id}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: resetPassword })
            });

            if (res.ok) {
                setMessage({ type: "success", text: "Password berhasil direset" });
                setResetPassword("");
                setShowResetModal(false);
                setSelectedAdmin(null);
            } else {
                setMessage({ type: "error", text: "Gagal mereset password" });
            }
        } catch {
            setMessage({ type: "error", text: "Terjadi kesalahan" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Auto-hide message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <Shield className="w-6 h-6 text-emerald-400" />
                        Manajemen Admin
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)]">Kelola akun administrator sistem</p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-emerald-600 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Admin
                </button>
            </div>

            {/* Message */}
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl flex items-center gap-3 ${message.type === "success"
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-red-500/10 border border-red-500/30 text-red-400"
                        }`}
                >
                    {message.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </motion.div>
            )}

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                <input
                    type="text"
                    placeholder="Cari admin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
            </div>

            {/* Admin List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
            ) : filteredAdmins.length === 0 ? (
                <div className="text-center py-12 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                    <Users className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
                    <p className="text-[var(--text-secondary)]">Belum ada admin terdaftar</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredAdmins.map((admin) => (
                        <motion.div
                            key={admin.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[var(--text-primary)]">{admin.username}</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Role: <span className="text-emerald-400">{admin.role}</span>
                                    </p>
                                    {admin.last_login && (
                                        <p className="text-xs text-[var(--text-secondary)]">
                                            Login terakhir: {new Date(admin.last_login).toLocaleString("id-ID")}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => { setSelectedAdmin(admin); setShowResetModal(true); }}
                                    className="flex-1 sm:flex-none px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-500/20 transition-colors"
                                >
                                    <Key className="w-4 h-4" />
                                    Reset Password
                                </button>
                                <button
                                    onClick={() => handleDeleteAdmin(admin)}
                                    className="flex-1 sm:flex-none px-3 py-2 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Hapus
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Tambah Admin Baru</h3>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-lg">
                                <X className="w-5 h-5 text-[var(--text-secondary)]" />
                            </button>
                        </div>

                        <form onSubmit={handleAddAdmin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                                    placeholder="Masukkan username"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                                    placeholder="Masukkan password"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Role</label>
                                <select
                                    value={newRole}
                                    onChange={(e) => setNewRole(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">Super Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 bg-white/5 text-[var(--text-primary)] rounded-xl font-semibold hover:bg-white/10 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Tambah
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && selectedAdmin && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[var(--text-primary)]">Reset Password</h3>
                            <button onClick={() => { setShowResetModal(false); setSelectedAdmin(null); }} className="p-2 hover:bg-white/5 rounded-lg">
                                <X className="w-5 h-5 text-[var(--text-secondary)]" />
                            </button>
                        </div>

                        <p className="text-[var(--text-secondary)] mb-4">
                            Reset password untuk <span className="text-emerald-400 font-semibold">{selectedAdmin.username}</span>
                        </p>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Password Baru</label>
                                <input
                                    type="password"
                                    value={resetPassword}
                                    onChange={(e) => setResetPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:border-emerald-500 outline-none"
                                    placeholder="Masukkan password baru"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowResetModal(false); setSelectedAdmin(null); }}
                                    className="flex-1 py-3 bg-white/5 text-[var(--text-primary)] rounded-xl font-semibold hover:bg-white/10 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                                    Reset
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

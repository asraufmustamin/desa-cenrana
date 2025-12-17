"use client";

import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/lib/supabase";
import { Users, Plus, Trash2, X, Upload, Edit3 } from "lucide-react";
import ImportExcelPenduduk from "@/components/ImportExcelPenduduk";

interface PendudukItem {
    id: number;
    nik: string;
    nama: string;
    dusun: string;
    pekerjaan?: string;
    tanggal_lahir?: string;
}

export default function PendudukPage() {
    const { isLoggedIn } = useAppContext();
    const [penduduk, setPenduduk] = useState<PendudukItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'list' | 'import'>('list');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nik: "",
        nama: "",
        dusun: "",
        pekerjaan: "",
        tanggal_lahir: "",
    });

    // Fetch penduduk data
    useEffect(() => {
        fetchPenduduk();
    }, []);

    const fetchPenduduk = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('penduduk')
                .select('*')
                .order('nama', { ascending: true });

            if (error) throw error;
            setPenduduk(data || []);
        } catch (error) {
            console.error("Error fetching penduduk:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log("🔵 Form submitted with data:", formData);

        // Validasi NIK
        if (!formData.nik || formData.nik.length !== 16) {
            alert("NIK harus diisi dengan 16 digit angka!");
            return;
        }

        // Validasi Nama
        if (!formData.nama || formData.nama.trim() === "") {
            alert("Nama lengkap harus diisi!");
            return;
        }

        // Validasi Dusun
        if (!formData.dusun || formData.dusun === "") {
            alert("Dusun harus dipilih!");
            return;
        }

        console.log("✅ Validation passed, attempting to insert...");

        try {
            const payload = {
                nik: formData.nik,
                nama: formData.nama,
                dusun: formData.dusun,
                pekerjaan: formData.pekerjaan || null,
                tanggal_lahir: formData.tanggal_lahir || null,
            };

            console.log("📤 Sending payload to Supabase:", payload);

            const { data, error } = await supabase.from('penduduk').insert([payload]).select();

            if (error) {
                console.error("❌ Supabase error:", error);
                throw error;
            }

            console.log("✅ Data inserted successfully:", data);

            alert("✅ Data penduduk berhasil ditambahkan!");
            setShowModal(false);
            setFormData({ nik: "", nama: "", dusun: "", pekerjaan: "", tanggal_lahir: "" });

            // Small delay to ensure DB commit completes before refresh
            setTimeout(() => {
                fetchPenduduk();
            }, 500);
        } catch (error: any) {
            console.error("❌ Catch block error:", error);

            // Cek apakah tabel tidak ada
            if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
                alert("⚠️ Tabel 'penduduk' belum dibuat di Supabase!\n\nSilakan buat tabel dulu via SQL Editor atau Table Editor.");
            } else if (error.code === '23505') {
                alert("⚠️ NIK sudah terdaftar! Gunakan NIK yang berbeda.");
            } else {
                alert(`❌ Error: ${error.message}\n\nCek console browser (F12) untuk detail.`);
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus data penduduk ini?")) return;

        try {
            const { error } = await supabase.from('penduduk').delete().eq('id', id);
            if (error) throw error;

            alert("Data berhasil dihapus");
            fetchPenduduk();
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleEdit = (item: PendudukItem) => {
        setEditingId(item.id);
        setFormData({
            nik: item.nik,
            nama: item.nama,
            dusun: item.dusun,
            pekerjaan: item.pekerjaan || "",
            tanggal_lahir: item.tanggal_lahir || "",
        });
        setShowModal(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingId) return;

        try {
            const { error } = await supabase
                .from('penduduk')
                .update({
                    nik: formData.nik,
                    nama: formData.nama,
                    dusun: formData.dusun,
                    pekerjaan: formData.pekerjaan || null,
                    tanggal_lahir: formData.tanggal_lahir || null,
                })
                .eq('id', editingId);

            if (error) throw error;

            alert("✅ Data berhasil diperbarui!");
            setShowModal(false);
            setEditingId(null);
            setFormData({ nik: "", nama: "", dusun: "", pekerjaan: "", tanggal_lahir: "" });
            fetchPenduduk();
        } catch (error: any) {
            alert(`❌ Error: ${error.message}`);
        }
    };

    const resetForm = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({ nik: "", nama: "", dusun: "", pekerjaan: "", tanggal_lahir: "" });
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <p className="text-xl text-red-600 font-bold">Akses Ditolak. Silakan login sebagai Admin.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-xl font-bold text-[var(--text-secondary)]">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-primary)]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <Users className="w-8 h-8 text-blue-600 mr-3" />
                        <h1 className="text-4xl font-bold text-[var(--text-primary)]">Data Penduduk</h1>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-bold hover:from-cyan-600 hover:to-emerald-600 transition-colors shadow-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Tambah Penduduk
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'list'
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                            }`}
                    >
                        <Users className="w-5 h-5 inline mr-2" />
                        Daftar Penduduk
                    </button>
                    <button
                        onClick={() => setActiveTab('import')}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'import'
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-card)]'
                            }`}
                    >
                        <Upload className="w-5 h-5 inline mr-2" />
                        Import Excel
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'import' && (
                    <div className="mb-8">
                        <ImportExcelPenduduk />
                    </div>
                )}

                {activeTab === 'list' && (
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[var(--bg-panel)] border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">No</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">NIK</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Dusun</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Pekerjaan</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {penduduk.length > 0 ? (
                                        penduduk.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-[var(--bg-panel)] transition-colors">
                                                <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{index + 1}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-[var(--text-primary)]">{item.nik}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-[var(--text-primary)]">{item.nama}</td>
                                                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.dusun}</td>
                                                <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{item.pekerjaan || "-"}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit3 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                                                Belum ada data penduduk
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Penduduk */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-lg rounded-2xl p-8 relative animate-fade-in-up">
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-card)] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
                            {editingId ? "Edit Data Penduduk" : "Tambah Data Penduduk"}
                        </h2>

                        <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">NIK</label>
                                <input
                                    type="text"
                                    required
                                    pattern="[0-9]{16}"
                                    title="NIK harus 16 digit angka"
                                    value={formData.nik}
                                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="16 digit angka"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="Sesuai KTP"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Dusun</label>
                                <select
                                    required
                                    value={formData.dusun}
                                    onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--bg-panel)] to-[var(--bg-card)] border-2 border-[var(--border-color)] text-[var(--text-primary)] font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    <option value="" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Pilih Dusun</option>
                                    <option value="Benteng" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Benteng</option>
                                    <option value="Kajuara" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Kajuara</option>
                                    <option value="Tanatengnga" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Tanatengnga</option>
                                    <option value="Panagi" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Panagi</option>
                                    <option value="Holiang" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Holiang</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Pekerjaan (Opsional)</label>
                                <input
                                    type="text"
                                    value={formData.pekerjaan}
                                    onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                    placeholder="Contoh: Petani"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[var(--text-secondary)] mb-2">Tanggal Lahir (Opsional)</label>
                                <input
                                    type="date"
                                    value={formData.tanggal_lahir}
                                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500 outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg hover:from-cyan-600 hover:to-emerald-600 transition-all mt-4"
                            >
                                {editingId ? "Update Data" : "Simpan Data"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

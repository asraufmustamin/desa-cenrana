
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { Upload, AlertCircle, Send } from "lucide-react";

const AspirasiForm = () => {
    const router = useRouter();
    const { addAspirasi } = useData();
    const [formData, setFormData] = useState({
        nama: "",
        nik: "",
        dusun: "",
        kategori: "",
        laporan: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call and save to context
        setTimeout(() => {
            addAspirasi(formData);
            setIsSubmitting(false);
            router.push("/aspirasi/success");
        }, 1000);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
            <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-800 leading-relaxed">
                    Data pelapor dilindungi dan divalidasi dengan NIK. Identitas Anda aman bersama kami dan tidak akan dipublikasikan tanpa persetujuan.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap
                    </label>
                    <input
                        type="text"
                        id="nama"
                        name="nama"
                        required
                        value={formData.nama}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-desa-green focus:border-desa-green outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="Sesuai KTP"
                    />
                </div>
                <div>
                    <label htmlFor="nik" className="block text-sm font-semibold text-gray-700 mb-2">
                        NIK (Nomor Induk Kependudukan)
                    </label>
                    <input
                        type="text"
                        id="nik"
                        name="nik"
                        required
                        pattern="[0-9]{16}"
                        title="NIK harus 16 digit angka"
                        value={formData.nik}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-desa-green focus:border-desa-green outline-none transition-all bg-gray-50 focus:bg-white"
                        placeholder="16 digit angka"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="dusun" className="block text-sm font-semibold text-gray-700 mb-2">
                        Asal Dusun
                    </label>
                    <div className="relative">
                        <select
                            id="dusun"
                            name="dusun"
                            required
                            value={formData.dusun}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-desa-green focus:border-desa-green outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                        >
                            <option value="">Pilih Dusun</option>
                            <option value="Benteng">Dusun Benteng</option>
                            <option value="Matajang">Dusun Matajang</option>
                            <option value="Bonto-Bonto">Dusun Bonto-Bonto</option>
                            <option value="Labuaja">Dusun Labuaja</option>
                            <option value="Tanete">Dusun Tanete</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="kategori" className="block text-sm font-semibold text-gray-700 mb-2">
                        Kategori Aspirasi
                    </label>
                    <div className="relative">
                        <select
                            id="kategori"
                            name="kategori"
                            required
                            value={formData.kategori}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-desa-green focus:border-desa-green outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Infrastruktur">Infrastruktur (Jalan, Jembatan, dll)</option>
                            <option value="Pelayanan">Pelayanan Publik</option>
                            <option value="Keamanan">Keamanan & Ketertiban</option>
                            <option value="Sosial">Sosial & Kesejahteraan</option>
                            <option value="Lainnya">Lainnya</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label htmlFor="laporan" className="block text-sm font-semibold text-gray-700 mb-2">
                    Isi Laporan / Aspirasi
                </label>
                <textarea
                    id="laporan"
                    name="laporan"
                    required
                    rows={5}
                    value={formData.laporan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-desa-green focus:border-desa-green outline-none transition-all bg-gray-50 focus:bg-white"
                    placeholder="Jelaskan detail laporan atau aspirasi Anda secara lengkap..."
                ></textarea>
            </div>

            <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Foto Pendukung (Opsional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-desa-green hover:bg-green-50/50 transition-all cursor-pointer bg-gray-50">
                    <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-desa-green hover:text-desa-gold focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-desa-green hover:bg-desa-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-desa-green disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            >
                {isSubmitting ? (
                    "Mengirim..."
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Laporan
                    </>
                )}
            </button>
        </form>
    );
};

export default AspirasiForm;

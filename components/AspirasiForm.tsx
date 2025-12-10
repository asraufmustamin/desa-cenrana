"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Upload, AlertCircle, Send, ShieldCheck, X, Image as ImageIcon } from "lucide-react";
import { uploadAspirasiImage, validateImageFile } from "@/lib/uploadImage";

const AspirasiForm = () => {
    const router = useRouter();
    const { addAspirasi } = useAppContext();
    const [formData, setFormData] = useState({
        nama: "",
        nik: "",
        dusun: "",
        kategori: "",
        priority: "Medium" as "Low" | "Medium" | "High" | "Emergency",
        laporan: "",
        is_anonymous: false,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            validateImageFile(file);
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            setErrorMessage("");
        } catch (error: any) {
            setErrorMessage(error.message);
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const removeImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            // Generate temporary ticket ID for upload
            const tempTicketId = `ASP-TEMP-${Date.now()}`;
            let imageUrl = "";

            // Upload image if selected
            if (selectedFile) {
                imageUrl = await uploadAspirasiImage(selectedFile, tempTicketId);
            }

            const ticketId = await addAspirasi({ ...formData, image: imageUrl });
            setIsSubmitting(false);
            router.push(`/aspirasi/success?ticket=${ticketId}`);
        } catch (error: any) {
            setIsSubmitting(false);
            setErrorMessage(error.message || "Terjadi kesalahan saat mengirim aspirasi.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-10">
            <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-800 leading-relaxed">
                    Data pelapor dilindungi dan divalidasi dengan NIK. Identitas Anda aman bersama kami dan tidak akan dipublikasikan tanpa persetujuan.
                </p>
            </div>

            {errorMessage && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-red-800 leading-relaxed font-medium">{errorMessage}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
                        Nama Lengkap <span className="text-red-500">*</span>
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
                        NIK <span className="text-red-500">*</span>
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
                        Dusun <span className="text-red-500">*</span>
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
                        Kategori Laporan <span className="text-red-500">*</span>
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
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                    Tingkat Prioritas <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <select
                        id="priority"
                        name="priority"
                        required
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-desa-green focus:border-desa-green outline-none transition-all bg-gray-50 focus:bg-white appearance-none"
                    >
                        <option value="Low">🟢 Rendah - Tidak mendesak</option>
                        <option value="Medium">🟡 Normal - Standar</option>
                        <option value="High">🟠 Penting - Perlu perhatian</option>
                        <option value="Emergency">🔴 Darurat - Sangat mendesak</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                    Pilih tingkat urgensi aspirasi Anda untuk membantu kami memprioritaskan penanganan.
                </p>
            </div>

            <div className="mb-6">
                <label className="flex items-center space-x-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        name="is_anonymous"
                        checked={formData.is_anonymous}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex items-center">
                        <ShieldCheck className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                            Rahasiakan Identitas Saya (Laporan Anonim)
                        </span>
                    </div>
                </label>
                <p className="mt-2 ml-8 text-xs text-gray-500">
                    Identitas Anda tetap tersimpan untuk validasi, namun tidak akan ditampilkan kepada admin.
                </p>
            </div>

            <div className="mb-6">
                <label htmlFor="laporan" className="block text-sm font-semibold text-gray-700 mb-2">
                    Isi Laporan <span className="text-red-500">*</span>
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

                {!previewUrl ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-desa-green hover:bg-green-50/50 transition-all cursor-pointer bg-gray-50">
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-desa-green hover:text-desa-gold focus-within:outline-none">
                                    <span>Pilih gambar</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/jpg"
                                        onChange={handleFileChange}
                                        className="sr-only"
                                    />
                                </label>
                                <p className="pl-1">atau drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, WebP maksimal 5MB</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative border-2 border-desa-green rounded-xl overflow-hidden bg-gray-50">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-4 bg-white border-t">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <ImageIcon className="w-5 h-5 text-desa-green" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{selectedFile?.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                >
                                    <X className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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


"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Phone, Tag, Search, ShoppingBag, Plus, X, Trophy, ChevronLeft, ChevronRight, Upload, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { canSubmit, recordSubmit, getRemainingTime } from "@/lib/rateLimit";

export default function LapakWarga() {
    const { lapak, submitLapak, isLoading } = useAppContext();
    const [activeTab, setActiveTab] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Product Detail Modal State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // Image Upload & Crop State
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [imageRotation, setImageRotation] = useState(0);
    const [uploadError, setUploadError] = useState("");

    // Custom Unit State
    const [customUnit, setCustomUnit] = useState("");

    // Crop State (react-easy-crop)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    // Form State
    const [form, setForm] = useState({
        title: "",
        category: "Hasil Tani",
        priceAmount: "",
        priceUnit: "/bungkus",
        seller: "",
        phone: "",
        image: "",
        description: "",
    });

    // State untuk inline errors di setiap field
    const [errors, setErrors] = useState({
        title: "",
        priceAmount: "",
        customUnit: "",
        seller: "",
        phone: "",
        description: ""
    });

    // State untuk loading saat submit
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk success feedback
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [successProductId, setSuccessProductId] = useState("");
    const [copied, setCopied] = useState(false);

    // State untuk rate limiting (anti-spam)
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    // Common units + Custom option
    const priceUnits = [
        "/kg", "/liter", "/bungkus", "/pcs", "/buah",
        "/ikat", "/ekor", "/porsi", "/meter", "/jam",
        "Custom" // This will show custom input
    ];

    // Countdown timer untuk cooldown
    useEffect(() => {
        if (isOnCooldown && remainingTime > 0) {
            const timer = setInterval(() => {
                const remaining = getRemainingTime('lapak');
                if (remaining <= 0) {
                    setIsOnCooldown(false);
                    setRemainingTime(0);
                } else {
                    setRemainingTime(remaining);
                }
            }, 1000); // Update every second
            return () => clearInterval(timer);
        }
    }, [isOnCooldown, remainingTime]);

    const categories = ["Semua", "Hasil Tani", "Produk UMKM", "Jasa Warga"];

    // Filter Active Items Only (Defensive Coding)
    const safeLapak = Array.isArray(lapak) ? lapak : [];
    const activeLapak = safeLapak.filter(item => item && item.status === "Active");

    const filteredLapak = activeLapak.filter((item) => {
        const matchesCategory = activeTab === "Semua" || item.category === activeTab;
        // Defensive Coding: Check if title exists, fallback to empty string
        // Also check for 'name' property just in case the DB returns that instead of title
        const itemTitle = item.title || (item as any).name || "";
        const matchesSearch = itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Top 5 "Produk Terbaru" - Sort by created_at descending
    const top5Items = activeLapak
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 5);

    // Crop Helper Functions
    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new window.Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area, rotation = 0): Promise<string> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return canvas.toDataURL('image/jpeg');
    };

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // Validation function untuk Lapak form dengan inline errors
    const validateLapakForm = (): boolean => {
        const newErrors = { title: "", priceAmount: "", customUnit: "", seller: "", phone: "", description: "" };
        let isValid = true;

        // Validasi Nama Produk
        if (!form.title.trim()) {
            newErrors.title = "Mohon isi nama produk";
            isValid = false;
        } else if (form.title.trim().length < 3) {
            newErrors.title = "Nama produk minimal 3 karakter";
            isValid = false;
        }

        // Validasi Harga
        if (!form.priceAmount || parseFloat(form.priceAmount) <= 0) {
            newErrors.priceAmount = "Mohon isi harga yang valid (harus lebih dari 0)";
            isValid = false;
        }

        // Validasi Custom Unit
        if (form.priceUnit === 'Custom' && !customUnit.trim()) {
            newErrors.customUnit = "Mohon isi satuan harga custom";
            isValid = false;
        }

        // Validasi Nama Penjual
        if (!form.seller.trim()) {
            newErrors.seller = "Mohon isi nama penjual";
            isValid = false;
        } else if (form.seller.trim().length < 3) {
            newErrors.seller = "Nama penjual minimal 3 karakter";
            isValid = false;
        }

        // Validasi WhatsApp
        if (!form.phone.trim()) {
            newErrors.phone = "Mohon isi nomor WhatsApp";
            isValid = false;
        } else {
            const cleanedPhone = form.phone.replace(/\D/g, '');
            if (cleanedPhone.length < 10) {
                newErrors.phone = "Nomor WhatsApp minimal 10 digit";
                isValid = false;
            }
        }

        // Validasi Deskripsi
        if (!form.description.trim()) {
            newErrors.description = "Mohon isi deskripsi produk";
            isValid = false;
        } else if (form.description.trim().length < 10) {
            newErrors.description = "Deskripsi produk minimal 10 karakter";
            isValid = false;
        }

        // Set semua errors sekaligus
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // ✅ CHECK: Rate limiting (anti-spam)
        if (!canSubmit('lapak')) {
            const remaining = getRemainingTime('lapak');
            setIsOnCooldown(true);
            setRemainingTime(remaining);
            // Tampilkan error via success card state atau bisa bikin error state tersendiri
            return;
        }

        // ✅ Validate form before submission
        if (!validateLapakForm()) {
            return;
        }

        // Set loading state
        setIsSubmitting(true);

        try {
            // Format phone number: 08xxx -> 62xxx
            const formatPhone = (phone: string): string => {
                let cleaned = phone.replace(/\D/g, '');
                if (cleaned.startsWith('08')) {
                    cleaned = '62' + cleaned.substring(1);
                } else if (cleaned.startsWith('8') && cleaned.length >= 10) {
                    cleaned = '62' + cleaned;
                } else if (cleaned.startsWith('0')) {
                    cleaned = '62' + cleaned.substring(1);
                }
                return cleaned;
            };

            // Format price with thousand separator
            const formatPriceDisplay = (value: string): string => {
                if (!value) return '0';
                return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            };

            const formattedPhone = formatPhone(form.phone);
            // Use custom unit if selected, otherwise use dropdown value
            const finalUnit = form.priceUnit === 'Custom' ? customUnit : form.priceUnit;
            const finalPrice = `Rp ${formatPriceDisplay(form.priceAmount)}${finalUnit}`;
            const productData = { ...form, price: finalPrice, phone: formattedPhone, image: imagePreview || form.image };

            await submitLapak(productData);

            // ✅ RECORD: Submit timestamp untuk rate limiting
            recordSubmit('lapak');

            // Tampilkan success card
            setSuccessProductId(form.title); // Gunakan title sebagai ID sementara
            setShowSuccessCard(true);

            // Reset form
            setForm({ title: "", category: "Hasil Tani", priceAmount: "", priceUnit: "/bungkus", seller: "", phone: "", image: "", description: "" });
            setImagePreview(null);
            setCustomUnit('');
            setErrors({ title: "", priceAmount: "", customUnit: "", seller: "", phone: "", description: "" });

            // Auto close modal dan hide success card setelah 3 detik
            setTimeout(() => {
                setShowSuccessCard(false);
                setShowModal(false);
            }, 3000);

        } catch (error) {
            console.error("Error submitting product:", error);
        } finally {
            // Selalu set loading ke false
            setIsSubmitting(false);
        }
    };

    // Image Upload Handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError("File harus berupa gambar (JPG, PNG, dll)");
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError("Ukuran gambar maksimal 5MB");
            return;
        }

        // Convert to Base64 and show preview modal
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setTempImagePreview(result);
            setImageRotation(0);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setShowImagePreviewModal(true);
            setUploadError("");
        };
        reader.readAsDataURL(file);
    };

    // Confirm image after crop
    const confirmImage = async () => {
        if (tempImagePreview && croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(tempImagePreview, croppedAreaPixels, imageRotation);
                setImagePreview(croppedImage);
                setForm({ ...form, image: croppedImage });
                setShowImagePreviewModal(false);
                setTempImagePreview(null);
                setImageRotation(0);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setCroppedAreaPixels(null);
            } catch (e) {
                console.error(e);
                setUploadError("Gagal memotong gambar");
            }
        }
    };

    // Cancel image preview
    const cancelImagePreview = () => {
        setShowImagePreviewModal(false);
        setTempImagePreview(null);
        setImageRotation(0);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Rotate image
    const rotateImage = () => {
        setImageRotation((prev) => (prev + 90) % 360);
    };

    // Remove uploaded image
    const removeImage = () => {
        setImagePreview(null);
        setForm({ ...form, image: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xl font-bold text-[var(--text-secondary)]">Memuat data lapak...</p>
            </div>
        );
    }

    if (!safeLapak) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <p className="text-xl font-bold text-red-500">Gagal memuat data lapak. Silakan coba lagi nanti.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4 text-glow">Lapak Warga</h1>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                        Dukung ekonomi lokal dengan membeli produk asli dari warga Desa Cenrana.
                    </p>
                </div>

                {/* Top 5 Widget */}
                <div className="mb-16">
                    <div className="flex items-center mb-6">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Produk Terbaru</h2>
                        </div>
                        <div className="ml-auto flex space-x-2">
                            <button onClick={() => scroll("left")} className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={() => scroll("right")} className="p-2 rounded-full bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-color)] transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory"
                    >
                        {top5Items?.length > 0 && top5Items.map((item) => (
                            <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center glass-card rounded-3xl overflow-hidden flex flex-col group">
                                <div className="relative h-48">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                                        Top Product
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-[var(--text-primary)] line-clamp-1 mb-1">{item.title}</h3>
                                    <p className="text-emerald-500 font-bold text-sm">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-12">
                    {/* Tabs */}
                    <div className="flex p-1 bg-[var(--bg-card)] backdrop-blur-md rounded-2xl border border-[var(--border-color)] overflow-x-auto max-w-full hide-scrollbar w-full lg:w-auto">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveTab(category)}
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${activeTab === category
                                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg"
                                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-panel)]"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3.5 text-[var(--text-secondary)] w-5 h-5" />
                        </div>

                        {/* Promote Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all flex items-center justify-center whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Promosikan Produk
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {filteredLapak.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredLapak?.map((item) => {
                            const isInvalidImage = item.image.includes("whatsapp") || item.image.includes("wa.me");
                            const safeImage = isInvalidImage
                                ? "https://images.unsplash.com/photo-1589923188900-85dae5233271?auto=format&fit=crop&w=800&q=80"
                                : item.image;

                            return (
                                <div
                                    key={item.id}
                                    className="glass-card rounded-3xl overflow-hidden flex flex-col group h-full cursor-pointer"
                                    onClick={() => { setSelectedProduct(item); setShowDetailModal(true); }}
                                >
                                    <div className="relative aspect-square overflow-hidden bg-[var(--bg-card)]">
                                        <Image
                                            src={safeImage}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 flex items-center">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {item.category}
                                        </div>
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-bold text-[var(--text-primary)] text-sm md:text-base line-clamp-2 mb-2 group-hover:text-blue-500 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-[var(--text-secondary)] mb-4">Oleh: {item.seller}</p>

                                        <div className="mt-auto">
                                            <p className="text-emerald-500 font-bold text-base md:text-lg mb-3">{item.price}</p>
                                            <a
                                                href={`https://wa.me/${item.phone}?text=Halo, saya tertarik dengan produk ${item.title} di Lapak Desa Cenrana.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-xs md:text-sm font-bold flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                                            >
                                                <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                                                Hubungi
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-24 glass-panel rounded-[2rem] border-dashed border-[var(--border-color)]">
                        <ShoppingBag className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Produk tidak ditemukan</h3>
                        <p className="text-[var(--text-secondary)]">Coba kata kunci lain atau kategori berbeda.</p>
                    </div>
                )}
            </div>

            {/* Submission Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="glass-panel w-full max-w-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 sm:top-6 sm:right-6 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4 sm:mb-6 pr-8">Promosikan Produk</h2>

                        <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4">
                            {/* Nama Produk - Full width */}
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-[var(--text-secondary)] mb-1.5 sm:mb-2">Nama Produk *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={(e) => {
                                        setForm({ ...form, title: e.target.value });
                                        // Clear error saat user mengetik
                                        if (errors.title) setErrors({ ...errors, title: "" });
                                    }}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] outline-none ${errors.title
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-[var(--border-color)] focus:border-blue-500"
                                        }`}
                                    placeholder="Contoh: Keripik Pisang Khas Cenrana"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-start">
                                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Kategori */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-[var(--text-secondary)] mb-1.5 sm:mb-2">Kategori *</label>
                                    <select
                                        required
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:border-blue-500 outline-none cursor-pointer"
                                    >
                                        <option value="Hasil Tani" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Hasil Tani</option>
                                        <option value="Produk UMKM" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Produk UMKM</option>
                                        <option value="Jasa Warga" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Jasa Warga / Lainnya</option>
                                        <option value="Barang Bekas" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Barang Bekas</option>
                                    </select>
                                </div>

                                {/* Harga dengan Auto-Format */}
                                <div>
                                    <label className="block text-xs sm:text-sm font-bold text-[var(--text-secondary)] mb-1.5 sm:mb-2">Harga *</label>
                                    <div className="flex gap-1.5 sm:gap-2">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold text-xs sm:text-sm pointer-events-none">Rp</span>
                                            <input
                                                type="text"
                                                required
                                                value={form.priceAmount ? form.priceAmount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                                onChange={(e) => {
                                                    const numbers = e.target.value.replace(/\D/g, '');
                                                    setForm({ ...form, priceAmount: numbers });
                                                    // Clear error saat user mengetik
                                                    if (errors.priceAmount) setErrors({ ...errors, priceAmount: "" });
                                                }}
                                                className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] outline-none ${errors.priceAmount
                                                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                    : "border-[var(--border-color)] focus:border-blue-500"
                                                    }`}
                                                placeholder="15.000"
                                            />
                                        </div>
                                        <select
                                            value={form.priceUnit}
                                            onChange={(e) => {
                                                setForm({ ...form, priceUnit: e.target.value });
                                                if (e.target.value !== 'Custom') {
                                                    setCustomUnit('');
                                                }
                                            }}
                                            className="px-2 sm:px-3 py-2.5 sm:py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] dark:text-white focus:border-blue-500 outline-none cursor-pointer text-xs sm:text-sm font-medium"
                                        >
                                            {priceUnits.map(unit => (
                                                <option key={unit} value={unit} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                                                    {unit === 'Custom' ? '✏️ Custom' : unit}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Error message untuk price */}
                                    {errors.priceAmount && (
                                        <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-start">
                                            <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                            {errors.priceAmount}
                                        </p>
                                    )}

                                    {/* Custom Unit Input */}
                                    {form.priceUnit === 'Custom' && (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                required
                                                value={customUnit}
                                                onChange={(e) => {
                                                    setCustomUnit(e.target.value);
                                                    // Clear error saat user mengetik
                                                    if (errors.customUnit) setErrors({ ...errors, customUnit: "" });
                                                }}
                                                className={`w-full px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] outline-none ${errors.customUnit
                                                    ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                                    : "border-emerald-500 focus:border-emerald-600"
                                                    }`}
                                                placeholder="Contoh: /tandan, /karung, /hari, dll"
                                            />
                                            {errors.customUnit ? (
                                                <p className="text-red-500 text-xs mt-1 flex items-start">
                                                    <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                                    {errors.customUnit}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">💡 Masukkan satuan custom Anda (dengan /)</p>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                                        Rp {form.priceAmount ? form.priceAmount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0'}
                                        {form.priceUnit === 'Custom' ? (customUnit || '/...') : form.priceUnit}
                                    </p>
                                </div>
                            </div>

                            {/* Nama Penjual */}
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-[var(--text-secondary)] mb-1.5 sm:mb-2">Nama Penjual / Toko *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.seller}
                                    onChange={(e) => {
                                        setForm({ ...form, seller: e.target.value });
                                        if (errors.seller) setErrors({ ...errors, seller: "" });
                                    }}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] outline-none ${errors.seller
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-[var(--border-color)] focus:border-blue-500"
                                        }`}
                                    placeholder="Nama Anda / Toko"
                                />
                                {errors.seller && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-start">
                                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                        {errors.seller}
                                    </p>
                                )}
                            </div>

                            {/* Nomor WhatsApp */}
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-[var(--text-secondary)] mb-1.5 sm:mb-2">Nomor WhatsApp *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.phone}
                                    onChange={(e) => {
                                        setForm({ ...form, phone: e.target.value });
                                        if (errors.phone) setErrors({ ...errors, phone: "" });
                                    }}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] outline-none ${errors.phone
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-[var(--border-color)] focus:border-blue-500"
                                        }`}
                                    placeholder="08123456789"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-start">
                                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Upload Foto dari Galeri */}
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-[var(--text-secondary)] mb-1.5 sm:mb-2">Foto Produk *</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    required={!imagePreview}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {!imagePreview ? (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-6 sm:py-8 rounded-xl border-2 border-dashed border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-panel)] transition-colors flex flex-col items-center justify-center gap-2"
                                    >
                                        <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--text-secondary)]" />
                                        <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">Upload Foto dari Galeri</span>
                                        <span className="text-[10px] sm:text-xs text-[var(--text-secondary)]">Max 5MB (JPG, PNG)</span>
                                    </button>
                                ) : (
                                    <div className="space-y-2 sm:space-y-3">
                                        {/* Image Preview - Show Cropped Result */}
                                        <div className="relative border-2 border-emerald-500 rounded-xl overflow-hidden bg-black">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-40 sm:h-48 object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-emerald-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold shadow-lg">
                                                ✓ Di-Crop
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-1.5 sm:gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-1 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                            >
                                                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Ganti Foto
                                            </button>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 sm:gap-2"
                                            >
                                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                Hapus
                                            </button>
                                        </div>

                                        <p className="text-[10px] sm:text-xs text-center text-emerald-600 dark:text-emerald-400 font-medium">
                                            ✓ Foto sudah di-crop dan siap digunakan
                                        </p>
                                    </div>
                                )}
                                {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-xs sm:text-sm font-bold text-[var(--text-secondary)] mb-1.5 sm:mb-2">Deskripsi Produk *</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={form.description}
                                    onChange={(e) => {
                                        setForm({ ...form, description: e.target.value });
                                        if (errors.description) setErrors({ ...errors, description: "" });
                                    }}
                                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl bg-[var(--bg-card)] border text-[var(--text-primary)] outline-none resize-none ${errors.description
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-[var(--border-color)] focus:border-blue-500"
                                        }`}
                                    placeholder="Jelaskan keunggulan produk Anda..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-start">
                                        <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Success Card - Compact */}
                            {showSuccessCard && (
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-600 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        {/* Icon Success */}
                                        <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-7 h-7 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-bold text-green-800 dark:text-green-300 mb-1">
                                                Produk Berhasil Diajukan!
                                            </h3>
                                            <p className="text-xs text-green-700 dark:text-green-400 mb-2">
                                                "{successProductId}" menunggu persetujuan admin
                                            </p>
                                            <p className="text-xs text-green-600 dark:text-green-500">
                                                💡 Modal akan otomatis tertutup dalam 3 detik
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}


                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 sm:py-4 text-white rounded-xl text-sm sm:text-base font-bold shadow-lg transition-all mt-4 sm:mt-6 flex items-center justify-center gap-2 ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-500"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                                        Mengirim...
                                    </>
                                ) : (
                                    "Ajukan Produk"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            {showDetailModal && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
                    <div className="bg-[var(--bg-panel)] rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto animate-slideUp">
                        <div className="relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="absolute top-3 right-3 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Product Image */}
                            <div className="relative w-full h-48 md:h-56 bg-gray-200 dark:bg-gray-800">
                                <Image
                                    src={selectedProduct.image || 'https://via.placeholder.com/600x400/cccccc/666666?text=No+Image'}
                                    alt={selectedProduct.title}
                                    fill
                                    className="object-cover rounded-t-2xl"
                                    unoptimized
                                />
                                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg">
                                    <p className="text-white text-xs font-bold flex items-center">
                                        <Tag className="w-3 h-3 mr-1.5" />
                                        {selectedProduct.category}
                                    </p>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="p-4">
                                <h2 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
                                    {selectedProduct.title}
                                </h2>

                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
                                    Dijual oleh: <span className="font-bold text-[var(--text-primary)] dark:text-white">{selectedProduct.seller}</span>
                                </p>

                                {/* Price */}
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 mb-4 border border-emerald-200 dark:border-emerald-700">
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-0.5">Harga</p>
                                    <p className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                        {selectedProduct.price}
                                    </p>
                                </div>

                                {/* Description */}
                                {selectedProduct.description && (
                                    <div className="mb-4">
                                        <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white mb-1.5">Deskripsi Produk</h3>
                                        <p className="text-sm text-gray-700 dark:text-white whitespace-pre-wrap leading-relaxed">
                                            {selectedProduct.description}
                                        </p>
                                    </div>
                                )}

                                {/* Contact Button */}
                                <a
                                    href={`https://wa.me/${selectedProduct.phone}?text=Halo, saya tertarik dengan produk *${selectedProduct.title}* seharga ${selectedProduct.price}. Apakah masih tersedia?`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold text-sm text-center flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    Hubungi via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Crop Modal - Professional Crop Tool */}
            {showImagePreviewModal && tempImagePreview && (
                <div className="fixed inset-0 z-[60] bg-black">
                    <div className="h-full flex flex-col">
                        {/* Top Bar */}
                        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-white/10">
                            <button
                                onClick={cancelImagePreview}
                                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                                <span className="text-sm font-medium">Batal</span>
                            </button>

                            <h3 className="text-white font-bold">Crop & Atur Foto</h3>

                            <button
                                onClick={confirmImage}
                                disabled={!croppedAreaPixels}
                                className="px-6 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Selesai
                            </button>
                        </div>

                        {/* Crop Area - Full Screen */}
                        <div className="flex-1 relative">
                            <Cropper
                                image={tempImagePreview}
                                crop={crop}
                                zoom={zoom}
                                rotation={imageRotation}
                                aspect={undefined}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                style={{
                                    containerStyle: {
                                        background: '#000'
                                    },
                                    cropAreaStyle: {
                                        border: '2px solid #10b981',
                                        color: 'rgba(16, 185, 129, 0.3)'
                                    }
                                }}
                            />
                        </div>

                        {/* Bottom Controls */}
                        <div className="bg-black/50 backdrop-blur-sm border-t border-white/10 p-4">
                            <div className="max-w-2xl mx-auto space-y-4">
                                {/* Zoom Control */}
                                <div className="flex items-center gap-4">
                                    <span className="text-white text-sm font-medium w-20">Zoom</span>
                                    <button
                                        onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                                        </svg>
                                    </button>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        step="0.1"
                                        value={zoom}
                                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((zoom - 1) / 2) * 100}%, #374151 ${((zoom - 1) / 2) * 100}%, #374151 100%)`
                                        }}
                                    />
                                    <button
                                        onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </button>
                                    <span className="text-white text-sm font-mono w-12 text-right">{Math.round(zoom * 100)}%</span>
                                </div>

                                {/* Toolbar */}
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={rotateImage}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Putar 90°
                                    </button>
                                    <button
                                        onClick={() => { setImageRotation(0); setCrop({ x: 0, y: 0 }); setZoom(1); }}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-sm transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Reset
                                    </button>
                                </div>

                                {/* Helper Text */}
                                <p className="text-center text-gray-400 text-xs">
                                    💡 Drag area hijau untuk crop, pinch/zoom untuk detail, putar untuk orientasi
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style jsx global>{`
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .animate-slideUp {
        animation: slideUp 0.3s ease-out;
    }
    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }
`}</style>
        </div>
    );
}

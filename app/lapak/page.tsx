"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Phone, Tag, Search, ShoppingBag, Plus, X, Trophy, ChevronLeft, ChevronRight, Upload, AlertCircle, CheckCircle, Clock, ArrowLeft, Store, Sparkles, Package, Zap, User, DollarSign, FileText, ImageIcon } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import Cropper from 'react-easy-crop';
import type { Area, Point } from 'react-easy-crop';
import { canSubmit, recordSubmit, getRemainingTime } from "@/lib/rateLimit";

export default function LapakWarga() {
    const { lapak, submitLapak, isLoading } = useAppContext();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [activeTab, setActiveTab] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
    const [showImagePreviewModal, setShowImagePreviewModal] = useState(false);
    const [imageRotation, setImageRotation] = useState(0);
    const [uploadError, setUploadError] = useState("");

    const [customUnit, setCustomUnit] = useState("");
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const [form, setForm] = useState({
        title: "", category: "Hasil Tani", priceAmount: "", priceUnit: "/bungkus",
        seller: "", phone: "", image: "", description: "",
    });

    const [errors, setErrors] = useState({ title: "", priceAmount: "", customUnit: "", seller: "", phone: "", description: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [successProductId, setSuccessProductId] = useState("");
    const [copied, setCopied] = useState(false);
    const [isOnCooldown, setIsOnCooldown] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);

    const priceUnits = ["/kg", "/liter", "/bungkus", "/pcs", "/buah", "/ikat", "/ekor", "/porsi", "/meter", "/jam", "Custom"];

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (isOnCooldown && remainingTime > 0) {
            const timer = setInterval(() => {
                const remaining = getRemainingTime('lapak');
                if (remaining <= 0) { setIsOnCooldown(false); setRemainingTime(0); }
                else { setRemainingTime(remaining); }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOnCooldown, remainingTime]);

    const categories = ["Semua", "Hasil Tani", "Produk UMKM", "Jasa Warga"];
    const safeLapak = Array.isArray(lapak) ? lapak : [];
    const activeLapak = safeLapak.filter(item => item && item.status === "Active");
    const filteredLapak = activeLapak.filter((item) => {
        const matchesCategory = activeTab === "Semua" || item.category === activeTab;
        const itemTitle = item.title || (item as any).name || "";
        const matchesSearch = itemTitle.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    const top5Items = activeLapak.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 5);

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
        if (!ctx) throw new Error('No 2d context');
        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));
        canvas.width = safeArea; canvas.height = safeArea;
        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);
        ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);
        const data = ctx.getImageData(0, 0, safeArea, safeArea);
        canvas.width = pixelCrop.width; canvas.height = pixelCrop.height;
        ctx.putImageData(data, Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x), Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y));
        return canvas.toDataURL('image/jpeg');
    };

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => { setCroppedAreaPixels(croppedAreaPixels); };

    const validateLapakForm = (): boolean => {
        const newErrors = { title: "", priceAmount: "", customUnit: "", seller: "", phone: "", description: "" };
        let isValid = true;
        if (!form.title.trim()) { newErrors.title = "Mohon isi nama produk"; isValid = false; }
        else if (form.title.trim().length < 3) { newErrors.title = "Nama produk minimal 3 karakter"; isValid = false; }
        if (!form.priceAmount || parseFloat(form.priceAmount) <= 0) { newErrors.priceAmount = "Mohon isi harga yang valid"; isValid = false; }
        if (form.priceUnit === 'Custom' && !customUnit.trim()) { newErrors.customUnit = "Mohon isi satuan harga custom"; isValid = false; }
        if (!form.seller.trim()) { newErrors.seller = "Mohon isi nama penjual"; isValid = false; }
        else if (form.seller.trim().length < 3) { newErrors.seller = "Nama penjual minimal 3 karakter"; isValid = false; }
        if (!form.phone.trim()) { newErrors.phone = "Mohon isi nomor WhatsApp"; isValid = false; }
        else { const cleanedPhone = form.phone.replace(/\D/g, ''); if (cleanedPhone.length < 10) { newErrors.phone = "Nomor WhatsApp minimal 10 digit"; isValid = false; } }
        if (!form.description.trim()) { newErrors.description = "Mohon isi deskripsi produk"; isValid = false; }
        else if (form.description.trim().length < 10) { newErrors.description = "Deskripsi produk minimal 10 karakter"; isValid = false; }
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit('lapak')) { const remaining = getRemainingTime('lapak'); setIsOnCooldown(true); setRemainingTime(remaining); return; }
        if (!validateLapakForm()) return;
        setIsSubmitting(true);
        try {
            const formatPhone = (phone: string): string => { let cleaned = phone.replace(/\D/g, ''); if (cleaned.startsWith('08')) { cleaned = '62' + cleaned.substring(1); } else if (cleaned.startsWith('8') && cleaned.length >= 10) { cleaned = '62' + cleaned; } else if (cleaned.startsWith('0')) { cleaned = '62' + cleaned.substring(1); } return cleaned; };
            const formatPriceDisplay = (value: string): string => { if (!value) return '0'; return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
            const formattedPhone = formatPhone(form.phone);
            const finalUnit = form.priceUnit === 'Custom' ? customUnit : form.priceUnit;
            const finalPrice = `Rp ${formatPriceDisplay(form.priceAmount)}${finalUnit}`;
            const productData = { ...form, price: finalPrice, phone: formattedPhone, image: imagePreview || form.image };
            await submitLapak(productData);
            recordSubmit('lapak');
            setSuccessProductId(form.title);
            setShowSuccessCard(true);
            setForm({ title: "", category: "Hasil Tani", priceAmount: "", priceUnit: "/bungkus", seller: "", phone: "", image: "", description: "" });
            setImagePreview(null);
            setCustomUnit('');
            setErrors({ title: "", priceAmount: "", customUnit: "", seller: "", phone: "", description: "" });
            setTimeout(() => { setShowSuccessCard(false); setShowModal(false); }, 3000);
        } catch (error) { console.error("Error submitting product:", error); }
        finally { setIsSubmitting(false); }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { setUploadError("File harus berupa gambar"); return; }
        if (file.size > 5 * 1024 * 1024) { setUploadError("Ukuran gambar maksimal 5MB"); return; }
        const reader = new FileReader();
        reader.onloadend = () => { const result = reader.result as string; setTempImagePreview(result); setImageRotation(0); setCrop({ x: 0, y: 0 }); setZoom(1); setShowImagePreviewModal(true); setUploadError(""); };
        reader.readAsDataURL(file);
    };

    const confirmImage = async () => {
        if (tempImagePreview && croppedAreaPixels) {
            try { const croppedImage = await getCroppedImg(tempImagePreview, croppedAreaPixels, imageRotation); setImagePreview(croppedImage); setForm({ ...form, image: croppedImage }); setShowImagePreviewModal(false); setTempImagePreview(null); setImageRotation(0); setCrop({ x: 0, y: 0 }); setZoom(1); setCroppedAreaPixels(null); }
            catch (e) { console.error(e); setUploadError("Gagal memotong gambar"); }
        }
    };

    const cancelImagePreview = () => { setShowImagePreviewModal(false); setTempImagePreview(null); setImageRotation(0); setCrop({ x: 0, y: 0 }); setZoom(1); setCroppedAreaPixels(null); if (fileInputRef.current) fileInputRef.current.value = ""; };
    const rotateImage = () => { setImageRotation((prev) => (prev + 90) % 360); };
    const removeImage = () => { setImagePreview(null); setForm({ ...form, image: "" }); if (fileInputRef.current) fileInputRef.current.value = ""; };
    const scroll = (direction: "left" | "right") => { if (scrollRef.current) { const scrollAmount = 280; if (direction === "left") scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" }); else scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" }); } };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="w-16 h-16 border-4 rounded-full animate-spin mb-4 mx-auto" style={{ borderColor: '#10B981', borderTopColor: 'transparent' }}></div>
                    <p className="text-lg font-bold text-[var(--text-secondary)]">Memuat data lapak...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-60 right-10 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-40 left-1/4 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Compact Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/" className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20">
                        <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                        Kembali
                    </Link>
                </motion.div>

                {/* Compact Hero Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Store className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-bold text-emerald-400">Marketplace Warga</span>
                        <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-black mb-2 text-[var(--text-primary)]">
                        Lapak{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Warga</span>
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto">
                        Dukung ekonomi lokal dengan membeli produk asli warga Desa Cenrana
                    </p>
                </motion.div>

                {/* Compact Top Products Carousel */}
                {top5Items.length > 0 && (
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <Trophy className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Produk Terbaru</h2>
                                    <p className="text-xs text-[var(--text-secondary)]">{top5Items.length} produk baru</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <motion.button
                                    onClick={() => scroll("left")}
                                    className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </motion.button>
                                <motion.button
                                    onClick={() => scroll("right")}
                                    className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-emerald-500/50 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory">
                            {top5Items.map((item, index) => {
                                const isInvalidImage = item.image?.includes("whatsapp") || item.image?.includes("wa.me");
                                const safeImage = isInvalidImage ? "https://images.unsplash.com/photo-1589923188900-85dae5233271?auto=format&fit=crop&w=800&q=80" : item.image;
                                return (
                                    <motion.div
                                        key={item.id}
                                        className="min-w-[240px] snap-center cursor-pointer group"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => { setSelectedProduct(item); setShowDetailModal(true); }}
                                        whileHover={{ scale: 1.02, y: -5 }}
                                    >
                                        <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                                            <div className="relative h-36">
                                                <Image src={safeImage || '/placeholder.jpg'} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">🔥 Terbaru</div>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="font-bold text-sm line-clamp-1 text-[var(--text-primary)] mb-1">{item.title}</h3>
                                                <p className="font-bold text-sm text-emerald-400">{item.price}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Compact Controls Bar */}
                <motion.div
                    className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Category Tabs */}
                    <div className="flex p-1 rounded-xl bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border-color)] overflow-x-auto max-w-full hide-scrollbar">
                        {categories.map((category) => (
                            <motion.button
                                key={category}
                                onClick={() => setActiveTab(category)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === category ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                    }`}
                                whileHover={{ scale: activeTab === category ? 1 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {activeTab === category && (
                                    <motion.div
                                        layoutId="activeCategory"
                                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg"
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{category}</span>
                            </motion.button>
                        ))}
                    </div>

                    <div className="flex gap-3 w-full lg:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 lg:w-56 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-emerald-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-primary)] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>

                        {/* Add Product Button */}
                        <motion.button
                            onClick={() => setShowModal(true)}
                            className="px-5 py-2.5 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 whitespace-nowrap relative overflow-hidden group"
                            whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)' }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <Plus className="w-4 h-4 relative z-10" />
                            <span className="relative z-10 hidden sm:inline">Promosikan</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Products Grid */}
                {filteredLapak.length > 0 ? (
                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {filteredLapak.map((item, index) => {
                            const isInvalidImage = item.image?.includes("whatsapp") || item.image?.includes("wa.me");
                            const safeImage = isInvalidImage ? "https://images.unsplash.com/photo-1589923188900-85dae5233271?auto=format&fit=crop&w=800&q=80" : item.image;
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group cursor-pointer"
                                    onClick={() => { setSelectedProduct(item); setShowDetailModal(true); }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-lg hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                                        <div className="relative aspect-square overflow-hidden bg-[var(--bg-panel)]">
                                            <Image src={safeImage || '/placeholder.jpg'} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1 bg-black/60 text-white backdrop-blur-sm">
                                                <Tag className="w-2.5 h-2.5" />{item.category}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-bold text-sm line-clamp-2 mb-1 text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                                            <p className="text-[10px] mb-2 text-[var(--text-secondary)]">oleh {item.seller}</p>
                                            <p className="font-bold text-sm mb-2 text-emerald-400">{item.price}</p>
                                            <a
                                                href={`https://wa.me/${item.phone}?text=Halo, saya tertarik dengan produk ${item.title} di Lapak Desa Cenrana.`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center transition-all bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                                            >
                                                <Phone className="w-3 h-3 mr-1.5" /> Hubungi
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-16 rounded-2xl bg-[var(--bg-card)]/50 border border-dashed border-[var(--border-color)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-16 h-16 rounded-full bg-[var(--bg-panel)] flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-8 h-8 text-[var(--text-secondary)]/40" />
                        </div>
                        <h3 className="text-lg font-bold mb-1 text-[var(--text-primary)]">Produk tidak ditemukan</h3>
                        <p className="text-sm text-[var(--text-secondary)]">Coba kata kunci lain atau kategori berbeda</p>
                    </motion.div>
                )}
            </div>

            {/* Premium Submission Modal */}
            {showModal && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="w-full max-w-lg rounded-2xl relative max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {/* Gradient Top Bar */}
                        <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

                        <div className="p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Promosikan Produk</h2>
                                        <p className="text-xs text-[var(--text-secondary)]">Isi form dengan lengkap</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                {/* Product Name */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                                        <Package className="w-3.5 h-3.5 text-emerald-400" />
                                        Nama Produk *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => { setForm({ ...form, title: e.target.value }); if (errors.title) setErrors({ ...errors, title: "" }); }}
                                        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] focus:border-emerald-500"
                                        style={{ borderColor: errors.title ? '#EF4444' : 'var(--border-color)' }}
                                        placeholder="Contoh: Keripik Pisang Khas Cenrana"
                                    />
                                    {errors.title && <p className="text-xs mt-1 text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Category */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                                            <Tag className="w-3.5 h-3.5 text-blue-400" />
                                            Kategori
                                        </label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none cursor-pointer bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-primary)] focus:border-blue-500"
                                        >
                                            <option value="Hasil Tani">🌾 Hasil Tani</option>
                                            <option value="Produk UMKM">🏭 Produk UMKM</option>
                                            <option value="Jasa Warga">🔧 Jasa Warga</option>
                                            <option value="Barang Bekas">📦 Barang Bekas</option>
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                                            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                                            Harga *
                                        </label>
                                        <div className="flex gap-1.5">
                                            <div className="relative flex-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-secondary)]">Rp</span>
                                                <input
                                                    type="text"
                                                    value={form.priceAmount ? form.priceAmount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                                    onChange={(e) => { const numbers = e.target.value.replace(/\D/g, ''); setForm({ ...form, priceAmount: numbers }); if (errors.priceAmount) setErrors({ ...errors, priceAmount: "" }); }}
                                                    className="w-full pl-9 pr-2 py-2.5 text-sm rounded-xl outline-none bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] focus:border-amber-500"
                                                    style={{ borderColor: errors.priceAmount ? '#EF4444' : 'var(--border-color)' }}
                                                    placeholder="15.000"
                                                />
                                            </div>
                                            <select
                                                value={form.priceUnit}
                                                onChange={(e) => { setForm({ ...form, priceUnit: e.target.value }); if (e.target.value !== 'Custom') setCustomUnit(''); }}
                                                className="px-2 py-2.5 rounded-xl text-xs font-medium cursor-pointer bg-[var(--bg-panel)] border-2 border-[var(--border-color)] text-[var(--text-primary)]"
                                            >
                                                {priceUnits.map(unit => (<option key={unit} value={unit}>{unit === 'Custom' ? '✏️' : unit}</option>))}
                                            </select>
                                        </div>
                                        {errors.priceAmount && <p className="text-xs mt-1 text-red-400">{errors.priceAmount}</p>}
                                        {form.priceUnit === 'Custom' && (
                                            <input
                                                type="text"
                                                value={customUnit}
                                                onChange={(e) => { setCustomUnit(e.target.value); if (errors.customUnit) setErrors({ ...errors, customUnit: "" }); }}
                                                className="w-full px-3 py-2 mt-2 text-sm rounded-lg outline-none bg-[var(--bg-panel)] border-2 border-emerald-500/50 text-[var(--text-primary)]"
                                                placeholder="/tandan, /karung, dll"
                                            />
                                        )}
                                        <p className="text-[10px] mt-1 font-semibold text-emerald-400">Preview: Rp {form.priceAmount ? form.priceAmount.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0'}{form.priceUnit === 'Custom' ? (customUnit || '/...') : form.priceUnit}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {/* Seller */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                                            <User className="w-3.5 h-3.5 text-purple-400" />
                                            Nama Penjual *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.seller}
                                            onChange={(e) => { setForm({ ...form, seller: e.target.value }); if (errors.seller) setErrors({ ...errors, seller: "" }); }}
                                            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] focus:border-purple-500"
                                            style={{ borderColor: errors.seller ? '#EF4444' : 'var(--border-color)' }}
                                            placeholder="Nama Anda / Toko"
                                        />
                                        {errors.seller && <p className="text-xs mt-1 text-red-400">{errors.seller}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                                            <Phone className="w-3.5 h-3.5 text-green-400" />
                                            WhatsApp *
                                        </label>
                                        <input
                                            type="text"
                                            value={form.phone}
                                            onChange={(e) => { setForm({ ...form, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: "" }); }}
                                            className="w-full px-3 py-2.5 text-sm rounded-xl outline-none bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] focus:border-green-500"
                                            style={{ borderColor: errors.phone ? '#EF4444' : 'var(--border-color)' }}
                                            placeholder="08123456789"
                                        />
                                        {errors.phone && <p className="text-xs mt-1 text-red-400">{errors.phone}</p>}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                                        <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                                        Foto Produk *
                                    </label>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                    {!imagePreview ? (
                                        <motion.button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full px-4 py-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all bg-[var(--bg-panel)] border-[var(--border-color)] hover:border-emerald-500/50"
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <Upload className="w-8 h-8 text-[var(--text-secondary)]" />
                                            <span className="text-sm font-bold text-[var(--text-primary)]">Upload Foto</span>
                                            <span className="text-[10px] text-[var(--text-secondary)]">Max 5MB (JPG, PNG)</span>
                                        </motion.button>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500">
                                                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                                                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-emerald-500">✓ OK</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-500 to-cyan-500"><Upload className="w-3.5 h-3.5" />Ganti</button>
                                                <button type="button" onClick={removeImage} className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"><X className="w-3.5 h-3.5" /></button>
                                            </div>
                                        </div>
                                    )}
                                    {uploadError && <p className="text-xs mt-1 text-red-400">{uploadError}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] mb-1.5">
                                        <FileText className="w-3.5 h-3.5 text-teal-400" />
                                        Deskripsi Produk *
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.description}
                                        onChange={(e) => { setForm({ ...form, description: e.target.value }); if (errors.description) setErrors({ ...errors, description: "" }); }}
                                        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none resize-none bg-[var(--bg-panel)] border-2 text-[var(--text-primary)] focus:border-teal-500"
                                        style={{ borderColor: errors.description ? '#EF4444' : 'var(--border-color)' }}
                                        placeholder="Jelaskan keunggulan produk..."
                                    />
                                    {errors.description && <p className="text-xs mt-1 text-red-400">{errors.description}</p>}
                                </div>

                                {/* Cooldown */}
                                {isOnCooldown && remainingTime > 0 && (
                                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40">
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-amber-400">Tunggu {remainingTime}s</p>
                                                <div className="h-1.5 rounded-full overflow-hidden bg-amber-500/20 mt-1">
                                                    <div className="h-full bg-amber-500 transition-all" style={{ width: `${(remainingTime / 60) * 100}%` }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Success */}
                                {showSuccessCard && (
                                    <motion.div
                                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center animate-bounce">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-emerald-400">Berhasil!</p>
                                                <p className="text-xs text-emerald-300/70">"{successProductId}" menunggu persetujuan</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting || isOnCooldown}
                                    className="w-full py-3 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: isOnCooldown ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'linear-gradient(135deg, #10B981, #0EA5E9)', boxShadow: isSubmitting || isOnCooldown ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.3)' }}
                                    whileHover={{ scale: isSubmitting || isOnCooldown ? 1 : 1.02 }}
                                    whileTap={{ scale: isSubmitting || isOnCooldown ? 1 : 0.98 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <span className="relative z-10 flex items-center gap-2">
                                        {isOnCooldown ? (<><Clock className="w-4 h-4 animate-pulse" /> Tunggu {remainingTime}s</>)
                                            : isSubmitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengirim...</>)
                                                : (<><Zap className="w-4 h-4" /> Ajukan Produk</>)}
                                    </span>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Product Detail Modal */}
            {showDetailModal && selectedProduct && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-color)]"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                    >
                        <div className="relative">
                            <motion.button
                                onClick={() => setShowDetailModal(false)}
                                className="absolute top-3 right-3 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                whileHover={{ scale: 1.1 }}
                            >
                                <X className="w-4 h-4" />
                            </motion.button>
                            <div className="relative w-full h-48 bg-[var(--bg-panel)]">
                                <Image src={selectedProduct.image || 'https://via.placeholder.com/600x400'} alt={selectedProduct.title} fill className="object-cover" unoptimized />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-black/60 backdrop-blur-sm flex items-center gap-1">
                                    <Tag className="w-3 h-3" />{selectedProduct.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-1 text-[var(--text-primary)]">{selectedProduct.title}</h2>
                                <p className="text-xs mb-3 text-[var(--text-secondary)]">Dijual oleh: <span className="font-bold text-[var(--text-primary)]">{selectedProduct.seller}</span></p>
                                <div className="rounded-xl p-3 mb-4 bg-emerald-500/10 border border-emerald-500/30">
                                    <p className="text-[10px] mb-0.5 text-[var(--text-secondary)]">Harga</p>
                                    <p className="text-2xl font-black text-emerald-400">{selectedProduct.price}</p>
                                </div>
                                {selectedProduct.description && (
                                    <div className="mb-4">
                                        <h3 className="text-xs font-bold mb-1.5 text-[var(--text-secondary)]">Deskripsi</h3>
                                        <p className="text-sm whitespace-pre-wrap leading-relaxed text-[var(--text-primary)]">{selectedProduct.description}</p>
                                    </div>
                                )}
                                <motion.a
                                    href={`https://wa.me/${selectedProduct.phone}?text=Halo, saya tertarik dengan produk *${selectedProduct.title}* seharga ${selectedProduct.price}. Apakah masih tersedia?`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 text-white rounded-xl font-bold text-sm text-center flex items-center justify-center transition-all bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Phone className="w-4 h-4 mr-2" />Hubungi via WhatsApp
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Image Crop Modal */}
            {showImagePreviewModal && tempImagePreview && (
                <div className="fixed inset-0 z-[60] bg-black">
                    <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-sm border-b border-white/10">
                            <button onClick={cancelImagePreview} className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5" /><span className="text-sm font-medium">Batal</span></button>
                            <h3 className="text-white font-bold">Crop Foto</h3>
                            <button onClick={confirmImage} disabled={!croppedAreaPixels} className="px-6 py-2 text-white font-bold text-sm rounded-lg disabled:opacity-50 bg-gradient-to-r from-emerald-500 to-teal-500">Selesai</button>
                        </div>
                        <div className="flex-1 relative">
                            <Cropper image={tempImagePreview} crop={crop} zoom={zoom} rotation={imageRotation} aspect={undefined} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete}
                                style={{ containerStyle: { background: '#000' }, cropAreaStyle: { border: '2px solid #10b981', color: 'rgba(16, 185, 129, 0.3)' } }} />
                        </div>
                        <div className="bg-black/50 backdrop-blur-sm border-t border-white/10 p-4">
                            <div className="max-w-xl mx-auto space-y-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-white text-sm w-16">Zoom</span>
                                    <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                        style={{ background: `linear-gradient(to right, #10b981 0%, #10b981 ${((zoom - 1) / 2) * 100}%, #374151 ${((zoom - 1) / 2) * 100}%, #374151 100%)` }} />
                                    <span className="text-white text-sm font-mono w-12">{Math.round(zoom * 100)}%</span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <button onClick={rotateImage} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors">Putar 90°</button>
                                    <button onClick={() => { setImageRotation(0); setCrop({ x: 0, y: 0 }); setZoom(1); }} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm">Reset</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

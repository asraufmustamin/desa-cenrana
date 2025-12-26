/**
 * Constants
 * =========
 * 
 * Konstanta yang digunakan di seluruh aplikasi
 */

// ================================
// SITE INFO
// ================================

export const SITE_CONFIG = {
    name: "Desa Cenrana",
    fullName: "Sistem Informasi Desa Cenrana",
    tagline: "Desa Digital, Warga Berdaya",
    description: "Website Resmi Pemerintah Desa Cenrana - Layanan publik digital, aspirasi warga, lapak UMKM, dan informasi desa.",
    url: "https://desacenrana.id",
    locale: "id_ID",

    // Contact
    phone: "081234567890",
    whatsapp: "081234567890",
    email: "desacenrana@maros.go.id",

    // Address
    address: {
        village: "Cenrana",
        district: "Camba",
        regency: "Kabupaten Maros",
        province: "Sulawesi Selatan",
        postalCode: "90562",
        full: "Desa Cenrana, Kec. Camba, Kab. Maros, Sulawesi Selatan 90562",
    },

    // Social Media
    social: {
        facebook: "https://facebook.com/desacenrana",
        instagram: "https://instagram.com/desacenrana",
        youtube: "https://youtube.com/desacenrana",
    },
};

// ================================
// CATEGORIES
// ================================

export const ASPIRASI_CATEGORIES = [
    { value: "saran", label: "Saran" },
    { value: "kritik", label: "Kritik" },
    { value: "pengaduan", label: "Pengaduan" },
    { value: "pertanyaan", label: "Pertanyaan" },
    { value: "lainnya", label: "Lainnya" },
];

export const ASPIRASI_STATUS = [
    { value: "Pending", label: "Pending", color: "warning" },
    { value: "Diproses", label: "Diproses", color: "info" },
    { value: "Selesai", label: "Selesai", color: "success" },
    { value: "Ditolak", label: "Ditolak", color: "error" },
];

export const LAPAK_CATEGORIES = [
    { value: "makanan", label: "Makanan & Minuman" },
    { value: "kerajinan", label: "Kerajinan Tangan" },
    { value: "pertanian", label: "Hasil Pertanian" },
    { value: "peternakan", label: "Hasil Peternakan" },
    { value: "jasa", label: "Jasa" },
    { value: "lainnya", label: "Lainnya" },
];

export const SURAT_TYPES = [
    { value: "ktp", label: "Surat Pengantar KTP" },
    { value: "kk", label: "Surat Pengantar KK" },
    { value: "skck", label: "Surat Pengantar SKCK" },
    { value: "domisili", label: "Surat Keterangan Domisili" },
    { value: "tidak_mampu", label: "Surat Keterangan Tidak Mampu" },
    { value: "usaha", label: "Surat Keterangan Usaha" },
    { value: "kematian", label: "Surat Keterangan Kematian" },
    { value: "kelahiran", label: "Surat Keterangan Kelahiran" },
    { value: "pindah", label: "Surat Pindah" },
    { value: "lainnya", label: "Surat Lainnya" },
];

export const BERITA_CATEGORIES = [
    { value: "pengumuman", label: "Pengumuman" },
    { value: "kegiatan", label: "Kegiatan" },
    { value: "pembangunan", label: "Pembangunan" },
    { value: "sosial", label: "Sosial" },
    { value: "kesehatan", label: "Kesehatan" },
    { value: "pendidikan", label: "Pendidikan" },
    { value: "lainnya", label: "Lainnya" },
];

// ================================
// DUSUN DATA
// ================================

export const DUSUN_LIST = [
    { value: "cenrana", label: "Dusun Cenrana" },
    { value: "mattampapole", label: "Dusun Mattampapole" },
    { value: "bontoa", label: "Dusun Bonto'a" },
    { value: "lainnya", label: "Lainnya" },
];

export const AGAMA_LIST = [
    { value: "islam", label: "Islam" },
    { value: "kristen", label: "Kristen" },
    { value: "katolik", label: "Katolik" },
    { value: "hindu", label: "Hindu" },
    { value: "buddha", label: "Buddha" },
    { value: "konghucu", label: "Konghucu" },
];

export const PENDIDIKAN_LIST = [
    { value: "tidak_sekolah", label: "Tidak Sekolah" },
    { value: "sd", label: "SD/Sederajat" },
    { value: "smp", label: "SMP/Sederajat" },
    { value: "sma", label: "SMA/Sederajat" },
    { value: "d1", label: "D1" },
    { value: "d2", label: "D2" },
    { value: "d3", label: "D3" },
    { value: "s1", label: "S1" },
    { value: "s2", label: "S2" },
    { value: "s3", label: "S3" },
];

export const PEKERJAAN_LIST = [
    { value: "tidak_bekerja", label: "Tidak Bekerja" },
    { value: "petani", label: "Petani" },
    { value: "nelayan", label: "Nelayan" },
    { value: "buruh", label: "Buruh" },
    { value: "pedagang", label: "Pedagang" },
    { value: "wiraswasta", label: "Wiraswasta" },
    { value: "pns", label: "PNS" },
    { value: "tni_polri", label: "TNI/POLRI" },
    { value: "karyawan", label: "Karyawan Swasta" },
    { value: "guru", label: "Guru/Dosen" },
    { value: "pelajar", label: "Pelajar/Mahasiswa" },
    { value: "ibu_rumah_tangga", label: "Ibu Rumah Tangga" },
    { value: "pensiunan", label: "Pensiunan" },
    { value: "lainnya", label: "Lainnya" },
];

export const STATUS_PERNIKAHAN = [
    { value: "belum_kawin", label: "Belum Kawin" },
    { value: "kawin", label: "Kawin" },
    { value: "cerai_hidup", label: "Cerai Hidup" },
    { value: "cerai_mati", label: "Cerai Mati" },
];

// ================================
// UI CONSTANTS
// ================================

export const ITEMS_PER_PAGE = 12;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const GRADIENTS = {
    primary: "from-emerald-500 to-cyan-500",
    secondary: "from-purple-500 to-pink-500",
    warning: "from-amber-500 to-orange-500",
    danger: "from-red-500 to-pink-500",
    info: "from-blue-500 to-cyan-500",
    success: "from-emerald-500 to-green-500",
};

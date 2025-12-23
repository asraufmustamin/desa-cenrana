/**
 * Default CMS Content (Fallback)
 * Dipindahkan dari AppContext.tsx untuk modularitas
 */

import { CMSContent } from "./types";

export const defaultCMSContent: CMSContent = {
    home: {
        heroTitle: "Desa Cenrana",
        heroSubtitle: "Mewujudkan desa yang mandiri, sejahtera, dan berbudaya melalui pelayanan publik yang transparan dan inovatif.",
        heroDesc: "Pusat informasi dan layanan digital untuk warga Desa Cenrana.",
        statsLabel1: "Penduduk", statsVal1: "3,500+",
        statsLabel2: "Kepala Keluarga", statsVal2: "850",
        statsLabel3: "Dusun", statsVal3: "4",
        statsLabel4: "Luas Wilayah", statsVal4: "12 km²",
        statsLabel5: "UMKM", statsVal5: "45+",
        statsLabel6: "Indeks Desa", statsVal6: "Maju",
    },
    footer: {
        brandName: "Desa Cenrana",
        brandDesc: "Website resmi Pemerintah Desa Cenrana, Kabupaten Maros.",
        address: "Jl. AB Situru Dusun Benteng, Kec. Camba, Kab. Maros, Sulawesi Selatan",
        phone: "+62 812-3456-7890",
        email: "admin@desacenrana.id",
        copyright: "© 2026 Pemerintah Desa Cenrana. All rights reserved.",
    },
    navbar: {
        brandName: "Desa Cenrana",
    },
    profil: {
        historyTitle: "Sejarah Desa Cenrana",
        historyText: "Desa Cenrana memiliki sejarah panjang yang berakar dari nilai-nilai gotong royong dan kearifan lokal. Didirikan pada tahun 1950-an, desa ini awalnya merupakan pemukiman kecil para petani yang kemudian berkembang menjadi pusat kegiatan ekonomi dan sosial di wilayah ini.",
        historyFullText: `Desa Cenrana memiliki sejarah panjang yang berakar dari nilai-nilai gotong royong dan kearifan lokal. Didirikan pada tahun 1950-an, desa ini awalnya merupakan pemukiman kecil para petani yang kemudian berkembang menjadi pusat kegiatan ekonomi dan sosial di wilayah ini.

**Awal Mula Pembentukan**

Sejarah Desa Cenrana tidak terlepas dari perjuangan para pendahulu yang datang ke wilayah ini dengan membawa semangat untuk membangun kehidupan yang lebih baik. Pada awalnya, wilayah ini adalah lahan pertanian yang luas dengan sistem irigasi tradisional yang dikelola secara komunal oleh para petani.

**Perkembangan Ekonomi**

Seiring berjalannya waktu, Desa Cenrana berkembang pesat menjadi sentra ekonomi lokal. Sektor pertanian menjadi pilar utama perekonomian desa, dengan hasil panen padi, jagung, dan palawija yang melimpah. Sistem gotong royong yang diterapkan dalam pengolahan lahan pertanian menjadi kunci keberhasilan produksi pertanian desa.

**Perubahan Administrasi**

Pada tahun 1970-an, Desa Cenrana resmi ditetapkan sebagai desa definitif dengan struktur pemerintahan yang terorganisir. Kepala Desa pertama yang dilantik membawa visi pembangunan infrastruktur dan peningkatan kesejahteraan masyarakat.

**Era Modernisasi**

Memasuki abad ke-21, Desa Cenrana mulai bertransformasi dengan pembangunan infrastruktur modern seperti jalan beraspal, jaringan listrik yang merata, dan akses internet. Pemerintah desa juga mulai menerapkan sistem administrasi digital untuk meningkatkan kualitas pelayanan publik.

**Warisan Budaya**

Hingga kini, Desa Cenrana tetap mempertahankan nilai-nilai budaya dan tradisi lokal. Berbagai upacara adat dan kegiatan keagamaan masih dijalankan dengan penuh hikmat, menjadi pengikat kuat antar generasi dan memperkuat identitas masyarakat desa.

**Tantangan dan Harapan Masa Depan**

Dengan semangat pembangunan berkelanjutan, Desa Cenrana terus berupaya meningkatkan kualitas hidup warganya melalui program-program pemberdayaan ekonomi, pendidikan, dan kesehatan. Visi untuk menjadi desa mandiri, sejahtera, dan berbudaya menjadi panduan dalam setiap langkah pembangunan yang dilakukan.`,
        historyBanner: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
        visionTitle: "Visi",
        visionText: "Terwujudnya Desa Cenrana yang Mandiri, Sejahtera, dan Berbudaya dengan Tata Kelola Pemerintahan yang Baik.",
        missionTitle: "Misi",
        missionList: [
            "Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel.",
            "Meningkatkan pembangunan infrastruktur dasar desa yang merata.",
            "Mengembangkan potensi ekonomi lokal berbasis pertanian dan UMKM.",
        ],
    },
    sambutan: {
        fotoKades: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='260'%3E%3Crect fill='%23e5e7eb' width='200' height='260'/%3E%3Cpath fill='%239ca3af' d='M100 110a35 35 0 1 0 0-70 35 35 0 0 0 0 70zm0 12c-40 0-72 24-72 54v6h144v-6c0-30-32-54-72-54z'/%3E%3C/svg%3E",
        namaKades: "H. Abdullah",
        isiSambutan: "Assalamu'alaikum Warahmatullahi Wabarakatuh.\n\nPuji syukur kita panjatkan kepada Allah SWT atas segala limpahan rahmat dan karunia-Nya. Selamat datang di Website Resmi Desa Cenrana.\n\nSebagai Kepala Desa, saya mengajak seluruh warga untuk bersama-sama membangun desa yang lebih maju, mandiri, dan sejahtera. Website ini hadir sebagai wujud komitmen kami dalam memberikan pelayanan publik yang transparan dan mudah diakses.\n\nMari kita jaga kebersamaan dan gotong royong sebagai modal utama pembangunan desa. Semoga Allah SWT senantiasa memberikan keberkahan dalam setiap langkah kita.\n\nWassalamu'alaikum Warahmatullahi Wabarakatuh."
    },
    transparansi: {
        title: "Transparansi Anggaran 2024",
        items: [
            { label: "Pendapatan Asli Desa", target: "150000000", realization: "125000000", percentage: "83" },
            { label: "Dana Desa", target: "1200000000", realization: "1200000000", percentage: "100" },
            { label: "Bagi Hasil Pajak & Retribusi", target: "45000000", realization: "40000000", percentage: "88" },
            { label: "Belanja Pegawai", target: "350000000", realization: "320000000", percentage: "91" },
            { label: "Pembangunan Infrastruktur", target: "800000000", realization: "750000000", percentage: "93" },
        ],
        budget: {
            pendapatan: { target: 1500000000, realisasi: 1250000000 },
            belanja: { target: 1500000000, realisasi: 1100000000 }
        }
    },
    officials: [
        { id: 1, name: "H. Abdullah", role: "Kepala Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 2, name: "Siti Aminah", role: "Sekretaris Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 3, name: "Budi Santoso", role: "Kaur Keuangan", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 4, name: "Rina Wati", role: "Kaur Umum", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
        { id: 5, name: "Ahmad Rizki", role: "Kepala Dusun Benteng", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23e5e7eb' width='200' height='200'/%3E%3Cpath fill='%239ca3af' d='M100 100a30 30 0 1 0 0-60 30 30 0 0 0 0 60zm0 10c-33 0-60 20-60 45v5h120v-5c0-25-27-45-60-45z'/%3E%3C/svg%3E" },
    ],
    sotk_new: {
        kades: { name: "H. Abdullah", role: "Kepala Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Cpath fill='%239ca3af' d='M200 200a60 60 0 1 0 0-120 60 60 0 0 0 0 120zm0 20c-66 0-120 40-120 90v10h240v-10c0-50-54-90-120-90z'/%3E%3C/svg%3E" },
        sekdes: { name: "Siti Aminah", role: "Sekretaris Desa", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e5e7eb' width='400' height='400'/%3E%3Cpath fill='%239ca3af' d='M200 200a60 60 0 1 0 0-120 60 60 0 0 0 0 120zm0 20c-66 0-120 40-120 90v10h240v-10c0-50-54-90-120-90z'/%3E%3C/svg%3E" },
        kaur: [
            { name: "Budi Santoso", role: "Kaur Keuangan", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Rina Wati", role: "Kaur Umum", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Joko Susilo", role: "Kaur Perencanaan", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
        ],
        kadus: [
            { name: "Ahmad Rizki", role: "Kadus Benteng", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Dewi Sartika", role: "Kadus Cemara", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
            { name: "Bambang Pamungkas", role: "Kadus Melati", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e5e7eb' width='300' height='300'/%3E%3Cpath fill='%239ca3af' d='M150 150a45 45 0 1 0 0-90 45 45 0 0 0 0 90zm0 15c-50 0-90 30-90 67.5v7.5h180v-7.5c0-37.5-40-67.5-90-67.5z'/%3E%3C/svg%3E" },
        ]
    },
    programs: [
        { id: 1, title: "Pembangunan Jalan Tani", status: "Berjalan", description: "Pembangunan jalan tani sepanjang 2km di Dusun Benteng untuk memudahkan akses petani.", icon: "Road" },
        { id: 2, title: "Pelatihan Digital UMKM", status: "Selesai", description: "Pelatihan pemasaran digital bagi pelaku UMKM desa untuk meningkatkan jangkauan pasar.", icon: "Laptop" },
        { id: 3, title: "Renovasi Posyandu", status: "Rencana", description: "Rencana renovasi dan penambahan fasilitas kesehatan untuk Posyandu Melati.", icon: "HeartPulse" },
    ],
    gallery: [
        { id: 1, title: "Panen Raya Padi", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=400" },
        { id: 2, title: "Musyawarah Desa", image: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=400" },
        { id: 3, title: "Gotong Royong", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400" },
        { id: 4, title: "Pemandangan Sawah", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400" },
        { id: 5, title: "Kegiatan PKK", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400" },
    ],
    peta: {
        batasUtara: "Desa Labuaja",
        batasSelatan: "Desa Limapoccoe",
        batasBarat: "Kecamatan Bantimurung",
        batasTimur: "Hutan Lindung",
        luasWilayah: "12.5",
        alamatKantor: "Jl. Poros Cenrana No. 123, Kec. Cenrana",
        koordinat: "-4.9666667, 119.7289895",
        jarakKabupaten: "35 km"
    },
    infografis: {
        gender: [
            { name: "Laki-laki", value: 1250, fill: "#3b82f6" },
            { name: "Perempuan", value: 1180, fill: "#ec4899" }
        ],
        education: [
            { name: "SD", value: 450, fill: "#f59e0b" },
            { name: "SMP", value: 380, fill: "#10b981" },
            { name: "SMA", value: 520, fill: "#3b82f6" },
            { name: "S1/D3", value: 210, fill: "#8b5cf6" }
        ],
        job: [
            { name: "Petani", value: 600, fill: "#10b981" },
            { name: "Pedagang", value: 150, fill: "#f59e0b" },
            { name: "PNS/TNI/Polri", value: 80, fill: "#3b82f6" },
            { name: "Wiraswasta", value: 200, fill: "#8b5cf6" },
            { name: "Lainnya", value: 120, fill: "#64748b" }
        ]
    },
    hukum: [
        { id: 1, jenis: "Perdes", nomor: "01", tahun: "2024", judul: "Anggaran Pendapatan dan Belanja Desa Tahun 2024", downloadUrl: "#" },
        { id: 2, jenis: "SK Kades", nomor: "05", tahun: "2024", judul: "Pembentukan Tim Pelaksana Kegiatan Pembangunan Desa", downloadUrl: "#" },
        { id: 3, jenis: "Perdes", nomor: "03", tahun: "2023", judul: "Rencana Pembangunan Jangka Menengah Desa (RPJMDes) 2023-2029", downloadUrl: "#" }
    ],
    agenda: [
        { id: 1, title: "Musyawarah Perencanaan Pembangunan (Musrenbang)", date: "2024-02-15", time: "09:00 WITA", location: "Aula Kantor Desa", description: "Pembahasan prioritas pembangunan desa tahun anggaran 2025." },
        { id: 2, title: "Posyandu Balita & Lansia", date: "2024-02-20", time: "08:00 WITA", location: "Posyandu Melati", description: "Pemeriksaan kesehatan rutin untuk balita dan lansia." },
        { id: 3, title: "Kerja Bakti Lingkungan", date: "2024-02-25", time: "07:00 WITA", location: "Dusun Benteng", description: "Membersihkan saluran irigasi dan jalan desa." }
    ],
    pengumuman: [
        { id: 1, text: "📢 Pendaftaran BLT Desa tahun 2025 dibuka mulai 15 Januari", active: true },
        { id: 2, text: "🏥 Jadwal Posyandu bulan ini: Setiap Kamis minggu pertama", active: true },
        { id: 3, text: "🎉 Peringatan HUT RI ke-80 akan diadakan di Lapangan Desa", active: true },
        { id: 4, text: "📝 Pengurusan surat-menyurat buka Senin-Jumat 08:00-15:00", active: true }
    ],
};

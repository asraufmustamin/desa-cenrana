-- SEED DATA: EXTENDED SURAT TYPES
-- Menambahkan daftar lengkap surat administrasi desa

INSERT INTO surat_types (kode, nama, deskripsi, icon, syarat, fields) VALUES
-- 1. KELOMPOK UMUM & USAHA (Sudah ada SKU, SKD, SKTM di script awal, ini pelengkap/overwrite)
(
    'SKU', 
    'Surat Keterangan Usaha', 
    'Untuk keperluan administrasi perbankan atau izin usaha mikro.',
    'Store',
    '["Foto KTP Asli", "Foto Tempat Usaha"]',
    '[{"name": "nama_usaha", "label": "Nama Usaha", "type": "text", "required": true}, {"name": "jenis_usaha", "label": "Jenis Usaha", "type": "text", "required": true}, {"name": "alamat_usaha", "label": "Alamat Tempat Usaha", "type": "textarea", "required": true}, {"name": "tahun_berdiri", "label": "Tahun Berdiri", "type": "number", "required": true}]'
),
(
    'SKD',
    'Surat Keterangan Domisili',
    'Untuk keperluan administrasi kependudukan atau pendaftaran sekolah.',
    'MapPin',
    '["Foto KTP Asli", "Foto KK Asli"]',
    '[{"name": "keperluan", "label": "Keperluan Surat", "type": "textarea", "required": true}, {"name": "alamat_asal", "label": "Alamat Asal (Sesuai KTP)", "type": "textarea", "required": false}]'
),
(
    'SKTM',
    'Surat Keterangan Tidak Mampu',
    'Untuk pengajuan beasiswa, bantuan kesehatan, atau bantuan sosial.',
    'HeartHandshake',
    '["Foto KTP Asli", "Foto KK Asli", "Foto Rumah Tampak Depan"]',
    '[{"name": "keperluan", "label": "Keperluan Surat", "type": "text", "required": true}, {"name": "pekerjaan_ayah", "label": "Pekerjaan Kepala Keluarga", "type": "text", "required": true}, {"name": "penghasilan", "label": "Penghasilan Rata-rata per Bulan", "type": "number", "required": true}]'
),
(
    'SKCK_PENGANTAR',
    'Pengantar SKCK',
    'Surat pengantar ke Polsek untuk pembuatan SKCK (Melamar Kerja/Daftar CPNS).',
    'ShieldCheck',
    '["Foto KTP Asli", "Foto KK Asli"]',
    '[{"name": "keperluan", "label": "Keperluan Pembuatan SKCK", "type": "text", "placeholder": "Contoh: Melamar Pekerjaan di PT...", "required": true}]'
),
(
    'SK_BELUM_NIKAH',
    'Surat Keterangan Belum Menikah',
    'Menyatakan status belum kawin untuk syarat melamar kerja atau daftar TNI/Polri.',
    'UserX',
    '["Foto KTP Asli", "Foto KK Asli"]',
    '[{"name": "keperluan", "label": "Keperluan Surat", "type": "text", "required": true}]'
),
(
    'SK_PENGHASILAN',
    'Surat Keterangan Penghasilan',
    'Pengganti slip gaji untuk wiraswasta/petani/buruh harian.',
    'Banknote',
    '["Foto KTP Asli", "Foto KK Asli"]',
    '[{"name": "pekerjaan", "label": "Pekerjaan Saat Ini", "type": "text", "required": true}, {"name": "penghasilan", "label": "Penghasilan Rata-rata (Rp)", "type": "number", "required": true}, {"name": "tanggungan", "label": "Jumlah Tanggungan Keluarga", "type": "number", "required": true}]'
),

-- 2. ADMINDUK (Kependudukan)
(
    'SK_KELAHIRAN',
    'Surat Keterangan Kelahiran',
    'Untuk pengurusan Akta Kelahiran bayi baru lahir.',
    'Baby',
    '["Foto KTP Ayah & Ibu", "Foto KK", "Surat Keterangan Bidan/RS"]',
    '[{"name": "nama_bayi", "label": "Nama Bayi", "type": "text", "required": true}, {"name": "tgl_lahir", "label": "Tanggal Lahir", "type": "date", "required": true}, {"name": "jam_lahir", "label": "Jam Lahir", "type": "time", "required": true}, {"name": "bb_bayi", "label": "Berat Badan (kg)", "type": "number", "required": true}, {"name": "nama_ayah", "label": "Nama Ayah", "type": "text", "required": true}, {"name": "nama_ibu", "label": "Nama Ibu", "type": "text", "required": true}]'
),
(
    'SK_KEMATIAN',
    'Surat Keterangan Kematian',
    'Untuk pengurusan Akta Kematian dan warisan.',
    'Cross',
    '["Foto KTP Almarhum", "Foto KK", "KTP Pelapor"]',
    '[{"name": "nama_alm", "label": "Nama Almarhum/Almarhumah", "type": "text", "required": true}, {"name": "nik_alm", "label": "NIK Almarhum", "type": "text", "required": true}, {"name": "tgl_meninggal", "label": "Tanggal Meninggal", "type": "date", "required": true}, {"name": "sebab", "label": "Sebab Meninggal", "type": "text", "required": true}, {"name": "tempat_pemakaman", "label": "Tempat Pemakaman", "type": "text", "required": true}]'
),
(
    'SK_BEDA_NAMA',
    'Surat Keterangan Beda Nama',
    'Jika terjadi kesalahan penulisan nama di KTP/Ijazah/Buku Tabungan.',
    'FileSignature',
    '["Foto KTP", "Foto KK", "Dokumen Pendukung (Ijazah/Buku Tabungan)"]',
    '[{"name": "nama_salah", "label": "Penulisan Nama yang SALAH", "type": "text", "required": true}, {"name": "dokumen_salah", "label": "Terdapat pada Dokumen", "type": "text", "placeholder": "Contoh: Ijazah SD", "required": true}, {"name": "nama_benar", "label": "Penulisan Nama yang BENAR", "type": "text", "required": true}, {"name": "dokumen_benar", "label": "Sesuai Dokumen", "type": "text", "placeholder": "Contoh: KTP / Akta Kelahiran", "required": true}]'
),
(
    'SP_PINDAH',
    'Surat Pengantar Pindah Penduduk',
    'Pengantar untuk pindah domisili keluar desa/kabupaten.',
    'Truck',
    '["Foto KTP", "Foto KK"]',
    '[{"name": "alasan_pindah", "label": "Alasan Pindah", "type": "text", "required": true}, {"name": "alamat_tujuan", "label": "Alamat Tujuan Lengkap", "type": "textarea", "required": true}, {"name": "jumlah_keluarga", "label": "Jumlah Anggota Keluarga yang Pindah", "type": "number", "required": true}]'
),

-- 3. LAIN-LAIN
(
    'SK_JANDA_DUDA',
    'Surat Keterangan Janda/Duda',
    'Menyatakan status pernikahan (Cerai Mati/Hidup).',
    'UserMinus',
    '["Foto KTP", "Foto KK", "Surat Kematian/Cerai Pasangan"]',
    '[{"name": "status", "label": "Status", "type": "select", "options": ["Janda", "Duda"], "required": true}, {"name": "nama_pasangan", "label": "Nama Mantan Suami/Istri", "type": "text", "required": true}, {"name": "keperluan", "label": "Keperluan Surat", "type": "text", "required": true}]'
),
(
    'SK_HILANG',
    'Surat Keterangan Kehilangan',
    'Pengantar laporan kehilangan ke kepolisian.',
    'Search',
    '["Foto KTP (Jika ada)", "Foto KK"]',
    '[{"name": "barang_hilang", "label": "Barang/Dokumen yang Hilang", "type": "text", "required": true}, {"name": "lokasi_hilang", "label": "Perkiraan Lokasi Hilang", "type": "text", "required": true}, {"name": "waktu_hilang", "label": "Perkiraan Waktu Hilang", "type": "text", "required": true}]'
),
(
    'IZIN_KERAMAIAN',
    'Surat Izin Keramaian',
    'Untuk mengadakan hajatan pernikahan, pesta, atau acara besar.',
    'PartyPopper',
    '["Foto KTP Penanggung Jawab"]',
    '[{"name": "nama_acara", "label": "Nama Acara", "type": "text", "required": true}, {"name": "tgl_acara", "label": "Tanggal Acara", "type": "date", "required": true}, {"name": "waktu_acara", "label": "Waktu Pelaksanaan (Jam)", "type": "text", "required": true}, {"name": "lokasi", "label": "Lokasi Acara", "type": "text", "required": true}, {"name": "hiburan", "label": "Hiburan (Jika ada)", "type": "text", "required": false}]'
),
(
    'SK_TANAH_HARGA',
    'Surat Keterangan Taksiran Harga Tanah',
    'Biasanya untuk jaminan pinjaman bank.',
    'Landplot',
    '["Foto KTP", "Fotocopy Sertifikat/SPPT PBB"]',
    '[{"name": "lokasi_tanah", "label": "Lokasi Tanah / NOP PBB", "type": "textarea", "required": true}, {"name": "luas_tanah", "label": "Luas Tanah (m2)", "type": "number", "required": true}, {"name": "taksiran", "label": "Perkiraan Harga per Meter", "type": "number", "required": true}]'
)

ON CONFLICT (kode) 
DO UPDATE SET 
    nama = EXCLUDED.nama,
    deskripsi = EXCLUDED.deskripsi,
    icon = EXCLUDED.icon,
    syarat = EXCLUDED.syarat,
    fields = EXCLUDED.fields;

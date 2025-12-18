-- Create tables for Layanan Surat Online (E-Surat)

-- 1. Master Data Jenis Surat
CREATE TABLE IF NOT EXISTS surat_types (
    id SERIAL PRIMARY KEY,
    kode TEXT NOT NULL UNIQUE,  -- e.g., 'SKU', 'SKD', 'SKTM'
    nama TEXT NOT NULL,         -- e.g., 'Surat Keterangan Usaha'
    deskripsi TEXT,             -- e.g., 'Untuk keperluan izin usaha mikro'
    icon TEXT,                  -- e.g., 'Store', 'MapPin' (Lucide icon names)
    syarat JSONB,               -- e.g., ["Foto KTP", "Bukti Pelunasan PBB"]
    fields JSONB,               -- e.g., [{"name": "nama_usaha", "label": "Nama Usaha", "type": "text"}]
    template_path TEXT,         -- e.g., '/templates/sku.pdf' (optional if generating dynamically)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Transaksi Request Surat
CREATE TABLE IF NOT EXISTS surat_requests (
    id SERIAL PRIMARY KEY,
    tracking_id TEXT NOT NULL UNIQUE, -- e.g., 'REQ-88129'
    nik TEXT NOT NULL,                -- Validated against penduduk table
    nama TEXT NOT NULL,
    jenis_surat_id INTEGER REFERENCES surat_types(id),
    status TEXT DEFAULT 'Pending',    -- 'Pending', 'Diproses', 'Selesai', 'Ditolak'
    data JSONB DEFAULT '{}',          -- Stores dynamic form data (nama_usaha, etc.)
    lampiran JSONB DEFAULT '[]',      -- Stores URLs of uploaded files
    keterangan TEXT,                  -- Admin notes (e.g., rejection reason)
    nomor_surat TEXT,                 -- Generated upon approval
    file_pdf_url TEXT,                -- Final signed PDF URL (optional)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS Policies (Row Level Security)
ALTER TABLE surat_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE surat_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read for surat_types (User needs to see available letters)
CREATE POLICY "Public can view surat types" ON surat_types FOR SELECT USING (true);

-- Allow public insert for requests (Warga submits request)
CREATE POLICY "Public can insert requests" ON surat_requests FOR INSERT WITH CHECK (true);

-- Allow public read requests by tracking_id (For tracking page)
CREATE POLICY "Public can view own request" ON surat_requests FOR SELECT USING (true); 

-- Allow full access for admins (Ideally restricted by role, but assuming public/anon for now simplified like other tables)
-- In a real app, strict RLS based on auth.uid() is needed. Here we keep it open for the 'admin' dashboard which uses the same anon key in client-side for now or service role.
-- To keep it simple and consistent with existing app patterns:
CREATE POLICY "Admin full access requests" ON surat_requests FOR ALL USING (true);

-- 4. Seed Data (Dummy Surat Types)
INSERT INTO surat_types (kode, nama, deskripsi, icon, syarat, fields) VALUES
(
    'SKU', 
    'Surat Keterangan Usaha', 
    'Untuk keperluan administrasi perbankan atau izin usaha mikro.',
    'Store',
    '["Foto KTP Asli", "Foto Tempat Usaha"]',
    '[
        {"name": "nama_usaha", "label": "Nama Usaha", "type": "text", "placeholder": "Contoh: Warung Berkah", "required": true},
        {"name": "jenis_usaha", "label": "Jenis Usaha", "type": "text", "placeholder": "Contoh: Kelontong / Pertanian", "required": true},
        {"name": "alamat_usaha", "label": "Alamat Tempat Usaha", "type": "textarea", "placeholder": "Alamat lengkap lokasi usaha", "required": true},
        {"name": "tahun_berdiri", "label": "Tahun Berdiri", "type": "number", "placeholder": "2020", "required": true}
    ]'
),
(
    'SKD',
    'Surat Keterangan Domisili',
    'Untuk keperluan administrasi kependudukan atau pendaftaran sekolah.',
    'MapPin',
    '["Foto KTP Asli", "Foto KK Asli"]',
    '[
        {"name": "keperluan", "label": "Keperluan Surat", "type": "textarea", "placeholder": "Contoh: Mengurus pendaftaran sekolah anak", "required": true},
        {"name": "alamat_asal", "label": "Alamat Asal (Sesuai KTP)", "type": "textarea", "placeholder": "Isi jika alamat domisili berbeda dengan KTP", "required": false}
    ]'
),
(
    'SKTM',
    'Surat Keterangan Tidak Mampu',
    'Untuk pengajuan beasiswa, bantuan kesehatan, atau bantuan sosial.',
    'HeartHandshake',
    '["Foto KTP Asli", "Foto KK Asli", "Foto Rumah Tampak Depan"]',
    '[
        {"name": "keperluan", "label": "Keperluan Surat", "type": "text", "placeholder": "Contoh: Pengajuan KIP Kuliah", "required": true},
        {"name": "pekerjaan_ayah", "label": "Pekerjaan Kepala Keluarga", "type": "text", "placeholder": "Contoh: Buruh Tani", "required": true},
        {"name": "penghasilan", "label": "Penghasilan Rata-rata per Bulan", "type": "number", "placeholder": "500000", "required": true}
    ]'
)
ON CONFLICT (kode) DO NOTHING;

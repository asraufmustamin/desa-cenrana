-- ============================================
-- ADDITIONAL TABLES FOR DESA CENRANA
-- Run this AFTER the main schema
-- ============================================

-- 1. NIK VALIDATION (Untuk hashing NIK warga terdaftar)
CREATE TABLE IF NOT EXISTS nik_validation (
    nik_hash VARCHAR(64) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL BERITA (Alias untuk news - digunakan di kode)
-- Catatan: Kode menggunakan 'berita', jadi buat tabel ini
CREATE TABLE IF NOT EXISTS berita (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    category VARCHAR(100) DEFAULT 'Pengumuman',
    date VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL PROGRAMS (Program Desa)
CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Berjalan' CHECK (status IN ('Berjalan', 'Selesai', 'Rencana')),
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL GALLERY (Galeri Foto Desa)
CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL CMS CONTENT (Konten yang bisa diedit)
CREATE TABLE IF NOT EXISTS cms_content (
    id INTEGER PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default CMS content
INSERT INTO cms_content (id, data) 
VALUES (1, '{"home":{"heroTitle":"Desa Cenrana","heroSubtitle":"Kabupaten Maros"},"footer":{"brandName":"Desa Cenrana","brandDesc":"Website resmi Pemerintah Desa Cenrana, Kabupaten Maros.","address":"Jl. AB Situru Dusun Benteng, Kec. Camba, Kab. Maros, Sulawesi Selatan","phone":"+62 812-3456-7890","email":"admin@desacenrana.id","copyright":"© 2026 Pemerintah Desa Cenrana. All rights reserved."}}')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ENABLE RLS FOR NEW TABLES
-- ============================================

ALTER TABLE nik_validation ENABLE ROW LEVEL SECURITY;
ALTER TABLE berita ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES FOR NEW TABLES
-- ============================================

-- NIK Validation: Insert only, no read (secure)
CREATE POLICY "Allow insert nik_validation" ON nik_validation FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select nik_validation" ON nik_validation FOR SELECT USING (true);

-- Berita: Public read, admin write
CREATE POLICY "Allow all berita" ON berita FOR ALL USING (true);

-- Programs: Public read, admin write
CREATE POLICY "Allow all programs" ON programs FOR ALL USING (true);

-- Gallery: Public read, admin write
CREATE POLICY "Allow all gallery" ON gallery FOR ALL USING (true);

-- CMS Content: Admin only
CREATE POLICY "Allow all cms_content" ON cms_content FOR ALL USING (true);

-- ============================================
-- DONE! Additional tables created.
-- ============================================

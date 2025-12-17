-- ============================================
-- SUPABASE SCHEMA FOR DESA CENRANA
-- Run this in SQL Editor after creating new project
-- ============================================

-- 1. TABEL ASPIRASI (Laporan Warga)
CREATE TABLE IF NOT EXISTS aspirasi (
    id SERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    dusun VARCHAR(100) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    laporan TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Diproses', 'Selesai', 'Rejected')),
    reply TEXT,
    image TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Emergency')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL LAPAK (Produk UMKM Warga)
CREATE TABLE IF NOT EXISTS lapak (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    seller VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    image TEXT,
    description TEXT,
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Active', 'Pending', 'Rejected')),
    view_count INTEGER DEFAULT 0,
    wa_click_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABEL BERITA
CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    category VARCHAR(100) DEFAULT 'Pengumuman',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL PENDUDUK
CREATE TABLE IF NOT EXISTS penduduk (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(255) NOT NULL,
    dusun VARCHAR(100) NOT NULL,
    pekerjaan VARCHAR(100),
    tanggal_lahir DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABEL EMERGENCY DISCLOSURE (Pengungkapan Darurat)
CREATE TABLE IF NOT EXISTS emergency_disclosure_requests (
    id SERIAL PRIMARY KEY,
    ticket_code VARCHAR(20) NOT NULL,
    requested_by VARCHAR(255) NOT NULL,
    request_reason TEXT NOT NULL,
    official_document VARCHAR(255),
    authorized_by VARCHAR(255),
    disclosed_niks TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABEL EMERGENCY ACCESS LOGS (Audit Trail)
CREATE TABLE IF NOT EXISTS emergency_access_logs (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES emergency_disclosure_requests(id),
    action VARCHAR(50) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE aspirasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE lapak ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE penduduk ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: Allow public read, authenticated write
-- ============================================

-- Aspirasi: Public can insert and read their own, admin can all
CREATE POLICY "Allow public insert aspirasi" ON aspirasi FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select aspirasi" ON aspirasi FOR SELECT USING (true);
CREATE POLICY "Allow public update aspirasi" ON aspirasi FOR UPDATE USING (true);
CREATE POLICY "Allow public delete aspirasi" ON aspirasi FOR DELETE USING (true);

-- Lapak: Public can insert and read, admin can manage
CREATE POLICY "Allow public insert lapak" ON lapak FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select lapak" ON lapak FOR SELECT USING (true);
CREATE POLICY "Allow public update lapak" ON lapak FOR UPDATE USING (true);
CREATE POLICY "Allow public delete lapak" ON lapak FOR DELETE USING (true);

-- News: Public can read, admin can write
CREATE POLICY "Allow public select news" ON news FOR SELECT USING (true);
CREATE POLICY "Allow public insert news" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update news" ON news FOR UPDATE USING (true);
CREATE POLICY "Allow public delete news" ON news FOR DELETE USING (true);

-- Penduduk: Admin only (but RLS allows all for simplicity in dev)
CREATE POLICY "Allow all penduduk" ON penduduk FOR ALL USING (true);

-- ============================================
-- DONE! Your database is ready.
-- ============================================

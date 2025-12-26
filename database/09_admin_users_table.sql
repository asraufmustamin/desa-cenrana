-- =============================================
-- ADMIN USERS TABLE
-- =============================================
-- Tabel ini portable dan bisa dimigrasi ke MySQL nanti
-- 
-- Jalankan SQL ini di Supabase SQL Editor:
-- https://supabase.com/dashboard -> SQL Editor

-- 1. Buat tabel admin_users
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- 3. RLS (Row Level Security) - Opsional tapi recommended
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Hanya service role yang bisa akses (API backend)
CREATE POLICY "Service role only" ON admin_users
    FOR ALL
    USING (auth.role() = 'service_role');

-- 4. Comment untuk dokumentasi
COMMENT ON TABLE admin_users IS 'Tabel untuk menyimpan admin website (portable ke MySQL)';
COMMENT ON COLUMN admin_users.password_hash IS 'Password terenkripsi dengan bcrypt';

-- =============================================
-- INSERT ADMIN PERTAMA (GANTI PASSWORD DI BAWAH!)
-- =============================================
-- PENTING: Setelah sistem auth jadi, Anda akan login dan ganti password
-- Password default sementara: "admin123" (hashed)
-- Hash dibuat dengan bcrypt cost 10

-- INSERT INTO admin_users (username, email, password_hash, role)
-- VALUES (
--     'admin',
--     'admin@desacenrana.id',
--     '$2a$10$PLACEHOLDER_HASH_WILL_BE_GENERATED',
--     'admin'
-- );

-- Catatan: Kita akan buat script terpisah untuk generate hash dan insert admin

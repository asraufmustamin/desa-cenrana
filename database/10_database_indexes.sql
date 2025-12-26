-- =============================================
-- DATABASE OPTIMIZATION - INDEXES
-- =============================================
-- Menambahkan index untuk mempercepat query yang sering digunakan
-- Jalankan di Supabase SQL Editor

-- =============================================
-- 1. ASPIRASI TABLE INDEXES
-- =============================================
-- Index untuk filter status (Pending, Diproses, Selesai)
CREATE INDEX IF NOT EXISTS idx_aspirasi_status ON aspirasi(status);

-- Index untuk filter dusun
CREATE INDEX IF NOT EXISTS idx_aspirasi_dusun ON aspirasi(dusun);

-- Index untuk sorting by created_at (ORDER BY yang sering dipakai)
CREATE INDEX IF NOT EXISTS idx_aspirasi_created_at ON aspirasi(created_at DESC);

-- Composite index untuk search by ticket_code
CREATE INDEX IF NOT EXISTS idx_aspirasi_ticket_code ON aspirasi(ticket_code);

-- Index untuk category filter
CREATE INDEX IF NOT EXISTS idx_aspirasi_category ON aspirasi(category);

-- =============================================
-- 2. LAPAK TABLE INDEXES
-- =============================================
-- Index untuk filter status (Pending, Active, Rejected)
CREATE INDEX IF NOT EXISTS idx_lapak_status ON lapak(status);

-- Index untuk filter category
CREATE INDEX IF NOT EXISTS idx_lapak_category ON lapak(category);

-- Index untuk sorting by created_at
CREATE INDEX IF NOT EXISTS idx_lapak_created_at ON lapak(created_at DESC);

-- Index untuk analytics (view_count sorting)
CREATE INDEX IF NOT EXISTS idx_lapak_view_count ON lapak(view_count DESC);

-- =============================================
-- 3. BERITA TABLE INDEXES
-- =============================================
-- Index untuk filter by status (published, draft)
CREATE INDEX IF NOT EXISTS idx_berita_status ON berita(status);

-- Index untuk filter by category
CREATE INDEX IF NOT EXISTS idx_berita_category ON berita(category);

-- Index untuk sorting by date
CREATE INDEX IF NOT EXISTS idx_berita_date ON berita(date DESC);

-- Index untuk created_at
CREATE INDEX IF NOT EXISTS idx_berita_created_at ON berita(created_at DESC);

-- =============================================
-- 4. CMS_CONTENT TABLE (jika belum ada)
-- =============================================
-- Primary key index sudah otomatis ada

-- =============================================
-- 5. ADMIN_USERS INDEXES (sudah dibuat sebelumnya)
-- =============================================
-- idx_admin_users_username
-- idx_admin_users_email

-- =============================================
-- VERIFIKASI INDEXES
-- =============================================
-- Jalankan query ini untuk melihat semua index:
-- SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public';

-- ============================================
-- Database Schema: Buku Tamu Digital
-- ============================================
-- Run this in Supabase SQL Editor

-- Create buku_tamu table
CREATE TABLE IF NOT EXISTS buku_tamu (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nik VARCHAR(20),
    no_hp VARCHAR(20),
    alamat TEXT,
    tujuan VARCHAR(50) NOT NULL,
    keperluan TEXT,
    waktu_datang TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    waktu_selesai TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'menunggu', -- menunggu, dilayani, selesai
    catatan_admin TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_buku_tamu_status ON buku_tamu(status);
CREATE INDEX IF NOT EXISTS idx_buku_tamu_waktu ON buku_tamu(waktu_datang DESC);

-- Enable RLS
ALTER TABLE buku_tamu ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public insert buku_tamu" ON buku_tamu;
DROP POLICY IF EXISTS "Allow public read buku_tamu" ON buku_tamu;
DROP POLICY IF EXISTS "Allow authenticated update buku_tamu" ON buku_tamu;
DROP POLICY IF EXISTS "Allow public update buku_tamu" ON buku_tamu;
DROP POLICY IF EXISTS "Allow public delete buku_tamu" ON buku_tamu;

-- Policy: Anyone can insert (public registration)
CREATE POLICY "Allow public insert buku_tamu" ON buku_tamu
    FOR INSERT WITH CHECK (true);

-- Policy: Anyone can read (for checking queue)
CREATE POLICY "Allow public read buku_tamu" ON buku_tamu
    FOR SELECT USING (true);

-- Policy: Anyone can update (admin handles auth in frontend)
CREATE POLICY "Allow public update buku_tamu" ON buku_tamu
    FOR UPDATE USING (true);

-- Policy: Anyone can delete (admin handles auth in frontend)
CREATE POLICY "Allow public delete buku_tamu" ON buku_tamu
    FOR DELETE USING (true);

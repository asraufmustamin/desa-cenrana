-- ============================================
-- Database Schema: Berita Comments
-- ============================================
-- Run this in Supabase SQL Editor

-- Create comments table
CREATE TABLE IF NOT EXISTS berita_comments (
    id SERIAL PRIMARY KEY,
    berita_id INTEGER NOT NULL,
    nama VARCHAR(100) NOT NULL,
    komentar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by berita_id
CREATE INDEX IF NOT EXISTS idx_berita_comments_berita_id ON berita_comments(berita_id);

-- Enable RLS (Row Level Security)
ALTER TABLE berita_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read comments" ON berita_comments;
DROP POLICY IF EXISTS "Allow public insert comments" ON berita_comments;
DROP POLICY IF EXISTS "Allow authenticated delete comments" ON berita_comments;

-- Policy: Anyone can read comments
CREATE POLICY "Allow public read comments" ON berita_comments
    FOR SELECT USING (true);

-- Policy: Anyone can insert comments (public commenting)
CREATE POLICY "Allow public insert comments" ON berita_comments
    FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users can delete (admin)
CREATE POLICY "Allow authenticated delete comments" ON berita_comments
    FOR DELETE USING (auth.role() = 'authenticated');

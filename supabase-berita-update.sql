-- ============================================
-- ADD MISSING COLUMNS TO BERITA TABLE
-- Run this in Supabase SQL Editor
-- ============================================

ALTER TABLE berita ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Admin Desa Cenrana';
ALTER TABLE berita ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT '';
ALTER TABLE berita ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'published';

-- Done! Now addNews will work with new fields.

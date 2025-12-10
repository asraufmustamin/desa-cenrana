-- Phase 1: Database Schema Updates for Aspirasi Enhancement
-- Run this in Supabase SQL Editor

-- 1. Add new columns to aspirasi table (backward compatible)
ALTER TABLE aspirasi 
ADD COLUMN IF NOT EXISTS priority VARCHAR DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN IF NOT EXISTS feedback_text TEXT;

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_aspirasi_priority ON aspirasi(priority);
CREATE INDEX IF NOT EXISTS idx_aspirasi_rating ON aspirasi(rating);

-- 3. Create aspirasi_timeline table for activity log
CREATE TABLE IF NOT EXISTS aspirasi_timeline (
  id SERIAL PRIMARY KEY,
  ticket_code VARCHAR NOT NULL,
  action VARCHAR NOT NULL,
  status VARCHAR,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ticket_code) REFERENCES aspirasi(ticket_code) ON DELETE CASCADE
);

-- 4. Create index for timeline queries
CREATE INDEX IF NOT EXISTS idx_timeline_ticket ON aspirasi_timeline(ticket_code);
CREATE INDEX IF NOT EXISTS idx_timeline_created ON aspirasi_timeline(created_at DESC);

-- 5. Verify changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'aspirasi'
ORDER BY ordinal_position;

-- 6. Check existing data still intact
SELECT COUNT(*) as total_aspirasi FROM aspirasi;

-- Setup Supabase Storage Bucket (do this in Supabase Dashboard):
-- 1. Go to Storage > Create bucket
-- 2. Name: aspirasi-images
-- 3. Public: YES
-- 4. File size limit: 5MB
-- 5. Allowed MIME types: image/jpeg, image/png, image/webp

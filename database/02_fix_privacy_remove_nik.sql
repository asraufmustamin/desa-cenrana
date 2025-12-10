-- CRITICAL FIX: Remove NIK Column from Aspirasi Table
-- This column allows admin to trace anonymous reports - PRIVACY LEAK!

-- Backup data first (optional, in case needed)
-- CREATE TABLE aspirasi_backup AS SELECT * FROM aspirasi;

-- Remove NIK column
ALTER TABLE aspirasi DROP COLUMN IF EXISTS nik;

-- Verify column removed
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'aspirasi';

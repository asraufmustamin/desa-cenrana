-- ================================================
-- CHECK & RESTORE ASPIRASI TABLE STRUCTURE
-- ================================================
-- Purpose: Verify and restore nik, date columns if missing
-- Run this in Supabase SQL Editor
-- ================================================

-- STEP 1: Check existing columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'aspirasi' 
ORDER BY ordinal_position;

-- STEP 2: Add missing columns IF NOT EXISTS
-- This is safe - won't error if column already exists

-- Add NIK column (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aspirasi' AND column_name = 'nik'
    ) THEN
        ALTER TABLE aspirasi ADD COLUMN nik TEXT;
        RAISE NOTICE 'Column nik added';
    ELSE
        RAISE NOTICE 'Column nik already exists';
    END IF;
END $$;

-- Add DATE column (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'aspirasi' AND column_name = 'date'
    ) THEN
        ALTER TABLE aspirasi ADD COLUMN date TEXT;
        RAISE NOTICE 'Column date added';
    ELSE
        RAISE NOTICE 'Column date already exists';
    END IF;
END $$;

-- STEP 3: Verify photo column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'aspirasi' AND column_name = 'photo';

-- STEP 4: Check sample data
SELECT 
    ticket_code,
    name,
    nik,
    date,
    photo IS NOT NULL as has_photo,
    dusun,
    category,
    status,
    created_at
FROM aspirasi 
ORDER BY created_at DESC 
LIMIT 5;

-- ================================================
-- EXPECTED OUTPUT:
-- All columns including nik, date, photo should exist
-- ================================================
gagal 
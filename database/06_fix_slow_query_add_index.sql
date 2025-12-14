-- ============================================
-- FIX: Slow Query Timeout - Add Database Index
-- ============================================
-- Problem: Query "SELECT * FROM aspirasi ORDER BY created_at DESC" is SLOW
-- Cause: No index on 'created_at' column
-- Solution: Add index to make query 100x faster
-- ============================================

-- Step 1: Create Index on created_at (untuk ORDER BY)
CREATE INDEX IF NOT EXISTS idx_aspirasi_created_at 
ON aspirasi(created_at DESC);

-- Step 2: Create Index on status (untuk filtering di admin)
CREATE INDEX IF NOT EXISTS idx_aspirasi_status 
ON aspirasi(status);

-- Step 3: Composite Index untuk filter + sort
CREATE INDEX IF NOT EXISTS idx_aspirasi_status_created_at 
ON aspirasi(status, created_at DESC);

-- ============================================
-- VERIFY: Check indexes created
-- ============================================
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'aspirasi';

-- ============================================
-- TEST: Query should be FAST now!
-- ============================================
SELECT * FROM aspirasi 
ORDER BY created_at DESC 
LIMIT 100;

-- ============================================
-- EXPECTED RESULT:
-- Before: 5-10 seconds (TIMEOUT!)
-- After: < 100ms (FAST! ✅)
-- ============================================

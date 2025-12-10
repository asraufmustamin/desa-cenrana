-- ================================================================
-- FINAL FIX: Complete RLS Disable + Simple Manual Test
-- ================================================================
-- Execute this entire script in one go
-- ================================================================

-- 1. DISABLE ALL RLS (for testing)
ALTER TABLE nik_validation DISABLE ROW LEVEL SECURITY;
ALTER TABLE disclosure_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE access_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE aspirasi DISABLE ROW LEVEL SECURITY;
ALTER TABLE penduduk DISABLE ROW LEVEL SECURITY;

-- 2. Get a sample NIK from penduduk
SELECT nik, nama, dusun FROM penduduk LIMIT 1;
-- Copy NIK dari hasil ini: __________________

-- 3. SIMPLE INSERT (ganti NIK di bawah dengan hasil dari step 2)
-- Contoh: INSERT INTO nik_validation (nik_hash, created_at) VALUES ...

INSERT INTO nik_validation (nik_hash, created_at) 
VALUES (
    encode(digest('7371011302010091', 'sha256'), 'hex'),  -- ← GANTI NIK INI!
    NOW()
);

-- 4. Verify insert
SELECT nik_hash, created_at 
FROM nik_validation 
WHERE created_at > NOW() - INTERVAL '1 minute'
ORDER BY created_at DESC;

-- ================================================================
-- THEN TEST:
-- ================================================================
-- 1. Submit aspirasi dengan NIK yang sama (dari step 2)
-- 2. Catat ticket code
-- 3. Request disclosure LANGSUNG
-- 4. Should match!
-- ================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ All RLS disabled';
  RAISE NOTICE '✅ Sample NIK hash inserted';
  RAISE NOTICE '📝 NOW: Submit aspirasi with same NIK, then test disclosure!';
END $$;

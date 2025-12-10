-- ================================================================
-- FIX: Disable RLS on disclosure tables untuk testing
-- ================================================================
-- Karena kita pakai custom auth (bukan Supabase Auth),
-- RLS policy yang check auth.jwt() tidak berfungsi
-- 
-- Security masih terjaga di UI level (only logged in admin)
-- ================================================================

-- 1. Disable RLS on disclosure_requests
ALTER TABLE disclosure_requests DISABLE ROW LEVEL SECURITY;

-- 2. Disable RLS on access_log (if enabled)
ALTER TABLE access_log DISABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies (cleanup)
DROP POLICY IF EXISTS "Super admin full access" ON disclosure_requests;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS Disabled for disclosure tables';
  RAISE NOTICE '🔒 Security: UI level protection (admin login required)';
  RAISE NOTICE '📝 For production: Setup custom RLS or re-enable with proper auth';
END $$;

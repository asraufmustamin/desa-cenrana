-- ================================================================
-- PHASE 1: EMERGENCY DISCLOSURE SYSTEM - DATABASE SETUP
-- ================================================================
-- Purpose: Setup tables untuk emergency disclosure system
-- - disclosure_requests: Track requests untuk buka identitas
-- - access_log: Audit trail untuk semua akses sensitif
-- - Fix: Remove NIK column dari aspirasi table (privacy)
-- ================================================================

-- 1. CREATE DISCLOSURE REQUESTS TABLE
-- Track siapa, kapan, kenapa minta buka identitas pelapor anonim
CREATE TABLE IF NOT EXISTS disclosure_requests (
  id SERIAL PRIMARY KEY,
  ticket_code VARCHAR(50) NOT NULL,
  requested_by VARCHAR(100) NOT NULL,
  request_reason TEXT NOT NULL,
  official_document VARCHAR(200),
  authorized_by VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  disclosed_nik VARCHAR(16),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  CONSTRAINT unique_ticket_request UNIQUE (ticket_code, requested_by)
);

-- Index untuk performance
CREATE INDEX idx_disclosure_ticket ON disclosure_requests(ticket_code);
CREATE INDEX idx_disclosure_status ON disclosure_requests(status);

-- 2. CREATE ACCESS LOG TABLE
-- Audit trail untuk semua akses ke table sensitif
CREATE TABLE IF NOT EXISTS access_log (
  id SERIAL PRIMARY KEY,
  accessed_by VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id INTEGER,
  ip_address VARCHAR(50),
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk query audit
CREATE INDEX idx_access_by ON access_log(accessed_by);
CREATE INDEX idx_access_table ON access_log(table_name);
CREATE INDEX idx_access_timestamp ON access_log(timestamp);

-- 3. REMOVE NIK FROM ASPIRASI TABLE (Privacy Fix)
-- NIK di table aspirasi = privacy leak, harus dihapus
ALTER TABLE aspirasi DROP COLUMN IF EXISTS nik;

-- 4. ROW LEVEL SECURITY (RLS)
-- Hanya super_admin yang bisa akses disclosure_requests
ALTER TABLE disclosure_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Hanya super admin bisa read/write
CREATE POLICY "Super admin full access"
ON disclosure_requests
FOR ALL
USING (
  auth.jwt() ->> 'role' = 'super_admin' 
  OR 
  auth.jwt() ->> 'email' IN (
    SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'super_admin'
  )
);

-- 5. COMMENTS (Dokumentasi)
COMMENT ON TABLE disclosure_requests IS 'Track emergency disclosure requests untuk trace pelapor anonim dalam kasus darurat';
COMMENT ON TABLE access_log IS 'Audit trail untuk semua akses ke data sensitif';

COMMENT ON COLUMN disclosure_requests.ticket_code IS 'Ticket code aspirasi yang mau di-trace';
COMMENT ON COLUMN disclosure_requests.request_reason IS 'Alasan disclosure (ancaman, kekerasan, dll)';
COMMENT ON COLUMN disclosure_requests.official_document IS 'Upload surat resmi dari pihak berwenang';
COMMENT ON COLUMN disclosure_requests.status IS 'pending | approved | rejected';

-- 6. SUCCESS MESSAGE
DO $$
BEGIN
  RAISE NOTICE '✅ Emergency Disclosure System - Database Setup COMPLETE!';
  RAISE NOTICE '📊 Tables created:';
  RAISE NOTICE '   - disclosure_requests (track requests)';
  RAISE NOTICE '   - access_log (audit trail)';
  RAISE NOTICE '🔒 Privacy fix:';
  RAISE NOTICE '   - NIK column removed from aspirasi table';
  RAISE NOTICE '🛡️ Security:';
  RAISE NOTICE '   - RLS enabled (super admin only)';
END $$;

-- ============================================
-- RLS POLICIES FOR EMERGENCY TABLES (FIXED)
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Allow all emergency_disclosure_requests" ON emergency_disclosure_requests;
DROP POLICY IF EXISTS "Allow all emergency_access_logs" ON emergency_access_logs;

-- Enable RLS on emergency tables
ALTER TABLE emergency_disclosure_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_access_logs ENABLE ROW LEVEL SECURITY;

-- Allow all operations on emergency_disclosure_requests
CREATE POLICY "Allow all emergency_disclosure_requests" 
ON emergency_disclosure_requests 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Allow all operations on emergency_access_logs
CREATE POLICY "Allow all emergency_access_logs" 
ON emergency_access_logs 
FOR ALL 
USING (true)
WITH CHECK (true);

-- ============================================
-- DONE! Refresh and try again.
-- ============================================

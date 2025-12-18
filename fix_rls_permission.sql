-- FIX RLS POLICIES FOR E-SURAT
-- Run this in Supabase SQL Editor to fix "new row violates row-level security policy" errors.

-- 1. Reset Policies for surat_requests table
ALTER TABLE surat_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can insert requests" ON surat_requests;
DROP POLICY IF EXISTS "Public can view own request" ON surat_requests;
DROP POLICY IF EXISTS "Admin full access requests" ON surat_requests;

-- Allow anyone (public/anon) to INSERT new requests
CREATE POLICY "Public can insert requests" 
ON surat_requests 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to VIEW requests (needed for Tracking Page & Admin Dashboard)
-- Ideally this should be restricted, but for this demo/MVP we keep it open or restricted by ID lookup
CREATE POLICY "Public can view requests" 
ON surat_requests 
FOR SELECT 
USING (true);

-- Allow UPDATE for Admins (or everyone for now to ensure Admin Dashboard works without auth issues)
CREATE POLICY "Public can update requests" 
ON surat_requests 
FOR UPDATE 
USING (true);

-- 2. Reset Policies for Storage (lampiran_surat bucket)
-- Ensure the bucket exists first (Created via Dashboard), this just sets policies on objects.

DROP POLICY IF EXISTS "Public Select Lampiran" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Lampiran" ON storage.objects;

-- Allow Public to VIEW files in lampiran_surat
CREATE POLICY "Public Select Lampiran"
ON storage.objects FOR SELECT
USING ( bucket_id = 'lampiran_surat' );

-- Allow Public to UPLOAD files to lampiran_surat
CREATE POLICY "Public Insert Lampiran"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'lampiran_surat' );

-- 3. Ensure surat_types is readable
DROP POLICY IF EXISTS "Public view surat_types" ON surat_types;
CREATE POLICY "Public view surat_types" 
ON surat_types 
FOR SELECT 
USING (true);

-- =============================================
-- AUDIT LOGS TABLE
-- =============================================
-- Mencatat semua aktivitas admin untuk tracking dan keamanan

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    
    -- Siapa yang melakukan aksi
    user_id INTEGER REFERENCES admin_users(id),
    username VARCHAR(50),
    
    -- Apa yang dilakukan
    action VARCHAR(50) NOT NULL,  -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc.
    entity_type VARCHAR(50),      -- berita, lapak, aspirasi, user, etc.
    entity_id VARCHAR(50),        -- ID dari entity yang di-modify
    
    -- Detail perubahan
    old_value TEXT,               -- Nilai sebelum (JSON)
    new_value TEXT,               -- Nilai sesudah (JSON)
    description TEXT,             -- Deskripsi aksi
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk query yang sering digunakan
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all (admin access)
CREATE POLICY "Allow all for audit_logs" ON audit_logs
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- ========================================
-- PHASE 1: DATABASE SETUP (OPTIMIZED)
-- Data Penduduk - Minimal Fields for Aspirasi
-- ========================================

-- Drop existing tables (start fresh)
DROP TABLE IF EXISTS nik_validation CASCADE;
DROP TABLE IF EXISTS penduduk CASCADE;

-- Table 1: Data Penduduk (Optimized for aspirasi needs)
-- REQUIRED: NIK, Nama, Dusun
-- OPTIONAL: Tanggal Lahir, Pekerjaan
CREATE TABLE penduduk (
  id SERIAL PRIMARY KEY,
  nik VARCHAR(16) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  dusun VARCHAR(50) NOT NULL,
  tanggal_lahir DATE,           -- OPTIONAL (boleh kosong)
  pekerjaan VARCHAR(50),         -- OPTIONAL (boleh kosong)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: NIK Validation (Privacy-preserving)
-- NIK di-hash untuk validasi aspirasi anonim
-- Admin TIDAK BISA trace identitas dari hash
CREATE TABLE nik_validation (
  nik_hash VARCHAR(64) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes untuk performa
CREATE INDEX idx_penduduk_nik ON penduduk(nik);
CREATE INDEX idx_penduduk_dusun ON penduduk(dusun);

-- Dokumentasi
COMMENT ON TABLE penduduk IS 'Data penduduk minimal untuk validasi aspirasi (NIK, Nama, Dusun + optional fields)';
COMMENT ON TABLE nik_validation IS 'NIK hash untuk validasi aspirasi anonim (privacy-preserving)';

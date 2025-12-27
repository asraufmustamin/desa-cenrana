-- ============================================
-- Database Schema: Polling Warga
-- ============================================
-- Run this in Supabase SQL Editor

-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]', -- Array of {id, text}
    is_active BOOLEAN DEFAULT true,
    allow_multiple BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_votes table
CREATE TABLE IF NOT EXISTS poll_votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER NOT NULL,
    voter_id TEXT NOT NULL, -- Browser fingerprint/localStorage ID
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(poll_id, voter_id) -- One vote per person per poll
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_polls_active ON polls(is_active);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_voter ON poll_votes(voter_id);

-- Enable RLS
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read polls" ON polls;
DROP POLICY IF EXISTS "Allow public insert polls" ON polls;
DROP POLICY IF EXISTS "Allow public update polls" ON polls;
DROP POLICY IF EXISTS "Allow public delete polls" ON polls;
DROP POLICY IF EXISTS "Allow public read poll_votes" ON poll_votes;
DROP POLICY IF EXISTS "Allow public insert poll_votes" ON poll_votes;
DROP POLICY IF EXISTS "Allow public delete poll_votes" ON poll_votes;

-- Polls policies
CREATE POLICY "Allow public read polls" ON polls FOR SELECT USING (true);
CREATE POLICY "Allow public insert polls" ON polls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update polls" ON polls FOR UPDATE USING (true);
CREATE POLICY "Allow public delete polls" ON polls FOR DELETE USING (true);

-- Poll_votes policies
CREATE POLICY "Allow public read poll_votes" ON poll_votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert poll_votes" ON poll_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete poll_votes" ON poll_votes FOR DELETE USING (true);

-- Insert sample poll
INSERT INTO polls (question, options, is_active, end_date) VALUES
(
    'Program apa yang paling dibutuhkan Desa Cenrana di tahun 2025?',
    '[
        {"id": 1, "text": "Perbaikan Jalan"},
        {"id": 2, "text": "Fasilitas Air Bersih"},
        {"id": 3, "text": "Penerangan Jalan"},
        {"id": 4, "text": "Lainnya"}
    ]'::jsonb,
    true,
    NOW() + INTERVAL '30 days'
);

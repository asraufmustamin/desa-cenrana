-- ============================================
-- Database Schema: Push Notification Subscriptions
-- ============================================
-- Run this in Supabase SQL Editor

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id SERIAL PRIMARY KEY,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- Enable RLS
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert push_subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Allow authenticated read push_subscriptions" ON push_subscriptions;
DROP POLICY IF EXISTS "Allow public delete push_subscriptions" ON push_subscriptions;

-- Policy: Anyone can insert (subscribe)
CREATE POLICY "Allow public insert push_subscriptions" ON push_subscriptions
    FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated can read (admin)
CREATE POLICY "Allow authenticated read push_subscriptions" ON push_subscriptions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Anyone can delete their own subscription
CREATE POLICY "Allow public delete push_subscriptions" ON push_subscriptions
    FOR DELETE USING (true);

-- Lapak Warga Analytics Migration (FIXED VERSION)
-- Purpose: Add analytics tracking columns to lapak table
-- Date: 2025-12-12
-- IMPORTANT: This works with the actual database schema!

-- Step 1: Add analytics columns to lapak table
ALTER TABLE lapak 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS wa_click_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_viewed_at TIMESTAMP;

-- Step 2: Create indexes for performance (faster queries)
CREATE INDEX IF NOT EXISTS idx_lapak_views 
ON lapak(view_count DESC);

CREATE INDEX IF NOT EXISTS idx_lapak_wa_clicks 
ON lapak(wa_click_count DESC);

CREATE INDEX IF NOT EXISTS idx_lapak_last_viewed 
ON lapak(last_viewed_at DESC);

-- Step 3: Create RPC functions for atomic increments
-- This is SAFER than trying to use supabase.sql which doesn't work

CREATE OR REPLACE FUNCTION increment_view_count(product_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE lapak 
    SET view_count = COALESCE(view_count, 0) + 1,
        last_viewed_at = NOW()
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_wa_click_count(product_id INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE lapak 
    SET wa_click_count = COALESCE(wa_click_count, 0) + 1
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Initialize existing dummy data with random analytics (for testing only)
-- This simulates activity so admin can see how dashboard looks
UPDATE lapak 
SET 
    view_count = FLOOR(RANDOM() * 100)::int,
    wa_click_count = FLOOR(RANDOM() * 20)::int,
    last_viewed_at = NOW() - (RANDOM() * INTERVAL '7 days')
WHERE view_count IS NULL OR view_count = 0;

-- Step 5: Add comment for documentation
COMMENT ON COLUMN lapak.view_count IS 'Number of times product was viewed';
COMMENT ON COLUMN lapak.wa_click_count IS 'Number of times WhatsApp button was clicked';
COMMENT ON COLUMN lapak.last_viewed_at IS 'Timestamp of last product view';

-- Verification: Check the changes
SELECT 
    id,
    name as product_name,
    view_count,
    wa_click_count,
    last_viewed_at,
    status
FROM lapak
WHERE status = 'Active'
ORDER BY view_count DESC
LIMIT 10;

/*
NOTES FOR PRODUCTION:
Before going live with real users, reset analytics to zero:

UPDATE lapak SET 
    view_count = 0,
    wa_click_count = 0,
    last_viewed_at = NULL;

This will start fresh tracking with real usage data.
*/

/*
HOW TO TEST:
1. Run this entire SQL file in Supabase SQL Editor
2. Check result shows products with analytics data
3. Go to website and click a product
4. Run: SELECT name, view_count FROM lapak WHERE id = X;
5. view_count should increase by 1
*/

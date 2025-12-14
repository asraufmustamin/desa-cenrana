-- ================================================
-- FIX TICKET CODE GENERATION
-- ================================================
-- Purpose: Eliminate duplicate ticket codes by using 
--          database auto-increment instead of client COUNT
-- Date: 14 Dec 2025
-- Author: System Fix
-- ================================================

-- STEP 1: Add auto-increment sequence column
-- This will auto-generate unique sequential numbers
ALTER TABLE aspirasi 
ADD COLUMN IF NOT EXISTS id_sequence SERIAL;

-- STEP 2: Create function to generate ticket code from sequence
-- This runs on server-side, eliminating race conditions
CREATE OR REPLACE FUNCTION generate_aspirasi_ticket_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if ticket_code is not provided
    -- Format: ASP-001, ASP-002, etc.
    IF NEW.ticket_code IS NULL OR NEW.ticket_code = '' THEN
        NEW.ticket_code := 'ASP-' || LPAD(NEW.id_sequence::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- STEP 3: Create trigger to auto-generate ticket code
DROP TRIGGER IF EXISTS set_aspirasi_ticket_code ON aspirasi;
CREATE TRIGGER set_aspirasi_ticket_code
BEFORE INSERT ON aspirasi
FOR EACH ROW
EXECUTE FUNCTION generate_aspirasi_ticket_code();

-- STEP 4: Backfill existing records with proper sequential codes
-- This fixes all duplicate codes in existing data
DO $$
DECLARE
    rec RECORD;
    new_seq INT := 1;
BEGIN
    -- Process all records in created_at order
    FOR rec IN 
        SELECT ticket_code, created_at
        FROM aspirasi
        ORDER BY created_at ASC
    LOOP
        -- Update id_sequence and regenerate ticket_code
        UPDATE aspirasi
        SET 
            id_sequence = new_seq,
            ticket_code = 'ASP-' || LPAD(new_seq::TEXT, 3, '0')
        WHERE ticket_code = rec.ticket_code 
          AND created_at = rec.created_at;
        
        new_seq := new_seq + 1;
    END LOOP;
    
    RAISE NOTICE 'Updated % records', new_seq - 1;
END $$;

-- STEP 5: Reset sequence to continue from last record
-- This ensures new records continue from where we left off
SELECT setval(
    pg_get_serial_sequence('aspirasi', 'id_sequence'),
    (SELECT COALESCE(MAX(id_sequence), 0) + 1 FROM aspirasi),
    false
);

-- STEP 6: Verify results
-- Check for duplicates (should return 0 rows)
SELECT ticket_code, COUNT(*) as duplicate_count
FROM aspirasi
GROUP BY ticket_code
HAVING COUNT(*) > 1;

-- Show sample of updated records
SELECT ticket_code, id_sequence, name, created_at
FROM aspirasi
ORDER BY id_sequence DESC
LIMIT 10;

-- ================================================
-- EXPECTED RESULTS:
-- - All ticket codes are unique
-- - Codes are sequential based on submission time
-- - New submissions will auto-generate codes
-- - No more race conditions or duplicates
-- ================================================

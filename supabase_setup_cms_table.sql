-- ============================================
-- Create CMS Content Table for Global Sync
-- ============================================

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS cms_content (
  id INTEGER PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_cms_content_updated 
ON cms_content(updated_at DESC);

-- Step 3: Insert default/initial data
-- This will be the base CMS content
INSERT INTO cms_content (id, data, updated_at)
VALUES (
  1,
  '{
    "home": {},
    "footer": {},
    "navbar": {},
    "profil": {
      "historyTitle": "Sejarah Desa Cenrana",
      "historyText": "Desa Cenrana memiliki sejarah panjang yang berakar dari nilai-nilai gotong royong dan kearifan lokal.",
      "historyFullText": "Desa Cenrana memiliki sejarah panjang...",
      "historyBanner": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
      "visionTitle": "Visi",
      "visionText": "Terwujudnya Desa Cenrana yang Mandiri, Sejahtera, dan Berbudaya.",
      "missionTitle": "Misi",
      "missionList": []
    },
    "transparansi": {}
  }'::jsonb,
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Step 4: Enable Row Level Security (RLS) - Optional for security
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policy to allow public read
CREATE POLICY "Allow public read access" 
ON cms_content FOR SELECT 
USING (true);

-- Step 6: Create policy to allow authenticated updates
-- Only logged-in admins can update
CREATE POLICY "Allow authenticated update" 
ON cms_content FOR UPDATE 
USING (auth.role() = 'authenticated');

-- ============================================
-- Verification Queries
-- ============================================

-- Check if table was created
SELECT * FROM cms_content;

-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cms_content';

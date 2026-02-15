-- Add CAVABEN column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cavaben text;

-- Optional: Update existing rows with a default if needed (handled in seed_data.sql for new rows)

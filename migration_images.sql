-- Add images column as an array of text
ALTER TABLE products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Migrate existing img to images array (if images is empty)
UPDATE products 
SET images = ARRAY[img] 
WHERE img IS NOT NULL AND (images IS NULL OR images = '{}');

-- We will keep 'img' column as a 'cover image' or just the first image for backward compatibility
-- But the frontend will primarily look at 'images' if available.

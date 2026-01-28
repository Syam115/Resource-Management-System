-- Migration: Change resources.category_id (FK) to resources.category (VARCHAR)
-- This script migrates the category relationship to a simple string field

-- Step 1: Add new category column (string)
ALTER TABLE resources ADD COLUMN category_new VARCHAR(255);

-- Step 2: Migrate data - copy category names from resource_categories table
UPDATE resources r
SET category_new = rc.name
FROM resource_categories rc
WHERE r.category_id = rc.id;

-- Step 3: Drop the foreign key constraint (if it exists)
ALTER TABLE resources DROP CONSTRAINT IF EXISTS fk_resources_category;

-- Step 4: Drop the old category_id column
ALTER TABLE resources DROP COLUMN IF EXISTS category_id;

-- Step 5: Rename the new column to 'category'
ALTER TABLE resources RENAME COLUMN category_new TO category;

-- Step 6: Make category NOT NULL (after data migration)
ALTER TABLE resources ALTER COLUMN category SET NOT NULL;

-- Optional: You can now drop the resource_categories table if you don't need it anymore
-- DROP TABLE IF EXISTS resource_categories CASCADE;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resources' 
ORDER BY ordinal_position;

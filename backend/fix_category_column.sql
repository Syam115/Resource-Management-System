-- Fixed Migration: Handle existing category column
-- This script safely migrates from category_id to category string

-- First, check what columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resources' 
AND column_name IN ('category', 'category_id')
ORDER BY column_name;

-- If category column exists but is empty and category_id exists, migrate the data
DO $$
BEGIN
    -- Check if category_id column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'resources' 
        AND column_name = 'category_id'
    ) THEN
        -- Migrate data from resource_categories to category string
        UPDATE resources r
        SET category = rc.name
        FROM resource_categories rc
        WHERE r.category_id = rc.id
        AND (r.category IS NULL OR r.category = '');
        
        -- Drop the foreign key constraint if it exists
        ALTER TABLE resources DROP CONSTRAINT IF EXISTS fk_resources_category;
        
        -- Drop the category_id column
        ALTER TABLE resources DROP COLUMN category_id;
        
        RAISE NOTICE 'Migration completed: category_id removed, data migrated to category column';
    ELSE
        RAISE NOTICE 'category_id column does not exist, no migration needed';
    END IF;
    
    -- Ensure category column is NOT NULL
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'resources' 
        AND column_name = 'category'
        AND is_nullable = 'YES'
    ) THEN
        -- First, fill any NULL values with a default
        UPDATE resources SET category = 'Uncategorized' WHERE category IS NULL;
        
        -- Then make it NOT NULL
        ALTER TABLE resources ALTER COLUMN category SET NOT NULL;
        
        RAISE NOTICE 'Category column set to NOT NULL';
    END IF;
END $$;

-- Verify the final schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'resources' 
ORDER BY ordinal_position;

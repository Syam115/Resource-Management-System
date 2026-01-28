-- WARNING: This will delete all existing data!
-- Only use this if you don't have important data in the database

-- Drop tables in correct order (respect foreign keys)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS resource_categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- The tables will be recreated by Hibernate when you restart the application
-- with the new schema (category as VARCHAR instead of foreign key)

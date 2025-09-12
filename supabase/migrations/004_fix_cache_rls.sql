-- Ensure cache tables don't have RLS enabled (performance optimization)
-- These tables contain non-sensitive, temporary data that expires automatically

ALTER TABLE cached_recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE search_cache DISABLE ROW LEVEL SECURITY;

-- Drop any accidental policies on cache tables
DROP POLICY IF EXISTS "Enable read access for all users" ON cached_recipes;
DROP POLICY IF EXISTS "Enable read access for all users" ON search_cache;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON cached_recipes; 
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON search_cache;

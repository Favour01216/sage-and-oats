-- Create cached_recipes table for server-side caching
CREATE TABLE cached_recipes (
  id SERIAL PRIMARY KEY,
  uri TEXT UNIQUE NOT NULL,
  recipe_data JSONB NOT NULL,
  source TEXT DEFAULT 'edamam',
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days')
);

-- Create search_cache table for caching search results
CREATE TABLE search_cache (
  id SERIAL PRIMARY KEY,
  cache_key TEXT UNIQUE NOT NULL,
  query_params JSONB NOT NULL,
  results JSONB NOT NULL,
  hit_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 hours')
);

-- Create user_collections table for personalized recipe collections
CREATE TABLE user_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create collection_recipes table for recipes in collections
CREATE TABLE collection_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES user_collections(id) ON DELETE CASCADE,
  recipe_uri TEXT NOT NULL,
  notes TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cached_recipes_uri ON cached_recipes(uri);
CREATE INDEX idx_cached_recipes_expires ON cached_recipes(expires_at);
CREATE INDEX idx_cached_recipes_view_count ON cached_recipes(view_count DESC);
CREATE INDEX idx_search_cache_key ON search_cache(cache_key);
CREATE INDEX idx_search_cache_expires ON search_cache(expires_at);
CREATE INDEX idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX idx_collection_recipes_collection_id ON collection_recipes(collection_id);
CREATE INDEX idx_collection_recipes_uri ON collection_recipes(recipe_uri);

-- Row Level Security (RLS) policies
ALTER TABLE user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_recipes ENABLE ROW LEVEL SECURITY;

-- User collections policies - users can only see their own or public collections
CREATE POLICY "Users can view their own collections or public ones" ON user_collections
  FOR SELECT USING (
    user_id = auth.uid() OR is_public = true
  );

CREATE POLICY "Users can create their own collections" ON user_collections
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own collections" ON user_collections
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own collections" ON user_collections
  FOR DELETE USING (user_id = auth.uid());

-- Collection recipes policies - users can only manage recipes in their own collections
CREATE POLICY "Users can view recipes in accessible collections" ON collection_recipes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_collections 
      WHERE id = collection_recipes.collection_id 
      AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can manage recipes in their own collections" ON collection_recipes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_collections 
      WHERE id = collection_recipes.collection_id 
      AND user_id = auth.uid()
    )
  );

-- Function to increment save count
CREATE OR REPLACE FUNCTION increment_save_count(recipe_uri TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO cached_recipes (uri, recipe_data, save_count)
  VALUES (recipe_uri, '{}'::jsonb, 1)
  ON CONFLICT (uri) 
  DO UPDATE SET save_count = cached_recipes.save_count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement save count
CREATE OR REPLACE FUNCTION decrement_save_count(recipe_uri TEXT)
RETURNS void AS $$
BEGIN
  UPDATE cached_recipes 
  SET save_count = GREATEST(0, save_count - 1)
  WHERE uri = recipe_uri;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired cache (can be called via cron or manually)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM cached_recipes WHERE expires_at < NOW();
  DELETE FROM search_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

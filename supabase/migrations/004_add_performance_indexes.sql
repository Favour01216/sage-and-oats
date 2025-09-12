-- Add performance indexes for common queries

-- Indexes for hearts table queries
CREATE INDEX IF NOT EXISTS idx_hearts_recipe_id ON hearts(recipe_id);
CREATE INDEX IF NOT EXISTS idx_hearts_user_id ON hearts(user_id);
CREATE INDEX IF NOT EXISTS idx_hearts_device_id ON hearts(device_id);
CREATE INDEX IF NOT EXISTS idx_hearts_created_at ON hearts(created_at);

-- Indexes for recipes table queries
CREATE INDEX IF NOT EXISTS idx_recipes_slug ON recipes(slug);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON recipes(cuisine);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_total_minutes ON recipes(total_minutes);
CREATE INDEX IF NOT EXISTS idx_recipes_avg_rating ON recipes(avg_rating);
CREATE INDEX IF NOT EXISTS idx_recipes_calories_per_serving ON recipes(calories_per_serving);
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);
CREATE INDEX IF NOT EXISTS idx_recipes_external_source ON recipes(external_source);

-- Indexes for recipe_ingredients table
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_order_index ON recipe_ingredients(recipe_id, order_index);

-- Indexes for recipe_steps table
CREATE INDEX IF NOT EXISTS idx_recipe_steps_recipe_id ON recipe_steps(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_steps_order_index ON recipe_steps(recipe_id, order_index);

-- Indexes for recipe_nutrition table
CREATE INDEX IF NOT EXISTS idx_recipe_nutrition_recipe_id ON recipe_nutrition(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_nutrition_calories ON recipe_nutrition(calories);

-- Indexes for ratings table
CREATE INDEX IF NOT EXISTS idx_ratings_recipe_id ON ratings(recipe_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_stars ON ratings(stars);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_recipes_search ON recipes(cuisine, total_minutes, avg_rating) 
  WHERE external_source = true;

CREATE INDEX IF NOT EXISTS idx_hearts_count ON hearts(recipe_id, created_at);

-- Index for collection queries
CREATE INDEX IF NOT EXISTS idx_user_collections_user_public ON user_collections(user_id, is_public);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_uri ON collection_recipes(recipe_uri);

-- Add partial indexes for better performance on filtered queries
CREATE INDEX IF NOT EXISTS idx_recipes_quick_meals ON recipes(total_minutes, avg_rating) 
  WHERE total_minutes <= 30 AND external_source = true;

CREATE INDEX IF NOT EXISTS idx_recipes_high_rated ON recipes(avg_rating, created_at) 
  WHERE avg_rating >= 4.0 AND external_source = true;
-- Seed data for Sage & Oat recipes
-- Clear existing data
TRUNCATE recipes, recipe_ingredients, recipe_steps, recipe_nutrition CASCADE;

-- Insert 5 balanced recipes
INSERT INTO recipes (id, slug, title, intro, hero_image_url, yield, prep_time, cook_time, total_minutes, difficulty, tags, cuisine, status, created_at)
VALUES 
  -- Mediterranean Bowl
  ('recipe-1', 'mediterranean-quinoa-bowl', 'Mediterranean Quinoa Bowl', 
   'A vibrant, nutritious bowl packed with Mediterranean flavors, featuring fluffy quinoa, roasted vegetables, and creamy tahini dressing.',
   'https://res.cloudinary.com/demo/image/upload/v1/mediterranean-bowl.jpg',
   '4 servings', 15, 25, 40, 'easy', 
   ARRAY['vegetarian', 'healthy', 'meal-prep', 'gluten-free'], 'Mediterranean', 'published', NOW()),
  
  -- Thai Curry
  ('recipe-2', 'thai-green-curry', 'Thai Green Curry', 
   'An authentic Thai green curry with tender vegetables, aromatic herbs, and creamy coconut milk. Perfect for spice lovers!',
   'https://res.cloudinary.com/demo/image/upload/v1/thai-curry.jpg',
   '6 servings', 20, 30, 50, 'medium', 
   ARRAY['thai', 'spicy', 'vegan', 'dairy-free'], 'Thai', 'published', NOW() - INTERVAL '1 day'),
  
  -- Italian Pasta
  ('recipe-3', 'homemade-pesto-pasta', 'Homemade Pesto Pasta', 
   'Classic Italian pasta with fresh basil pesto, cherry tomatoes, and pine nuts. Simple yet incredibly flavorful.',
   'https://res.cloudinary.com/demo/image/upload/v1/pesto-pasta.jpg',
   '4 servings', 10, 15, 25, 'easy', 
   ARRAY['italian', 'quick', 'vegetarian', 'pasta'], 'Italian', 'published', NOW() - INTERVAL '2 days'),
  
  -- Mexican Tacos
  ('recipe-4', 'fish-tacos-mango-salsa', 'Fish Tacos with Mango Salsa', 
   'Crispy fish tacos topped with fresh mango salsa and lime crema. A perfect balance of textures and tropical flavors.',
   'https://res.cloudinary.com/demo/image/upload/v1/fish-tacos.jpg',
   '4 servings', 25, 20, 45, 'medium', 
   ARRAY['mexican', 'seafood', 'summer', 'fresh'], 'Mexican', 'published', NOW() - INTERVAL '3 days'),
  
  -- Japanese Ramen
  ('recipe-5', 'miso-ramen-bowl', 'Miso Ramen Bowl', 
   'Rich and comforting miso ramen with soft-boiled eggs, tender pork, and fresh vegetables in a savory broth.',
   'https://res.cloudinary.com/demo/image/upload/v1/miso-ramen.jpg',
   '2 servings', 30, 180, 210, 'hard', 
   ARRAY['japanese', 'comfort-food', 'soup', 'noodles'], 'Japanese', 'published', NOW() - INTERVAL '4 days');

-- Mediterranean Bowl Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_text, group_name, display_order)
VALUES 
  ('recipe-1', '1 cup quinoa, rinsed', 'Base', 1),
  ('recipe-1', '2 cups vegetable broth', 'Base', 2),
  ('recipe-1', '1 cucumber, diced', 'Vegetables', 3),
  ('recipe-1', '2 cups cherry tomatoes, halved', 'Vegetables', 4),
  ('recipe-1', '1 red bell pepper, diced', 'Vegetables', 5),
  ('recipe-1', '1/2 red onion, thinly sliced', 'Vegetables', 6),
  ('recipe-1', '1 cup chickpeas, cooked', 'Vegetables', 7),
  ('recipe-1', '1/2 cup kalamata olives', 'Toppings', 8),
  ('recipe-1', '1/2 cup feta cheese, crumbled', 'Toppings', 9),
  ('recipe-1', '1/4 cup tahini', 'Dressing', 10),
  ('recipe-1', '2 tbsp lemon juice', 'Dressing', 11),
  ('recipe-1', '2 cloves garlic, minced', 'Dressing', 12),
  ('recipe-1', 'Salt and pepper to taste', 'Dressing', 13);

-- Thai Green Curry Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_text, display_order)
VALUES 
  ('recipe-2', '2 tbsp green curry paste', 1),
  ('recipe-2', '400ml coconut milk', 2),
  ('recipe-2', '1 cup vegetable broth', 3),
  ('recipe-2', '200g firm tofu, cubed', 4),
  ('recipe-2', '1 eggplant, cubed', 5),
  ('recipe-2', '1 red bell pepper, sliced', 6),
  ('recipe-2', '100g green beans', 7),
  ('recipe-2', '2 kaffir lime leaves', 8),
  ('recipe-2', '1 stalk lemongrass, bruised', 9),
  ('recipe-2', '1 tbsp palm sugar', 10),
  ('recipe-2', '2 tbsp soy sauce', 11),
  ('recipe-2', 'Thai basil for garnish', 12);

-- Pesto Pasta Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_text, display_order)
VALUES 
  ('recipe-3', '400g pasta (linguine or spaghetti)', 1),
  ('recipe-3', '2 cups fresh basil leaves', 2),
  ('recipe-3', '1/2 cup pine nuts', 3),
  ('recipe-3', '3 cloves garlic', 4),
  ('recipe-3', '1/2 cup parmesan cheese, grated', 5),
  ('recipe-3', '1/2 cup extra virgin olive oil', 6),
  ('recipe-3', '1 cup cherry tomatoes', 7),
  ('recipe-3', 'Salt and black pepper', 8);

-- Fish Tacos Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_text, group_name, display_order)
VALUES 
  ('recipe-4', '500g white fish fillets', 'Fish', 1),
  ('recipe-4', '1 cup flour', 'Fish', 2),
  ('recipe-4', '1 tsp paprika', 'Fish', 3),
  ('recipe-4', '1 tsp cumin', 'Fish', 4),
  ('recipe-4', '1 ripe mango, diced', 'Salsa', 5),
  ('recipe-4', '1/2 red onion, finely diced', 'Salsa', 6),
  ('recipe-4', '1 jalapeño, minced', 'Salsa', 7),
  ('recipe-4', '1/4 cup cilantro, chopped', 'Salsa', 8),
  ('recipe-4', 'Juice of 2 limes', 'Salsa', 9),
  ('recipe-4', '8 corn tortillas', 'Serving', 10),
  ('recipe-4', '1/2 cup sour cream', 'Serving', 11),
  ('recipe-4', 'Lime wedges', 'Serving', 12);

-- Miso Ramen Ingredients
INSERT INTO recipe_ingredients (recipe_id, ingredient_text, group_name, display_order)
VALUES 
  ('recipe-5', '200g ramen noodles', 'Base', 1),
  ('recipe-5', '4 cups chicken broth', 'Broth', 2),
  ('recipe-5', '3 tbsp miso paste', 'Broth', 3),
  ('recipe-5', '2 tbsp soy sauce', 'Broth', 4),
  ('recipe-5', '1 tbsp mirin', 'Broth', 5),
  ('recipe-5', '2 cloves garlic, minced', 'Broth', 6),
  ('recipe-5', '1 inch ginger, grated', 'Broth', 7),
  ('recipe-5', '200g pork belly, sliced', 'Toppings', 8),
  ('recipe-5', '2 eggs', 'Toppings', 9),
  ('recipe-5', '2 green onions, sliced', 'Toppings', 10),
  ('recipe-5', 'Nori sheets', 'Toppings', 11),
  ('recipe-5', 'Corn kernels', 'Toppings', 12);

-- Mediterranean Bowl Steps
INSERT INTO recipe_steps (recipe_id, step_number, step_text, timer_minutes)
VALUES 
  ('recipe-1', 1, 'Rinse quinoa under cold water until water runs clear.', NULL),
  ('recipe-1', 2, 'In a pot, bring vegetable broth to a boil. Add quinoa, reduce heat, cover and simmer.', 15),
  ('recipe-1', 3, 'While quinoa cooks, prepare the vegetables: dice cucumber and bell pepper, halve tomatoes, slice onion.', NULL),
  ('recipe-1', 4, 'For the dressing, whisk together tahini, lemon juice, minced garlic, and 2-3 tbsp water until smooth.', NULL),
  ('recipe-1', 5, 'Once quinoa is cooked, fluff with a fork and let cool slightly.', 5),
  ('recipe-1', 6, 'Assemble bowls: divide quinoa, top with vegetables, chickpeas, olives, and feta.', NULL),
  ('recipe-1', 7, 'Drizzle with tahini dressing and serve.', NULL);

-- Thai Green Curry Steps
INSERT INTO recipe_steps (recipe_id, step_number, step_text, timer_minutes)
VALUES 
  ('recipe-2', 1, 'Heat oil in a large pan or wok over medium-high heat.', NULL),
  ('recipe-2', 2, 'Add green curry paste and fry for 1-2 minutes until fragrant.', 2),
  ('recipe-2', 3, 'Pour in half the coconut milk, stirring constantly.', NULL),
  ('recipe-2', 4, 'Add tofu and vegetables, stir to coat with curry mixture.', NULL),
  ('recipe-2', 5, 'Add remaining coconut milk, broth, lime leaves, and lemongrass.', NULL),
  ('recipe-2', 6, 'Simmer for 15-20 minutes until vegetables are tender.', 20),
  ('recipe-2', 7, 'Season with palm sugar and soy sauce. Garnish with Thai basil.', NULL);

-- Pesto Pasta Steps
INSERT INTO recipe_steps (recipe_id, step_number, step_text, timer_minutes)
VALUES 
  ('recipe-3', 1, 'Bring a large pot of salted water to boil for pasta.', NULL),
  ('recipe-3', 2, 'Toast pine nuts in a dry pan until golden. Set aside to cool.', 3),
  ('recipe-3', 3, 'In a food processor, combine basil, pine nuts, garlic, and parmesan. Pulse until coarsely chopped.', NULL),
  ('recipe-3', 4, 'With processor running, slowly add olive oil until smooth pesto forms.', NULL),
  ('recipe-3', 5, 'Cook pasta according to package directions until al dente.', 10),
  ('recipe-3', 6, 'Reserve 1 cup pasta water, then drain pasta.', NULL),
  ('recipe-3', 7, 'Toss hot pasta with pesto, adding pasta water as needed. Top with tomatoes.', NULL);

-- Fish Tacos Steps
INSERT INTO recipe_steps (recipe_id, step_number, step_text, timer_minutes)
VALUES 
  ('recipe-4', 1, 'Mix flour with paprika, cumin, salt, and pepper for coating.', NULL),
  ('recipe-4', 2, 'Cut fish into strips and coat in seasoned flour.', NULL),
  ('recipe-4', 3, 'For salsa: combine mango, onion, jalapeño, cilantro, and lime juice. Set aside.', NULL),
  ('recipe-4', 4, 'Heat oil in a pan. Fry fish strips until golden and crispy.', 8),
  ('recipe-4', 5, 'Warm tortillas in a dry pan or microwave.', 2),
  ('recipe-4', 6, 'Mix sour cream with lime juice for crema.', NULL),
  ('recipe-4', 7, 'Assemble tacos: place fish in tortillas, top with mango salsa and lime crema.', NULL);

-- Miso Ramen Steps
INSERT INTO recipe_steps (recipe_id, step_number, step_text, timer_minutes)
VALUES 
  ('recipe-5', 1, 'Prepare soft-boiled eggs: boil for exactly 6.5 minutes, then ice bath.', 7),
  ('recipe-5', 2, 'In a pot, heat oil and sauté garlic and ginger until fragrant.', 2),
  ('recipe-5', 3, 'Add chicken broth and bring to a simmer.', NULL),
  ('recipe-5', 4, 'In a small bowl, mix miso paste with a ladle of hot broth until smooth.', NULL),
  ('recipe-5', 5, 'Add miso mixture, soy sauce, and mirin to the pot. Keep warm.', NULL),
  ('recipe-5', 6, 'In a separate pan, sear pork belly slices until crispy.', 5),
  ('recipe-5', 7, 'Cook ramen noodles according to package directions.', 4),
  ('recipe-5', 8, 'Divide noodles between bowls, ladle hot broth over.', NULL),
  ('recipe-5', 9, 'Top with pork, halved eggs, green onions, nori, and corn.', NULL);

-- Add nutrition data for Mediterranean Bowl (as example)
INSERT INTO recipe_nutrition (recipe_id, calories_per_serving, protein_g, fat_g, carbs_g, fiber_g, sugar_g, sodium_mg)
VALUES 
  ('recipe-1', 420, 15, 18, 52, 9, 8, 580),
  ('recipe-2', 380, 12, 22, 35, 6, 10, 720),
  ('recipe-3', 520, 18, 24, 58, 4, 5, 450),
  ('recipe-4', 350, 28, 12, 38, 5, 8, 620),
  ('recipe-5', 680, 32, 28, 72, 3, 6, 1850);

-- Update average ratings (mock data)
UPDATE recipes SET avg_rating = 4.5, review_count = 12 WHERE id = 'recipe-1';
UPDATE recipes SET avg_rating = 4.8, review_count = 8 WHERE id = 'recipe-2';
UPDATE recipes SET avg_rating = 4.3, review_count = 15 WHERE id = 'recipe-3';
UPDATE recipes SET avg_rating = 4.6, review_count = 10 WHERE id = 'recipe-4';
UPDATE recipes SET avg_rating = 4.9, review_count = 6 WHERE id = 'recipe-5';

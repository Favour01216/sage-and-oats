-- Insert sample recipes
INSERT INTO recipes (slug, title, intro, hero_image_url, tags, yield, total_minutes, difficulty, avg_rating)
VALUES 
  ('lemon-herb-roasted-chicken', 'Lemon Herb Roasted Chicken', 'A simple yet elegant roasted chicken with bright lemon and fresh herbs.', 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800', ARRAY['dinner', 'gluten-free', 'high-protein'], '4 servings', 75, 'easy', 4.8),
  ('creamy-mushroom-risotto', 'Creamy Mushroom Risotto', 'A rich and comforting Italian classic with earthy mushrooms and parmesan.', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800', ARRAY['dinner', 'vegetarian', 'comfort-food'], '4 servings', 35, 'medium', 4.6),
  ('thai-green-curry', 'Thai Green Curry', 'A vibrant and aromatic curry with vegetables and coconut milk.', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800', ARRAY['dinner', 'vegan', 'gluten-free', 'spicy'], '4 servings', 30, 'easy', 4.7),
  ('chocolate-chip-cookies', 'Classic Chocolate Chip Cookies', 'Crispy edges with a chewy center, loaded with chocolate chips.', 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800', ARRAY['dessert', 'vegetarian', 'comfort-food'], '24 cookies', 25, 'easy', 4.9),
  ('avocado-toast', 'Gourmet Avocado Toast', 'Simple yet satisfying breakfast with creamy avocado on crispy bread.', 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800', ARRAY['breakfast', 'vegetarian', 'quick'], '2 servings', 10, 'easy', 4.5);

-- Get recipe IDs for adding ingredients and steps
DO $$
DECLARE
  chicken_id UUID;
  risotto_id UUID;
  curry_id UUID;
BEGIN
  SELECT id INTO chicken_id FROM recipes WHERE slug = 'lemon-herb-roasted-chicken';
  SELECT id INTO risotto_id FROM recipes WHERE slug = 'creamy-mushroom-risotto';
  SELECT id INTO curry_id FROM recipes WHERE slug = 'thai-green-curry';

  -- Add ingredients for Lemon Herb Roasted Chicken
  INSERT INTO recipe_ingredients (recipe_id, line_text, quantity_num, unit, item)
  VALUES 
    (chicken_id, '1 whole chicken (4-5 lbs)', 1, 'whole', 'chicken'),
    (chicken_id, '2 lemons, halved', 2, 'whole', 'lemons'),
    (chicken_id, '4 sprigs fresh rosemary', 4, 'sprigs', 'rosemary'),
    (chicken_id, '6 cloves garlic, minced', 6, 'cloves', 'garlic'),
    (chicken_id, '3 tbsp olive oil', 3, 'tbsp', 'olive oil');

  -- Add steps for Lemon Herb Roasted Chicken
  INSERT INTO recipe_steps (recipe_id, step_number, text, timer_seconds)
  VALUES 
    (chicken_id, 1, 'Preheat oven to 425°F (220°C).', NULL),
    (chicken_id, 2, 'Pat chicken dry and season inside and out with salt and pepper.', NULL),
    (chicken_id, 3, 'Stuff cavity with lemon halves and rosemary.', NULL),
    (chicken_id, 4, 'Rub skin with olive oil and minced garlic.', NULL),
    (chicken_id, 5, 'Roast for 1 hour 15 minutes until golden.', 4500),
    (chicken_id, 6, 'Let rest for 10 minutes before carving.', 600);

  -- Add ingredients for Creamy Mushroom Risotto
  INSERT INTO recipe_ingredients (recipe_id, line_text, quantity_num, unit, item)
  VALUES 
    (risotto_id, '1½ cups arborio rice', 1.5, 'cups', 'arborio rice'),
    (risotto_id, '1 lb mixed mushrooms, sliced', 1, 'lb', 'mushrooms'),
    (risotto_id, '4 cups vegetable broth', 4, 'cups', 'vegetable broth'),
    (risotto_id, '1 cup white wine', 1, 'cup', 'white wine'),
    (risotto_id, '1 cup parmesan cheese, grated', 1, 'cup', 'parmesan');

  -- Add steps for Creamy Mushroom Risotto
  INSERT INTO recipe_steps (recipe_id, step_number, text, timer_seconds)
  VALUES 
    (risotto_id, 1, 'Heat broth in a separate pot and keep warm.', NULL),
    (risotto_id, 2, 'Sauté mushrooms until golden, set aside.', NULL),
    (risotto_id, 3, 'Toast rice in butter for 2 minutes.', 120),
    (risotto_id, 4, 'Add wine and stir until absorbed.', NULL),
    (risotto_id, 5, 'Add broth one ladle at a time, stirring constantly.', 1200),
    (risotto_id, 6, 'Stir in mushrooms and parmesan, serve immediately.', NULL);

  -- Add ingredients for Thai Green Curry
  INSERT INTO recipe_ingredients (recipe_id, line_text, quantity_num, unit, item)
  VALUES 
    (curry_id, '2 tbsp green curry paste', 2, 'tbsp', 'curry paste'),
    (curry_id, '1 can (14 oz) coconut milk', 14, 'oz', 'coconut milk'),
    (curry_id, '1 lb mixed vegetables', 1, 'lb', 'vegetables'),
    (curry_id, '1 cup Thai basil leaves', 1, 'cup', 'Thai basil'),
    (curry_id, '2 tbsp fish sauce (or soy sauce)', 2, 'tbsp', 'fish sauce');

  -- Add steps for Thai Green Curry
  INSERT INTO recipe_steps (recipe_id, step_number, text, timer_seconds)
  VALUES 
    (curry_id, 1, 'Heat oil in a wok or large pan.', NULL),
    (curry_id, 2, 'Fry curry paste for 1 minute until fragrant.', 60),
    (curry_id, 3, 'Add coconut milk and bring to a simmer.', NULL),
    (curry_id, 4, 'Add vegetables and cook for 10 minutes.', 600),
    (curry_id, 5, 'Season with fish sauce and palm sugar.', NULL),
    (curry_id, 6, 'Garnish with Thai basil and serve with rice.', NULL);
END $$;

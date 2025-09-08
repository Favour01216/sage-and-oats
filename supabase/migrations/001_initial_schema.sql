-- Create recipes table
create table recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  hero_image_url text,
  intro text,
  yield text,
  total_minutes int,
  difficulty text,
  tags text[] default '{}',
  cuisine text,
  author_id uuid references auth.users(id) on delete set null,
  avg_rating numeric(2,1) default 0,
  created_at timestamptz default now()
);

-- Create recipe_ingredients table
create table recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  group_label text,
  line_text text not null,
  quantity_num numeric,
  unit text,
  item text,
  note text
);
create index on recipe_ingredients (recipe_id);

-- Create recipe_steps table
create table recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  step_number int not null,
  text text not null,
  timer_seconds int
);
create unique index on recipe_steps (recipe_id, step_number);

-- Create recipe_nutrition table
create table recipe_nutrition (
  recipe_id uuid primary key references recipes(id) on delete cascade,
  calories numeric,
  protein_g numeric,
  fat_g numeric,
  carbs_g numeric,
  fiber_g numeric,
  sugar_g numeric,
  sodium_mg numeric,
  raw_edamam jsonb
);

-- Create hearts table
create table hearts (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  device_id text,
  created_at timestamptz default now(),
  constraint hearts_user_or_device check (
    (user_id is not null and device_id is null) or
    (user_id is null and device_id is not null)
  )
);

-- Prevent duplicates
create unique index hearts_unique_user on hearts(recipe_id, user_id) where user_id is not null;
create unique index hearts_unique_device on hearts(recipe_id, device_id) where device_id is not null;

-- Create ratings table
create table ratings (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid references recipes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  stars int check (stars between 1 and 5),
  comment text,
  created_at timestamptz default now()
);
create index on ratings (recipe_id);

-- Enable RLS
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table recipe_nutrition enable row level security;
alter table hearts enable row level security;
alter table ratings enable row level security;

-- RLS Policies for recipes
create policy "recipes_read_all" on recipes for select using (true);
create policy "recipes_insert_auth" on recipes for insert with check (auth.uid() = author_id);
create policy "recipes_update_owner" on recipes for update using (auth.uid() = author_id);
create policy "recipes_delete_owner" on recipes for delete using (auth.uid() = author_id);

-- RLS Policies for recipe_ingredients
create policy "ingredients_read_all" on recipe_ingredients for select using (true);
create policy "ingredients_manage_owner" on recipe_ingredients for all 
  using (exists (select 1 from recipes where recipes.id = recipe_ingredients.recipe_id and recipes.author_id = auth.uid()));

-- RLS Policies for recipe_steps
create policy "steps_read_all" on recipe_steps for select using (true);
create policy "steps_manage_owner" on recipe_steps for all 
  using (exists (select 1 from recipes where recipes.id = recipe_steps.recipe_id and recipes.author_id = auth.uid()));

-- RLS Policies for recipe_nutrition
create policy "nutrition_read_all" on recipe_nutrition for select using (true);
create policy "nutrition_manage_owner" on recipe_nutrition for all 
  using (exists (select 1 from recipes where recipes.id = recipe_nutrition.recipe_id and recipes.author_id = auth.uid()));

-- RLS Policies for hearts
create policy "hearts_read_all" on hearts for select using (true);
create policy "hearts_insert_user" on hearts for insert with check (user_id = auth.uid());
create policy "hearts_insert_device" on hearts for insert with check (user_id is null and device_id is not null);
create policy "hearts_update_owner" on hearts for update using (user_id = auth.uid());
create policy "hearts_delete_owner" on hearts for delete using (user_id = auth.uid());

-- RLS Policies for ratings
create policy "ratings_read_all" on ratings for select using (true);
create policy "ratings_insert_auth" on ratings for insert with check (user_id = auth.uid());
create policy "ratings_update_owner" on ratings for update using (user_id = auth.uid());
create policy "ratings_delete_owner" on ratings for delete using (user_id = auth.uid());

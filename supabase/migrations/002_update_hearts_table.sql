-- Modify hearts table to work with external recipe IDs
-- Remove foreign key constraint and change recipe_id to text

-- Drop existing table and recreate
DROP TABLE IF EXISTS hearts;

-- Create new hearts table without foreign key constraint
CREATE TABLE hearts (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null, -- Changed to text to support external IDs
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

-- Enable RLS
alter table hearts enable row level security;

-- Create policies for hearts
create policy "hearts_read_all" on hearts for select using (true);
create policy "hearts_insert_user" on hearts for insert with check (user_id = auth.uid());
create policy "hearts_insert_device" on hearts for insert with check (user_id is null and device_id is not null);
create policy "hearts_update_owner" on hearts for update using (user_id = auth.uid());
create policy "hearts_delete_owner" on hearts for delete using (user_id = auth.uid());
create policy "hearts_delete_device" on hearts for delete using (user_id is null and device_id is not null);

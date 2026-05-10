-- EthioHomes Initial Schema
-- Run this in your Supabase SQL editor to set up the database.

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  description text,
  price numeric not null,
  price_type text check (price_type in ('rent', 'sale')) not null,
  price_period text check (price_period in ('monthly', 'yearly', 'total')),
  city text not null,
  subcity text,
  woreda text,
  bedrooms integer,
  bathrooms integer,
  area_sqm numeric,
  property_type text check (property_type in ('apartment', 'house', 'villa', 'commercial', 'land')) not null,
  images text[],
  amenities text[],
  lat numeric,
  lng numeric,
  agent_id uuid references auth.users(id),
  agent_name text,
  agent_phone text not null,
  is_featured boolean default false,
  is_active boolean default true
);

create table if not exists agents (
  id uuid references auth.users(id) primary key,
  full_name text not null,
  phone text not null,
  agency_name text,
  whatsapp text,
  bio text,
  avatar_url text,
  verified boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table properties enable row level security;
alter table agents enable row level security;

-- Properties: anyone can read active listings
create policy "Public can read active properties"
  on properties for select
  using (is_active = true);

-- Properties: agents can read all their own (including inactive)
create policy "Agents read own properties"
  on properties for select
  using (auth.uid() = agent_id);

-- Properties: authenticated agents can insert
create policy "Agents can insert properties"
  on properties for insert
  with check (auth.uid() = agent_id);

-- Properties: agents can update their own
create policy "Agents can update own properties"
  on properties for update
  using (auth.uid() = agent_id);

-- Properties: agents can delete their own
create policy "Agents can delete own properties"
  on properties for delete
  using (auth.uid() = agent_id);

-- Agents: public read
create policy "Public can read agents"
  on agents for select
  using (true);

-- Agents: user can insert their own profile
create policy "User can insert own agent profile"
  on agents for insert
  with check (auth.uid() = id);

-- Agents: user can update their own profile
create policy "User can update own agent profile"
  on agents for update
  using (auth.uid() = id);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Run in Supabase dashboard > Storage or via SQL:
--
-- insert into storage.buckets (id, name, public)
-- values ('property-images', 'property-images', true);
--
-- create policy "Public read property images"
--   on storage.objects for select
--   using (bucket_id = 'property-images');
--
-- create policy "Authenticated upload property images"
--   on storage.objects for insert
--   with check (bucket_id = 'property-images' and auth.role() = 'authenticated');
--
-- create policy "Owner delete property images"
--   on storage.objects for delete
--   using (bucket_id = 'property-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- SAMPLE DATA (optional, for local testing)
-- ============================================================
-- insert into properties (title, price, price_type, price_period, city, subcity, bedrooms, bathrooms, property_type, agent_name, agent_phone, is_featured, is_active)
-- values
--   ('Modern 3BR Apartment in Bole', 25000, 'rent', 'monthly', 'Addis Ababa', 'Bole', 3, 2, 'apartment', 'Abebe Girma', '912345678', true, true),
--   ('Luxury Villa in CMC', 8500000, 'sale', 'total', 'Addis Ababa', 'CMC', 5, 4, 'villa', 'Sara Tadesse', '911234567', true, true),
--   ('Studio in Kazanchis', 12000, 'rent', 'monthly', 'Addis Ababa', 'Kazanchis', 0, 1, 'apartment', 'Dawit Haile', '913456789', false, true);

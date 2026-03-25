create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  city text,
  avatar_url text,
  flavor_preferences text[] not null default '{}',
  roast_preference text,
  drink_style text,
  discovery_style text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roasters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  description text,
  city text,
  image_url text,
  brand_tags text[] not null default '{}',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cafes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  neighborhood text,
  city text,
  address text,
  lat double precision,
  lng double precision,
  hours_text text,
  tags text[] not null default '{}',
  image_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists beans (
  id uuid primary key default gen_random_uuid(),
  roaster_id uuid references roasters(id) on delete set null,
  slug text not null unique,
  name text not null,
  origin text,
  producer_estate text,
  process text,
  roast_style text,
  flavor_notes text[] not null default '{}',
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists cafe_bean_availability (
  id uuid primary key default gen_random_uuid(),
  cafe_id uuid not null references cafes(id) on delete cascade,
  bean_id uuid not null references beans(id) on delete cascade,
  availability_types text[] not null default '{}',
  freshness_note text,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (cafe_id, bean_id)
);

create table if not exists saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('bean', 'cafe', 'roaster')),
  entity_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_slug)
);

create table if not exists follows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('cafe', 'roaster')),
  entity_slug text not null,
  created_at timestamptz not null default now(),
  unique (user_id, entity_type, entity_slug)
);

create table if not exists reactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bean_id uuid not null references beans(id) on delete cascade,
  cafe_id uuid references cafes(id) on delete set null,
  reaction text not null check (reaction in ('loved_it', 'liked_it', 'not_for_me')),
  reaction_tags text[] not null default '{}',
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_roasters_slug on roasters(slug);
create index if not exists idx_cafes_slug on cafes(slug);
create index if not exists idx_beans_slug on beans(slug);
create index if not exists idx_beans_roaster_id on beans(roaster_id);
create index if not exists idx_cafe_bean_availability_cafe_id on cafe_bean_availability(cafe_id);
create index if not exists idx_cafe_bean_availability_bean_id on cafe_bean_availability(bean_id);
create index if not exists idx_saves_user_id on saves(user_id);
create index if not exists idx_follows_user_id on follows(user_id);
create index if not exists idx_reactions_user_id on reactions(user_id);
create index if not exists idx_reactions_bean_id on reactions(bean_id);
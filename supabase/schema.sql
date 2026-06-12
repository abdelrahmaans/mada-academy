create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  phone text not null,
  child_name text,
  child_age int,
  selected_track text,
  reason text not null check (reason in ('start_track','free_workshop','ask_question','pricing','partnership','other')),
  message text,
  source_page text,
  source_section text,
  status text not null default 'new' check (status in ('new','contacted','qualified','enrolled','closed')),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  admin_id uuid references auth.users(id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title text not null,
  body text not null,
  is_enabled boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  age text not null,
  focus text not null,
  tools text[] not null default '{}',
  outcome text not null,
  description text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists stars_board (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  avatar_url text,
  track text not null,
  badge text not null,
  xp int not null default 0,
  project text not null,
  quote text not null,
  highlight_reason text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  thumbnail_url text,
  platform text not null check (platform in ('instagram','tiktok','youtube','blog')),
  external_link text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  alt_text text not null,
  item_type text not null default 'photo' check (item_type in ('photo','project','certificate')),
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  role text not null,
  quote text not null,
  image_url text,
  rating int not null default 5,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table testimonials add column if not exists image_url text;

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media_library (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  public_url text not null,
  bucket text not null,
  path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at before update on profiles for each row execute function set_updated_at();
drop trigger if exists trg_leads_updated_at on leads;
create trigger trg_leads_updated_at before update on leads for each row execute function set_updated_at();
drop trigger if exists trg_site_settings_updated_at on site_settings;
create trigger trg_site_settings_updated_at before update on site_settings for each row execute function set_updated_at();
drop trigger if exists trg_homepage_sections_updated_at on homepage_sections;
create trigger trg_homepage_sections_updated_at before update on homepage_sections for each row execute function set_updated_at();
drop trigger if exists trg_tracks_updated_at on tracks;
create trigger trg_tracks_updated_at before update on tracks for each row execute function set_updated_at();
drop trigger if exists trg_stars_board_updated_at on stars_board;
create trigger trg_stars_board_updated_at before update on stars_board for each row execute function set_updated_at();
drop trigger if exists trg_content_items_updated_at on content_items;
create trigger trg_content_items_updated_at before update on content_items for each row execute function set_updated_at();
drop trigger if exists trg_gallery_items_updated_at on gallery_items;
create trigger trg_gallery_items_updated_at before update on gallery_items for each row execute function set_updated_at();
drop trigger if exists trg_testimonials_updated_at on testimonials;
create trigger trg_testimonials_updated_at before update on testimonials for each row execute function set_updated_at();
drop trigger if exists trg_faqs_updated_at on faqs;
create trigger trg_faqs_updated_at before update on faqs for each row execute function set_updated_at();

create or replace function is_cms_user()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where profiles.id = auth.uid()
    and profiles.role in ('admin', 'editor')
  );
$$;

alter table profiles enable row level security;
alter table leads enable row level security;
alter table lead_notes enable row level security;
alter table site_settings enable row level security;
alter table homepage_sections enable row level security;
alter table tracks enable row level security;
alter table stars_board enable row level security;
alter table content_items enable row level security;
alter table gallery_items enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table media_library enable row level security;

create policy "profiles self read" on profiles for select using (auth.uid() = id or is_cms_user());
create policy "profiles admin manage" on profiles for all using (is_cms_user()) with check (is_cms_user());

create policy "public insert leads" on leads for insert with check (true);
create policy "cms read leads" on leads for select using (is_cms_user());
create policy "cms update leads" on leads for update using (is_cms_user()) with check (is_cms_user());

create policy "cms manage lead notes" on lead_notes for all using (is_cms_user()) with check (is_cms_user());

create policy "public read settings" on site_settings for select using (true);
create policy "cms manage settings" on site_settings for all using (is_cms_user()) with check (is_cms_user());

create policy "public read published homepage" on homepage_sections for select using (is_enabled = true);
create policy "cms manage homepage" on homepage_sections for all using (is_cms_user()) with check (is_cms_user());

create policy "public read published tracks" on tracks for select using (is_published = true);
create policy "cms manage tracks" on tracks for all using (is_cms_user()) with check (is_cms_user());

create policy "public read published stars" on stars_board for select using (is_published = true);
create policy "cms manage stars" on stars_board for all using (is_cms_user()) with check (is_cms_user());

create policy "public read published content" on content_items for select using (is_published = true);
create policy "cms manage content" on content_items for all using (is_cms_user()) with check (is_cms_user());

create policy "public read published gallery" on gallery_items for select using (is_published = true);
create policy "cms manage gallery" on gallery_items for all using (is_cms_user()) with check (is_cms_user());

create policy "public read published testimonials" on testimonials for select using (is_published = true);
create policy "cms manage testimonials" on testimonials for all using (is_cms_user()) with check (is_cms_user());

create policy "public read published faqs" on faqs for select using (is_published = true);
create policy "cms manage faqs" on faqs for all using (is_cms_user()) with check (is_cms_user());

create policy "public read media" on media_library for select using (true);
create policy "cms manage media" on media_library for all using (is_cms_user()) with check (is_cms_user());

insert into storage.buckets (id, name, public)
values ('mada-media', 'mada-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "public read mada media objects" on storage.objects;
create policy "public read mada media objects"
on storage.objects for select
using (bucket_id = 'mada-media');

drop policy if exists "cms insert mada media objects" on storage.objects;
create policy "cms insert mada media objects"
on storage.objects for insert
with check (bucket_id = 'mada-media' and is_cms_user());

drop policy if exists "cms update mada media objects" on storage.objects;
create policy "cms update mada media objects"
on storage.objects for update
using (bucket_id = 'mada-media' and is_cms_user())
with check (bucket_id = 'mada-media' and is_cms_user());

drop policy if exists "cms delete mada media objects" on storage.objects;
create policy "cms delete mada media objects"
on storage.objects for delete
using (bucket_id = 'mada-media' and is_cms_user());

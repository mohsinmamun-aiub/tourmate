-- ========================================================
-- TourMate BD - Complete Database Schema & Security
-- Run this script inside the Supabase SQL Editor
-- ========================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  university_name text not null,
  department text,
  student_id text,
  is_verified boolean default false,
  verification_method text check (verification_method in ('edu_email', 'id_card')),
  id_card_url text,
  gender text check (gender in ('male', 'female', 'other')),
  phone_number text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. TOURS / TRIPS TABLE
create table if not exists public.tours (
  id uuid default gen_random_uuid() primary key,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  destination text not null,
  departure_date date not null,
  return_date date not null,
  estimated_budget_bdt integer not null,
  max_members integer not null,
  gender_preference text default 'any' check (gender_preference in ('any', 'male_only', 'female_only')),
  description text not null,
  whatsapp_group_link text,
  status text default 'open' check (status in ('open', 'full', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- 3. TOUR JOIN REQUESTS TABLE
create table if not exists public.tour_requests (
  id uuid default gen_random_uuid() primary key,
  tour_id uuid references public.tours(id) on delete cascade not null,
  applicant_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz default now(),
  unique(tour_id, applicant_id)
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.tours enable row level security;
alter table public.tour_requests enable row level security;

-- Profiles Policies
create policy "Anyone can view profiles" 
  on public.profiles for select 
  using (true);

create policy "Users can insert their own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update their own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- Tours Policies
create policy "Anyone can view open tours" 
  on public.tours for select 
  using (true);

create policy "Verified users can create tours" 
  on public.tours for insert 
  with check (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.is_verified = true
    )
  );

create policy "Tour creator can update tour" 
  on public.tours for update 
  using (auth.uid() = creator_id);

-- Tour Requests Policies
create policy "Creators and applicants can view requests" 
  on public.tour_requests for select 
  using (
    auth.uid() = applicant_id or 
    exists (
      select 1 from public.tours 
      where tours.id = tour_requests.tour_id and tours.creator_id = auth.uid()
    )
  );

create policy "Verified users can apply to tours" 
  on public.tour_requests for insert 
  with check (
    auth.uid() = applicant_id and
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.is_verified = true
    )
  );

create policy "Tour creator can update request status" 
  on public.tour_requests for update 
  using (
    exists (
      select 1 from public.tours 
      where tours.id = tour_requests.tour_id and tours.creator_id = auth.uid()
    )
  );

-- 5. STORAGE BUCKET FOR STUDENT ID CARDS
insert into storage.buckets (id, name, public) 
values ('id-cards', 'id-cards', true)
on conflict (id) do nothing;

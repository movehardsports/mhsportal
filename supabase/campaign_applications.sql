-- Campaign applications table
create table if not exists public.campaign_applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  athlete_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz not null default now(),
  unique (campaign_id, athlete_id)
);

-- RLS
alter table public.campaign_applications enable row level security;

-- Athlete can insert their own application to active campaigns
create policy "Athletes can apply to active campaigns"
  on public.campaign_applications
  for insert
  with check (
    auth.uid() = athlete_id
    and exists (
      select 1 from public.campaigns
      where id = campaign_id and status = 'active'
    )
  );

-- Athlete can read their own applications
create policy "Athletes can read own applications"
  on public.campaign_applications
  for select
  using (auth.uid() = athlete_id);

-- Athlete can update message on pending applications
create policy "Athletes can update own pending applications"
  on public.campaign_applications
  for update
  using (auth.uid() = athlete_id and status = 'pending')
  with check (auth.uid() = athlete_id and status = 'pending');

-- Athlete can withdraw (delete) pending applications
create policy "Athletes can withdraw own pending applications"
  on public.campaign_applications
  for delete
  using (auth.uid() = athlete_id and status = 'pending');

-- Brand can read applications to their campaigns
create policy "Brands can read applications to their campaigns"
  on public.campaign_applications
  for select
  using (
    exists (
      select 1 from public.campaigns
      where id = campaign_id and brand_id = auth.uid()
    )
  );

-- Allow reading brand profiles publicly (needed to display brand_name on campaigns)
create policy "Anyone can read brand profiles"
  on public.profiles
  for select
  using (account_type = 'brand');

-- View for public application counts (bypasses RLS, exposes only aggregated data)
create or replace view public.campaign_application_counts as
  select campaign_id, count(*)::bigint as count
  from public.campaign_applications
  group by campaign_id;

grant select on public.campaign_application_counts to authenticated, anon;

-- Brands can read profiles of athletes who applied to their campaigns
create policy "Brands can read profiles of athletes who applied to their campaigns"
  on public.profiles
  for select
  using (
    account_type = 'athlete'
    and exists (
      select 1 from public.campaign_applications ca
      join public.campaigns c on c.id = ca.campaign_id
      where ca.athlete_id = profiles.id
      and c.brand_id = auth.uid()
    )
  );

-- Allow reading athlete profiles publicly (needed for /explore/athletes page)
create policy "Anyone can read athlete profiles"
  on public.profiles
  for select
  using (account_type = 'athlete' and onboarding_completed = true);

-- Brands can accept/reject applications to their campaigns
create policy "Brands can update status of applications to their campaigns"
  on public.campaign_applications
  for update
  using (
    exists (
      select 1 from public.campaigns
      where id = campaign_id and brand_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.campaigns
      where id = campaign_id and brand_id = auth.uid()
    )
  );

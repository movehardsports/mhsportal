-- Profile enrichment: bio, location, website (brand), contact_email (brand)
alter table public.profiles
  add column if not exists bio text,
  add column if not exists location text,
  add column if not exists website text,
  add column if not exists contact_email text;

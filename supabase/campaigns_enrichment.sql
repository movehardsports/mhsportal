-- Campaign enrichment: campaign_type, budget, deadline, location
alter table public.campaigns
  add column if not exists campaign_type text,
  add column if not exists budget text,
  add column if not exists deadline date,
  add column if not exists location text;

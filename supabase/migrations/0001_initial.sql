-- Trox Studio — Initial Schema
-- Phase 2 PostgreSQL migration
-- Run: supabase db push (or apply via Supabase dashboard)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users are managed by Supabase Auth (auth.users table)
-- This table stores app-level profile data

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'free', -- free | pro | agency | enterprise
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.memberships (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'editor', -- owner | editor | viewer
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, org_id)
);

-- Brand profiles (one org can have multiple brands = multi-brand workspace)
CREATE TABLE public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ig_username TEXT,
  platform_tokens JSONB DEFAULT '{}', -- encrypted client-side before storing
  sells TEXT,
  audience TEXT,
  voice TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand memory (the Playbook)
CREATE TABLE public.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE UNIQUE,
  content TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content posts
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  channel TEXT NOT NULL, -- instagram | pinterest
  format TEXT NOT NULL, -- Reel | Carousel | Post | Story | Pin | Idea Pin
  title TEXT,
  content TEXT,
  status TEXT DEFAULT 'planned', -- planned | posted
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post performance metrics (logged after posting)
CREATE TABLE public.post_metrics (
  post_id UUID PRIMARY KEY REFERENCES public.posts(id) ON DELETE CASCADE,
  reach INT,
  impressions INT,
  likes INT,
  comments INT,
  saves INT,
  shares INT,
  follows INT,
  notes TEXT,
  ai_insight TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instagram scraped posts (session or Graph API)
CREATE TABLE public.ig_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  ig_media_id TEXT,
  media_type TEXT,
  is_reel BOOLEAN DEFAULT FALSE,
  caption TEXT,
  timestamp TIMESTAMPTZ,
  like_count INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  play_count INT DEFAULT 0,
  reach INT,
  impressions INT,
  saved INT,
  permalink TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, ig_media_id)
);

-- Account snapshots (track follower growth over time)
CREATE TABLE public.ig_account_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  followers INT,
  following INT,
  media_count INT,
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitor tracking
CREATE TABLE public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_name TEXT,
  followers INT,
  posts INT,
  bio TEXT,
  fetched_at TIMESTAMPTZ,
  UNIQUE(brand_id, username)
);

-- Trend signals (from Trend Agent)
CREATE TABLE public.trend_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'instagram',
  signal_type TEXT, -- hashtag | audio | format | topic
  content TEXT,
  score TEXT, -- HIGH | MEDIUM | LOW
  captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- API keys (for public REST API access)
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL, -- SHA-256 hash of the key
  label TEXT DEFAULT 'Default key',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- Webhook registrations
CREATE TABLE public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] DEFAULT ARRAY['POST_GENERATED', 'POST_METRICS_LOGGED'],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) — users only see their own data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Org members see org" ON public.organisations
  FOR SELECT USING (
    owner_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.memberships WHERE org_id = organisations.id AND user_id = auth.uid())
  );

CREATE POLICY "Brand access via org" ON public.brands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      JOIN public.organisations o ON o.id = m.org_id
      WHERE m.user_id = auth.uid() AND o.id = brands.org_id
    )
  );

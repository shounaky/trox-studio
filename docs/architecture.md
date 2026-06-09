# Architecture
**Trox Studio — Technical Architecture**
Version: 1.0 | Last updated: 2026-06-09

---

## System Overview

### Phase 1 (Current — Deployed)

```
Browser (React / Next.js "use client")
        │
        ├── localStorage (API keys, posts, playbook, IG data, competitors)
        │
        └── Next.js API Routes (Vercel Serverless)
                ├── /api/claude              → Groq / Claude AI proxy
                ├── /api/instagram           → Public IG profile scraper
                ├── /api/instagram-session   → IG internal API (session cookie)
                ├── /api/instagram-comments  → IG comments via session
                ├── /api/instagram-analytics → IG Graph API (OAuth token)
                ├── /api/auth/instagram/start     → OAuth initiation
                └── /api/auth/instagram/callback  → OAuth token exchange
                        │
                        ├── Groq API (llama-3.3-70b-versatile)
                        ├── Anthropic API (claude-opus-4-5)
                        ├── Instagram Internal API (session cookie)
                        ├── Instagram Graph API v21.0 (access token)
                        └── Facebook Graph API v21.0 (OAuth)
```

### Phase 2 (Target Architecture)

```
Client (Next.js App Router, React)
        │
        ▼
API Gateway (Next.js / standalone Express)
        │
        ├── Auth Service         → JWT, OAuth, sessions
        ├── Brand Service        → Brand profiles, workspaces
        ├── Content Service      → Post generation, storage, scheduling
        ├── Analytics Service    → Metrics aggregation, reporting
        ├── Trend Service        → Trend discovery, competitor monitoring
        ├── Publishing Service   → Platform-specific publishing
        └── Agent Service        → AI orchestration, memory, planning
                │
        ▼
Database Layer
        ├── PostgreSQL           → Users, brands, posts, metrics
        ├── Redis                → Session cache, job queues, rate limits
        └── Pinecone / pgvector  → Brand memory, semantic search
                │
        ▼
External Integrations
        ├── Groq API             → Fast inference (free tier)
        ├── Anthropic API        → High-quality generation (paid)
        ├── Instagram Graph API  → Publishing, analytics
        ├── Pinterest API        → Publishing, analytics
        └── Meta Graph API       → Facebook page data
```

---

## Architecture Principles

| Principle | Description |
|---|---|
| **Modular** | Each service has a single responsibility and can be deployed independently |
| **Agent-first** | AI is not a feature — it is the operating layer. Every workflow routes through an agent |
| **Event-driven** | Services communicate via events, not direct calls. Enables async workflows and replay |
| **API-first** | Every feature is exposed as an API contract before UI is built |
| **Cloud-native** | Designed for Vercel (Phase 1) and container-based deployment (Phase 2) |
| **Horizontally scalable** | No shared mutable state between request handlers |
| **Vendor-agnostic** | AI provider, database, and hosting are swappable without feature changes |
| **Documentation-first** | No code is written without a corresponding entry in problem-statement.md |

---

## Current File Structure (Phase 1)

```
/
├── app/
│   ├── page.js                          # Root page, renders TroxStudio
│   └── api/
│       ├── claude/route.js              # AI proxy (Groq + Claude)
│       ├── instagram/route.js           # Public profile scraper
│       ├── instagram-session/route.js   # Session cookie scraper
│       ├── instagram-comments/route.js  # Comments via session
│       ├── instagram-analytics/route.js # Graph API analytics
│       └── auth/instagram/
│           ├── start/route.js           # OAuth initiation
│           └── callback/route.js        # OAuth token exchange
├── components/
│   └── TroxStudio.jsx                   # Entire frontend (monolithic)
├── docs/                                # This documentation
└── public/
```

### Phase 1 Limitations to Resolve in Phase 2
- All UI in a single 1,000+ line component — must be decomposed
- localStorage as persistence — not shareable, not reliable across devices
- No authentication — single-user only
- Secrets (API keys) stored in browser — acceptable for Phase 1, must move server-side
- No job queue — long AI operations block the request/response cycle

---

## Service Breakdown (Phase 2 Target)

### User Service
**Responsibility:** Identity, authentication, organisation management

Endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /users/me`
- `POST /organisations`
- `GET /organisations/:id/members`

Data:
```sql
users (id, email, name, hashed_password, created_at)
organisations (id, name, plan, owner_id, created_at)
memberships (user_id, org_id, role, created_at)
```

### Brand Service
**Responsibility:** Brand profiles, voice, goals, Playbook memory

Endpoints:
- `GET /brands/:id`
- `PUT /brands/:id`
- `GET /brands/:id/playbook`
- `PUT /brands/:id/playbook`

Data:
```sql
brands (id, org_id, name, sells, audience, voice, goal, created_at)
playbooks (id, brand_id, content, updated_at)
```

### Content Service
**Responsibility:** Post generation, storage, scheduling

Endpoints:
- `POST /content/generate` — calls Agent Service
- `GET /content/posts`
- `POST /content/posts`
- `PUT /content/posts/:id`
- `POST /content/posts/:id/log`

Data:
```sql
posts (id, brand_id, channel, format, title, content, status, scheduled_at, created_at)
post_metrics (post_id, reach, impressions, likes, comments, saves, shares, follows, notes, logged_at)
```

### Analytics Service
**Responsibility:** Metrics ingestion, aggregation, reporting

Endpoints:
- `POST /analytics/sync` — trigger IG sync
- `GET /analytics/overview`
- `GET /analytics/posts`
- `POST /analytics/import` — bulk import from IG export

Data:
```sql
ig_posts (id, brand_id, ig_media_id, media_type, caption, timestamp, like_count, comment_count, play_count, reach, impressions, saved, synced_at)
ig_account_snapshots (id, brand_id, followers, following, media_count, captured_at)
```

### Trend Service
**Responsibility:** Trend discovery, competitor tracking, gap analysis

Endpoints:
- `GET /trends/discover`
- `GET /competitors`
- `POST /competitors`
- `DELETE /competitors/:username`
- `POST /competitors/analyse`

Data:
```sql
competitors (id, brand_id, username, display_name, followers, posts, bio, fetched_at)
trend_signals (id, brand_id, platform, signal_type, content, score, captured_at)
```

### Publishing Service (Phase 2)
**Responsibility:** Direct publishing to Instagram, Pinterest

Endpoints:
- `POST /publish/instagram`
- `POST /publish/pinterest`
- `GET /schedule`

Note: Requires Instagram Graph API with `instagram_content_publish` permission and app review.

### Agent Service
**Responsibility:** AI orchestration, tool routing, memory management

Endpoints:
- `POST /agent/run` — run a named agent with inputs
- `GET /agent/memory/:brand_id` — retrieve brand memory

See AI Agent Architecture section below.

---

## Database Architecture

### PostgreSQL Schema (Phase 2)

```sql
-- Core identity
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  hashed_password TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'free', -- free | pro | enterprise
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brand intelligence
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organisations(id),
  name TEXT NOT NULL,
  ig_username TEXT,
  platform_tokens JSONB, -- encrypted
  sells TEXT,
  audience TEXT,
  voice TEXT,
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  content TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  channel TEXT, -- instagram | pinterest
  format TEXT, -- Reel | Carousel | Post | Story | Pin | Idea Pin
  title TEXT,
  content TEXT,
  status TEXT DEFAULT 'planned', -- planned | posted
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE post_metrics (
  post_id UUID REFERENCES posts(id) PRIMARY KEY,
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

-- Analytics
CREATE TABLE ig_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  ig_media_id TEXT UNIQUE,
  media_type TEXT,
  is_reel BOOLEAN DEFAULT FALSE,
  caption TEXT,
  timestamp TIMESTAMPTZ,
  like_count INT,
  comment_count INT,
  play_count INT,
  reach INT,
  impressions INT,
  saved INT,
  permalink TEXT,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competition
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id),
  username TEXT NOT NULL,
  display_name TEXT,
  followers INT,
  posts INT,
  bio TEXT,
  fetched_at TIMESTAMPTZ,
  UNIQUE(brand_id, username)
);
```

### Redis Cache Structure (Phase 2)

```
session:{session_id}            → user session data, TTL 7 days
rate_limit:{user_id}:{endpoint} → request count, TTL 1 min
ig_sync_lock:{brand_id}         → prevents concurrent syncs, TTL 60s
trend_cache:{niche}             → cached trend results, TTL 6 hrs
competitor_cache:{username}     → scraped profile, TTL 1 hr
```

### Vector Database (Phase 2 — Pinecone or pgvector)

```
namespace: brand_memory
vectors: embedded brand playbook entries
metadata: { brand_id, post_id, type, date }
use: semantic search over brand's content history for contextual generation
```

---

## AI Agent Architecture

### Principle
Agents are stateful, goal-directed AI processes. Each agent has a purpose, defined inputs, defined outputs, access to specific tools, and a memory layer. Agents are composed — the Content Agent calls the Trend Agent and the Brand Memory Agent before generating.

### Content Agent
```
Purpose:  Generate on-brand content briefs and full captions
Inputs:   Brand profile, Playbook, format, channel, subject, competitive context
Outputs:  Complete content brief (hook, body, CTA, hashtags, visual notes)
Tools:    brand_memory_search, playbook_read, trend_lookup
Memory:   Playbook (performance learnings), brand voice index
Decision: 1. Load brand context 2. Check Playbook for what worked 3. Check trends 4. Generate
Model:    Groq llama-3.3-70b (default) / claude-opus-4-5 (quality mode)
```

### Analytics Agent
```
Purpose:  Interpret performance data and update brand Playbook
Inputs:   Post metrics (reach, saves, likes, comments, follows), post content
Outputs:  One-line insight, updated Playbook (bullet rules)
Tools:    playbook_write, metrics_read
Memory:   Playbook (write access)
Decision: 1. Compare metrics to average 2. Identify what drove difference 3. Extract rule 4. Update Playbook
Model:    Groq llama-3.3-70b
```

### Intelligence Agent
```
Purpose:  Deep content analysis — voice, campaigns, storytelling, hashtags
Inputs:   Full post corpus (captions, dates, types, engagement, comments)
Outputs:  Structured analysis report (7 sections)
Tools:    comment_fetch, hashtag_analyse, pattern_detect
Memory:   Read-only brand context
Decision: 1. Compute aggregate stats 2. Fetch comments for top posts 3. Run deep analysis
Model:    Groq llama-3.3-70b / claude-opus-4-5 preferred for quality
```

### Competitor Agent
```
Purpose:  Monitor competitor profiles, identify gaps, recommend positioning
Inputs:   List of competitor usernames, own brand profile
Outputs:  Gap analysis report with specific content recommendations
Tools:    ig_profile_scrape, bio_parse
Memory:   Historical competitor snapshots
Decision: 1. Scrape each competitor 2. Compute positioning gaps 3. Identify content white-space
Model:    Groq llama-3.3-70b
```

### Trend Agent (Phase 2)
```
Purpose:  Discover trending content formats and topics in relevant niches
Inputs:   Brand category, target audience, platform
Outputs:  Top 5 trend signals with opportunity scores
Tools:    hashtag_scrape, reel_audio_trends, google_trends
Memory:   Historical trend signals (detects repeating seasonal patterns)
Decision: 1. Scrape trending hashtags 2. Score relevance to brand 3. Rank by opportunity window
Model:    Groq llama-3.3-70b
```

---

## Event System

All events are logged and can trigger downstream workflows.

| Event | Trigger | Downstream Actions |
|---|---|---|
| `POST_GENERATED` | User saves content brief | Log in posts table, notify calendar |
| `POST_METRICS_LOGGED` | User logs post results | Analytics Agent runs, Playbook updated |
| `IG_SYNC_COMPLETED` | User triggers sync | Analytics refreshed, stale cache cleared |
| `COMPETITOR_ADDED` | User tracks new account | Immediate profile scrape triggered |
| `PLAYBOOK_UPDATED` | Analytics Agent writes | Brand memory index re-embedded |
| `TOKEN_EXPIRED` | IG token age >55 days | Notify user to reconnect |
| `TREND_FOUND` | Trend Agent scores signal | Content Agent briefed on opportunity |
| `REPORT_GENERATED` | Weekly cron | Email dispatch, dashboard refresh |

---

## API Contracts

### AI Proxy
```
POST /api/claude
Request:  { prompt: string, provider: "groq"|"claude", apiKey?: string }
Response: { text: string } | { error: string }
Auth:     None (Phase 1) → Bearer JWT (Phase 2)
Rate:     30 req/min per IP (Phase 1 Vercel limit)
```

### Instagram Session Sync
```
POST /api/instagram-session
Request:  { sessionId: string, username: string }
Response: { account: AccountObject, posts: PostObject[] } | { error: string }
Auth:     None (Phase 1)
Notes:    sessionId never logged. Returns up to 48 posts.
```

### Instagram Comments
```
POST /api/instagram-comments
Request:  { sessionId: string, mediaId: string }
Response: { comments: CommentObject[] }
Auth:     None (Phase 1)
Notes:    Returns up to 15 comments. Fails silently if blocked.
```

### Instagram Graph API Analytics
```
POST /api/instagram-analytics
Request:  { token: string, action: "setup"|"account"|"media"|"post_insights", igAccountId?: string, mediaId?: string, mediaType?: string }
Response: Varies by action
Auth:     Token validated against Graph API
```

### OAuth Flow
```
POST /api/auth/instagram/start
Request:  { appId: string, appSecret: string }
Response: { oauthUrl: string, redirectUri: string }
Sets:     Cookies ig_app_id, ig_app_secret, ig_redirect_uri (httpOnly, TTL 10 min)

GET /api/auth/instagram/callback?code={code}
Sets:     Long-lived token in redirect URL param ig_token
Redirects to: /?ig_token={token} | /?ig_error={message}
```

---

## Security Architecture

### Phase 1 (Current)
- API keys stored in `localStorage` on user's own device — acceptable for single-user personal use
- All API calls proxied through server-side routes — keys never in client network requests
- Instagram session ID stored in `localStorage` — same security model as staying logged into Instagram
- OAuth secrets stored in short-lived `httpOnly` cookies during auth flow only
- HTTPS enforced by Vercel on all production URLs

### Phase 2 Requirements
- **Authentication:** JWT (access token 15 min, refresh token 7 days)
- **Authorisation:** RBAC — roles: `owner`, `editor`, `viewer`
- **Secret storage:** API keys encrypted at rest in PostgreSQL using AES-256
- **Audit logs:** All content generation, publishing, and settings changes logged with user and timestamp
- **Rate limiting:** Per-user rate limits on AI endpoints via Redis
- **Input validation:** All API inputs validated with Zod schemas
- **CORS:** Strict allowlist, no wildcard origins in production

---

## Deployment Architecture

### Phase 1 (Current)
```
GitHub (main branch)
    │
    ▼ Auto-deploy on push
Vercel (Production)
    ├── Next.js App (SSR + static)
    ├── Serverless Functions (API routes)
    └── Edge Network (global CDN)

URL: trox-studio-git-main-trox-creations.vercel.app
Build: npm run build (Next.js 15)
Node: 20.x
Region: Auto (closest to user)
```

### Phase 2 (Target)
```
Development:  Local Next.js dev server + local PostgreSQL + local Redis
Staging:      Vercel preview + Supabase staging DB + Upstash Redis
Production:   Vercel (frontend + API) + Supabase (PostgreSQL) + Upstash (Redis) + Pinecone (vectors)
```

### Environment Variables (Phase 2)
```
# AI
GROQ_API_KEY=
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=
REDIS_URL=

# Auth
JWT_SECRET=
NEXTAUTH_SECRET=

# Instagram
IG_APP_ID=
IG_APP_SECRET=

# Encryption
ENCRYPTION_KEY=
```

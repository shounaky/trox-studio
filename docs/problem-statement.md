# Problem Statement
**Trox Studio — AI Social Media Operations Platform**
Version: 1.0 | Last updated: 2026-06-09

---

## Executive Summary

### What problem is being solved

Small creative brands and businesses spend 10–20 hours per week on social media content — writing captions, researching trends, scheduling posts, analysing what worked, and repeating the cycle manually. The content they produce is rarely informed by their actual performance data, and the "strategy" is largely intuition-driven.

Trox Studio solves this by replacing manual social media operations with an AI-first platform that understands the brand deeply, learns from every post's performance, generates on-brand content autonomously, and provides competitive and trend intelligence — all in a single unified workspace.

### Why existing tools are insufficient

| Tool | What it does | What it misses |
|---|---|---|
| Later / Buffer | Scheduling | No AI content generation, no brand learning |
| Canva | Design | No strategy, no analytics, no publishing |
| Hootsuite | Dashboard | Generic AI, no brand memory, expensive |
| ChatGPT | Text generation | No brand context, no performance data, no publishing |
| Instagram Insights | Native analytics | Siloed, no AI interpretation, no competitive context |

No existing tool combines brand-aware AI content generation, live performance analytics, competitive intelligence, and continuous self-improvement in one place — at a price point accessible to solo creators and small teams.

### Target users

**Primary:** Trox Creations (@troxcreations) — premium handcrafted notebook brand, founder-led, 9,100+ followers, growing to 12,000+.

**Generalised target:**
- Solo creators and founder-led brands (1–3 people managing social)
- Small businesses with a distinct brand identity
- Marketing teams at growing DTC brands
- Creative agencies managing multiple brand accounts
- Enterprise marketing departments requiring multi-brand operations

### Expected business outcomes

- Reduce content creation time from 10–20 hrs/week to under 2 hrs/week
- Increase posting consistency from ad hoc to 4–7 posts/week
- Improve engagement rate by 30%+ through data-driven content selection
- Build a self-improving brand intelligence system that compounds over time

---

## Target Users

### Content Creators
Solo operators running personal brands, Substack writers with Instagram presence, YouTubers expanding to short-form. Need: fast content generation, brand consistency, low cost.

### Small Businesses
Founder-led brands like Trox Creations. 1–5 team members, no dedicated marketing hire. Need: strategy, consistency, competitive awareness, actionable analytics.

### Marketing Teams
5–20 person companies with a 1–2 person social team. Need: workflow efficiency, approval processes, reporting, multi-channel publishing.

### Agencies
Manage 5–50 client accounts. Need: multi-brand workspaces, white-labelling, bulk scheduling, client reporting.

### Enterprises
Large organisations with multiple sub-brands. Need: RBAC, audit trails, compliance, SSO, SLA guarantees.

---

## User Pain Points

### 1. Too many disconnected tools
A typical small brand uses: Canva (design), ChatGPT (copy), Later (scheduling), Instagram Insights (analytics), Google Sheets (reporting), and Notion (strategy). None of these talk to each other.

### 2. Manual content creation
Every post starts from scratch. There is no system that learns what works for a specific brand and applies that learning to the next piece of content automatically.

### 3. Difficulty tracking trends
Brands miss trending topics, viral formats, and seasonal opportunities because monitoring is manual. By the time a trend is spotted, it has passed.

### 4. Inefficient reporting
Analytics are scattered across platform dashboards. Producing a monthly report takes hours of manual data gathering. There is no narrative — just numbers.

### 5. Inconsistent posting
Without a system, posting is driven by inspiration or urgency. Gaps in the content calendar hurt algorithmic reach. Most brands post less than they intend to.

### 6. Lack of strategic optimisation
Most brands post content and never rigorously analyse what worked and why. The same mistakes repeat. There is no feedback loop from analytics back to creation.

---

## Goals

### G-001 Fully autonomous social media operations
The platform handles content ideation, brief writing, caption generation, scheduling, and performance logging with minimal human input beyond approval.

### G-002 Unified dashboard
One workspace for brand intelligence, content creation, publishing calendar, analytics, competitive monitoring, and AI coaching. Zero tab-switching.

### G-003 AI-first workflows
Every feature is AI-native. Content is not written and then optimised — it is generated with brand context, performance history, and competitive signals baked in from the start.

### G-004 Continuous optimisation
The system learns from every post. The Playbook (brand's performance memory) grows richer with every content cycle. Strategy improves without human intervention.

### G-005 Enterprise scalability
Architecture supports multi-brand, multi-user, multi-channel operations with appropriate access controls, audit trails, and SLA guarantees.

---

## Non-Goals

The platform will NOT be:

- **A CRM.** Managing customer relationships, support tickets, or DMs is out of scope. Social media publishing only.
- **A video editing suite.** The platform briefs and scripts video content but does not edit, render, or produce video files.
- **An ERP or project management tool.** No inventory management, invoicing, or task tracking beyond social content workflows.
- **A customer support platform.** Comment moderation and community management are not automated. Human review of all audience interactions is assumed.
- **A general-purpose AI assistant.** The AI is scoped to social media strategy and content — it does not answer arbitrary questions.
- **A design tool.** Canva, Adobe, and Figma integrations may be planned but the platform does not generate or edit images natively in Phase 1.
- **A paid advertising platform.** Organic social only. Paid media management (Meta Ads, TikTok Ads) is a non-goal in Phase 1.

---

## Success Metrics

| Metric | Baseline (Trox Creations) | Target | Timeframe |
|---|---|---|---|
| Content creation time | ~10 hrs/week | <2 hrs/week | 3 months |
| Posts per week | 1–2 | 4–7 | 3 months |
| Follower growth | 9,107 | 12,000+ | 6 months |
| Engagement rate | ~2–3% | >4% | 3 months |
| Content consistency | Ad hoc | 5+ days/week | 1 month |
| Strategy review time | 2–3 hrs/month | 30 min/month | 3 months |

---

## Functional Requirements

### Phase 1 — Core (Current, deployed)

| ID | Feature | Status |
|---|---|---|
| FR-001 | Brand Brain — persistent brand profile (name, audience, voice, goals) | Done |
| FR-002 | AI Content Generation — Reels, Carousels, Posts, Stories, Pins, Idea Pins | Done |
| FR-003 | Idea Generator — 5 content ideas with format, hook, and performance estimate | Done |
| FR-004 | Posts Library — save, track and log post performance | Done |
| FR-005 | Playbook — AI living memory that learns from post results | Done |
| FR-006 | Follower Goal Tracker — visual progress toward growth target | Done |
| FR-007 | Competition Tracking — scrape any Instagram handle for followers/bio/posts | Done |
| FR-008 | Competitive Gap Analysis — AI analysis of Trox vs competitors | Done |
| FR-009 | Growth Coach — AI audit of performance and next 3 post recommendations | Done |
| FR-010 | AI Provider Settings — switch between Groq (free) and Claude (paid) | Done |
| FR-011 | Instagram Session Analytics — scrape own account via session cookie | Done |
| FR-012 | Deep Content Intelligence — brand voice, campaigns, storytelling, hashtag audit | Done |
| FR-013 | Instagram Insights Import — import reach/saves/impressions from IG data export | Done |
| FR-014 | Instagram OAuth — connect via Meta Developer App for Graph API data | Done |
| FR-015 | Comment Fetching — fetch post comments for qualitative analysis | Done |

### Phase 2 — Growth (Next)

| ID | Feature | Status |
|---|---|---|
| FR-016 | Content Calendar — visual weekly/monthly scheduling view | Done |
| FR-017 | Direct Publishing — post to Instagram, Pinterest without leaving the app | Done (pending Meta app review) |
| FR-018 | Trend Monitoring — real-time trend discovery for relevant niches | Done |
| FR-019 | AI Image Brief Generator — detailed art direction for Canva/designer | Done |
| FR-020 | Multi-brand Workspaces — manage multiple brand accounts | Foundation done (Supabase schema ready) |
| FR-021 | User Authentication — login, accounts, session management | Done (requires Supabase env vars) |
| FR-022 | Persistent Backend — PostgreSQL database replacing localStorage | Done (migration ready, localStorage fallback active) |
| FR-023 | Pinterest Analytics — scrape and analyse Pinterest performance | Placeholder (Pinterest OAuth needed) |
| FR-024 | Story Analytics — Instagram Stories performance tracking | Done (requires instagram_manage_insights permission) |
| FR-025 | Automated Weekly Report — AI-generated summary emailed weekly | Done (in-app; email requires Phase 3 email service) |

### Phase 3 — Enterprise

| ID | Feature | Status |
|---|---|---|
| FR-026 | Multi-user collaboration — team roles and approval workflows | Foundation done (RBAC schema in migration) |
| FR-027 | Agency mode — white-label client workspaces | Foundation done (multi-brand schema supports this) |
| FR-028 | Webhook integrations — Zapier/Make/n8n compatible events | Done |
| FR-029 | API access — public REST API for enterprise integrations | Done |
| FR-030 | SSO — Google/Okta login for enterprise | Done (Google OAuth via Supabase) |

---

## Non-Functional Requirements

### Performance
- Page load (initial): <2 seconds on standard broadband
- AI response: <8 seconds for content generation, <15 seconds for full brand audit
- Instagram sync: <30 seconds for 30 posts with insights

### Scalability
- Phase 1: Single-user, Vercel serverless (auto-scaling)
- Phase 2: Multi-user, horizontally scalable API services
- Phase 3: Enterprise SLA with 99.9% uptime guarantee

### Reliability
- AI fallback: if primary provider (Groq) fails, degrade gracefully with error message
- Data persistence: localStorage for Phase 1; PostgreSQL with daily backups for Phase 2
- No data loss on page refresh or browser close

### Security
- API keys stored in localStorage (Phase 1, single-user acceptable)
- API keys moved to server-side encrypted storage in Phase 2
- No API keys ever exposed in client-side network requests
- All AI calls proxied through server-side API routes
- Instagram session cookies stored in localStorage (user's own device only)
- HTTPS enforced via Vercel (production) and local dev certificates

### Compliance
- GDPR: user controls all their data; export and deletion available
- Instagram ToS: session cookie scraping used only for own account analytics
- No scraping of private accounts
- No storage of third-party user data beyond public profile metadata

### Accessibility
- Minimum WCAG 2.1 AA compliance for all interactive elements
- Keyboard navigable tabs and forms
- Sufficient colour contrast (min 4.5:1 for body text)

---

## Acceptance Criteria

### FR-001 Brand Brain
- AC-001-1: User can view and edit brand name, audience, voice, and goals
- AC-001-2: Edited brand profile persists across page refreshes
- AC-001-3: All AI features use updated brand profile immediately after save

### FR-002 AI Content Generation
- AC-002-1: Generates content for all 6 formats (Reel, Carousel, Post, Story, Pin, Idea Pin)
- AC-002-2: Output is specific to selected collection/theme/angle
- AC-002-3: Content reflects brand voice and Playbook learnings
- AC-002-4: Plaintext output, no markdown symbols

### FR-011 Instagram Session Analytics
- AC-011-1: Syncs all posts (up to 48) with likes, comments, play counts
- AC-011-2: Displays posts in a grid with engagement metrics
- AC-011-3: Handles session expiry with a clear error message

### FR-012 Deep Content Intelligence
- AC-012-1: Full audit covers all 7 sections (voice, campaigns, storytelling, hashtags, calendar, engagement, next posts)
- AC-012-2: References specific post captions and numbers from the real data
- AC-012-3: Individual analysis modes (voice, campaigns, hashtags) complete in <15 seconds

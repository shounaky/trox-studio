# Architectural Decision Records (ADR)
**Trox Studio**
Version: 1.0 | Last updated: 2026-06-09

---

## ADR Format

Each record follows this structure:
- **Date:** When the decision was made
- **Decision:** What was decided
- **Reason:** Why this was the right choice
- **Alternatives considered:** What else was evaluated
- **Trade-offs:** What we accepted as a consequence
- **Revisit when:** Conditions under which this decision should be reconsidered

---

## ADR-001 — Framework: Next.js 15 App Router

**Date:** 2026-05-01

**Decision:** Use Next.js 15 with App Router as the full-stack framework.

**Reason:**
- Single codebase for frontend and API routes eliminates separate backend service in Phase 1
- Serverless API routes deploy automatically to Vercel — zero DevOps
- App Router supports server components and server-side rendering natively
- Strong ecosystem, well-documented, LLM training data coverage is excellent

**Alternatives considered:**
- Vite + React + Express: More flexibility but two codebases, more deployment complexity
- Remix: Good but smaller community, less LLM familiarity
- SvelteKit: Excellent performance but smaller ecosystem

**Trade-offs:**
- Next.js is opinionated — routing and data-fetching patterns are constrained
- App Router is relatively new; some ecosystem packages lag behind
- Cold start latency on Vercel serverless functions (~200ms) is acceptable for Phase 1 but must be addressed in Phase 2

**Revisit when:** Moving to Phase 2 with dedicated backend services; may extract API routes to separate Express/Fastify service.

---

## ADR-002 — Deployment: Vercel Free Tier

**Date:** 2026-05-01

**Decision:** Deploy on Vercel free tier, auto-deploy from GitHub main branch.

**Reason:**
- Zero cost for Phase 1 — critical for a prototype/MVP stage
- Automatic HTTPS, global CDN, preview deployments included
- Native Next.js optimisation (same company)
- No DevOps required

**Alternatives considered:**
- Railway: More flexible, supports persistent services, costs ~$5/month
- Render: Similar to Railway, good free tier
- Self-hosted VPS: Maximum control, most complex

**Trade-offs:**
- Vercel free tier has execution time limits (10s on Hobby plan) — AI calls can approach this
- No persistent storage on Vercel (critical limitation for Phase 2 — must add DB)
- Serverless cold starts can slow first-request UX

**Revisit when:** Adding persistent backend storage, or when AI calls consistently exceed 10s.

---

## ADR-003 — AI Provider: Groq as Default (not Gemini)

**Date:** 2026-06-08

**Decision:** Switch primary AI provider from Google Gemini to Groq (llama-3.3-70b-versatile).

**Reason:**
- Gemini models returned persistent 404 (model not found) and 429 (quota exceeded with zero free tier) errors
- Groq is genuinely free with no credit card required (30 req/min, 14,400 req/day)
- Groq uses LPU hardware — response times are 3–5× faster than Gemini for the same model size
- llama-3.3-70b-versatile produces high-quality, well-structured content

**Alternatives considered:**
- Continue debugging Gemini: Exhausted fallback chain through 5 models — all failed
- OpenAI: No free tier, cost-prohibitive for a prototype
- Cohere: Smaller community, less capable for content generation
- Local Ollama: Requires local hardware, not deployable to Vercel

**Trade-offs:**
- Groq's free tier has rate limits — users who generate heavily may hit them
- llama-3.3-70b is open-source and occasionally less consistent than proprietary models
- Groq does not support image/vision input (limits future multimodal features)

**Revisit when:** Groq free tier proves insufficient; evaluate paid Groq tier or add back Gemini as secondary.

---

## ADR-004 — Persistence: localStorage (Phase 1)

**Date:** 2026-05-01

**Decision:** Use browser `localStorage` for all data persistence in Phase 1.

**Reason:**
- Zero backend infrastructure required — no database setup, no server
- Instant reads/writes — no network latency
- Acceptable for single-user personal use case (Trox Creations founder)
- Allows rapid prototyping without schema migrations

**Alternatives considered:**
- Supabase (PostgreSQL): Correct long-term choice, but adds auth, schema, and API layer too early
- PlanetScale / Neon: Same concerns as Supabase
- IndexedDB: More powerful than localStorage but significantly more complex API

**Trade-offs:**
- Data is lost if user clears browser storage
- Not shareable across devices or browsers
- No user authentication possible
- Maximum ~5MB storage limit (sufficient for text data, insufficient for large media)
- Security: API keys stored in localStorage are accessible to any JS on the page

**Revisit when:** Any of: (a) user needs multi-device access, (b) second user is added, (c) storage exceeds 1MB.

---

## ADR-005 — Instagram Data: Session Cookie Scraping

**Date:** 2026-06-09

**Decision:** Use Instagram `sessionid` cookie with Instagram's internal API as primary analytics method.

**Reason:**
- Instagram's official Graph API requires a Meta Developer account, app review for key permissions, and an OAuth flow — creating 5+ setup steps that blocked users
- Session cookie gives access to all public engagement metrics (likes, comments, plays) for any account the user is logged in as
- This is the same technique used by Apify, ScraperAPI, and major Instagram analytics tools
- Setup is reduced to 3 steps: log into Instagram, open DevTools, copy sessionid

**Alternatives considered:**
- Official Graph API only: Too much friction for non-technical users
- Public HTML scraping (og:description): Gives only follower/post count, no individual post metrics
- Third-party data API (RapidAPI): Costs money, adds dependency on third-party service reliability

**Trade-offs:**
- Technically violates Instagram's ToS for automated use (acceptable risk for own-account personal use; not acceptable at scale)
- Session expires on logout — users need to refresh periodically
- Instagram may change internal API endpoints without notice
- Cannot access private metrics: reach, impressions, saves (these are never sent to any client)

**Revisit when:** Instagram blocks this approach, or when official API integration becomes simpler.

---

## ADR-006 — Instagram Private Metrics: Data Export Import

**Date:** 2026-06-09

**Decision:** For reach, saves, and impressions — support import of `media_metrics.json` from Instagram's built-in "Download Your Data" feature.

**Reason:**
- Reach, saves, and impressions are computed server-side by Instagram and never transmitted to any client
- No scraping technique (including Apify) can retrieve these without official API auth
- Instagram's "Download Your Data" export includes these metrics in structured JSON
- This is a zero-cost, ToS-compliant path that requires no developer account

**Alternatives considered:**
- Official Graph API (`instagram_manage_insights` permission): Requires Meta Developer app + app review
- Manual entry UI: Per-post data entry from Instagram Insights screenshots
- Screenshot + OCR: Would require vision-capable AI model; Groq (Llama) is text-only

**Trade-offs:**
- Export takes up to 24 hours to arrive from Instagram
- One-time effort per export period (not live/real-time)
- Requires user to navigate a non-obvious Instagram settings flow

**Revisit when:** Official Graph API OAuth becomes simpler to set up, or when Groq adds vision support enabling screenshot parsing.

---

## ADR-007 — UI Architecture: Single Component (Phase 1)

**Date:** 2026-05-01

**Decision:** Build entire UI in a single `TroxStudio.jsx` component.

**Reason:**
- Fastest path to a working product — no component architecture decisions needed
- All state co-located — no prop drilling or context required
- Appropriate for a prototype being built for a single user

**Alternatives considered:**
- Feature-based folder structure: Correct for Phase 2 but premature
- Atomic design system: Over-engineered for current scale
- Separate page routes per tab: Adds routing complexity, unnecessary for this tab-based UI

**Trade-offs:**
- Component now exceeds 1,000 lines — approaching unmaintainable
- Cannot be unit tested in isolation
- Any refactor touches one large file with high risk of regression

**Revisit when:** Adding a second top-level feature section, or when the component exceeds 1,200 lines.

---

## ADR-008 — AI Provider Abstraction: Provider-Agnostic Playbook

**Date:** 2026-05-15

**Decision:** Store the brand Playbook as plain text in localStorage, independent of the AI provider.

**Reason:**
- When the user switches AI providers (e.g., Gemini → Groq), they should not lose learned brand intelligence
- Plain text is universally readable by any LLM
- Playbook is injected as context into every AI prompt — provider is irrelevant

**Alternatives considered:**
- Provider-specific embeddings: Would break on provider switch
- Structured JSON memory: More queryable but more complex to generate and maintain

**Trade-offs:**
- Plain text Playbook can grow long — eventually exceeds prompt context windows
- No semantic search over memory — everything is injected in full

**Revisit when:** Playbook exceeds ~2,000 words; at that point switch to vector-embedded memory with retrieval.

---

## ADR-009 — Content Intelligence: AI Over Raw Metrics

**Date:** 2026-06-09

**Decision:** Prioritise AI analysis of caption corpus, comments, and patterns over raw metric dashboards.

**Reason:**
- Reach and saves are inaccessible without official API (see ADR-005, ADR-006)
- A deep AI analysis of 37 posts' captions, hashtags, posting patterns, and comment text provides more strategic value than knowing that Post #12 had 840 reach
- This shifts the product from "metrics dashboard" to "brand intelligence platform" — a stronger differentiated position

**Alternatives considered:**
- Build a chart dashboard with available metrics: Less differentiated, commoditised
- Partner with a third-party analytics API: Cost, reliability dependency

**Trade-offs:**
- Analysis quality is only as good as the AI model — Groq/Llama has occasional inconsistencies
- Users accustomed to numeric dashboards may find text analysis unfamiliar

**Revisit when:** Phase 2 database is in place and real metrics can be stored and charted historically.

---

## ADR-010 — UI Architecture: Tab Component Decomposition (Phase 2)

**Date:** 2026-06-09

**Decision:** Decompose the monolithic `TroxStudio.jsx` into a main orchestrator (`TroxStudio.jsx`, 772 lines) and nine tab components in `components/tabs/`. Extract CSS to `styles/studio.css`, constants to `lib/constants.js`, utilities to `lib/utils.js`, storage helpers to `lib/storage.js`, and prompts to `lib/prompts.js`.

**Reason:**
- Rule 9 required decomposition once TroxStudio.jsx exceeded 1,200 lines (was at 1,271)
- Adding Phase 2 features (Calendar, Trends, Image Brief, Weekly Report) required ~400+ more lines — impossible in the monolith
- Tab components are independently readable and maintainable
- CSS moved to a file (not a template literal string) enables syntax highlighting, linting, and editor support

**Alternatives considered:**
- Context API for state sharing: Avoids prop drilling but adds abstraction overhead; props are sufficient for current feature set
- Route-per-tab (Next.js pages): Correct for Phase 3 with deep-linking needs; over-engineered now
- Keep monolith, increase line limit: Violates Rule 9; file becomes unworkable for AI-assisted development

**Trade-offs:**
- Props interface between TroxStudio.jsx and tab components is wide (~20+ props each) — acceptable for current scale
- No code splitting per tab (all tabs load with the page) — acceptable; total JS bundle is 126KB first load

**Revisit when:** Any tab component exceeds 600 lines, or when we need per-tab route-level code splitting.

---

## ADR-011 — Phase 2 Feature Foundations

**Date:** 2026-06-09

**Decision:** Implement Phase 2 (FR-016 to FR-025) and Phase 3 (FR-026 to FR-030) foundations in a single release:

| FR | Feature | Implementation |
|---|---|---|
| FR-016 | Content Calendar | Monthly grid + scheduling in localStorage, AI plan generation |
| FR-017 | Direct Publishing | Instagram Graph API container/publish endpoints (requires app review) |
| FR-018 | Trend Monitoring | Dedicated `/api/trends` route + AI trend discovery |
| FR-019 | Image Brief | AI art direction generator in Create tab |
| FR-020 | Multi-brand | KEYS.workspace in storage, CSS workspace switcher, Supabase schema prepared |
| FR-021 | Authentication | Login/register pages at `/login` and `/register` using Supabase Auth |
| FR-022 | Persistent Backend | `lib/supabase.js` + `lib/db.js` abstraction layer, SQL migration in `supabase/migrations/` |
| FR-023 | Pinterest Analytics | UI placeholder with connect flow (Pinterest OAuth required) |
| FR-024 | Story Analytics | UI tab + Graph API endpoint (requires `instagram_manage_insights` scope) |
| FR-025 | Weekly Report | AI-generated dashboard report with webhook dispatch |
| FR-026 | Multi-user | RBAC schema in SQL migration; memberships table |
| FR-027 | Agency mode | Multi-brand Supabase schema supports this |
| FR-028 | Webhooks | `/api/webhooks` dispatch endpoint, webhook URL storage in Settings |
| FR-029 | Public API | `/api/apikeys` key generation, `X-API-Key` auth on webhook endpoint |
| FR-030 | SSO | Supabase OAuth providers (Google) wired in login page |

**Reason:** User directive: "Start with phases complete all phases." Building all foundations in one release ensures the architecture is in place before adding complexity.

**Trade-offs:**
- Some features have no backend (Supabase not yet configured) — they degrade gracefully to localStorage or show setup guidance
- Direct publishing requires Meta app review which can take weeks — the API route is ready but UI is limited until approved
- Pinterest OAuth not yet implemented — UI shows "coming soon" placeholder

**Revisit when:** Supabase environment variables are added to Vercel — at that point auth and persistent DB become live.

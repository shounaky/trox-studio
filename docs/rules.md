# Development Rules
**Trox Studio — Mandatory Rules for All Development Sessions**
Version: 1.0 | Last updated: 2026-06-09

---

## Prime Directive

**Documentation is the single source of truth.**

If code and documentation disagree, documentation wins — until documentation is explicitly updated to reflect a deliberate change. Any AI coding session that begins without reading the relevant documentation first is operating blind.

---

## Rule 1 — Documentation First

**Before writing any code:**
1. Check `problem-statement.md` — does this feature exist as a Functional Requirement?
2. Check `architecture.md` — does this touch an existing service? Does it require a new one?
3. Check `decisions.md` — has a relevant architectural decision already been made?
4. Check `rules.md` — are there specific rules that apply?

**If the feature is not in `problem-statement.md`:** Add it first, get explicit approval, then implement.

**If you are changing architecture:** Update `architecture.md` before writing code, not after.

---

## Rule 2 — No Undocumented Features

Never implement a feature that is not present in `problem-statement.md` as a Functional Requirement (FR-XXX).

If a user asks for something new during a coding session:
1. Determine which FR it maps to, or identify it as a new FR
2. Add the FR to `problem-statement.md` with acceptance criteria
3. Then implement

**Rationale:** Feature creep without documentation creates a codebase that no one — human or AI — can fully reason about.

---

## Rule 3 — No Architecture Changes Without ADR

Never make the following changes without adding an entry to `decisions.md` first:

- Changing the AI provider or adding a new one
- Changing the persistence layer (localStorage → DB, or DB schema changes)
- Adding a new external service or API integration
- Adding a new npm dependency (weight >100KB bundled)
- Changing the deployment target or infrastructure
- Changing authentication or security model
- Splitting or merging services

**Template for new ADR:**
```
## ADR-XXX — [Short title]
Date: YYYY-MM-DD
Decision: [What was decided]
Reason: [Why]
Alternatives considered: [What else was evaluated]
Trade-offs: [What we accepted]
Revisit when: [Conditions for reconsideration]
```

---

## Rule 4 — No Duplicate Services

Before creating a new API route or service:
1. Check if an existing route can be extended
2. Check `architecture.md` Service Breakdown section

**Current API routes — do not duplicate these:**
- `/api/claude` — all AI generation (Groq + Claude)
- `/api/instagram` — public profile scraping (competitor tracking)
- `/api/instagram-session` — own account scraping via session cookie
- `/api/instagram-comments` — comment fetching via session cookie
- `/api/instagram-analytics` — Graph API analytics
- `/api/auth/instagram/start` — OAuth initiation
- `/api/auth/instagram/callback` — OAuth token exchange

**If you need Instagram data:** extend an existing route with a new `action` parameter. Do not create `/api/instagram-v2`.

---

## Rule 5 — No Hardcoded Secrets

Never hardcode:
- API keys (Groq, Anthropic, Instagram)
- Access tokens
- App IDs or App Secrets
- Database connection strings
- JWT secrets
- Encryption keys

**Phase 1 rule:** Secrets come from the user's localStorage (client-provided) or Vercel environment variables. Never in source code.

**Phase 2 rule:** All secrets in environment variables, never committed to git.

---

## Rule 6 — No New Dependencies Without Justification

Before running `npm install [package]`:
1. Can the same thing be achieved with existing dependencies or standard Web APIs?
2. What is the bundle size impact?
3. Is it actively maintained (last commit <6 months)?
4. Add the justification as a comment in the PR or as an ADR if significant

**Current approved dependencies:**
```
next, react, react-dom    — Framework (do not swap)
groq-sdk                  — Groq AI inference
@anthropic-ai/sdk         — Claude AI inference
@google/generative-ai     — Retained but deprioritised (ADR-003)
```

**Do not add** without explicit approval:
- Chart libraries (recharts, chart.js) — build CSS-based charts first
- UI component libraries (shadcn, MUI) — use existing custom components
- ORMs (Prisma, Drizzle) — add only when database is introduced (Phase 2)
- State management (Redux, Zustand) — React state is sufficient for Phase 1

---

## Rule 7 — Respect the Phase Boundary

Phase 1 is single-user, no authentication, localStorage persistence.

Do NOT implement the following in Phase 1 code:
- User accounts or login screens
- Multi-brand switching
- Database queries
- Email sending
- Background jobs or cron
- Webhooks

When Phase 2 begins, it begins with updating `architecture.md` first — not with writing code.

---

## Rule 8 — API Contracts are Binding

Every API route has a documented contract in `architecture.md`. Contracts define:
- HTTP method
- Request body schema
- Response schema
- Auth requirements
- Error format

**Do not change a contract without:**
1. Updating `architecture.md`
2. Updating all callers of that endpoint in the same commit
3. Adding an ADR if it is a breaking change

**Standard error format (all routes):**
```json
{ "error": "Human-readable message explaining what failed." }
```

---

## Rule 9 — Component Size Limit

`TroxStudio.jsx` must not exceed 1,200 lines.

When approaching this limit:
1. Extract CSS to a separate `styles/studio.css` file
2. Extract tab content to separate components in `components/tabs/`
3. Extract helper functions to `lib/` utilities
4. This refactor must happen before new features are added

---

## Rule 10 — Test Before Claiming Done

A feature is not done until:
1. `npm run build` completes without errors
2. The feature is verified working in the browser (not just "code looks right")
3. The happy path works
4. An obvious edge case is tested (empty state, missing API key, network error)

**Never report a feature as complete based solely on reading the code.**

---

## Rule 11 — Commit Message Format

Every commit must follow this format:
```
[scope] Short imperative summary (max 72 chars)

Optional body explaining WHY, not what.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Valid scopes: `feat`, `fix`, `docs`, `refactor`, `chore`, `style`

Examples:
```
feat: add session cookie Instagram scraper
fix: handle Groq rate limit with graceful error message
docs: update architecture.md with Phase 2 DB schema
refactor: extract Analytics tab to separate component
```

---

## Rule 12 — Documentation Updates Are Code

Documentation changes must be committed alongside the code changes they describe.

A PR that adds a new API route without updating `architecture.md` is incomplete.
A PR that makes an architectural decision without updating `decisions.md` is incomplete.

---

## Quick Reference: Before You Start Any Session

```
□ Read problem-statement.md — understand what is in scope
□ Read architecture.md — know what exists and how it connects
□ Read decisions.md — know what has already been decided and why
□ Read rules.md — know what you cannot do
□ Identify the FR-XXX this work maps to
□ Check if an ADR is needed before writing code
```

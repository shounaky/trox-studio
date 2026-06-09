# UX Principles
**Trox Studio — Design Philosophy & Wireframes**
Version: 1.0 | Last updated: 2026-06-09

---

## Design Philosophy

Trox Studio is used by a founder running a premium handcrafted brand. The UI must feel worthy of the brand it serves — elegant, deliberate, and calm. Not another SaaS dashboard cluttered with notifications, pop-ups, and upsell banners.

### Four Design References

| Reference | What we borrow |
|---|---|
| **Linear** | Keyboard-first, dense but not cluttered, fast, no decorative chrome |
| **Notion** | Hierarchy through whitespace, not borders; content IS the UI |
| **Stripe Dashboard** | Confident data display, trustworthy typography, purposeful colour |
| **Apple** | Visual consistency above all; every pixel is intentional |

### One Rule
> If a UI element does not help the user accomplish a task, it does not exist.

---

## Design Tokens (Current Implementation)

```css
--paper:    #F4EEE2   /* Warm off-white — primary background */
--card:     #FBF7EE   /* Slightly lighter — card surfaces */
--card-2:   #F1EAD9   /* Slightly darker — secondary surfaces */
--line:     #E2D8C3   /* Borders, dividers */
--ink:      #1C2A45   /* Primary text — deep navy */
--ink-2:    #5A6276   /* Secondary text */
--muted:    #8C8676   /* Placeholder, timestamps, labels */
--blue:     #3E74D1   /* Primary action colour */
--blue-deep:#2C58A8   /* Hover state */
--gold:     #B08D57   /* Brand accent — warmth, craft */
--gold-soft:#CBB489   /* Secondary gold */
--rose:     #C26B5A   /* Error, danger */
--ok:       #3E9B6B   /* Success, green metrics */

Typography:
  --display: 'Fraunces' — headings, brand name, labels
  --body:    'Mulish'   — all body text, inputs, buttons
```

---

## Requirements

### Minimal Clicks
- Content creation: idea → brief → save in 3 clicks maximum
- Settings: API key save in 1 click after pasting
- Analytics sync: 1 click from any state
- Tab navigation: 1 click to any section

### Fast Loading
- No full-page loading states — individual sections load independently
- Skeleton states for data-heavy sections (Instagram grid)
- AI responses stream where possible (Phase 2)

### Responsive Design
- Mobile breakpoint at 680px for grids (2-column → 1-column)
- Tab bar wraps on mobile — all tabs remain accessible
- Touch targets minimum 44×44px

### Keyboard Shortcuts (Phase 2 target)
```
G then D    → Dashboard
G then C    → Create
G then P    → Posts
G then A    → Analytics
G then N    → Competition
G then S    → Settings
Cmd+Enter   → Generate / Submit current action
Cmd+K       → Command palette
```

### Dark Mode (Phase 2)
Planned token swap:
```css
--paper:  #0F1117
--card:   #1A1D25
--ink:    #E8E6E0
--line:   #2A2D38
```

### Accessibility
- All interactive elements have `aria-label` or visible label
- Colour is never the sole means of conveying state (icons accompany colour signals)
- Focus rings preserved and visible
- Error messages associated with their input via `aria-describedby`

---

## Component Patterns

### Status Chips
```
● Green dot  → Connected, ready, success
● Amber dot  → Warning, needs attention (clickable — links to Settings)
● Red text   → Error state (inline, near the failing action)
```

### Buttons
```
Primary (blue fill)   → Main action per section. One per visible area.
Ghost (outlined)      → Secondary action. Regenerate, alternative options.
Mini (small, bordered)→ Inline actions on cards. Delete, copy, refresh.
OK (green fill)       → Save / confirm key actions (key save, connect)
```

### Cards
- Consistent 16px padding, 16px border-radius
- Subtle shadow (1px, 4% opacity) — depth without heaviness
- Entrance animation: `rise` (fade up, 400ms) with staggered delay for grids

### Forms
- Labels: uppercase, 11px, blue, 0.5px letter-spacing
- Inputs: 13px border-radius, focus ring = blue border
- No asterisks for required fields — all fields in a form are required unless labelled optional

---

## Wireframes

### Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ TROX Studio           [● Groq ready]  [Brand: X | edit] │
├─────────────────────────────────────────────────────────┤
│ Dashboard  Create  Posts  Analytics  Competition  Coach │
│           Settings                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ +2,400 followers  /  3,000 new follower goal     │   │
│  │ ████████████████████████░░░░░░░░░  80%           │   │
│  │ Starting: [9107]          Now: [11500]           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │  24  │  │   8  │  │ 340  │  │  89  │               │
│  │Posts │  │Meas- │  │Foll- │  │Best  │               │
│  │      │  │ured  │  │ows   │  │Saves │               │
│  └──────┘  └──────┘  └──────┘  └──────┘               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ The Playbook · AI living memory                  │   │
│  │ Reels with tactile close-ups + zodiac hook...   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Create Tab
```
┌─────────────────────────────────────────────────────────┐
│ [Instagram] [Pinterest]                                  │
├─────────────────────────────────────────────────────────┤
│ [General brand ▾] [Relationships ▾] [Any angle ▾]       │
│ [Optional topic input field          ] [Idea me 5]      │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │ ▲ High       │  │ ● Med        │  │ ▲ High       │   │
│ │ REEL         │  │ CAROUSEL     │  │ REEL         │   │
│ │ Zodiac Revel │  │ Craft Series │  │ VMKG Story   │   │
│ │ "When the..." │  │ "The thread" │  │ "What if..." │   │
│ │ [Use this →] │  │ [Use this →] │  │ [Use this →] │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
├─────────────────────────────────────────────────────────┤
│ [Reel ▾]                    [Build the Reel]            │
│                                                         │
│ ┌──────────────────────────────────────────────────┐   │
│ │ HOOK: "The moment you open it, something shifts" │   │
│ │                                                  │   │
│ │ BEAT 1 [0-3s]: Camera close on cover foil...    │   │
│ │ ...                                              │   │
│ │                                       [copy]     │   │
│ └──────────────────────────────────────────────────┘   │
│ [Save to Posts →]  [Regenerate]                         │
└─────────────────────────────────────────────────────────┘
```

### Analytics Tab
```
┌─────────────────────────────────────────────────────────┐
│ ✓ @troxcreations connected  9,107 followers · session   │
│                                            [Disconnect] │
├─────────────────────────────────────────────────────────┤
│ ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐         │
│ │  9.1K  │  │   37   │  │  4.2K  │  │  312   │         │
│ │Followers│  │Tracked │  │ Total  │  │ Total  │         │
│ │        │  │        │  │ Likes  │  │ Plays  │         │
│ └────────┘  └────────┘  └────────┘  └────────┘         │
├─────────────────────────────────────────────────────────┤
│ [↻ Sync posts]  Last synced 2h ago                      │
│                                                         │
│ ┌─────────────────────────────────────────────────┐    │
│ │ Deep Content Intelligence                         │    │
│ │ [Full brand audit →] [Voice] [Campaigns] [Tags] │    │
│ └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│ │ REEL ▲       │  │ IMAGE        │  │ CAROUSEL ●   │   │
│ │ 3d ago       │  │ 5d ago       │  │ 1w ago       │   │
│ │ Caption prev │  │ Caption prev │  │ Caption prev │   │
│ │ ♥234 💬18    │  │ ♥98  💬4     │  │ ♥156 💬11    │   │
│ │ ▶1.2K        │  │              │  │              │   │
│ │ ▲ 4.2% eng  │  │ ● 2.1% eng  │  │ ● 3.0% eng  │   │
│ │ [View ↗]     │  │ [View ↗]     │  │ [View ↗]     │   │
│ └──────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Content Calendar (Phase 2)
```
┌─────────────────────────────────────────────────────────┐
│ June 2026          [← Prev]  [Today]  [Next →]          │
├───────┬────────┬────────┬────────┬────────┬─────────────┤
│  Mon  │  Tue   │  Wed   │  Thu   │  Fri   │  Sat/Sun    │
├───────┼────────┼────────┼────────┼────────┼─────────────┤
│       │ [REEL] │        │ [POST] │        │             │
│       │ Zodiac │        │ Legacy │        │             │
│       │ Taurus │        │ 10am   │        │             │
├───────┼────────┼────────┼────────┼────────┼─────────────┤
│       │        │[CRSL]  │        │ [REEL] │             │
│       │        │VMKG    │        │ Craft  │             │
│       │        │ 9am    │        │ 11am   │             │
└───────┴────────┴────────┴────────┴────────┴─────────────┘
  [+ Add post]  [AI fill gaps →]
```

### Settings Tab
```
┌─────────────────────────────────────────────────────────┐
│ Settings                                                  │
│ API keys stored in your browser only.                    │
├─────────────────────────────────────────────────────────┤
│ CHOOSE AI PROVIDER                                       │
│ ┌─────────────────┐  ┌─────────────────┐               │
│ │ ✓ Groq          │  │   Claude        │               │
│ │ FREE            │  │   ~$3–5/month   │               │
│ │ Llama 3.3 70B   │  │   claude-opus   │               │
│ │ ✓ Active        │  │                 │               │
│ └─────────────────┘  └─────────────────┘               │
├─────────────────────────────────────────────────────────┤
│ GROQ API KEY                                            │
│ ✓ Key saved: gsk_abcd••••••••••••5678                   │
│ [Replace key input field              ] [Replace]       │
├─────────────────────────────────────────────────────────┤
│ INSTAGRAM — Session Cookie (EASIEST)                    │
│ Instructions: F12 → Application → Cookies → sessionid   │
│ ✓ Session saved: IGSID••••••••••••9012                  │
│ [Replace session input                ] [Replace]       │
├─────────────────────────────────────────────────────────┤
│ INSTAGRAM — Connect via Meta App (optional)             │
│ [Connect Instagram →]                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### Error States
- Errors appear inline, immediately below the action that caused them
- Red text, no modal dialogs, no toast notifications
- Error message includes what to do next, not just what went wrong

### Loading States
- Spinning ring + italicised Fraunces text describing what is happening
- Button text changes to "…" state (e.g., "Building…", "Syncing…", "Analysing…")
- No skeleton screens in Phase 1 — content appears once ready

### Empty States
- Every empty tab has a `big` headline and a one-line description of what to do
- Empty states are not dead ends — they guide to the action that fills them

### Success States
- Inline green text, fades after 2.5 seconds
- No modal confirmations for non-destructive actions

### Destructive Actions
- Delete buttons are `bw-mini` (small, subtle) — never primary
- No confirmation dialogs in Phase 1 (undo is acceptable pattern for Phase 2)

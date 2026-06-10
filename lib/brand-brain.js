// Brand Brain — structured knowledge layer
// Every AI feature reads from and writes to this module.

export const BB_KEY = "trox_brand_brain";

export const DEFAULT_PERSONAS = [
  {
    id: "gifting-buyer",
    emoji: "🎁",
    name: "The Gifting Buyer",
    description: "Looking for a heartfelt, premium gift for birthdays, anniversaries, or festivals. Wants personalised and meaningful — not generic.",
    platforms: ["Instagram", "Pinterest"],
    triggers: ["Milestone birthday", "Anniversary", "Diwali", "Raksha Bandhan", "Wedding"],
    painPoints: ["Can't find unique enough gifts", "Wants personalisation", "Budget ₹800–₹3,000"],
  },
  {
    id: "journaling-enthusiast",
    emoji: "✍️",
    name: "The Journaling Enthusiast",
    description: "Daily writer or aspiring journaler. Values craftsmanship, paper quality, and aesthetic. Part of the self-development and wellness community.",
    platforms: ["Instagram", "YouTube", "Pinterest"],
    triggers: ["New Year resolution", "Therapy starter", "Self-development journey", "Stationery haul"],
    painPoints: ["Mass-produced journals feel impersonal", "Wants quality paper and binding", "Loves beautiful craft and intentional design"],
  },
  {
    id: "corporate-buyer",
    emoji: "🏢",
    name: "The Corporate Buyer",
    description: "HR manager or team lead sourcing premium branded gifts for employees, clients, or events. Values customisation, professional presentation, and on-time delivery.",
    platforms: ["LinkedIn", "Email"],
    triggers: ["Employee appreciation", "Client onboarding", "Corporate events", "Diwali gifting"],
    painPoints: ["Needs bulk ordering", "Wants logo customisation", "Tight delivery timelines", "Needs invoice/GST"],
  },
];

export const DEFAULT_PILLARS = [
  { id: "craftsmanship", label: "Craftsmanship & BTS",     target: 25, color: "#C9A86C" },
  { id: "journaling",    label: "Journaling Culture & Prompts", target: 25, color: "#7BA7F0" },
  { id: "gifting",       label: "Gifting Occasions",         target: 20, color: "#D4806E" },
  { id: "customer",      label: "Customer Stories & UGC",    target: 15, color: "#6DC48B" },
  { id: "product",       label: "Product Launches & Features", target: 15, color: "#A78BFA" },
];

export const SEASONAL_MOMENTS = [
  { id: "diwali",           label: "Diwali",               month: 10, day: 20,  category: "india",  pillar: "gifting",       description: "Top gifting season. Custom Zodiac journals as Diwali gifts." },
  { id: "rakshabandhan",    label: "Raksha Bandhan",        month:  8, day:  9,  category: "india",  pillar: "gifting",       description: "Sister-brother bonds. Personal journals as heartfelt gifts." },
  { id: "friendship-day",   label: "Friendship Day",        month:  8, day:  3,  category: "india",  pillar: "gifting",       description: "First Sunday of August. Gifting to close friends." },
  { id: "wedding-season",   label: "Wedding Season",        month: 11, day: 15,  category: "india",  pillar: "gifting",       description: "Nov–Feb: premium gifting for couples, guests, wedding favours." },
  { id: "new-year",         label: "New Year Fresh Start",  month:  1, day:  1,  category: "global", pillar: "journaling",    description: "Peak journaling intent. Resolutions, goal-setting, new chapter energy." },
  { id: "valentines",       label: "Valentine's Day",       month:  2, day: 14,  category: "global", pillar: "gifting",       description: "Romantic gifting. Custom couples' journals, anniversary editions." },
  { id: "exam-season",      label: "Exam Season",           month:  3, day:  1,  category: "india",  pillar: "gifting",       description: "Feb–April: students and parents gifting study planners and journals." },
  { id: "holi",             label: "Holi",                  month:  3, day: 13,  category: "india",  pillar: "journaling",    description: "Colours and expression — tie to creative self-expression." },
  { id: "world-stationery", label: "World Stationery Day",  month:  4, day: 29,  category: "global", pillar: "craftsmanship", description: "Last Wednesday of April. Owned content moment for the brand." },
  { id: "mothers-day",      label: "Mother's Day",          month:  5, day: 11,  category: "global", pillar: "gifting",       description: "Premium heartfelt gift — personalised Legacy collection for mothers." },
];

export const DEFAULT_HASHTAG_VAULT = {
  craftsmanship: [
    "#handcraftedjournal", "#leatherjournal", "#journalmaking", "#bookbinding",
    "#craftedwithcare", "#makersgonnamake", "#artisancraft", "#handbound",
    "#journalcraft", "#premiumstationery",
  ],
  journaling: [
    "#journalingcommunity", "#dailyjournal", "#journalprompts", "#journalinglife",
    "#selfcare", "#mindfulwriting", "#writingcommunity", "#journaltherapy",
    "#notebooklove", "#planneraddict",
  ],
  gifting: [
    "#giftideas", "#uniquegifts", "#personalizedgifts", "#giftforhim",
    "#giftforher", "#diwaligifts", "#gifting", "#thoughtfulgifts",
    "#luxurygifts", "#handmadegifts",
  ],
  customer: [
    "#customerreview", "#happycustomer", "#unboxing", "#communityshare",
    "#testimonial", "#realreview", "#customerlove", "#ugc",
    "#troxcreations", "#troxjournals",
  ],
  product: [
    "#newlaunch", "#limitededition", "#zodiacjournal", "#legacyjournal",
    "#lifepillarjournal", "#vmkg", "#newcollection", "#stationary",
    "#journaldesign", "#notebookdesign",
  ],
};

export const DEFAULT_BRAND_BRAIN = {
  version: 1,
  updatedAt: null,
  personas: DEFAULT_PERSONAS,
  pillars: DEFAULT_PILLARS,
  seasonalMoments: SEASONAL_MOMENTS,
  voiceExamples: {
    good: [
      "Every stitch holds a secret — the story you haven't written yet.",
      "Not just a notebook. A space where thought becomes form.",
      "Your Zodiac journal knows who you are before you do.",
    ],
    avoid: [
      "Grab yours now before it's gone!",
      "Best price guaranteed.",
      "Hurry, limited stock!",
    ],
  },
  learningMemory: [],
  hashtagVault: DEFAULT_HASHTAG_VAULT,
};

// ─── Storage helpers ───────────────────────────────────────────────────────

export function loadBrandBrain() {
  if (typeof window === "undefined") return DEFAULT_BRAND_BRAIN;
  try {
    const stored = localStorage.getItem(BB_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_BRAND_BRAIN,
        ...parsed,
        personas: parsed.personas || DEFAULT_BRAND_BRAIN.personas,
        pillars: parsed.pillars || DEFAULT_BRAND_BRAIN.pillars,
        voiceExamples: parsed.voiceExamples || DEFAULT_BRAND_BRAIN.voiceExamples,
        learningMemory: parsed.learningMemory || [],
        hashtagVault: parsed.hashtagVault
          ? { ...DEFAULT_HASHTAG_VAULT, ...parsed.hashtagVault }
          : DEFAULT_HASHTAG_VAULT,
      };
    }
  } catch {}
  return DEFAULT_BRAND_BRAIN;
}

export function getHashtagsForPillar(bb, pillarId) {
  return (bb?.hashtagVault?.[pillarId] || []);
}

export function saveBrandBrainToStorage(bb) {
  try {
    localStorage.setItem(BB_KEY, JSON.stringify({ ...bb, updatedAt: Date.now() }));
  } catch {}
}

// ─── AI context builder ────────────────────────────────────────────────────

export function brandBrainCtx(bb) {
  const brain = bb || DEFAULT_BRAND_BRAIN;

  const personasText = brain.personas.map((p) =>
    `• ${p.name}: ${p.description} Triggers: ${p.triggers.join(", ")}.`
  ).join("\n");

  const pillarsText = brain.pillars.map((p) =>
    `• ${p.label} — ${p.target}% of content`
  ).join("\n");

  const memoryText = brain.learningMemory.length
    ? brain.learningMemory.slice(-8).map((m) => `• ${m.text}`).join("\n")
    : "No insights accumulated yet — use strong best practices.";

  const goodVoice = (brain.voiceExamples?.good || []).join("\n");
  const badVoice  = (brain.voiceExamples?.avoid || []).join("\n");

  return `BRAND BRAIN:

AUDIENCE PERSONAS:
${personasText}

CONTENT PILLARS (target mix):
${pillarsText}

BRAND VOICE — DO:
${goodVoice}

BRAND VOICE — AVOID:
${badVoice}

LEARNING MEMORY (recent performance insights):
${memoryText}`;
}

// ─── Short context (for content generation — concise version) ─────────────

export function shortBrainCtx(bb) {
  if (!bb) return "";
  const brain = bb;
  const personasText = (brain.personas || []).map((p) =>
    `• ${p.name}: ${p.description.slice(0, 120)}`
  ).join("\n");
  const pillarsText = (brain.pillars || []).map((p) =>
    `• ${p.label} (${p.target}%)`
  ).join(", ");
  const memText = (brain.learningMemory || []).slice(-4).map((m) => `• ${m.text}`).join("\n");
  return [
    "AUDIENCE: " + personasText,
    pillarsText ? "CONTENT PILLARS: " + pillarsText : "",
    memText ? "RECENT INSIGHTS:\n" + memText : "",
  ].filter(Boolean).join("\n\n");
}

// ─── Learning memory helper ────────────────────────────────────────────────

export function addInsightToMemory(bb, text, source = "manual") {
  const memory = [...(bb.learningMemory || [])];
  memory.push({ id: Date.now().toString(36), text, source, addedAt: Date.now() });
  // Keep last 30 insights
  if (memory.length > 30) memory.splice(0, memory.length - 30);
  return { ...bb, learningMemory: memory };
}

// ─── Pillar mix analysis ───────────────────────────────────────────────────

export function computePillarMix(posts, pillars) {
  const total = posts.length;
  if (!total) return pillars.map((p) => ({ ...p, actual: 0, delta: -p.target }));
  const counts = {};
  posts.forEach((p) => { counts[p.pillar] = (counts[p.pillar] || 0) + 1; });
  return pillars.map((p) => {
    const actual = Math.round(((counts[p.id] || 0) / total) * 100);
    return { ...p, actual, delta: actual - p.target };
  });
}

// ─── Seasonal calendar helpers ─────────────────────────────────────────────

export function upcomingMoments(moments, daysAhead = 60) {
  const now = new Date();
  const year = now.getFullYear();
  return moments
    .map((m) => {
      let d = new Date(year, m.month - 1, m.day);
      if (d < now) d = new Date(year + 1, m.month - 1, m.day);
      const days = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
      return { ...m, date: d, daysAway: days };
    })
    .filter((m) => m.daysAway <= daysAhead)
    .sort((a, b) => a.daysAway - b.daysAway);
}

// Mock data generators — work completely offline, no API keys needed.

const MOCK_CAPTIONS = [
  "The thread count in this journal is something you feel before you read.",
  "Zodiac energy, handstitched into every cover. Your sign. Your story.",
  "A journal that knows your Mercury placement before you do.",
  "Not mass-produced. Not algorithm-designed. Just craft.",
  "For the person who writes their future first — then lives it.",
  "This is what Diwali gifting looks like when you actually care.",
  "Legacy. One page at a time.",
  "The moment you open it, you know something is different.",
  "Your words deserve a home this beautiful.",
  "Every Trox journal begins the same way — with someone deciding to start.",
];

function seededRandom(seed) {
  let h = seed ^ 0xdeadbeef;
  return function () {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h ^= h >>> 16;
    return (h >>> 0) / 0x100000000;
  };
}

// ─── Follower history ──────────────────────────────────────────────────────

export function generateFollowerHistory(currentFollowers = 4820, days = 90) {
  const rng = seededRandom(currentFollowers + days);
  const data = [];
  const now = new Date();
  let count = currentFollowers - Math.floor(rng() * 800 + 200);

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    const delta = Math.floor(rng() * 20 - 4);
    count = Math.max(0, count + delta);
    if (i % 7 === 0 || i === 0) {
      data.push({ date: label, followers: count });
    }
  }
  return data;
}

// ─── Engagement history ────────────────────────────────────────────────────

export function generateEngagementHistory(days = 30) {
  const rng = seededRandom(days * 17);
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    const rate = (3.8 + rng() * 4.2 - 1).toFixed(1);
    if (i % 3 === 0 || i === 0) {
      data.push({ date: label, rate: parseFloat(rate) });
    }
  }
  return data;
}

// ─── Post performance history ──────────────────────────────────────────────

export function generatePostPerformance(savedPosts = [], igMedia = []) {
  const rng = seededRandom(savedPosts.length * 7 + igMedia.length * 13);
  const pillars = ["craftsmanship", "journaling", "gifting", "customer", "product"];
  const formats = ["Reel", "Carousel", "Post"];

  const posts = igMedia.length > 0
    ? igMedia.slice(0, 12).map((p, i) => ({
        id: p.id || `ig_${i}`,
        label: `Post ${i + 1}`,
        likes: p.like_count || 0,
        comments: p.comment_count || 0,
        reach: Math.round((p.like_count || 0) * (8 + rng() * 4)),
        format: p.media_type === "VIDEO" ? "Reel" : p.media_type === "CAROUSEL_ALBUM" ? "Carousel" : "Post",
        pillar: pillars[i % pillars.length],
      }))
    : Array.from({ length: 12 }, (_, i) => {
        const base = Math.floor(rng() * 400 + 80);
        return {
          id: `mock_${i}`,
          label: `Post ${i + 1}`,
          likes: base,
          comments: Math.floor(base * 0.06 + rng() * 10),
          reach: base * Math.floor(rng() * 6 + 7),
          format: formats[i % formats.length],
          pillar: pillars[i % pillars.length],
        };
      });

  return posts;
}

// ─── Mock inbox messages ───────────────────────────────────────────────────

const MOCK_AUTHORS = [
  "@aishaa.journals", "@stationery_love", "@riya.writes", "@thejournalclub",
  "@giftideas_india", "@corporategiftsco", "@zodiac.journal", "@siddhiink",
  "@paperlove.in", "@writewithme_01",
];

const MOCK_MESSAGES = [
  { text: "This is exactly what I was looking for as a birthday gift for my sister! Do you do gift wrapping?", intent: "purchase_inquiry", lead: true },
  { text: "Love the Zodiac collection! I'm a Virgo — is there a Virgo edition?", intent: "product_question", lead: true },
  { text: "We're looking for 50+ corporate gifts before Diwali. Can you DM me pricing?", intent: "bulk_inquiry", lead: true, priority: true },
  { text: "Just got my order and WOW the quality 😍 The stitching is so beautiful", intent: "positive_review", lead: false },
  { text: "How long does delivery take to Pune?", intent: "shipping_inquiry", lead: true },
  { text: "This is so gorgeous. Who else should I tag in this?", intent: "engagement", lead: false },
  { text: "Can I personalise the inside cover with a message?", intent: "customisation_inquiry", lead: true },
  { text: "Do you have gift cards available?", intent: "product_question", lead: true },
  { text: "My therapist recommended journaling. Is this journal good for beginners?", intent: "product_question", lead: true },
  { text: "Absolutely obsessed with the Legacy collection. Ordering a second one.", intent: "repeat_buyer", lead: false },
];

export function generateMockInbox() {
  const rng = seededRandom(Date.now() % 9999);
  return MOCK_MESSAGES.map((m, i) => ({
    id: `inbox_${i}`,
    author: MOCK_AUTHORS[i % MOCK_AUTHORS.length],
    avatar: null,
    text: m.text,
    intent: m.intent,
    lead: m.lead || false,
    priority: m.priority || false,
    postId: `mock_post_${(i % 5) + 1}`,
    postCaption: MOCK_CAPTIONS[i % MOCK_CAPTIONS.length].slice(0, 60) + "…",
    time: Date.now() - (i * 3 + Math.floor(rng() * 4)) * 60 * 60 * 1000,
    replied: false,
    draft: "",
    label: m.priority ? "hot-lead" : m.lead ? "lead" : m.intent === "positive_review" ? "love" : "general",
  }));
}

// ─── Mock engagement advancement ──────────────────────────────────────────

export function advanceMockEngagement(post) {
  const rng = seededRandom(post.id?.length || 7);
  const hoursElapsed = Math.floor((Date.now() - (post.publishedAt || Date.now())) / (1000 * 60 * 60));
  const growthCurve = Math.min(1, Math.log10(hoursElapsed + 1) / 2.5);

  const baseLikes    = Math.floor(rng() * 250 + 50);
  const baseComments = Math.floor(rng() * 20 + 3);

  return {
    likes:    Math.floor(baseLikes * growthCurve),
    comments: Math.floor(baseComments * growthCurve),
    shares:   Math.floor(rng() * 15 * growthCurve),
    saves:    Math.floor(rng() * 80 * growthCurve),
    reach:    Math.floor(baseLikes * (7 + rng() * 5) * growthCurve),
    hoursElapsed,
  };
}

// ─── Best-time posting recommendations ────────────────────────────────────

export const BEST_TIMES = {
  Instagram: [
    { day: 2, hour: 11, label: "Tue 11am IST" },
    { day: 4, hour: 11, label: "Thu 11am IST" },
    { day: 5, hour: 19, label: "Fri 7pm IST" },
  ],
  Pinterest: [
    { day: 6, hour: 9,  label: "Sat 9am IST" },
    { day: 0, hour: 10, label: "Sun 10am IST" },
  ],
  LinkedIn: [
    { day: 2, hour: 9,  label: "Tue 9am IST" },
    { day: 3, hour: 12, label: "Wed 12pm IST" },
  ],
  "X (Twitter)": [
    { day: 1, hour: 8,  label: "Mon 8am IST" },
    { day: 3, hour: 12, label: "Wed 12pm IST" },
    { day: 5, hour: 18, label: "Fri 6pm IST" },
  ],
  Threads: [
    { day: 2, hour: 11, label: "Tue 11am IST" },
    { day: 5, hour: 19, label: "Fri 7pm IST" },
  ],
};

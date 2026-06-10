// MockProvider — simulates publishing without any external API.
// Implements the PublishingProvider interface: publish(post) → { id, status }
// Switch to AyrshareProvider by returning a different provider from getProvider().

const MOCK_PUBLISHED_KEY = "trox_mock_published";

function loadPublished() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(MOCK_PUBLISHED_KEY) || "[]"); } catch { return []; }
}

function savePublished(posts) {
  try { localStorage.setItem(MOCK_PUBLISHED_KEY, JSON.stringify(posts)); } catch {}
}

export const MockProvider = {
  name: "mock",
  label: "Demo Mode",

  async publish(post) {
    await new Promise((r) => setTimeout(r, 800));

    const mockId = `mock_${Date.now().toString(36)}`;
    const record = {
      id: mockId,
      originalId: post.id,
      platform: post.platform || "Instagram",
      caption: (post.draft || post.caption || "").slice(0, 200),
      format: post.format,
      scheduledFor: post.scheduledFor,
      publishedAt: Date.now(),
      status: "published",
      mockEngagement: { likes: 0, comments: 0, shares: 0, saves: 0, reach: 0 },
    };

    const all = loadPublished();
    all.push(record);
    savePublished(all);

    return { id: mockId, status: "published", provider: "mock" };
  },

  async getEngagement(mockId) {
    await new Promise((r) => setTimeout(r, 200));

    const all = loadPublished();
    const record = all.find((p) => p.id === mockId);
    if (!record) return null;

    const hoursElapsed = Math.floor((Date.now() - record.publishedAt) / (1000 * 60 * 60));
    const seed = mockId.charCodeAt(mockId.length - 1) * 7;
    const rng  = () => ((seed * 9301 + 49297) % 233280) / 233280;
    const grow = Math.min(1, Math.log10(hoursElapsed + 1) / 2);

    return {
      likes:    Math.floor((rng() * 200 + 40) * grow),
      comments: Math.floor((rng() * 15 + 2) * grow),
      shares:   Math.floor((rng() * 12) * grow),
      saves:    Math.floor((rng() * 60) * grow),
      reach:    Math.floor((rng() * 1200 + 300) * grow),
      hoursElapsed,
    };
  },

  getAll() {
    return loadPublished();
  },

  clear() {
    savePublished([]);
  },
};

// ─── Provider registry ─────────────────────────────────────────────────────

export function getProvider(settings) {
  // Future: return AyrshareProvider when settings.ayrshareKey is set
  return MockProvider;
}

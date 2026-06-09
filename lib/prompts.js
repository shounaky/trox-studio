export const BRAND_KB = `DEEP BRAND KNOWLEDGE — Trox Creations (@troxcreations):

FOUNDER & ORIGIN:
Benjamin Victor Manickam founded Trox Creations as his Ikigai — the intersection of passion, skill, and meaningful impact. He is an educator at Victor Manickam Knowledge Group (VMKG) and Business Head at Humandesign Education Pvt Ltd. He created personalized study tools for himself and discovered that building customized structures enhanced ownership and responsibility — then built a brand to give others the same transformative experience.

BRAND ESSENCE:
Tagline: "Every notebook tells a story waiting to be written."
Mission: "To Learn and Express" — the brand learns from people, stories, and ideas, then channels those insights into thoughtfully designed notebooks.
Core belief: "A notebook is not just a product — it's a reflection of thought, identity, and possibility."
Featured philosopher: Brene Brown ("Connection gives purpose and meaning to our lives.") — signals an emotionally intelligent, reflective audience.
Instagram bio: "Let your creativity flow and make your mark with a book that is as unique as you are. Discover the joy of personalised creation today!"

BRAND 7 PILLARS: Vision (Excellence), Mission (Learning & Expression), Purpose (Self-Presentation), Values (Joy, Oneness, Responsibility), Principles (Service, Integrity, Authenticity), Body of Work, Realm of Work.

FOUR PRODUCT LINES:
- LEGACY COLLECTION — Timeless notebooks for your enduring stories. Five journals: Relationships, Work & Education, Health, Wealth, Self-Awareness.
- LIFE PILLAR SERIES — A dedicated journal for each pillar of life. Same five themes as Legacy.
- ZODIAC SERIES — Personalized journals for all 12 star signs. Customers say "it introduces me to me." Most-used gifting product.
- VMKG EDITION — Benjamin's educational/knowledge brand collaboration. Used in workshops, coaching, and Human Design contexts.

THE FIVE LIFE PILLARS: Relationships, Work & Education, Health, Wealth, Self-Awareness.
PERSONALIZATION: Zodiac editions + fully custom keepsakes. Most popular as birthday and anniversary gifts.
EMOTIONAL TERRITORY: Self-discovery, reflection, legacy, ownership of words, craftsmanship (cut, feel, stitch), meaningful gifting.
REAL CUSTOMER LANGUAGE: "it introduces me to me", "a space purely mine", "felt like it was made for me", "I find it sacred."
VOICE: Premium, soulful, warm, reflective, philosophical, elegant. Quiet luxury. Never loud or discount-driven.
AUDIENCE: Thoughtful introspective people 22-45, journalers, self-development practitioners, Human Design/astrology community, gift-buyers. Strong in India (Navi Mumbai), global appeal.
INSTAGRAM: @troxcreations, 9100+ followers, 37 posts, Navi Mumbai.
CONTENT STRENGTHS: Founder Ikigai story, personalization hook, Zodiac community, craft close-ups (paper/stitching/foil/hands), birthday/anniversary gifting, philosophical quotes.`;

export const TROX_DEFAULT = {
  name: "Trox Creations",
  sells:
    "Premium handcrafted notebooks & journals — Legacy, Life Pillar, Zodiac & VMKG Edition. Custom keepsakes. Founded as Benjamin's Ikigai.",
  audience:
    "Introspective people 22-45 into self-development, journaling, Human Design / astrology. Gift-buyers wanting heartfelt personalised keepsakes (esp. birthdays & anniversaries).",
  voice:
    "Premium, soulful, warm, reflective, philosophical, elegant. Quiet luxury — never salesy. The brand lives at the intersection of craftsmanship and consciousness. Brene Brown territory.",
  goal:
    "Grow @troxcreations from 9,107 to 12,000+ organic followers; attract gift-buyers, journaling lovers, and the self-development/zodiac community.",
};

export function learnCtx(profile, playbook) {
  return `${BRAND_KB}

BRAND PROFILE:
- Sells: ${profile?.sells || TROX_DEFAULT.sells}
- Audience: ${profile?.audience || TROX_DEFAULT.audience}
- Voice: ${profile?.voice || TROX_DEFAULT.voice}
- Goal: ${profile?.goal || TROX_DEFAULT.goal}

WHAT WE'VE LEARNED:
${playbook || "No performance data logged yet — use strong best practices for this premium, reflective brand."}`;
}

export const CHANNELS = [
  { id: "instagram",  label: "Instagram" },
  { id: "pinterest",  label: "Pinterest" },
  { id: "linkedin",   label: "LinkedIn" },
  { id: "twitter",    label: "X (Twitter)" },
  { id: "threads",    label: "Threads" },
];

export const FORMATS = {
  instagram: ["Reel", "Carousel", "Post", "Story"],
  pinterest: ["Pin", "Idea Pin"],
  linkedin:  ["Article", "Post", "Document"],
  twitter:   ["Tweet", "Thread"],
  threads:   ["Post", "Thread"],
};

export const COLLECTIONS = [
  "General brand",
  "Legacy",
  "Life Pillar",
  "Zodiac",
  "VMKG Edition",
];

export const PILLARS = [
  "Relationships",
  "Work & Education",
  "Health",
  "Wealth",
  "Self-Awareness",
];

export const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces",
];

export const ANGLES = [
  "Any angle",
  "Self-discovery",
  "Gifting",
  "Craftsmanship",
  "Behind the scenes",
  "Founder story",
  "Customer story",
  "Festive / occasion",
  "Philosophy & reflection",
];

export const TABS = [
  "Home",
  "Brand Brain",
  "Create",
  "Posts",
  "Calendar",
  "Inbox",
  "Trends",
  "Analytics",
  "Competition",
  "Coach",
  "Settings",
];

export const channelLabel = (id) =>
  CHANNELS.find((c) => c.id === id)?.label || id;

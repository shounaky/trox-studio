export const CHANNELS = [
  { id: "instagram", label: "Instagram" },
  { id: "pinterest", label: "Pinterest" },
];

export const FORMATS = {
  instagram: ["Reel", "Carousel", "Post", "Story"],
  pinterest: ["Pin", "Idea Pin"],
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
  "Dashboard",
  "Create",
  "Posts",
  "Calendar",
  "Trends",
  "Analytics",
  "Competition",
  "Coach",
  "Settings",
];

export const channelLabel = (id) =>
  CHANNELS.find((c) => c.id === id)?.label || id;

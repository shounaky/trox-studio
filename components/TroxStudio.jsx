"use client";

import React, { useState, useEffect } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Mulish:wght@400;500;600;700;800&display=swap');
* { box-sizing:border-box; margin:0; padding:0; }
.bw-root {
  --paper:#F4EEE2; --card:#FBF7EE; --card-2:#F1EAD9; --line:#E2D8C3;
  --ink:#1C2A45; --ink-2:#5A6276; --muted:#8C8676;
  --blue:#3E74D1; --blue-deep:#2C58A8; --gold:#B08D57; --gold-soft:#CBB489;
  --rose:#C26B5A; --ok:#3E9B6B;
  font-family:'Mulish',sans-serif; background:var(--paper); color:var(--ink);
  min-height:100vh; padding:0 0 70px; position:relative; overflow-x:hidden;
}
.bw-root::before { content:""; position:fixed; inset:0; pointer-events:none; opacity:.5; z-index:0;
  background:radial-gradient(700px 380px at 90% -8%,rgba(62,116,209,.10),transparent 60%),
             radial-gradient(620px 420px at -5% 105%,rgba(176,141,87,.10),transparent 60%); }
.bw-wrap { position:relative; z-index:1; }
.bw-topwave { display:block; width:100%; height:54px; }
.bw-wrap { max-width:960px; margin:0 auto; padding:0 20px; position:relative; }
.bw-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; margin:6px 0 24px; }
.bw-logo { font-family:'Fraunces'; font-weight:600; font-size:30px; letter-spacing:.5px; line-height:1; color:var(--ink); }
.bw-logo b { font-weight:600; letter-spacing:3px; }
.bw-logo span { color:var(--blue); font-style:italic; }
.bw-tag { color:var(--ink-2); font-size:12.5px; margin-top:7px; font-weight:500; }
.bw-headright { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
.bw-brandchip { background:var(--card); border:1px solid var(--line); border-radius:999px; padding:8px 14px; font-size:12px; display:flex; gap:9px; align-items:center; }
.bw-brandchip b { color:var(--blue); font-family:'Fraunces'; font-weight:600; }
.bw-aichip { background:var(--card); border:1px solid var(--line); border-radius:999px; padding:6px 13px; font-size:11.5px; display:flex; gap:7px; align-items:center; font-weight:700; }
.bw-aichip .dot { width:7px; height:7px; border-radius:50%; background:var(--ok); flex-shrink:0; }
.bw-aichip .dot.amber { background:#e8a020; }
.bw-edit { background:none; border:none; color:var(--muted); cursor:pointer; font-size:11px; text-decoration:underline; font-family:inherit; }
.bw-tabs { display:flex; border-bottom:1px solid var(--line); margin-bottom:24px; flex-wrap:wrap; }
.bw-tab { background:none; border:none; color:var(--muted); cursor:pointer; font-family:'Fraunces'; font-weight:600; font-size:17px; padding:10px 2px; margin-right:24px; position:relative; }
.bw-tab.on { color:var(--ink); }
.bw-tab.on::after { content:""; position:absolute; left:0; right:0; bottom:-1px; height:2.5px; background:var(--blue); border-radius:2px; }
.bw-channels { display:flex; gap:8px; margin-bottom:18px; }
.bw-chan { border:1px solid var(--line); background:var(--card); color:var(--ink-2); border-radius:999px; padding:8px 17px; font-size:13px; cursor:pointer; font-family:inherit; font-weight:700; transition:all .15s; }
.bw-chan:hover { border-color:var(--blue); color:var(--ink); }
.bw-chan.on { background:var(--blue); color:#fff; border-color:var(--blue); }
.bw-builder { display:flex; gap:9px; flex-wrap:wrap; margin-bottom:14px; }
.bw-row { display:flex; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
.bw-input { flex:1; min-width:200px; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:13px 15px; color:var(--ink); font-family:inherit; font-size:14px; }
.bw-input::placeholder { color:#b3ab98; }
.bw-input:focus { outline:none; border-color:var(--blue); }
textarea.bw-input { resize:vertical; min-height:78px; width:100%; }
.bw-select { background:var(--card); border:1px solid var(--line); border-radius:12px; padding:12px 13px; color:var(--ink); font-family:inherit; font-size:13.5px; cursor:pointer; }
.bw-btn { background:var(--blue); color:#fff; border:none; border-radius:12px; padding:13px 22px; font-family:'Fraunces'; font-weight:600; font-size:15px; cursor:pointer; transition:all .14s; white-space:nowrap; box-shadow:0 2px 10px rgba(62,116,209,.22); }
.bw-btn:hover { background:var(--blue-deep); transform:translateY(-1px); }
.bw-btn:disabled { opacity:.5; cursor:wait; transform:none; }
.bw-btn.ghost { background:transparent; color:var(--ink); border:1px solid var(--gold-soft); box-shadow:none; }
.bw-btn.ghost:hover { background:var(--card-2); }
.bw-btn.sm { padding:9px 16px; font-size:13px; }
.bw-btn.ok { background:var(--ok); }
.bw-grid { display:grid; grid-template-columns:1fr 1fr; gap:13px; }
@media (max-width:680px){ .bw-grid { grid-template-columns:1fr; } }
.bw-card { background:var(--card); border:1px solid var(--line); border-radius:16px; padding:17px; animation:rise .4s ease backwards; box-shadow:0 1px 2px rgba(28,42,69,.04); }
.bw-card h4 { font-family:'Fraunces'; font-weight:600; font-size:17px; margin-bottom:8px; line-height:1.2; color:var(--ink); }
.bw-meta { display:flex; gap:7px; margin-bottom:9px; flex-wrap:wrap; align-items:center; }
.bw-fmt { font-size:10px; font-weight:800; color:var(--blue); border:1px solid #cdddf5; background:#eaf1fc; padding:3px 9px; border-radius:999px; letter-spacing:.4px; text-transform:uppercase; }
.bw-perf { font-size:10px; font-weight:800; padding:3px 9px; border-radius:999px; letter-spacing:.4px; }
.bw-perf.high { color:#fff; background:var(--ok); }
.bw-perf.medium { color:#5a4a22; background:var(--gold-soft); }
.bw-status { font-size:10px; font-weight:800; padding:3px 9px; border-radius:999px; letter-spacing:.4px; }
.bw-status.planned { color:var(--muted); border:1px solid var(--line); }
.bw-status.posted { color:#fff; background:var(--gold); }
.bw-hook { font-family:'Fraunces'; font-size:14px; font-style:italic; color:var(--ink); border-left:2px solid var(--gold); padding-left:11px; margin:8px 0; line-height:1.35; }
.bw-why { font-size:12px; color:var(--ink-2); line-height:1.5; }
.bw-cardbtns { display:flex; gap:7px; margin-top:13px; flex-wrap:wrap; }
.bw-mini { font-size:11px; font-weight:700; padding:6px 12px; border-radius:9px; cursor:pointer; border:1px solid var(--line); background:var(--card-2); color:var(--ink); font-family:inherit; }
.bw-mini:hover { border-color:var(--blue); }
.bw-mini.go { background:var(--blue); color:#fff; border-color:var(--blue); }
.bw-out { background:var(--card); border:1px solid var(--line); border-radius:16px; padding:20px; white-space:pre-wrap; font-size:13.5px; line-height:1.65; animation:rise .4s ease; box-shadow:0 1px 2px rgba(28,42,69,.04); }
.bw-out.mono { font-family:ui-monospace,Menlo,monospace; font-size:12.5px; }
.bw-copy { float:right; font-size:11px; color:var(--muted); cursor:pointer; background:none; border:none; text-decoration:underline; font-family:inherit; }
.bw-draftbar { display:flex; gap:8px; margin-top:14px; }
.bw-empty { text-align:center; color:var(--ink-2); padding:46px 20px; font-size:14px; }
.bw-empty .big { font-family:'Fraunces'; font-weight:600; font-size:21px; color:var(--ink); margin-bottom:7px; }
.bw-note { color:var(--muted); font-size:11.5px; margin-top:13px; }
.bw-load { display:flex; align-items:center; gap:12px; color:var(--ink-2); padding:38px 10px; font-size:14px; font-style:italic; font-family:'Fraunces'; }
.bw-spin { width:18px; height:18px; border:2px solid var(--line); border-top-color:var(--blue); border-radius:50%; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes rise { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
.bw-setup { background:var(--card); border:1px solid var(--line); border-radius:20px; padding:28px; max-width:570px; margin:18px auto 0; animation:rise .4s ease; box-shadow:0 6px 30px rgba(28,42,69,.06); }
.bw-setup h2 { font-family:'Fraunces'; font-weight:600; font-size:26px; margin-bottom:6px; }
.bw-setup p.sub { color:var(--ink-2); font-size:13px; margin-bottom:22px; }
.bw-field { margin-bottom:15px; }
.bw-field label { display:block; font-size:11px; font-weight:800; color:var(--blue); margin-bottom:6px; letter-spacing:.5px; text-transform:uppercase; }
.bw-goal { background:linear-gradient(135deg,var(--card),var(--card-2)); border:1px solid var(--line); border-radius:18px; padding:22px; margin-bottom:16px; }
.bw-goalhead { display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:10px; margin-bottom:15px; }
.bw-goalnum { font-family:'Fraunces'; font-weight:600; font-size:31px; color:var(--ink); }
.bw-goalnum small { font-size:15px; color:var(--ink-2); font-weight:500; font-family:'Mulish'; }
.bw-bar { height:13px; background:#e8e0cf; border-radius:999px; overflow:hidden; border:1px solid var(--line); }
.bw-fill { height:100%; background:linear-gradient(90deg,var(--blue),var(--gold)); border-radius:999px; transition:width .6s ease; }
.bw-goalfoot { display:flex; gap:16px; margin-top:13px; flex-wrap:wrap; }
.bw-smallin { width:130px; }
.bw-tiles { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px; }
@media (max-width:680px){ .bw-tiles { grid-template-columns:1fr 1fr; } }
.bw-tile { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:16px; }
.bw-tile .n { font-family:'Fraunces'; font-weight:600; font-size:27px; color:var(--ink); }
.bw-tile .l { font-size:10.5px; color:var(--muted); margin-top:3px; text-transform:uppercase; letter-spacing:.5px; font-weight:700; }
.bw-playbook { background:var(--card); border:1px solid var(--line); border-radius:16px; padding:20px; }
.bw-playbook h3 { font-family:'Fraunces'; font-weight:600; font-size:18px; margin-bottom:4px; }
.bw-playbook h3 em { color:var(--gold); font-weight:500; font-size:14px; }
.bw-playbook .sub { font-size:11.5px; color:var(--ink-2); margin-bottom:12px; }
.bw-playbook .body { white-space:pre-wrap; font-size:13px; line-height:1.65; color:var(--ink); }
.bw-playbook .body.empty { color:var(--muted); font-style:italic; }
.bw-metricgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:12px; }
@media (max-width:680px){ .bw-metricgrid { grid-template-columns:1fr 1fr; } }
.bw-mlabel { font-size:9.5px; color:var(--muted); text-transform:uppercase; letter-spacing:.4px; margin-bottom:3px; display:block; font-weight:700; }
.bw-min { width:100%; background:var(--paper); border:1px solid var(--line); border-radius:9px; padding:9px 10px; color:var(--ink); font-family:inherit; font-size:13px; }
.bw-min:focus { outline:none; border-color:var(--blue); }
.bw-insight { margin-top:11px; font-size:12.5px; color:var(--blue-deep); background:#eaf1fc; border:1px solid #d3e0f6; border-radius:10px; padding:11px 13px; line-height:1.5; font-weight:600; }
.bw-postbody { font-size:12px; color:var(--ink-2); white-space:pre-wrap; max-height:88px; overflow:hidden; margin-top:8px; line-height:1.5; }
.bw-comp-add { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
.bw-comp-add .bw-input { max-width:300px; }
.bw-compgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px; }
@media (max-width:760px){ .bw-compgrid { grid-template-columns:1fr 1fr; } }
@media (max-width:480px){ .bw-compgrid { grid-template-columns:1fr; } }
.bw-compcard { background:var(--card); border:1px solid var(--line); border-radius:16px; padding:15px; animation:rise .35s ease backwards; }
.bw-compcard .handle { font-size:11px; font-weight:800; color:var(--blue); letter-spacing:.3px; margin-bottom:3px; }
.bw-compcard .name { font-family:'Fraunces'; font-weight:600; font-size:16px; color:var(--ink); margin-bottom:8px; line-height:1.2; }
.bw-compstats { display:flex; gap:14px; margin-bottom:8px; }
.bw-compstat .val { font-family:'Fraunces'; font-weight:600; font-size:18px; color:var(--ink); }
.bw-compstat .lbl { font-size:9px; color:var(--muted); text-transform:uppercase; letter-spacing:.4px; font-weight:700; }
.bw-compbio { font-size:11.5px; color:var(--ink-2); line-height:1.45; margin-bottom:10px; font-style:italic; border-left:2px solid var(--line); padding-left:9px; }
.bw-comperr { font-size:11px; color:var(--rose); margin-bottom:8px; }
.bw-compfooter { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; }
.bw-comptime { font-size:10px; color:var(--muted); }
.bw-compbtns { display:flex; gap:6px; }
.bw-gap-section h3 { font-family:'Fraunces'; font-weight:600; font-size:18px; margin-bottom:6px; }
.bw-gap-section .sub { font-size:12px; color:var(--ink-2); margin-bottom:14px; }
.bw-settings { max-width:600px; }
.bw-settings > h2 { font-family:'Fraunces'; font-weight:600; font-size:24px; margin-bottom:6px; }
.bw-settings > .sub { color:var(--ink-2); font-size:13px; margin-bottom:24px; line-height:1.55; }
.bw-settings h3 { font-family:'Fraunces'; font-weight:600; font-size:16px; margin-bottom:14px; color:var(--ink); }
.bw-providers { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:28px; }
@media(max-width:500px){ .bw-providers { grid-template-columns:1fr; } }
.bw-provider { background:var(--card); border:2px solid var(--line); border-radius:16px; padding:18px; cursor:pointer; transition:all .15s; }
.bw-provider:hover { border-color:var(--blue); }
.bw-provider.active { border-color:var(--blue); background:#f0f5fd; }
.bw-provider .pname { font-family:'Fraunces'; font-weight:600; font-size:18px; margin-bottom:4px; }
.bw-provider .pbadge { display:inline-block; font-size:10px; font-weight:800; padding:2px 9px; border-radius:999px; margin-bottom:8px; letter-spacing:.4px; }
.bw-provider .pbadge.free { background:#dcf5e9; color:#1d6b3e; }
.bw-provider .pbadge.paid { background:#fef3dc; color:#7a4e00; }
.bw-provider .pdesc { font-size:12px; color:var(--ink-2); line-height:1.5; }
.bw-provider .pcheck { margin-top:10px; font-size:12px; font-weight:700; color:var(--blue); }
.bw-keyblock { background:var(--card); border:1px solid var(--line); border-radius:16px; padding:20px; margin-bottom:16px; }
.bw-keyblock h4 { font-family:'Fraunces'; font-weight:600; font-size:15px; margin-bottom:4px; }
.bw-keyblock .kdesc { font-size:12px; color:var(--ink-2); margin-bottom:12px; line-height:1.5; }
.bw-keyrow { display:flex; gap:8px; }
.bw-keyrow .bw-input { font-family:ui-monospace,monospace; font-size:12.5px; }
.bw-keystatus { margin-top:9px; font-size:12px; font-weight:700; }
.bw-keystatus.set { color:var(--ok); }
.bw-keystatus.unset { color:var(--muted); }
.bw-savednote { font-size:12px; color:var(--ok); font-weight:700; margin-top:8px; animation:rise .3s ease; }
`;

const CHANNELS = [{ id: "instagram", label: "Instagram" }, { id: "pinterest", label: "Pinterest" }];
const FORMATS = { instagram: ["Reel", "Carousel", "Post", "Story"], pinterest: ["Pin", "Idea Pin"] };
const COLLECTIONS = ["General brand", "Legacy", "Life Pillar", "Zodiac", "VMKG Edition"];
const PILLARS = ["Relationships", "Work & Education", "Health", "Wealth", "Self-Awareness"];
const SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const ANGLES = ["Any angle","Self-discovery","Gifting","Craftsmanship","Behind the scenes","Founder story","Customer story","Festive / occasion","Philosophy & reflection"];
const TABS = ["Dashboard","Create","Posts","Competition","Coach","Settings"];
const channelLabel = (id) => CHANNELS.find((c) => c.id === id)?.label || id;
const uid = () => Math.random().toString(36).slice(2, 9);

const BRAND_KB = `DEEP BRAND KNOWLEDGE — Trox Creations (@troxcreations):

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

const TROX_DEFAULT = {
  name: "Trox Creations",
  sells: "Premium handcrafted notebooks & journals — Legacy, Life Pillar, Zodiac & VMKG Edition. Custom keepsakes. Founded as Benjamin's Ikigai.",
  audience: "Introspective people 22-45 into self-development, journaling, Human Design / astrology. Gift-buyers wanting heartfelt personalised keepsakes (esp. birthdays & anniversaries).",
  voice: "Premium, soulful, warm, reflective, philosophical, elegant. Quiet luxury — never salesy. The brand lives at the intersection of craftsmanship and consciousness. Brene Brown territory.",
  goal: "Grow @troxcreations from 9,107 to 12,000+ organic followers; attract gift-buyers, journaling lovers, and the self-development/zodiac community.",
};

function buildInstructions(fmt) {
  switch (fmt) {
    case "Reel": return "Give: HOOK (0-3s) opening line + opening visual; 4-5 numbered BEATS each with [VISUAL] and [SAY/TEXT] + rough timing; B-ROLL (3 shots: paper texture, stitching, foil emboss, hands on pages, pen on paper); 2-3 on-screen TEXT overlays; CAPTION ending in a soft CTA; 6-8 hashtags.";
    case "Carousel": return "Give a COVER hook line, then SLIDE 1 to SLIDE 6 each with short on-slide text + one-line visual note; final slide = gentle CTA; then a CAPTION + 6-8 hashtags.";
    case "Post": return "Give: IMAGE CONCEPT (1-2 lines, emphasise tactile craft and emotion); CAPTION (reflective hook line, 2-3 body lines in Benjamin's philosophical voice, soft CTA); 6-8 hashtags.";
    case "Story": return "Give a 4-5 FRAME sequence; each frame: visual + short text overlay; include one interactive sticker idea (poll/question/quiz); final frame = CTA with tap/swipe action.";
    case "Pin": return "Give: PIN TITLE (SEO-rich, under 100 chars); PIN DESCRIPTION (keyword-rich, 2-3 sentences, gift & journaling & self-development intent); IMAGE CONCEPT; destination + CTA idea.";
    case "Idea Pin": return "Give a 4-6 PAGE outline; each page: visual + short text; page 1 = hook, last page = CTA; plus 5 keyword tags.";
    default: return "Give a complete, ready-to-produce content brief.";
  }
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}

function maskKey(k) {
  if (!k) return "";
  return k.slice(0, 8) + "••••••••••••" + k.slice(-4);
}

export default function TroxStudio() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(TROX_DEFAULT);
  const [editing, setEditing] = useState(false);
  const [playbook, setPlaybook] = useState("");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState({ start: "9107", now: "9107" });
  const [competitors, setCompetitors] = useState([]);
  const [compInput, setCompInput] = useState("");
  const [compAnalysis, setCompAnalysis] = useState("");
  const [aiProvider, setAiProvider] = useState("gemini");
  const [geminiKey, setGeminiKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [keyInput, setKeyInput] = useState({ gemini: "", claude: "" });
  const [keySaved, setKeySaved] = useState("");
  const [tab, setTab] = useState("Dashboard");
  const [channel, setChannel] = useState("instagram");
  const [collection, setCollection] = useState("General brand");
  const [theme, setTheme] = useState(PILLARS[0]);
  const [sign, setSign] = useState(SIGNS[0]);
  const [angle, setAngle] = useState("Any angle");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("Reel");
  const [ideas, setIdeas] = useState([]);
  const [draftContent, setDraftContent] = useState(null);
  const [coach, setCoach] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [logOpen, setLogOpen] = useState(null);
  const [logForm, setLogForm] = useState({});

  useEffect(() => {
    let p = null;
    try { const r = localStorage.getItem("trox_profile"); if (r) p = JSON.parse(r); } catch (e) {}
    if (!p) { p = TROX_DEFAULT; try { localStorage.setItem("trox_profile", JSON.stringify(p)); } catch (e) {} }
    setProfile(p);
    try { const r = localStorage.getItem("trox_playbook"); if (r) setPlaybook(r); } catch (e) {}
    try { const r = localStorage.getItem("trox_posts"); if (r) setPosts(JSON.parse(r)); } catch (e) {}
    try { const r = localStorage.getItem("trox_followers"); if (r) setFollowers(JSON.parse(r)); } catch (e) {}
    try { const r = localStorage.getItem("trox_competitors"); if (r) setCompetitors(JSON.parse(r)); } catch (e) {}
    try { const r = localStorage.getItem("trox_ai_provider"); if (r) setAiProvider(r); } catch (e) {}
    try { const r = localStorage.getItem("trox_gemini_key"); if (r) setGeminiKey(r); } catch (e) {}
    try { const r = localStorage.getItem("trox_claude_key"); if (r) setClaudeKey(r); } catch (e) {}
    setLoaded(true);
  }, []);

  const persist = (k, v) => { try { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } catch (e) {} };
  const savePosts = (n) => { setPosts(n); persist("trox_posts", n); };
  const saveFollowers = (n) => { setFollowers(n); persist("trox_followers", n); };
  const saveCompetitors = (n) => { setCompetitors(n); persist("trox_competitors", n); };
  function saveProfile() { setProfile({ ...draft }); setEditing(false); persist("trox_profile", draft); }
  function startEdit() { setDraft(profile || TROX_DEFAULT); setEditing(true); }

  function selectProvider(p) { setAiProvider(p); persist("trox_ai_provider", p); }

  function saveKey(type) {
    const val = keyInput[type].trim();
    if (!val) return;
    if (type === "gemini") { setGeminiKey(val); persist("trox_gemini_key", val); }
    else { setClaudeKey(val); persist("trox_claude_key", val); }
    setKeyInput({ ...keyInput, [type]: "" });
    setKeySaved(type);
    setTimeout(() => setKeySaved(""), 2500);
  }

  const activeKey = aiProvider === "gemini" ? geminiKey : claudeKey;

  async function callAI(prompt) {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, provider: aiProvider, apiKey: activeKey || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.error || "API error " + res.status);
    return data.text || "";
  }

  function parseJSON(text) {
    const c = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const s = c.indexOf("["), e = c.lastIndexOf("]");
    return JSON.parse(s !== -1 && e !== -1 ? c.slice(s, e + 1) : c);
  }

  const learnCtx = () => `${BRAND_KB}

BRAND PROFILE:
- Sells: ${profile.sells}
- Audience: ${profile.audience}
- Voice: ${profile.voice}
- Goal: ${profile.goal}

WHAT WE'VE LEARNED:
${playbook || "No performance data logged yet — use strong best practices for this premium, reflective brand."}`;

  function composeSubject() {
    const parts = [];
    if (collection !== "General brand") parts.push(collection + " Collection");
    if ((collection === "Legacy" || collection === "Life Pillar") && theme) parts.push(theme + " theme");
    if (collection === "Zodiac" && sign) parts.push(sign + " edition");
    if (angle !== "Any angle") parts.push("angle: " + angle);
    return [parts.join(" — "), topic.trim()].filter(Boolean).join(" · ");
  }

  function noKeyGuard() {
    if (!activeKey) { setErr("Add your API key in the Settings tab first."); setTab("Settings"); return true; }
    return false;
  }

  async function genIdeas() {
    if (noKeyGuard()) return;
    setBusy("ideas"); setErr(""); setIdeas([]);
    const subject = composeSubject();
    try {
      const out = await callAI(`${learnCtx()}

Platform: ${channelLabel(channel)}. Generate 5 content ideas${subject ? " focused on: " + subject : ""} to win NEW followers for Trox Creations.
Return ONLY a JSON array. Each object: {"title","format","hook","why","performance"}.
format from: ${FORMATS[channel].join(" / ")}
hook: scroll-stopping soulful opener, max 14 words
why: one sentence on growth lever
performance: "High" or "Medium"`);
      setIdeas(parseJSON(out));
    } catch (e) { setErr(e.message || "Couldn't generate ideas — try again."); }
    setBusy("");
  }

  async function buildContent() {
    if (noKeyGuard()) return;
    const subject = composeSubject();
    if (!subject) { setErr("Pick a collection/theme or type a topic first."); return; }
    setBusy("build"); setErr(""); setDraftContent(null);
    try {
      const out = await callAI(`${learnCtx()}

Create a ${format} for ${channelLabel(channel)} about: ${subject}.
${buildInstructions(format)}
Write 100% in Trox's premium, reflective, philosophical voice. Plain text only, no markdown symbols.`);
      setDraftContent({ channel, type: format, title: subject, content: out });
    } catch (e) { setErr(e.message || "Couldn't build that — try again."); }
    setBusy("");
  }

  function saveDraft() {
    if (!draftContent) return;
    savePosts([{ id: uid(), ...draftContent, createdAt: Date.now(), status: "planned", metrics: null, insight: "" }, ...posts]);
    setDraftContent(null); setTab("Posts");
  }

  function openLog(p) { setLogOpen(p.id); setLogForm({ reach: "", likes: "", comments: "", saves: "", shares: "", follows: "", notes: "" }); }

  async function submitLog(p) {
    if (noKeyGuard()) return;
    setBusy("log_" + p.id); setErr("");
    const m = { ...logForm };
    try {
      const out = await callAI(`${learnCtx()}

A ${p.type} just went live on ${channelLabel(p.channel)} for Trox Creations.
Topic: "${p.title}"
Results: reach ${m.reach||"?"}, likes ${m.likes||"?"}, comments ${m.comments||"?"}, saves ${m.saves||"?"}, shares ${m.shares||"?"}, new followers ${m.follows||"?"}. Notes: ${m.notes||"none"}.

1) ONE sentence takeaway starting with "Insight:".
2) UPDATED PLAYBOOK as 4-7 bullet rules for Trox Instagram + Pinterest growth. Start with "PLAYBOOK:".`);
      const iM = out.match(/Insight:(.*?)(PLAYBOOK:|$)/is);
      const pM = out.match(/PLAYBOOK:([\s\S]*)$/i);
      const insight = iM ? iM[1].trim() : out.slice(0, 220);
      const newPlay = pM ? pM[1].trim() : playbook;
      savePosts(posts.map((x) => x.id === p.id ? { ...x, status: "posted", metrics: m, insight } : x));
      setPlaybook(newPlay); persist("trox_playbook", newPlay);
      if (m.follows && !isNaN(+m.follows)) saveFollowers({ ...followers, now: String(+(followers.now || followers.start || 0) + +m.follows) });
      setLogOpen(null);
    } catch (e) { setErr(e.message || "Couldn't analyze — try again."); }
    setBusy("");
  }

  async function fetchCompetitor(username, existing) {
    setBusy("comp_" + username);
    const list = (existing || competitors).map((c) => c.username === username ? { ...c, loading: true, error: null } : c);
    saveCompetitors(list);
    try {
      const res = await fetch("/api/instagram?username=" + encodeURIComponent(username));
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      saveCompetitors((existing || competitors).map((c) => c.username === username ? { ...c, ...data, loading: false, error: null } : c));
    } catch (e) {
      saveCompetitors((existing || competitors).map((c) => c.username === username ? { ...c, loading: false, error: e.message } : c));
    }
    setBusy("");
  }

  async function addCompetitor() {
    const username = compInput.replace("@", "").trim().toLowerCase();
    if (!username || competitors.find((c) => c.username === username)) { setCompInput(""); return; }
    const list = [...competitors, { username, displayName: username, followers: null, posts: null, bio: null, fetchedAt: null, loading: true, error: null }];
    saveCompetitors(list);
    setCompInput("");
    await fetchCompetitor(username, list);
  }

  function removeCompetitor(username) { saveCompetitors(competitors.filter((c) => c.username !== username)); }

  async function genCompAnalysis() {
    if (noKeyGuard()) return;
    if (!competitors.length) { setErr("Add at least one competitor first."); return; }
    setBusy("comp_analysis"); setErr(""); setCompAnalysis("");
    const compData = competitors.map((c) => `@${c.username} (${c.displayName}): ${c.followers||"?"} followers, ${c.posts||"?"} posts. Bio: "${c.bio||"unknown"}"`).join("\n");
    try {
      const out = await callAI(`${learnCtx()}

TROX position: ${+(followers.now||followers.start||0)} followers, 37 posts, Navi Mumbai.
COMPETITORS:
${compData}

Produce a sharp competitive gap analysis:
THEIR EDGE — what competitors do well that Trox isn't doing (2-3 points)
TROX EDGE — Trox's unique advantages (lean into VMKG/Human Design, personalization, Ikigai story, zodiac community)
CONTENT GAPS — 3 angles none of these competitors own that Trox could own completely
QUICK WINS — 2 posts to make THIS WEEK to pull followers from this space
Plain text, no markdown symbols.`);
      setCompAnalysis(out);
    } catch (e) { setErr(e.message || "Couldn't run analysis — try again."); }
    setBusy("");
  }

  async function runCoach() {
    if (noKeyGuard()) return;
    setBusy("coach"); setErr(""); setCoach("");
    const done = posts.filter((p) => p.metrics).slice(0, 8);
    const summary = done.length ? done.map((p) => `- ${p.type} (${channelLabel(p.channel)}) "${p.title}": reach ${p.metrics.reach||"?"}, saves ${p.metrics.saves||"?"}, follows ${p.metrics.follows||"?"}`).join("\n") : "No measured posts yet.";
    const s = +(followers.start||0), n = +(followers.now||followers.start||0), g = s + 3000;
    try {
      const out = await callAI(`${learnCtx()}

Performance: ${summary}
Followers: started ${s||"?"}, now ${n||"?"}, target ${g||"?"} (need ${Math.max(0,g-n)} more).

WORKING — 2 things driving growth.
FIX — 2 things to change now.
NEXT MOVES — 3 specific posts to make next (format + exact angle).
Be specific, concise. Plain text, no markdown.`);
      setCoach(out);
    } catch (e) { setErr(e.message || "Couldn't run the audit — try again."); }
    setBusy("");
  }

  const useIdea = (it) => { setTopic(it.title); if (FORMATS[channel].includes(it.format)) setFormat(it.format); setDraftContent(null); };
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} };
  const s = +(followers.start||0), n = +(followers.now||followers.start||0);
  const goal = s + 3000, gained = Math.max(0, n - s);
  const pct = Math.max(0, Math.min(100, (gained / 3000) * 100));
  const withData = posts.filter((p) => p.metrics);
  const totalFollows = withData.reduce((a, p) => a + (+p.metrics.follows||0), 0);
  const bestSaves = withData.reduce((a, p) => Math.max(a, +p.metrics.saves||0), 0);
  const providerLabel = aiProvider === "gemini" ? "Gemini (free)" : "Claude";

  if (!loaded) return <div className="bw-root"><style>{CSS}</style><div className="bw-wrap"><div className="bw-load"><div className="bw-spin" />opening the studio…</div></div></div>;

  return (
    <div className="bw-root">
      <style>{CSS}</style>
      <svg className="bw-topwave" viewBox="0 0 1200 54" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,30 C150,55 350,5 600,28 C850,50 1050,8 1200,26 L1200,0 L0,0 Z" fill="#3E74D1" opacity="0.10"/>
        <path d="M0,38 C200,18 400,52 640,34 C880,16 1040,46 1200,32 L1200,0 L0,0 Z" fill="#B08D57" opacity="0.08"/>
      </svg>
      <div className="bw-wrap">
        <div className="bw-head">
          <div>
            <div className="bw-logo"><b>TROX</b> <span>Studio</span></div>
            <div className="bw-tag">AI social manager · handcrafted journals · growing @troxcreations</div>
          </div>
          <div className="bw-headright">
            <button className="bw-aichip" onClick={() => setTab("Settings")} style={{cursor:"pointer",border:"1px solid var(--line)"}}>
              <span className={"dot" + (activeKey ? "" : " amber")}/>
              {providerLabel} {activeKey ? "ready" : "— tap to add key"}
            </button>
            {profile && !editing && (
              <div className="bw-brandchip"><span>Brand: <b>{profile.name}</b></span><button className="bw-edit" onClick={startEdit}>edit</button></div>
            )}
          </div>
        </div>

        {editing ? (
          <div className="bw-setup">
            <h2>Brand Brain</h2>
            <p className="sub">Pre-loaded from your site. Tweak anything — feeds every idea, script and caption.</p>
            {[["sells","What you sell",false],["audience","Target audience",false],["voice","Brand voice",true],["goal","Current focus",false]].map(([k,label,area]) => (
              <div className="bw-field" key={k}>
                <label>{label}</label>
                {area ? <textarea className="bw-input" value={draft[k]} onChange={(e) => setDraft({...draft,[k]:e.target.value})}/>
                      : <input className="bw-input" value={draft[k]} onChange={(e) => setDraft({...draft,[k]:e.target.value})}/>}
              </div>
            ))}
            <button className="bw-btn" onClick={saveProfile}>Save Brand Brain →</button>
          </div>
        ) : (
          <>
            <div className="bw-tabs">
              {TABS.map((t) => <button key={t} className={"bw-tab"+(tab===t?" on":"")} onClick={() => { setTab(t); setErr(""); setCompAnalysis(""); }}>{t}</button>)}
            </div>

            {tab === "Dashboard" && (<>
              <div className="bw-goal">
                <div className="bw-goalhead">
                  <div className="bw-goalnum">+{gained.toLocaleString()} <small>/ 3,000 new followers</small></div>
                  <div style={{color:"var(--ink-2)",fontSize:12.5}}>{n ? `${n.toLocaleString()} now → ${goal.toLocaleString()} goal` : "add your numbers below"}</div>
                </div>
                <div className="bw-bar"><div className="bw-fill" style={{width:pct+"%"}}/></div>
                <div className="bw-goalfoot">
                  <div><span className="bw-mlabel">Starting followers</span><input className="bw-input bw-smallin" type="number" value={followers.start} placeholder="9107" onChange={(e) => saveFollowers({...followers,start:e.target.value})}/></div>
                  <div><span className="bw-mlabel">Followers now</span><input className="bw-input bw-smallin" type="number" value={followers.now} placeholder="9200" onChange={(e) => saveFollowers({...followers,now:e.target.value})}/></div>
                </div>
              </div>
              <div className="bw-tiles">
                <div className="bw-tile"><div className="n">{posts.length}</div><div className="l">Content made</div></div>
                <div className="bw-tile"><div className="n">{withData.length}</div><div className="l">Posts measured</div></div>
                <div className="bw-tile"><div className="n">{totalFollows.toLocaleString()}</div><div className="l">Follows from posts</div></div>
                <div className="bw-tile"><div className="n">{bestSaves.toLocaleString()}</div><div className="l">Best saves</div></div>
              </div>
              <div className="bw-playbook">
                <h3>The Playbook <em>· AI living memory</em></h3>
                <div className="sub">Rewritten every time you log results. Survives AI provider switches.</div>
                <div className={"body"+(playbook?"":" empty")}>{playbook||"Empty for now. Create content, post it, log results in Posts — the AI builds Trox's growth playbook here."}</div>
              </div>
            </>)}

            {tab === "Create" && (<>
              {!activeKey && <div className="bw-insight" style={{marginBottom:16}}>No API key — <button className="bw-edit" onClick={() => setTab("Settings")}>add it in Settings →</button></div>}
              <div className="bw-channels">
                {CHANNELS.map((c) => <button key={c.id} className={"bw-chan"+(channel===c.id?" on":"")} onClick={() => { setChannel(c.id); setFormat(FORMATS[c.id][0]); setIdeas([]); setDraftContent(null); }}>{c.label}</button>)}
              </div>
              <div className="bw-builder">
                <select className="bw-select" value={collection} onChange={(e) => setCollection(e.target.value)}>{COLLECTIONS.map((c) => <option key={c}>{c}</option>)}</select>
                {(collection==="Legacy"||collection==="Life Pillar") && <select className="bw-select" value={theme} onChange={(e) => setTheme(e.target.value)}>{PILLARS.map((p) => <option key={p}>{p}</option>)}</select>}
                {collection==="Zodiac" && <select className="bw-select" value={sign} onChange={(e) => setSign(e.target.value)}>{SIGNS.map((sg) => <option key={sg}>{sg}</option>)}</select>}
                <select className="bw-select" value={angle} onChange={(e) => setAngle(e.target.value)}>{ANGLES.map((a) => <option key={a}>{a}</option>)}</select>
              </div>
              <div className="bw-row">
                <input className="bw-input" placeholder="Optional extra angle or topic" value={topic} onChange={(e) => setTopic(e.target.value)}/>
                <button className="bw-btn ghost" onClick={genIdeas} disabled={busy==="ideas"}>{busy==="ideas"?"…":"Idea me 5"}</button>
              </div>
              {busy==="ideas" && <div className="bw-load"><div className="bw-spin"/>Scoping ideas for {channelLabel(channel)}…</div>}
              {ideas.length > 0 && (<>
                <div className="bw-grid">
                  {ideas.map((it,i) => (
                    <div className="bw-card" key={i} style={{animationDelay:i*55+"ms"}}>
                      <div className="bw-meta">
                        <span className="bw-fmt">{it.format}</span>
                        <span className={"bw-perf "+(String(it.performance).toLowerCase()==="high"?"high":"medium")}>{String(it.performance).toLowerCase()==="high"?"▲ High":"● Med"}</span>
                      </div>
                      <h4>{it.title}</h4>
                      <div className="bw-hook">"{it.hook}"</div>
                      <div className="bw-why">{it.why}</div>
                      <div className="bw-cardbtns"><button className="bw-mini go" onClick={() => useIdea(it)}>Use this →</button></div>
                    </div>
                  ))}
                </div>
                <div className="bw-note">Estimates blend format, brand fit and your Playbook.</div>
              </>)}
              <div className="bw-row" style={{marginTop:22}}>
                <select className="bw-select" value={format} onChange={(e) => setFormat(e.target.value)}>{FORMATS[channel].map((f) => <option key={f}>{f}</option>)}</select>
                <button className="bw-btn" onClick={buildContent} disabled={busy==="build"}>{busy==="build"?"Crafting…":"Build the "+format}</button>
              </div>
              {busy==="build" && <div className="bw-load"><div className="bw-spin"/>Crafting your {format}…</div>}
              {draftContent && (<>
                <div className="bw-out mono"><button className="bw-copy" onClick={() => copy(draftContent.content)}>copy</button>{draftContent.content}</div>
                <div className="bw-draftbar"><button className="bw-btn" onClick={saveDraft}>Save to Posts →</button><button className="bw-btn ghost" onClick={buildContent}>Regenerate</button></div>
              </>)}
            </>)}

            {tab === "Posts" && (<>
              {posts.length===0 && <div className="bw-empty"><div className="big">No posts yet</div>Build content in Create and save it here. After posting, log results so the AI learns.</div>}
              <div className="bw-grid">
                {posts.map((p) => (
                  <div className="bw-card" key={p.id}>
                    <div className="bw-meta">
                      <span className="bw-fmt">{p.type}</span>
                      <span className="bw-fmt" style={{color:"var(--ink-2)",background:"var(--card-2)",borderColor:"var(--line)"}}>{channelLabel(p.channel)}</span>
                      <span className={"bw-status "+p.status}>{p.status==="posted"?"✓ measured":"planned"}</span>
                    </div>
                    <h4>{p.title}</h4>
                    <div className="bw-postbody">{p.content}</div>
                    {p.insight && <div className="bw-insight">{p.insight}</div>}
                    {p.status==="planned" && logOpen!==p.id && (
                      <div className="bw-cardbtns">
                        <button className="bw-mini go" onClick={() => openLog(p)}>Log results</button>
                        <button className="bw-mini" onClick={() => copy(p.content)}>Copy</button>
                        <button className="bw-mini" onClick={() => savePosts(posts.filter((x) => x.id!==p.id))}>Delete</button>
                      </div>
                    )}
                    {logOpen===p.id && (
                      <div>
                        <div className="bw-metricgrid">
                          {[["reach","Reach"],["likes","Likes"],["comments","Comments"],["saves","Saves"],["shares","Shares"],["follows","New followers"]].map(([k,lbl]) => (
                            <div key={k}><span className="bw-mlabel">{lbl}</span><input className="bw-min" type="number" value={logForm[k]||""} onChange={(e) => setLogForm({...logForm,[k]:e.target.value})}/></div>
                          ))}
                        </div>
                        <span className="bw-mlabel" style={{marginTop:8}}>Notes</span>
                        <input className="bw-min" value={logForm.notes||""} onChange={(e) => setLogForm({...logForm,notes:e.target.value})} placeholder="e.g. lots of DM shares from gift-buyers"/>
                        <div className="bw-cardbtns">
                          <button className="bw-mini go" onClick={() => submitLog(p)} disabled={busy==="log_"+p.id}>{busy==="log_"+p.id?"Learning…":"Save & learn"}</button>
                          <button className="bw-mini" onClick={() => setLogOpen(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>)}

            {tab === "Competition" && (<>
              <div className="bw-comp-add">
                <input className="bw-input" placeholder="@competitorhandle" value={compInput} onChange={(e) => setCompInput(e.target.value)} onKeyDown={(e) => { if(e.key==="Enter") addCompetitor(); }}/>
                <button className="bw-btn sm" onClick={addCompetitor} disabled={!compInput.trim()||(busy.startsWith("comp_")&&!busy.includes("analysis"))}>
                  {busy.startsWith("comp_")&&!busy.includes("analysis")?"Fetching…":"Track"}
                </button>
              </div>
              {competitors.length===0 && <div className="bw-empty"><div className="big">No competitors tracked yet</div>Add any Instagram handle above — the app fetches their follower count, post count and bio. Then run gap analysis.</div>}
              {competitors.length > 0 && (<>
                <div className="bw-compgrid">
                  {competitors.map((c,i) => (
                    <div className="bw-compcard" key={c.username} style={{animationDelay:i*50+"ms",opacity:c.loading?.6:1}}>
                      <div className="handle">@{c.username}</div>
                      <div className="name">{c.loading?"Fetching…":(c.displayName!==c.username?c.displayName:c.username)}</div>
                      {!c.loading&&!c.error&&(c.followers||c.posts)&&(
                        <div className="bw-compstats">
                          {c.followers&&<div className="bw-compstat"><div className="val">{c.followers}</div><div className="lbl">followers</div></div>}
                          {c.posts&&<div className="bw-compstat"><div className="val">{c.posts}</div><div className="lbl">posts</div></div>}
                        </div>
                      )}
                      {c.bio&&<div className="bw-compbio">{c.bio.slice(0,120)}{c.bio.length>120?"…":""}</div>}
                      {c.error&&<div className="bw-comperr">Could not fetch — Instagram may have blocked. Try Refresh.</div>}
                      <div className="bw-compfooter">
                        <span className="bw-comptime">{c.fetchedAt?timeAgo(c.fetchedAt):""}</span>
                        <div className="bw-compbtns">
                          <button className="bw-mini" onClick={() => fetchCompetitor(c.username)} disabled={!!busy}>↻</button>
                          <button className="bw-mini" onClick={() => removeCompetitor(c.username)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bw-gap-section">
                  <h3>Gap Analysis</h3>
                  <div className="sub">AI compares Trox vs every tracked competitor — finds gaps and your fastest moves.</div>
                  <div className="bw-row">
                    <button className="bw-btn" onClick={genCompAnalysis} disabled={busy==="comp_analysis"}>{busy==="comp_analysis"?"Analysing…":"Analyse the gap →"}</button>
                  </div>
                  {busy==="comp_analysis"&&<div className="bw-load"><div className="bw-spin"/>Reading the competitive landscape…</div>}
                  {compAnalysis&&<div className="bw-out"><button className="bw-copy" onClick={() => copy(compAnalysis)}>copy</button>{compAnalysis}</div>}
                </div>
              </>)}
            </>)}

            {tab === "Coach" && (<>
              {!activeKey&&<div className="bw-insight" style={{marginBottom:16}}>No API key — <button className="bw-edit" onClick={() => setTab("Settings")}>add it in Settings →</button></div>}
              <div className="bw-row"><button className="bw-btn" onClick={runCoach} disabled={busy==="coach"}>{busy==="coach"?"Auditing…":"Audit & advise me"}</button></div>
              {busy==="coach"&&<div className="bw-load"><div className="bw-spin"/>Reviewing Trox performance…</div>}
              {!busy&&!coach&&<div className="bw-empty"><div className="big">Your growth coach</div>Reads your Playbook, every measured post, and follower progress — tells you what to fix and next 3 posts to make.</div>}
              {coach&&<div className="bw-out"><button className="bw-copy" onClick={() => copy(coach)}>copy</button>{coach}</div>}
            </>)}

            {tab === "Settings" && (
              <div className="bw-settings">
                <h2>Settings</h2>
                <p className="sub">Your API key is saved in your browser only — never sent anywhere except the AI provider you choose. Switching providers never loses your Playbook or posts.</p>
                <h3>Choose AI Provider</h3>
                <div className="bw-providers">
                  <div className={"bw-provider"+(aiProvider==="gemini"?" active":"")} onClick={() => selectProvider("gemini")}>
                    <div className="pname">Google Gemini</div>
                    <span className="pbadge free">FREE</span>
                    <div className="pdesc">Gemini 1.5 Flash. 1 million tokens/day free. No credit card needed. Get key at aistudio.google.com</div>
                    {aiProvider==="gemini"&&<div className="pcheck">✓ Active</div>}
                  </div>
                  <div className={"bw-provider"+(aiProvider==="claude"?" active":"")} onClick={() => selectProvider("claude")}>
                    <div className="pname">Claude (Anthropic)</div>
                    <span className="pbadge paid">~$3–5/month</span>
                    <div className="pdesc">Claude Opus 4.5. Higher quality outputs, better brand voice. Get key at console.anthropic.com</div>
                    {aiProvider==="claude"&&<div className="pcheck">✓ Active</div>}
                  </div>
                </div>
                <div className="bw-keyblock">
                  <h4>Gemini API Key</h4>
                  <div className="kdesc">Get it free at <b>aistudio.google.com</b> → Get API Key → Create API key. Starts with <b>AIzaSy</b>.</div>
                  {geminiKey&&<div className="bw-keystatus set">✓ Key saved: {maskKey(geminiKey)}</div>}
                  {!geminiKey&&<div className="bw-keystatus unset">No key saved yet</div>}
                  <div className="bw-keyrow" style={{marginTop:10}}>
                    <input className="bw-input" type="password" placeholder={geminiKey?"Paste new key to replace":"Paste your AIzaSy... key here"} value={keyInput.gemini} onChange={(e) => setKeyInput({...keyInput,gemini:e.target.value})}/>
                    <button className={"bw-btn sm"+(geminiKey?"":" ok")} onClick={() => saveKey("gemini")} disabled={!keyInput.gemini.trim()}>{geminiKey?"Replace":"Save"}</button>
                  </div>
                  {keySaved==="gemini"&&<div className="bw-savednote">✓ Gemini key saved! You can start using the app.</div>}
                </div>
                <div className="bw-keyblock">
                  <h4>Claude API Key <span style={{color:"var(--muted)",fontWeight:400,fontSize:12}}>(optional)</span></h4>
                  <div className="kdesc">Get it at <b>console.anthropic.com</b> → API Keys. Starts with <b>sk-ant-</b>. Switch to Claude above to use it.</div>
                  {claudeKey&&<div className="bw-keystatus set">✓ Key saved: {maskKey(claudeKey)}</div>}
                  {!claudeKey&&<div className="bw-keystatus unset">No key saved yet</div>}
                  <div className="bw-keyrow" style={{marginTop:10}}>
                    <input className="bw-input" type="password" placeholder={claudeKey?"Paste new key to replace":"Paste your sk-ant-... key here"} value={keyInput.claude} onChange={(e) => setKeyInput({...keyInput,claude:e.target.value})}/>
                    <button className="bw-btn sm" onClick={() => saveKey("claude")} disabled={!keyInput.claude.trim()}>{claudeKey?"Replace":"Save"}</button>
                  </div>
                  {keySaved==="claude"&&<div className="bw-savednote">✓ Claude key saved!</div>}
                </div>
              </div>
            )}

            {err&&<div className="bw-note" style={{color:"var(--rose)"}}>{err}</div>}
          </>
        )}
      </div>
    </div>
  );
}

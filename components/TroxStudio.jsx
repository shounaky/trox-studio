"use client";

import React, { useState, useEffect } from "react";

/* ============================================================
   TROX CREATIONS — AI Social Media Manager
   Premium handcrafted journals · Instagram + Pinterest
   Learns from every post · Goal: +3,000 organic followers
   ============================================================ */

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
.bw-root::before { content:""; position:fixed; inset:0; pointer-events:none; opacity:.5;
  background:radial-gradient(700px 380px at 90% -8%,rgba(62,116,209,.10),transparent 60%),
             radial-gradient(620px 420px at -5% 105%,rgba(176,141,87,.10),transparent 60%); }
.bw-topwave { display:block; width:100%; height:54px; }
.bw-wrap { max-width:960px; margin:0 auto; padding:0 20px; position:relative; }

.bw-head { display:flex; align-items:flex-end; justify-content:space-between; gap:16px; flex-wrap:wrap; margin:6px 0 24px; }
.bw-logo { font-family:'Fraunces'; font-weight:600; font-size:30px; letter-spacing:.5px; line-height:1; color:var(--ink); }
.bw-logo b { font-weight:600; letter-spacing:3px; }
.bw-logo span { color:var(--blue); font-style:italic; }
.bw-tag { color:var(--ink-2); font-size:12.5px; margin-top:7px; font-weight:500; }
.bw-brandchip { background:var(--card); border:1px solid var(--line); border-radius:999px; padding:8px 14px; font-size:12px; display:flex; gap:9px; align-items:center; box-shadow:0 1px 0 rgba(0,0,0,.02); }
.bw-brandchip b { color:var(--blue); font-family:'Fraunces'; font-weight:600; }
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

.bw-goal { background:linear-gradient(135deg,var(--card),var(--card-2)); border:1px solid var(--line); border-radius:18px; padding:22px; margin-bottom:16px; box-shadow:0 1px 2px rgba(28,42,69,.04); }
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
.bw-playbook { background:var(--card); border:1px solid var(--line); border-radius:16px; padding:20px; box-shadow:0 1px 2px rgba(28,42,69,.04); }
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
`;

const CHANNELS = [{ id: "instagram", label: "Instagram" }, { id: "pinterest", label: "Pinterest" }];
const FORMATS = { instagram: ["Reel", "Carousel", "Post", "Story"], pinterest: ["Pin", "Idea Pin"] };
const COLLECTIONS = ["General brand", "Legacy", "Life Pillar", "Zodiac"];
const PILLARS = ["Relationships", "Work & Education", "Health", "Wealth", "Self-Awareness"];
const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const ANGLES = ["Any angle", "Self-discovery", "Gifting", "Craftsmanship", "Behind the scenes", "Customer story", "Festive / occasion"];
const TABS = ["Dashboard", "Create", "Posts", "Coach"];
const channelLabel = (id) => CHANNELS.find((c) => c.id === id)?.label || id;
const uid = () => Math.random().toString(36).slice(2, 9);

const BRAND_KB = `DEEP BRAND KNOWLEDGE (always honor this — from troxcreations.com & @troxcreations Instagram):
Trox Creations makes PREMIUM HANDCRAFTED notebooks & journals — luxury keepsakes, not ordinary stationery. Founder: Benjamin. Based in Navi Mumbai, India. Instagram: @troxcreations (9,100+ followers, 37 posts).
Official Instagram bio: "Let your creativity flow and make your mark with a book that is as unique as you are. Discover the joy of personalised creation today!"
Three collections:
- LEGACY — timeless journals for your enduring life stories.
- LIFE PILLAR — a dedicated journal for each pillar of life.
- ZODIAC — personalized journals tied to the 12 star signs; customers say "it introduces me to me".
The five life pillars: Relationships, Work & Education, Health, Wealth, Self-Awareness.
Personalization: zodiac editions + fully custom keepsakes (very popular as birthday & anniversary gifts).
Emotional territory: self-discovery, reflection, legacy, the sacred ownership of one's own words, true craftsmanship (the cut, feel, alignment, stitch), and deeply meaningful gifting.
Real customer language to echo: "it introduces me to me", "a space purely mine", "felt like it was made for me", "I find it sacred".
Voice: premium, soulful, warm, reflective, elegant — quiet luxury. Never loud, gimmicky or discount-driven. Often pairs a reflective human truth with the tactile craft of the book.
Audience: thoughtful people ~22-45 who value handmade, meaningful, personal objects; journalers; and gift-buyers seeking something heartfelt and unique. Strong in India, with global appeal.`;

const TROX_DEFAULT = {
  name: "Trox Creations",
  sells: "Premium handcrafted notebooks & journals — Legacy, Life Pillar & personalized Zodiac collections, plus custom keepsakes.",
  audience: "Thoughtful people 22-45 who love handmade, meaningful objects; journalers; and gift-buyers seeking something heartfelt & personal (esp. birthdays & anniversaries).",
  voice: "Premium, soulful, warm, reflective, elegant. Quiet luxury — never loud or salesy. Celebrates craft and self-discovery.",
  goal: "Grow @troxcreations from 9,107 to 12,000+ organic followers; reach new gift-buyers and journaling lovers in India and beyond.",
};

async function callClaude(prompt) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error("API error " + res.status);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("").trim();
}

function parseJSON(text) {
  const c = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const s = c.indexOf("["), e = c.lastIndexOf("]");
  return JSON.parse(s !== -1 && e !== -1 ? c.slice(s, e + 1) : c);
}

function buildInstructions(fmt) {
  switch (fmt) {
    case "Reel": return "Give: HOOK (0-3s) opening line + opening visual; 4-5 numbered BEATS each with [VISUAL] and [SAY/TEXT] + rough timing; B-ROLL (3 shots, lean into close-ups of the craft — paper, stitching, foil, hands); 2-3 on-screen TEXT overlays; CAPTION ending in a soft CTA; 6-8 hashtags.";
    case "Carousel": return "Give a COVER hook line, then SLIDE 1 to SLIDE 6 each with short on-slide text + a one-line visual note; final slide = gentle CTA; then a CAPTION + 6-8 hashtags.";
    case "Post": return "Give: IMAGE CONCEPT (1-2 lines, emphasise the tactile craft); CAPTION (reflective hook line, 2-3 body lines, soft CTA); 6-8 hashtags.";
    case "Story": return "Give a 4-5 FRAME sequence; each frame: visual + short text overlay; include one interactive sticker idea (poll/question/quiz); final frame = CTA with a tap/swipe action.";
    case "Pin": return "Give: PIN TITLE (SEO, under 100 chars); PIN DESCRIPTION (keyword-rich, 2-3 sentences, gift & journaling intent); IMAGE CONCEPT; destination + CTA idea.";
    case "Idea Pin": return "Give a 4-6 PAGE outline; each page: visual + short text; page 1 = hook, last page = CTA; plus 5 keyword tags.";
    default: return "Give a complete, ready-to-produce content brief.";
  }
}

export default function TroxStudio() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(TROX_DEFAULT);
  const [editing, setEditing] = useState(false);

  const [playbook, setPlaybook] = useState("");
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState({ start: "9107", now: "9107" });

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
    setLoaded(true);
  }, []);

  const persist = (k, v) => { try { localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v)); } catch (e) {} };
  const savePosts = (n) => { setPosts(n); persist("trox_posts", n); };
  const saveFollowers = (n) => { setFollowers(n); persist("trox_followers", n); };
  function saveProfile() { setProfile({ ...draft }); setEditing(false); persist("trox_profile", draft); }
  function startEdit() { setDraft(profile || TROX_DEFAULT); setEditing(true); }

  const learnCtx = () => `${BRAND_KB}

EDITABLE BRAND PROFILE:
- Sells: ${profile.sells}
- Audience: ${profile.audience}
- Voice: ${profile.voice}
- Goal: ${profile.goal}

WHAT WE'VE LEARNED (apply this — based on Trox's REAL performance):
${playbook || "No performance data logged yet — use strong best practices for this premium, reflective brand."}`;

  function composeSubject() {
    const parts = [];
    if (collection !== "General brand") parts.push(collection + " Collection");
    if ((collection === "Legacy" || collection === "Life Pillar") && theme) parts.push(theme + " theme");
    if (collection === "Zodiac" && sign) parts.push(sign + " edition");
    if (angle !== "Any angle") parts.push("angle: " + angle);
    return [parts.join(" — "), topic.trim()].filter(Boolean).join(" · ");
  }

  async function genIdeas() {
    setBusy("ideas"); setErr(""); setIdeas([]);
    const subject = composeSubject();
    try {
      const out = await callClaude(`${learnCtx()}

Platform: ${channelLabel(channel)}. Generate 5 content ideas${subject ? ` focused on: ${subject}` : ""} engineered to win NEW followers for Trox Creations while staying true to the quiet-luxury, reflective brand.
Return ONLY a JSON array (no markdown). Each object: {"title","format","hook","why","performance"}.
- format from: ${FORMATS[channel].join(" / ")}
- hook: a scroll-stopping, soulful opener, max 14 words
- why: one sentence tying it to a learning or a follower-growth lever
- performance: "High" or "Medium"`);
      setIdeas(parseJSON(out));
    } catch (e) { setErr("Couldn't generate ideas — try again."); }
    setBusy("");
  }

  async function buildContent() {
    const subject = composeSubject();
    if (!subject) { setErr("Pick a collection/theme or type a topic first."); return; }
    setBusy("build"); setErr(""); setDraftContent(null);
    try {
      const out = await callClaude(`${learnCtx()}

Create a ${format} for ${channelLabel(channel)} about: ${subject}.
${buildInstructions(format)}
Apply the learnings above. Write 100% in Trox's premium, reflective voice. Plain text only, no markdown symbols.`);
      setDraftContent({ channel, type: format, title: subject, content: out });
    } catch (e) { setErr("Couldn't build that — try again."); }
    setBusy("");
  }

  function saveDraft() {
    if (!draftContent) return;
    savePosts([{ id: uid(), ...draftContent, createdAt: Date.now(), status: "planned", metrics: null, insight: "" }, ...posts]);
    setDraftContent(null); setTab("Posts");
  }
  function openLog(p) { setLogOpen(p.id); setLogForm({ reach: "", likes: "", comments: "", saves: "", shares: "", follows: "", notes: "" }); }

  async function submitLog(p) {
    setBusy("log_" + p.id); setErr("");
    const m = { ...logForm };
    try {
      const out = await callClaude(`${learnCtx()}

A ${p.type} just went live on ${channelLabel(p.channel)} for Trox Creations.
Topic: "${p.title}"
Results — reach/impressions: ${m.reach || "?"}, likes: ${m.likes || "?"}, comments: ${m.comments || "?"}, saves: ${m.saves || "?"}, shares/outbound: ${m.shares || "?"}, NEW followers: ${m.follows || "?"}. Notes: ${m.notes || "none"}.

Do two things:
1) Write ONE sentence takeaway from THIS post, starting with "Insight:".
2) Then output an UPDATED PLAYBOOK as 4-7 short bullet rules specific to Trox Creations for Instagram + Pinterest follower growth — merge the existing playbook with this new learning, keep rules that still hold, sharpen or drop ones the data contradicts. Start with "PLAYBOOK:".
Be concise.`);
      const iM = out.match(/Insight:(.*?)(PLAYBOOK:|$)/is);
      const pM = out.match(/PLAYBOOK:([\s\S]*)$/i);
      const insight = iM ? iM[1].trim() : out.slice(0, 220);
      const newPlay = pM ? pM[1].trim() : playbook;
      savePosts(posts.map((x) => x.id === p.id ? { ...x, status: "posted", metrics: m, insight } : x));
      setPlaybook(newPlay); persist("trox_playbook", newPlay);
      if (m.follows && !isNaN(+m.follows)) {
        const base = +(followers.now || followers.start || 0);
        saveFollowers({ ...followers, now: String(base + +m.follows) });
      }
      setLogOpen(null);
    } catch (e) { setErr("Couldn't analyze that post — try again."); }
    setBusy("");
  }

  async function runCoach() {
    setBusy("coach"); setErr(""); setCoach("");
    const done = posts.filter((p) => p.metrics).slice(0, 8);
    const summary = done.length ? done.map((p) => `- ${p.type} (${channelLabel(p.channel)}) "${p.title}": reach ${p.metrics.reach || "?"}, saves ${p.metrics.saves || "?"}, comments ${p.metrics.comments || "?"}, follows ${p.metrics.follows || "?"}`).join("\n") : "No posts with logged results yet.";
    const start = +(followers.start || 0), now = +(followers.now || followers.start || 0);
    const goal = start + 3000, remaining = Math.max(0, goal - now);
    try {
      const out = await callClaude(`${learnCtx()}

Recent performance (newest first):
${summary}
Follower progress: started ${start || "?"}, now ${now || "?"}, target ${goal || "?"} (need ${remaining} more).

You are Trox's AI social media manager. Give:
WORKING — 2 things driving growth (point to the data).
FIX — 2 things to change now.
NEXT MOVES — 3 specific posts to make next (format + exact angle, naming a collection/theme/sign where it helps) to gain followers fastest.
Be specific and concise. Plain text, no markdown symbols.`);
      setCoach(out);
    } catch (e) { setErr("Couldn't run the audit — try again."); }
    setBusy("");
  }

  const useIdea = (it) => { setTopic(it.title); if (FORMATS[channel].includes(it.format)) setFormat(it.format); setDraftContent(null); };
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (e) {} };

  const start = +(followers.start || 0), now = +(followers.now || followers.start || 0);
  const goal = start + 3000, gained = Math.max(0, now - start);
  const pct = Math.max(0, Math.min(100, (gained / 3000) * 100));
  const withData = posts.filter((p) => p.metrics);
  const totalFollows = withData.reduce((s, p) => s + (+p.metrics.follows || 0), 0);
  const bestSaves = withData.reduce((m, p) => Math.max(m, +p.metrics.saves || 0), 0);

  if (!loaded) return <div className="bw-root"><style>{CSS}</style><div className="bw-wrap"><div className="bw-load"><div className="bw-spin" /> opening the studio…</div></div></div>;
  const needSetup = editing;
  const showThemeSel = collection === "Legacy" || collection === "Life Pillar";
  const showSignSel = collection === "Zodiac";

  return (
    <div className="bw-root">
      <style>{CSS}</style>
      <svg className="bw-topwave" viewBox="0 0 1200 54" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,30 C150,55 350,5 600,28 C850,50 1050,8 1200,26 L1200,0 L0,0 Z" fill="#3E74D1" opacity="0.10" />
        <path d="M0,38 C200,18 400,52 640,34 C880,16 1040,46 1200,32 L1200,0 L0,0 Z" fill="#B08D57" opacity="0.08" />
      </svg>
      <div className="bw-wrap">
        <div className="bw-head">
          <div>
            <div className="bw-logo"><b>TROX</b> <span>Studio</span></div>
            <div className="bw-tag">An AI social manager for handcrafted journals · grows Instagram & Pinterest toward +3,000 followers</div>
          </div>
          {profile && !editing && (
            <div className="bw-brandchip"><span>Brand Brain: <b>{profile.name}</b></span><button className="bw-edit" onClick={startEdit}>edit</button></div>
          )}
        </div>

        {needSetup ? (
          <div className="bw-setup">
            <h2>Trox Creations — Brand Brain</h2>
            <p className="sub">Pre-loaded from your website. Tweak anything; it's saved and feeds every idea, script and caption.</p>
            {[
              ["sells", "What you sell", false],
              ["audience", "Target audience", false],
              ["voice", "Brand voice / personality", true],
              ["goal", "Current focus", false],
            ].map(([k, label, area]) => (
              <div className="bw-field" key={k}>
                <label>{label}</label>
                {area
                  ? <textarea className="bw-input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                  : <input className="bw-input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />}
              </div>
            ))}
            <button className="bw-btn" onClick={saveProfile}>Save Brand Brain →</button>
          </div>
        ) : (
          <>
            <div className="bw-tabs">
              {TABS.map((t) => <button key={t} className={"bw-tab" + (tab === t ? " on" : "")} onClick={() => { setTab(t); setErr(""); }}>{t}</button>)}
            </div>

            {tab === "Dashboard" && (
              <>
                <div className="bw-goal">
                  <div className="bw-goalhead">
                    <div className="bw-goalnum">+{gained.toLocaleString()} <small>/ 3,000 new followers</small></div>
                    <div style={{ color: "var(--ink-2)", fontSize: 12.5 }}>{now ? `${now.toLocaleString()} now → ${goal.toLocaleString()} goal` : "add your numbers below"}</div>
                  </div>
                  <div className="bw-bar"><div className="bw-fill" style={{ width: pct + "%" }} /></div>
                  <div className="bw-goalfoot">
                    <div><span className="bw-mlabel">Starting followers</span><input className="bw-input bw-smallin" type="number" value={followers.start} placeholder="e.g. 850" onChange={(e) => saveFollowers({ ...followers, start: e.target.value })} /></div>
                    <div><span className="bw-mlabel">Followers now</span><input className="bw-input bw-smallin" type="number" value={followers.now} placeholder="e.g. 1120" onChange={(e) => saveFollowers({ ...followers, now: e.target.value })} /></div>
                  </div>
                </div>
                <div className="bw-tiles">
                  <div className="bw-tile"><div className="n">{posts.length}</div><div className="l">Content made</div></div>
                  <div className="bw-tile"><div className="n">{withData.length}</div><div className="l">Posts measured</div></div>
                  <div className="bw-tile"><div className="n">{totalFollows.toLocaleString()}</div><div className="l">Follows from posts</div></div>
                  <div className="bw-tile"><div className="n">{bestSaves.toLocaleString()}</div><div className="l">Best saves</div></div>
                </div>
                <div className="bw-playbook">
                  <h3>The Playbook <em>· the AI's living memory</em></h3>
                  <div className="sub">Rewritten each time you log a post's results, then fed into every idea and piece of content.</div>
                  <div className={"body" + (playbook ? "" : " empty")}>{playbook || "Empty for now. Create content, post it, then log how it did in the Posts tab — the AI will start building Trox's growth playbook here."}</div>
                </div>
              </>
            )}

            {tab === "Create" && (
              <>
                <div className="bw-channels">
                  {CHANNELS.map((c) => <button key={c.id} className={"bw-chan" + (channel === c.id ? " on" : "")} onClick={() => { setChannel(c.id); setFormat(FORMATS[c.id][0]); setIdeas([]); setDraftContent(null); }}>{c.label}</button>)}
                </div>

                <div className="bw-builder">
                  <select className="bw-select" value={collection} onChange={(e) => setCollection(e.target.value)}>
                    {COLLECTIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  {showThemeSel && <select className="bw-select" value={theme} onChange={(e) => setTheme(e.target.value)}>{PILLARS.map((p) => <option key={p}>{p}</option>)}</select>}
                  {showSignSel && <select className="bw-select" value={sign} onChange={(e) => setSign(e.target.value)}>{SIGNS.map((s) => <option key={s}>{s}</option>)}</select>}
                  <select className="bw-select" value={angle} onChange={(e) => setAngle(e.target.value)}>{ANGLES.map((a) => <option key={a}>{a}</option>)}</select>
                </div>

                <div className="bw-row">
                  <input className="bw-input" placeholder='Optional extra angle — e.g. "unboxing a custom anniversary order"' value={topic} onChange={(e) => setTopic(e.target.value)} />
                  <button className="bw-btn ghost" onClick={genIdeas} disabled={busy === "ideas"}>{busy === "ideas" ? "…" : "Idea me 5"}</button>
                </div>

                {busy === "ideas" && <div className="bw-load"><div className="bw-spin" /> Scoping ideas for {channelLabel(channel)}…</div>}
                {ideas.length > 0 && (
                  <>
                    <div className="bw-grid">
                      {ideas.map((it, i) => (
                        <div className="bw-card" key={i} style={{ animationDelay: i * 55 + "ms" }}>
                          <div className="bw-meta">
                            <span className="bw-fmt">{it.format}</span>
                            <span className={"bw-perf " + (String(it.performance).toLowerCase() === "high" ? "high" : "medium")}>{String(it.performance).toLowerCase() === "high" ? "▲ High" : "● Medium"}</span>
                          </div>
                          <h4>{it.title}</h4>
                          <div className="bw-hook">"{it.hook}"</div>
                          <div className="bw-why">{it.why}</div>
                          <div className="bw-cardbtns"><button className="bw-mini go" onClick={() => useIdea(it)}>Use this →</button></div>
                        </div>
                      ))}
                    </div>
                    <div className="bw-note">Estimates blend format, brand fit and your Playbook — they sharpen as you log real results.</div>
                  </>
                )}

                <div className="bw-row" style={{ marginTop: 22 }}>
                  <select className="bw-select" value={format} onChange={(e) => setFormat(e.target.value)}>{FORMATS[channel].map((f) => <option key={f}>{f}</option>)}</select>
                  <button className="bw-btn" onClick={buildContent} disabled={busy === "build"}>{busy === "build" ? "Crafting…" : `Build the ${format}`}</button>
                </div>

                {busy === "build" && <div className="bw-load"><div className="bw-spin" /> Crafting your {format}…</div>}
                {draftContent && (
                  <>
                    <div className="bw-out mono"><button className="bw-copy" onClick={() => copy(draftContent.content)}>copy</button>{draftContent.content}</div>
                    <div className="bw-draftbar"><button className="bw-btn" onClick={saveDraft}>Save to Posts →</button><button className="bw-btn ghost" onClick={buildContent}>Regenerate</button></div>
                  </>
                )}
              </>
            )}

            {tab === "Posts" && (
              <>
                {posts.length === 0 && <div className="bw-empty"><div className="big">No posts yet</div>Build content in Create and save it here. After you post, log the results so the AI learns.</div>}
                <div className="bw-grid">
                  {posts.map((p) => (
                    <div className="bw-card" key={p.id}>
                      <div className="bw-meta">
                        <span className="bw-fmt">{p.type}</span>
                        <span className="bw-fmt" style={{ color: "var(--ink-2)", background: "var(--card-2)", borderColor: "var(--line)" }}>{channelLabel(p.channel)}</span>
                        <span className={"bw-status " + p.status}>{p.status === "posted" ? "✓ measured" : "planned"}</span>
                      </div>
                      <h4>{p.title}</h4>
                      <div className="bw-postbody">{p.content}</div>
                      {p.insight && <div className="bw-insight">{p.insight}</div>}
                      {p.status === "planned" && logOpen !== p.id && (
                        <div className="bw-cardbtns">
                          <button className="bw-mini go" onClick={() => openLog(p)}>Log results</button>
                          <button className="bw-mini" onClick={() => copy(p.content)}>Copy</button>
                          <button className="bw-mini" onClick={() => savePosts(posts.filter((x) => x.id !== p.id))}>Delete</button>
                        </div>
                      )}
                      {logOpen === p.id && (
                        <div>
                          <div className="bw-metricgrid">
                            {[["reach", "Reach / impr."], ["likes", "Likes"], ["comments", "Comments"], ["saves", "Saves"], ["shares", "Shares / clicks"], ["follows", "New followers"]].map(([k, lbl]) => (
                              <div key={k}><span className="bw-mlabel">{lbl}</span><input className="bw-min" type="number" value={logForm[k] || ""} onChange={(e) => setLogForm({ ...logForm, [k]: e.target.value })} /></div>
                            ))}
                          </div>
                          <span className="bw-mlabel" style={{ marginTop: 8 }}>Notes</span>
                          <input className="bw-min" value={logForm.notes || ""} onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })} placeholder="e.g. lots of DM shares from gift-buyers" />
                          <div className="bw-cardbtns">
                            <button className="bw-mini go" onClick={() => submitLog(p)} disabled={busy === "log_" + p.id}>{busy === "log_" + p.id ? "Learning…" : "Save & learn"}</button>
                            <button className="bw-mini" onClick={() => setLogOpen(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "Coach" && (
              <>
                <div className="bw-row"><button className="bw-btn" onClick={runCoach} disabled={busy === "coach"}>{busy === "coach" ? "Auditing…" : "Audit & advise me"}</button></div>
                {busy === "coach" && <div className="bw-load"><div className="bw-spin" /> Reviewing Trox's performance & follower trajectory…</div>}
                {!busy && !coach && <div className="bw-empty"><div className="big">Your growth coach</div>It reads your Playbook, every measured post, and your follower progress — then tells you what's working, what to fix, and the next 3 posts to make.</div>}
                {coach && <div className="bw-out"><button className="bw-copy" onClick={() => copy(coach)}>copy</button>{coach}</div>}
              </>
            )}

            {err && <div className="bw-note" style={{ color: "var(--rose)" }}>{err}</div>}
          </>
        )}
      </div>
    </div>
  );
}

export const uid = () => Math.random().toString(36).slice(2, 9);

export function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m ago";
  if (s < 86400) return Math.floor(s / 3600) + "h ago";
  return Math.floor(s / 86400) + "d ago";
}

export function maskKey(k) {
  if (!k) return "";
  return k.slice(0, 8) + "••••••••••••" + k.slice(-4);
}

export function fmtNum(n) {
  if (n == null) return "—";
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export function parseJSON(text) {
  const c = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const s = c.indexOf("[");
  const e = c.lastIndexOf("]");
  return JSON.parse(s !== -1 && e !== -1 ? c.slice(s, e + 1) : c);
}

export function buildInstructions(fmt) {
  switch (fmt) {
    case "Reel":
      return "Give: HOOK (0-3s) opening line + opening visual; 4-5 numbered BEATS each with [VISUAL] and [SAY/TEXT] + rough timing; B-ROLL (3 shots: paper texture, stitching, foil emboss, hands on pages, pen on paper); 2-3 on-screen TEXT overlays; CAPTION ending in a soft CTA; 6-8 hashtags.";
    case "Carousel":
      return "Give a COVER hook line, then SLIDE 1 to SLIDE 6 each with short on-slide text + one-line visual note; final slide = gentle CTA; then a CAPTION + 6-8 hashtags.";
    case "Post":
      return "Give: IMAGE CONCEPT (1-2 lines, emphasise tactile craft and emotion); CAPTION (reflective hook line, 2-3 body lines in Benjamin's philosophical voice, soft CTA); 6-8 hashtags.";
    case "Story":
      return "Give a 4-5 FRAME sequence; each frame: visual + short text overlay; include one interactive sticker idea (poll/question/quiz); final frame = CTA with tap/swipe action.";
    case "Pin":
      return "Give: PIN TITLE (SEO-rich, under 100 chars); PIN DESCRIPTION (keyword-rich, 2-3 sentences, gift & journaling & self-development intent); IMAGE CONCEPT; destination + CTA idea.";
    case "Idea Pin":
      return "Give a 4-6 PAGE outline; each page: visual + short text; page 1 = hook, last page = CTA; plus 5 keyword tags.";
    default:
      return "Give a complete, ready-to-produce content brief.";
  }
}

export function buildImageBriefInstructions(format, contentTitle) {
  return `You are an art director for a premium handcrafted journal brand. Generate a detailed visual brief for a ${format} about "${contentTitle}".

Cover:
1. HERO SHOT — exact composition, angle, focal point, what is in frame
2. COLOR PALETTE — 4-5 exact hex codes with their role (background, prop, accent)
3. LIGHTING — quality, direction, time of day, mood
4. PROPS — every single object in frame, its placement, its texture
5. TYPOGRAPHY — if any text overlay: font feel (serif/sans), weight, size hierarchy, placement
6. MOOD REFERENCE — two cultural/cinematic references that capture the feeling
7. WHAT TO AVOID — 2-3 things that would ruin the shot

Be extremely specific. A designer should be able to recreate this without asking a single question. Plain text, no markdown symbols.`;
}

export function dateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

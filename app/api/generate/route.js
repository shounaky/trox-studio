import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import { HOOK_LAB_PROMPT, REPURPOSE_PROMPT, VOICE_CHECK_PROMPT } from "../../../lib/prompts-content";

function buildClient(provider, apiKey) {
  if (provider === "claude") {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("No Claude API key. Add it in Settings.");
    return { type: "claude", client: new Anthropic({ apiKey: key }) };
  }
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) throw new Error("No Groq API key. Add it in Settings.");
  return { type: "groq", client: new Groq({ apiKey: key }) };
}

async function runPrompt({ type, client }, prompt, maxTokens = 1600) {
  if (type === "claude") {
    const res = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    });
    return (res.content || []).map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  }
  const res = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: maxTokens,
  });
  return res.choices[0]?.message?.content?.trim() || "";
}

function parseJSON(text) {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenceMatch ? fenceMatch[1] : text;
  const start = raw.indexOf("{");
  const end   = raw.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found in response");
  return JSON.parse(raw.slice(start, end + 1));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, provider = "groq", apiKey, brandCtx = "", voiceExamples } = body;

    const ai = buildClient(provider, apiKey);

    // ── Hook Lab ──────────────────────────────────────────────────────────
    if (action === "hooks") {
      const { content } = body;
      if (!content) return Response.json({ error: "content required" }, { status: 400 });
      const prompt = HOOK_LAB_PROMPT(content, brandCtx);
      const raw = await runPrompt(ai, prompt, 1400);
      const data = parseJSON(raw);
      return Response.json(data);
    }

    // ── Repurpose ──────────────────────────────────────────────────────────
    if (action === "repurpose") {
      const { sourceText, platforms } = body;
      if (!sourceText || !platforms?.length)
        return Response.json({ error: "sourceText and platforms required" }, { status: 400 });
      const prompt = REPURPOSE_PROMPT(sourceText, platforms, brandCtx);
      const raw = await runPrompt(ai, prompt, 2000);
      const data = parseJSON(raw);
      return Response.json(data);
    }

    // ── Voice Check ────────────────────────────────────────────────────────
    if (action === "voice-check") {
      const { content } = body;
      if (!content) return Response.json({ error: "content required" }, { status: 400 });
      const prompt = VOICE_CHECK_PROMPT(content, voiceExamples);
      const raw = await runPrompt(ai, prompt, 800);
      const data = parseJSON(raw);
      return Response.json(data);
    }

    // ── Command Center Priorities ──────────────────────────────────────────
    if (action === "command-center") {
      const { COMMAND_CENTER_PROMPT } = await import("../../../lib/prompts-content");
      const { calendarPosts = [], pillarMix = [], upcomingMoments = [], igAccount = {} } = body;
      const prompt = COMMAND_CENTER_PROMPT(calendarPosts, pillarMix, upcomingMoments, brandCtx, igAccount);
      const raw = await runPrompt(ai, prompt, 900);
      const data = parseJSON(raw);
      return Response.json(data);
    }

    // ── Suggest Hashtags ──────────────────────────────────────────────────
    if (action === "suggest-hashtags") {
      const { pillarLabel, existingTags = [] } = body;
      const prompt = `You are a social media strategist for Trox Creations — a premium handcrafted journal brand based in India.

Suggest 10 new Instagram hashtags for the content pillar: "${pillarLabel}".
Existing tags to avoid: ${existingTags.slice(0, 20).join(", ")}.

Rules:
- Mix sizes: 2-3 large (1M+ posts), 4-5 medium (100K-1M), 2-3 niche (<100K)
- All must be relevant to handcrafted journals, stationery, gifting, or the specific pillar
- No banned or spammy hashtags
- Return ONLY a JSON object: {"hashtags": ["#tag1", "#tag2", ...]} — exactly 10 items`;
      const raw = await runPrompt(ai, prompt, 400);
      const data = parseJSON(raw);
      return Response.json(data);
    }

    // ── Content Series Builder ────────────────────────────────────────────
    if (action === "content-series") {
      const { theme, postCount = 4, channel, pillarLabel, brandCtx: seriesBrandCtx = brandCtx } = body;
      const prompt = `${seriesBrandCtx ? seriesBrandCtx + "\n\n" : ""}You are building a content series for @troxcreations — premium handcrafted journals.

Series theme: "${theme}"
Posts in series: ${postCount}
Platform: ${channel || "Instagram"}
Pillar: ${pillarLabel || ""}

Generate exactly ${postCount} posts for this series. Each post should build on the last — think of it as a narrative arc: hook → reveal → evidence → CTA.

Return ONLY a JSON object:
{
  "seriesName": "Name of the series",
  "seriesHook": "One-line series concept",
  "posts": [
    {
      "number": 1,
      "format": "Reel | Carousel | Post",
      "title": "Post title",
      "hook": "Opening line (max 15 words)",
      "angle": "What angle this post takes",
      "cta": "What action to drive"
    }
  ]
}`;
      const raw = await runPrompt(ai, prompt, 1200);
      const data = parseJSON(raw);
      return Response.json(data);
    }

    // ── Format Caption ────────────────────────────────────────────────────
    if (action === "format-caption") {
      const { caption, channel: captionChannel = "instagram" } = body;
      if (!caption) return Response.json({ error: "caption required" }, { status: 400 });
      const formatRules = {
        instagram: "Instagram: Short punchy paragraphs (1-3 lines max). Single blank line between paragraphs. Place relevant emoji at start of key lines. End with a question or call-to-action. Add 3-5 hashtags on the last line (not inline).",
        linkedin:  "LinkedIn: Professional but warm. 2-3 short paragraphs. No emoji spam — max 1-2 relevant emoji. End with a question to drive comments. No hashtags inline.",
        twitter:   "X (Twitter): Keep under 280 characters. One punchy sentence or 2-line hook. No hashtags in body — add 1-2 at end max.",
        threads:   "Threads: Conversational, no formal structure. 2-3 short sentences. Can use emoji naturally. Keep it feeling spontaneous.",
        pinterest: "Pinterest: Start with a keyword-rich sentence. Then 2-3 descriptive sentences. End with action words. No hashtags.",
      };
      const rules = formatRules[captionChannel] || formatRules.instagram;
      const prompt = `Reformat the following caption for ${captionChannel} following these rules:
${rules}

Original caption:
${caption}

Return ONLY a JSON object: {"formatted": "the reformatted caption"}
Keep the same core content and brand voice — only change structure and formatting.`;
      const raw = await runPrompt(ai, prompt, 600);
      const data = parseJSON(raw);
      return Response.json(data);
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch (err) {
    console.error("generate route error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

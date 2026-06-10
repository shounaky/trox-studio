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

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });

  } catch (err) {
    console.error("generate route error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

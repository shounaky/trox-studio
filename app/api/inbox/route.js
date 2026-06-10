import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import { generateMockInbox } from "../../../lib/mock-data";

function buildClient(provider, apiKey) {
  if (provider === "claude") {
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error("No Claude API key");
    return { type: "claude", client: new Anthropic({ apiKey: key }) };
  }
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) throw new Error("No Groq API key");
  return { type: "groq", client: new Groq({ apiKey: key }) };
}

async function runPrompt({ type, client }, prompt) {
  if (type === "claude") {
    const res = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });
    return (res.content || []).map((b) => (b.type === "text" ? b.text : "")).join("").trim();
  }
  const res = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
  });
  return res.choices[0]?.message?.content?.trim() || "";
}

export async function GET() {
  // Returns mock inbox — real IG comments fetched client-side from /api/instagram-comments
  const messages = generateMockInbox();
  return Response.json({ messages, source: "mock" });
}

export async function POST(request) {
  try {
    const { action, message, brandCtx = "", provider = "groq", apiKey } = await request.json();

    if (action === "draft-reply") {
      if (!message) return Response.json({ error: "message required" }, { status: 400 });

      const prompt = `You are the community manager for Trox Creations — a premium handcrafted journal brand from India.

${brandCtx}

BRAND VOICE: Warm, personal, never corporate or salesy. Address the person directly. Short — max 2-3 sentences. End with an open question when appropriate to continue the conversation.

COMMENT TO REPLY TO:
Author: ${message.author}
Comment: "${message.text}"
Post context: "${message.postCaption || ""}"
Intent detected: ${message.intent || "general"}
${message.priority ? "PRIORITY: This appears to be a high-value lead — be warm but also gently guide them toward DM or purchase." : ""}

Write ONLY the reply text. No quotes, no formatting, no emojis unless the original comment used them.`;

      const ai = buildClient(provider, apiKey);
      const reply = await runPrompt(ai, prompt);
      return Response.json({ reply });
    }

    return Response.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (err) {
    console.error("inbox route error:", err.message);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

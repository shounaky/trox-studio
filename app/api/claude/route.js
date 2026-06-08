import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-8b",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
];

async function callGemini(key, prompt) {
  const genAI = new GoogleGenerativeAI(key);
  let lastError;
  for (const modelName of GEMINI_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (e) {
      lastError = e;
      const msg = e.message || "";
      if (msg.includes("404") || msg.includes("not found") || msg.includes("not supported")) {
        continue;
      }
      throw e;
    }
  }
  throw lastError || new Error("No available Gemini model found for your API key.");
}

export async function POST(request) {
  try {
    const { prompt, provider = "gemini", apiKey } = await request.json();
    if (!prompt) return Response.json({ error: "No prompt provided" }, { status: 400 });

    if (provider === "claude") {
      const key = apiKey || process.env.ANTHROPIC_API_KEY;
      if (!key) return Response.json({ error: "No Claude API key found. Add it in the Settings tab." }, { status: 500 });
      const client = new Anthropic({ apiKey: key });
      const message = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      });
      const text = (message.content || []).map((b) => (b.type === "text" ? b.text : "")).join("").trim();
      return Response.json({ text });
    }

    const key = apiKey || process.env.GOOGLE_AI_KEY;
    if (!key) return Response.json({ error: "No Gemini API key found. Add it in the Settings tab." }, { status: 500 });
    const text = await callGemini(key, prompt);
    return Response.json({ text });

  } catch (error) {
    console.error("AI error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

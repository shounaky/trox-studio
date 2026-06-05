import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    // Gemini (default)
    const key = apiKey || process.env.GOOGLE_AI_KEY;
    if (!key) return Response.json({ error: "No Gemini API key found. Add it in the Settings tab." }, { status: 500 });
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return Response.json({ text });

  } catch (error) {
    console.error("AI error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

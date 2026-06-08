import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";

export async function POST(request) {
  try {
    const { prompt, provider = "groq", apiKey } = await request.json();
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

    const key = apiKey || process.env.GROQ_API_KEY;
    if (!key) return Response.json({ error: "No Groq API key found. Add it in the Settings tab." }, { status: 500 });
    const client = new Groq({ apiKey: key });
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1200,
    });
    const text = completion.choices[0]?.message?.content?.trim() || "";
    return Response.json({ text });

  } catch (error) {
    console.error("AI error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) return Response.json({ error: "No prompt provided" }, { status: 400 });

    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "ANTHROPIC_API_KEY is not set. Add it in Vercel → Project Settings → Environment Variables." }, { status: 500 });
    }

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    return Response.json({ content: message.content });
  } catch (error) {
    console.error("Claude API error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

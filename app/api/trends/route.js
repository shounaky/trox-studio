import Groq from "groq-sdk";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request) {
  try {
    const { brandContext, niche, audience, provider = "groq", apiKey } = await request.json();

    const key = apiKey || (provider === "groq" ? process.env.GROQ_API_KEY : process.env.ANTHROPIC_API_KEY);
    if (!key) {
      return Response.json({ error: "No API key provided." }, { status: 400 });
    }

    const niches = niche || "premium handcrafted journals, stationery, gifting, self-development, zodiac/astrology, mindfulness";
    const targetAudience = audience || "introspective adults 22-45 into journaling, self-development, Human Design, zodiac; gift-buyers";

    const prompt = `You are a social media trend analyst specialising in premium lifestyle, stationery, gifting, and self-development niches on Instagram.

Analyse what is currently trending or emerging in these categories:
${niches}

Target audience: ${targetAudience}

${brandContext ? `Brand context: ${brandContext}` : ""}

Identify exactly 6 content trend opportunities. For each:

TREND 1: [Trend name — short, punchy]
WHAT IT IS: [2 sentences describing the trend and why it is growing right now]
WHY IT FITS: [1 sentence on why this is perfect for a premium handcrafted journal brand]
FORMAT: [Best Instagram format: Reel / Carousel / Post]
HASHTAG SIGNAL: [3 trending hashtags related to this trend]
OPPORTUNITY: [HIGH / MEDIUM / LOW — based on timing and competition level]
HOOK IDEA: [One scroll-stopping opening line for a post using this trend]

Repeat for TREND 2 through TREND 6.

Be specific and current. Reference real content patterns (e.g., "soft girl aesthetic", "hot girl walk journaling", "shadow work", "manifestation journaling"). Plain text only, no markdown.`;

    let text = "";

    if (provider === "claude") {
      const client = new Anthropic({ apiKey: key });
      const response = await client.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      });
      text = response.content[0].text;
    } else {
      const client = new Groq({ apiKey: key });
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
      });
      text = completion.choices[0].message.content;
    }

    return Response.json({ text });
  } catch (err) {
    return Response.json({ error: err.message || "Trend discovery failed." }, { status: 500 });
  }
}

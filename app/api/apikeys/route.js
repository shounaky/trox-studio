// FR-029: API key management for public REST API access
// Phase 1: single key per installation, stored in browser localStorage
// Phase 2: keys stored in Supabase with user_id association

import { randomBytes } from "crypto";

export async function POST(request) {
  try {
    const { action } = await request.json();

    if (action === "generate") {
      const key = "tsk_" + randomBytes(24).toString("hex");
      return Response.json({ key, createdAt: new Date().toISOString() });
    }

    return Response.json({ error: "Unknown action. Use: generate" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message || "API key operation failed." }, { status: 500 });
  }
}

export async function GET(request) {
  const apiKey = request.headers.get("X-API-Key");
  const serverApiKey = process.env.TROX_API_KEY;

  if (serverApiKey && apiKey !== serverApiKey) {
    return Response.json({ error: "Invalid API key." }, { status: 401 });
  }

  return Response.json({
    service: "Trox Studio API",
    version: "1.0",
    authenticated: true,
    endpoints: {
      "GET /api/apikeys": "API info",
      "POST /api/claude": "AI content generation",
      "POST /api/instagram-session": "Instagram sync",
      "POST /api/instagram-analytics": "Analytics",
      "POST /api/trends": "Trend discovery",
      "POST /api/publish/instagram": "Publish content",
      "POST /api/webhooks": "Webhook dispatch",
    },
  });
}

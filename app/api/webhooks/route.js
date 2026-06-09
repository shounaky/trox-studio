// FR-028: Webhook event dispatch — Zapier/Make/n8n compatible
// Outgoing webhooks: POST to user-configured URL when events occur
// Incoming webhooks: POST /api/webhooks with X-API-Key header

const VALID_EVENTS = [
  "POST_GENERATED",
  "POST_METRICS_LOGGED",
  "IG_SYNC_COMPLETED",
  "PLAYBOOK_UPDATED",
  "WEEKLY_REPORT_GENERATED",
  "TREND_DISCOVERED",
];

export async function POST(request) {
  try {
    const apiKey = request.headers.get("X-API-Key");
    const body = await request.json();
    const { event, payload, webhookUrl } = body;

    if (webhookUrl) {
      // Outgoing dispatch: forward event to user's configured webhook URL
      if (!event || !VALID_EVENTS.includes(event)) {
        return Response.json({ error: `Unknown event. Valid: ${VALID_EVENTS.join(", ")}` }, { status: 400 });
      }
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Trox-Event": event,
            "X-Trox-Timestamp": new Date().toISOString(),
          },
          body: JSON.stringify({
            event,
            timestamp: new Date().toISOString(),
            source: "trox-studio",
            payload: payload || {},
          }),
        });
        return Response.json({
          dispatched: true,
          event,
          webhookStatus: res.status,
        });
      } catch (err) {
        return Response.json({ error: "Failed to reach webhook URL: " + err.message }, { status: 502 });
      }
    }

    // Incoming webhook: validate API key and return event info
    const serverApiKey = process.env.TROX_API_KEY;
    if (serverApiKey && apiKey !== serverApiKey) {
      return Response.json({ error: "Invalid API key." }, { status: 401 });
    }

    return Response.json({
      received: true,
      event: event || "unknown",
      timestamp: new Date().toISOString(),
      validEvents: VALID_EVENTS,
    });
  } catch (err) {
    return Response.json({ error: err.message || "Webhook error." }, { status: 500 });
  }
}

export async function GET(request) {
  return Response.json({
    service: "Trox Studio Webhooks",
    version: "1.0",
    events: VALID_EVENTS,
    docs: "POST to this endpoint with { event, payload, webhookUrl } to dispatch events to your registered URL.",
  });
}

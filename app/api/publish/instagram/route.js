// FR-017: Direct publishing to Instagram via Graph API
// Requires: instagram_content_publish permission + app review from Meta
// Flow: (1) Create media container → (2) Publish container
// Limitations: Images must be publicly accessible URLs. Videos require additional processing time.

export async function POST(request) {
  try {
    const { token, igAccountId, mediaType, imageUrl, videoUrl, caption, action } = await request.json();

    if (!token || !igAccountId) {
      return Response.json({ error: "Instagram token and account ID required." }, { status: 400 });
    }

    const base = `https://graph.facebook.com/v21.0`;

    if (action === "create_image") {
      if (!imageUrl || !caption) {
        return Response.json({ error: "imageUrl and caption required for image posts." }, { status: 400 });
      }
      const res = await fetch(`${base}/${igAccountId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          access_token: token,
        }),
      });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
      return Response.json({ containerId: data.id });
    }

    if (action === "create_reel") {
      if (!videoUrl || !caption) {
        return Response.json({ error: "videoUrl and caption required for reels." }, { status: 400 });
      }
      const res = await fetch(`${base}/${igAccountId}/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          media_type: "REELS",
          video_url: videoUrl,
          caption,
          share_to_feed: true,
          access_token: token,
        }),
      });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
      return Response.json({ containerId: data.id });
    }

    if (action === "check_status") {
      const { containerId } = await request.json().catch(() => ({}));
      const cId = request._containerId || containerId;
      const res = await fetch(`${base}/${cId}?fields=status_code&access_token=${token}`);
      const data = await res.json();
      return Response.json({ status: data.status_code });
    }

    if (action === "publish") {
      const { containerId } = await request.json().catch(() => ({}));
      const cId = request._containerId || containerId;
      const res = await fetch(`${base}/${igAccountId}/media_publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creation_id: cId,
          access_token: token,
        }),
      });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 400 });
      return Response.json({ mediaId: data.id, published: true });
    }

    return Response.json({ error: "Unknown action. Use: create_image | create_reel | check_status | publish" }, { status: 400 });
  } catch (err) {
    return Response.json({ error: err.message || "Publishing failed." }, { status: 500 });
  }
}

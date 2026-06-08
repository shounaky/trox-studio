const BASE = "https://graph.facebook.com/v21.0";

async function gfetch(path, token) {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${BASE}${path}${sep}access_token=${token}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "Facebook API error");
  return data;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, action, igAccountId, mediaId, mediaType } = body;

    if (!token) return Response.json({ error: "No access token provided." }, { status: 400 });

    if (action === "setup") {
      const pages = await gfetch("/me/accounts?fields=id,name", token);
      for (const page of (pages.data || [])) {
        let pageData;
        try { pageData = await gfetch(`/${page.id}?fields=instagram_business_account`, token); } catch { continue; }
        if (pageData.instagram_business_account) {
          const igId = pageData.instagram_business_account.id;
          const account = await gfetch(`/${igId}?fields=username,followers_count,media_count,biography,profile_picture_url`, token);
          return Response.json({ igAccountId: igId, account });
        }
      }
      return Response.json({
        error: "No Instagram Business/Creator account found. Make sure: (1) your Instagram is a Business or Creator account, (2) it is linked to a Facebook Page.",
      }, { status: 400 });
    }

    if (!igAccountId) return Response.json({ error: "No IG account ID." }, { status: 400 });

    if (action === "account") {
      const data = await gfetch(`/${igAccountId}?fields=username,followers_count,media_count,biography,profile_picture_url`, token);
      return Response.json(data);
    }

    if (action === "media") {
      const data = await gfetch(
        `/${igAccountId}/media?fields=id,caption,media_type,timestamp,like_count,comments_count,permalink&limit=30`,
        token,
      );
      return Response.json(data);
    }

    if (action === "post_insights") {
      if (!mediaId) return Response.json({ data: [] });
      let metrics;
      if (mediaType === "REEL") {
        metrics = "plays,reach,saved,likes,comments,shares";
      } else if (mediaType === "VIDEO") {
        metrics = "reach,impressions,saved,video_views";
      } else {
        metrics = "reach,impressions,saved,engagement";
      }
      try {
        const data = await gfetch(`/${mediaId}/insights?metric=${metrics}`, token);
        return Response.json(data);
      } catch {
        return Response.json({ data: [] });
      }
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    console.error("IG Analytics error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

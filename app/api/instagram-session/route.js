const IG_HEADERS = (sessionId, username) => ({
  "Cookie": `sessionid=${sessionId}; ig_did=; mid=;`,
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "X-IG-App-ID": "936619743392459",
  "X-Requested-With": "XMLHttpRequest",
  "Referer": `https://www.instagram.com/${username}/`,
  "Accept": "*/*",
  "Accept-Language": "en-US,en;q=0.9",
});

export async function POST(request) {
  try {
    const { sessionId, username } = await request.json();
    if (!sessionId || !username) return Response.json({ error: "Missing sessionId or username." }, { status: 400 });

    const headers = IG_HEADERS(sessionId, username);

    // Fetch profile info
    const profileRes = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
      { headers },
    );

    if (profileRes.status === 401 || profileRes.status === 403) {
      return Response.json({ error: "Session expired or invalid. Refresh your sessionid from Instagram." }, { status: 401 });
    }
    if (!profileRes.ok) {
      return Response.json({ error: `Instagram returned ${profileRes.status}. Try again shortly.` }, { status: 502 });
    }

    const profileData = await profileRes.json();
    const user = profileData.data?.user;
    if (!user) return Response.json({ error: "Profile not found or account is private." }, { status: 404 });

    const userId = user.id;
    const account = {
      username: user.username,
      full_name: user.full_name,
      followers_count: user.edge_followed_by?.count ?? user.follower_count ?? 0,
      following_count: user.edge_follow?.count ?? user.following_count ?? 0,
      media_count: user.edge_owner_to_timeline_media?.count ?? user.media_count ?? 0,
      biography: user.biography ?? "",
      profile_picture_url: user.profile_pic_url ?? "",
    };

    // Fetch media pages (up to 48 posts)
    const posts = [];
    let nextCursor = null;

    for (let page = 0; page < 4; page++) {
      const feedUrl = `https://www.instagram.com/api/v1/feed/user/${userId}/?count=12${nextCursor ? "&max_id=" + nextCursor : ""}`;
      const feedRes = await fetch(feedUrl, { headers });
      if (!feedRes.ok) break;

      const feedData = await feedRes.json();
      const items = feedData.items || [];

      for (const item of items) {
        const isReel = item.product_type === "clips" || item.media_type === 2;
        const isCarousel = item.media_type === 8;
        posts.push({
          id: item.id,
          shortcode: item.code,
          permalink: `https://www.instagram.com/p/${item.code}/`,
          media_type: isCarousel ? "CAROUSEL_ALBUM" : item.media_type === 2 ? "VIDEO" : "IMAGE",
          is_reel: item.product_type === "clips",
          timestamp: new Date((item.taken_at || 0) * 1000).toISOString(),
          caption: item.caption?.text || "",
          like_count: item.like_count || 0,
          comments_count: item.comment_count || 0,
          play_count: item.play_count || item.view_count || 0,
          // carousel sub-items count
          carousel_count: isCarousel ? (item.carousel_media?.length || 0) : 0,
        });
      }

      if (!feedData.more_available || !feedData.next_max_id) break;
      nextCursor = feedData.next_max_id;
    }

    return Response.json({ account, posts });
  } catch (error) {
    console.error("IG session error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

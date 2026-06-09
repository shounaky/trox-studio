export async function POST(request) {
  try {
    const { sessionId, mediaId } = await request.json();
    if (!sessionId || !mediaId) return Response.json({ comments: [] });

    const headers = {
      "Cookie": `sessionid=${sessionId}`,
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "X-IG-App-ID": "936619743392459",
      "X-Requested-With": "XMLHttpRequest",
      "Accept": "*/*",
    };

    const res = await fetch(
      `https://www.instagram.com/api/v1/media/${mediaId}/comments/?can_support_threading=true&permalink_enabled=false`,
      { headers },
    );

    if (!res.ok) return Response.json({ comments: [] });

    const data = await res.json();
    const comments = (data.comments || []).slice(0, 15).map((c) => ({
      text: c.text || "",
      likes: c.comment_like_count || 0,
      username: c.user?.username || "",
    }));

    return Response.json({ comments });
  } catch (error) {
    return Response.json({ comments: [] });
  }
}

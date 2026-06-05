export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.replace("@", "").trim();

  if (!username) return Response.json({ error: "No username provided" }, { status: 400 });

  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    if (!res.ok) return Response.json({ error: `Instagram returned ${res.status}. Profile may be private or doesn't exist.` }, { status: 502 });

    const html = await res.text();

    const ogDesc = html.match(/property="og:description" content="([^"]+)"/)?.[1] || "";
    const ogTitle = html.match(/property="og:title" content="([^"]+)"/)?.[1] || "";

    const followersMatch = ogDesc.match(/([\d,.]+[KkMm]?)\s+Followers/i);
    const postsMatch = ogDesc.match(/([\d,.]+[KkMm]?)\s+Posts/i);
    const nameMatch = ogTitle.match(/^(.+?)\s*\(@/);

    // Bio is everything after the dash that follows the stats
    const bioMatch = ogDesc.match(/Posts\s*-\s*(.+)$/i) || ogDesc.match(/-\s*(.+)$/);
    const rawBio = bioMatch?.[1]?.replace(/See Instagram photos and videos from .+/i, "").trim() || "";

    return Response.json({
      username,
      displayName: nameMatch?.[1]?.trim() || username,
      followers: followersMatch?.[1] || null,
      posts: postsMatch?.[1] || null,
      bio: rawBio || null,
      fetchedAt: Date.now(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

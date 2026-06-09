import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { appId, appSecret } = await request.json();
    if (!appId || !appSecret)
      return NextResponse.json({ error: "App ID and Secret are required." }, { status: 400 });

    const host = request.headers.get("host") || "";
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/instagram/callback`;

    const scope = "instagram_basic,pages_show_list,instagram_manage_insights";
    const oauthUrl = `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`;

    const res = NextResponse.json({ oauthUrl, redirectUri });
    const opts = { httpOnly: true, secure: !host.includes("localhost"), maxAge: 600, path: "/" };
    res.cookies.set("ig_app_id", appId, opts);
    res.cookies.set("ig_app_secret", appSecret, opts);
    res.cookies.set("ig_redirect_uri", redirectUri, opts);
    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

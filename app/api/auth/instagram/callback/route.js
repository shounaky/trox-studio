import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDesc = searchParams.get("error_description");

  if (error || !code) {
    const msg = errorDesc || error || "Instagram connection was cancelled.";
    return NextResponse.redirect(`${origin}/?ig_error=${encodeURIComponent(msg)}`);
  }

  const cookieStore = await cookies();
  const appId = cookieStore.get("ig_app_id")?.value;
  const appSecret = cookieStore.get("ig_app_secret")?.value;
  const redirectUri = cookieStore.get("ig_redirect_uri")?.value;

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.redirect(`${origin}/?ig_error=${encodeURIComponent("Session expired — try connecting again.")}`);
  }

  try {
    // Exchange code for short-lived user token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${appSecret}&code=${code}`,
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error || !tokenData.access_token) {
      throw new Error(tokenData.error?.message || "Failed to get access token.");
    }

    // Exchange for long-lived token (60 days)
    const llRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`,
    );
    const llData = await llRes.json();
    const finalToken = llData.access_token || tokenData.access_token;

    const res = NextResponse.redirect(`${origin}/?ig_token=${encodeURIComponent(finalToken)}`);
    res.cookies.delete("ig_app_id");
    res.cookies.delete("ig_app_secret");
    res.cookies.delete("ig_redirect_uri");
    return res;
  } catch (err) {
    return NextResponse.redirect(`${origin}/?ig_error=${encodeURIComponent(err.message)}`);
  }
}

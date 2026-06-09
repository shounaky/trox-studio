"use client";
import React, { useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "../../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "magic"

  async function handleLogin(e) {
    e.preventDefault();
    setErr(""); setOk(""); setLoading(true);
    if (!isSupabaseConfigured()) {
      setErr("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.");
      setLoading(false);
      return;
    }
    const sb = getSupabaseClient();
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setLoading(false); return; }
    window.location.href = "/";
  }

  async function handleMagicLink(e) {
    e.preventDefault();
    setErr(""); setOk(""); setLoading(true);
    if (!isSupabaseConfigured()) {
      setErr("Supabase is not configured.");
      setLoading(false);
      return;
    }
    const sb = getSupabaseClient();
    const { error } = await sb.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    setOk("Magic link sent! Check your email.");
    setLoading(false);
  }

  async function handleGoogle() {
    if (!isSupabaseConfigured()) { setErr("Supabase is not configured."); return; }
    const sb = getSupabaseClient();
    await sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  }

  return (
    <div className="bw-auth-wrap bw-root">
      <div className="bw-auth-box">
        <div style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 28, marginBottom: 4 }}>
          TROX <span style={{ color: "var(--blue)", fontStyle: "italic" }}>Studio</span>
        </div>
        <p className="sub" style={{ marginBottom: 24 }}>
          {mode === "login" ? "Sign in to your workspace" : "Get a magic link — no password needed"}
        </p>

        {err && <div className="bw-auth-err">{err}</div>}
        {ok && <div className="bw-auth-ok">{ok}</div>}

        {!isSupabaseConfigured() && (
          <div style={{ background: "#fef3dc", border: "1px solid var(--gold-soft)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12.5, color: "#7a4e00", lineHeight: 1.6 }}>
            <b>Supabase not configured.</b> Add environment variables to enable authentication.
            In Phase 1, the app works without login — just close this page and use the app directly.
            <br />
            <a href="/" style={{ color: "var(--blue)", fontWeight: 700 }}>Back to Trox Studio →</a>
          </div>
        )}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="bw-field">
              <label>Email</label>
              <input
                className="bw-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="bw-field">
              <label>Password</label>
              <input
                className="bw-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <button className="bw-btn ok" style={{ width: "100%", marginBottom: 12 }} disabled={loading}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMagicLink}>
            <div className="bw-field">
              <label>Email</label>
              <input
                className="bw-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <button className="bw-btn ok" style={{ width: "100%", marginBottom: 12 }} disabled={loading}>
              {loading ? "Sending…" : "Send magic link →"}
            </button>
          </form>
        )}

        <button className="bw-btn ghost" style={{ width: "100%", marginBottom: 16 }} onClick={handleGoogle}>
          Continue with Google
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
          <button className="bw-auth-link" onClick={() => setMode(mode === "login" ? "magic" : "login")}>
            {mode === "login" ? "Use magic link instead" : "Use password instead"}
          </button>
          <a href="/register" style={{ color: "var(--blue)", fontSize: 12.5 }}>Create account</a>
        </div>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)", textAlign: "center" }}>
          <a href="/" style={{ fontSize: 12, color: "var(--muted)" }}>← Back to Trox Studio</a>
        </div>
      </div>
    </div>
  );
}

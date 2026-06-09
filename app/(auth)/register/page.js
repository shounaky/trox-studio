"use client";
import React, { useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "../../../lib/supabase";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setErr(""); setOk(""); setLoading(true);
    if (!isSupabaseConfigured()) {
      setErr("Supabase is not configured. Authentication is not available.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }
    const sb = getSupabaseClient();
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) { setErr(error.message); setLoading(false); return; }
    if (data?.user?.identities?.length === 0) {
      setErr("An account with this email already exists.");
      setLoading(false);
      return;
    }
    setOk("Account created! Check your email to confirm, then sign in.");
    setLoading(false);
  }

  return (
    <div className="bw-auth-wrap bw-root">
      <div className="bw-auth-box">
        <div style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 28, marginBottom: 4 }}>
          TROX <span style={{ color: "var(--blue)", fontStyle: "italic" }}>Studio</span>
        </div>
        <p className="sub" style={{ marginBottom: 24 }}>Create your workspace</p>

        {err && <div className="bw-auth-err">{err}</div>}
        {ok && <div className="bw-auth-ok">{ok}</div>}

        {!isSupabaseConfigured() && (
          <div style={{ background: "#fef3dc", border: "1px solid var(--gold-soft)", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12.5, color: "#7a4e00", lineHeight: 1.6 }}>
            <b>Supabase not configured.</b> Authentication is not available yet.
            The app works without an account in Phase 1.
            <br />
            <a href="/" style={{ color: "var(--blue)", fontWeight: 700 }}>Back to Trox Studio →</a>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="bw-field">
            <label>Your name</label>
            <input
              className="bw-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Benjamin"
              autoComplete="name"
            />
          </div>
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
              placeholder="min 8 characters"
              required
              autoComplete="new-password"
            />
          </div>
          <button className="bw-btn ok" style={{ width: "100%", marginBottom: 12 }} disabled={loading}>
            {loading ? "Creating account…" : "Create account →"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: 12.5 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "var(--blue)" }}>Sign in</a>
        </div>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--line)", textAlign: "center" }}>
          <a href="/" style={{ fontSize: 12, color: "var(--muted)" }}>← Back to Trox Studio</a>
        </div>
      </div>
    </div>
  );
}

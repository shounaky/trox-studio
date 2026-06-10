"use client";
import React, { useState, useMemo } from "react";
import { fmtNum, timeAgo } from "../../lib/utils";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import {
  generateFollowerHistory,
  generateEngagementHistory,
  generatePostPerformance,
} from "../../lib/mock-data";

const CHART_COLORS = { gold: "#C9A86C", blue: "#7BA7F0", rose: "#D4806E", green: "#6DC48B" };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "var(--ink-2)", marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsTab({
  igSessionId,
  igToken,
  igAccountId,
  igAccount,
  igMedia,
  igSyncing,
  igError,
  igLastSync,
  igAnalysis,
  busy,
  setTab,
  syncInstagram,
  syncWithSession,
  disconnectInstagram,
  analyzeInstagram,
  fetchTopCommentsThenAnalyze,
  importInsightsJSON,
  copy,
}) {
  const [importInput, setImportInput] = useState("");
  const [importMsg, setImportMsg]     = useState("");
  const [activeView, setActiveView]   = useState("instagram");
  const [chartPeriod, setChartPeriod] = useState(30);

  const connected = igSessionId || (igToken && igAccountId);

  const igAvgReach = igMedia.length
    ? Math.round(
        igMedia.filter((p) => p.insights?.reach).reduce((a, p) => a + (p.insights.reach || 0), 0) /
          (igMedia.filter((p) => p.insights?.reach).length || 1)
      )
    : 0;

  // Generate chart data from real or mock sources
  const followerData    = useMemo(() => generateFollowerHistory(igAccount?.followers_count || 4820, chartPeriod), [igAccount?.followers_count, chartPeriod]);
  const engagementData  = useMemo(() => generateEngagementHistory(chartPeriod), [chartPeriod]);
  const postPerfData    = useMemo(() => generatePostPerformance([], igMedia), [igMedia]);

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["instagram", "pinterest", "stories"].map((v) => (
          <button
            key={v}
            className={"bw-chan" + (activeView === v ? " on" : "")}
            onClick={() => setActiveView(v)}
          >
            {v === "instagram" ? "Instagram" : v === "pinterest" ? "Pinterest" : "Stories"}
          </button>
        ))}
      </div>

      {activeView === "instagram" && (
        <>
          {/* ── Charts Section ─────────────────────────────────────── */}
          <div className="bw-charts-section">
            <div className="bw-charts-header">
              <div className="bw-charts-title">Performance Overview</div>
              <div className="bw-chart-period">
                {[7, 30, 90].map((d) => (
                  <button
                    key={d}
                    className={`bw-chart-period-btn${chartPeriod === d ? " on" : ""}`}
                    onClick={() => setChartPeriod(d)}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>
            {!connected && (
              <div className="bw-charts-mock-badge">Demo data — connect Instagram for live metrics</div>
            )}

            <div className="bw-charts-grid">
              {/* Follower Growth */}
              <div className="bw-chart-card">
                <div className="bw-chart-card-title">Follower Growth</div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={followerData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--ink-2)" }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "var(--ink-2)" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="followers" stroke={CHART_COLORS.gold} strokeWidth={2} dot={false} name="Followers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement Rate */}
              <div className="bw-chart-card">
                <div className="bw-chart-card-title">Engagement Rate %</div>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={engagementData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--ink-2)" }} tickLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "var(--ink-2)" }} tickLine={false} axisLine={false} domain={[0, 12]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line type="monotone" dataKey="rate" stroke={CHART_COLORS.blue} strokeWidth={2} dot={false} name="Eng Rate %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Post Performance Bars */}
            {postPerfData.length > 0 && (
              <div className="bw-chart-card" style={{ marginTop: 16 }}>
                <div className="bw-chart-card-title">
                  Post Performance — Likes
                  {igMedia.length > 0 && <span className="bw-charts-live-badge">live</span>}
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={postPerfData.slice(0, 12)} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--ink-2)" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--ink-2)" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="likes" fill={CHART_COLORS.gold} radius={[3, 3, 0, 0]} name="Likes" />
                    <Bar dataKey="comments" fill={CHART_COLORS.blue} radius={[3, 3, 0, 0]} name="Comments" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* ── Existing Instagram analytics section ──────────────── */}
          {!connected ? (
            <div className="bw-ig-setup">
              <h3>Live Instagram Analytics</h3>
              <p className="sub">
                See real likes, comments, video/reel plays and engagement for every post — then let AI
                tell you what to make next.
              </p>
              {igError && (
                <div style={{ fontSize: 12, color: "var(--rose)", marginBottom: 12, padding: "8px 12px", background: "#fef2f2", borderRadius: 8 }}>
                  {igError}
                </div>
              )}
              <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
                Go to{" "}
                <button className="bw-edit" onClick={() => setTab("Settings")}>Settings →</button>
                {" "}paste your Instagram Session ID and hit Sync. No developer app needed.
              </p>
            </div>
          ) : (
            <>
              {(igAccount || igSessionId) && (
                <div className="bw-ig-connected">
                  <div className="bw-ig-avatar-ph">{(igAccount?.username || "T")[0].toUpperCase()}</div>
                  <div className="info">
                    <div className="handle">✓ @{igAccount?.username || "troxcreations"}</div>
                    <div className="stats">
                      {fmtNum(igAccount?.followers_count)} followers ·{" "}
                      {igAccount?.media_count || igMedia.length || "—"} posts ·{" "}
                      {igSessionId ? "session" : "API"} connected
                    </div>
                  </div>
                  <button className="bw-mini" style={{ marginLeft: "auto" }} onClick={disconnectInstagram}>Disconnect</button>
                </div>
              )}

              <div className="bw-analytics-header">
                <div className="bw-analytics-tile">
                  <div className="aval">{fmtNum(igAccount?.followers_count) || "—"}</div>
                  <div className="albl">Followers</div>
                </div>
                <div className="bw-analytics-tile">
                  <div className="aval">{igMedia.length || "—"}</div>
                  <div className="albl">Posts tracked</div>
                </div>
                <div className="bw-analytics-tile">
                  <div className="aval">{fmtNum(igMedia.reduce((a, p) => a + (p.like_count || 0), 0)) || "—"}</div>
                  <div className="albl">Total likes</div>
                </div>
                <div className="bw-analytics-tile">
                  <div className="aval">{fmtNum(igMedia.reduce((a, p) => a + (p.insights?.plays || p.play_count || 0), 0)) || "—"}</div>
                  <div className="albl">Total plays</div>
                </div>
              </div>

              <div className="bw-analytics-syncbar">
                <button className="bw-btn sm" onClick={igToken && igAccountId ? syncInstagram : syncWithSession} disabled={igSyncing}>
                  {igSyncing ? "Syncing…" : "↻ Sync posts"}
                </button>
                {igLastSync && <span className="bw-analytics-synctime">Last synced {timeAgo(igLastSync)}</span>}
                {igError && <span style={{ fontSize: 12, color: "var(--rose)" }}>{igError}</span>}
              </div>

              {igMedia.length > 0 && (
                <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px", marginBottom: 18 }}>
                  <div style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                    Deep Content Intelligence
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 12 }}>
                    AI reads every caption, comment, hashtag and pattern across all {igMedia.length} posts.
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="bw-btn sm" onClick={fetchTopCommentsThenAnalyze} disabled={busy.startsWith("ig_")}>
                      {busy === "ig_ai_full" || busy === "ig_comments" ? "Analysing…" : "Full brand audit →"}
                    </button>
                    <button className="bw-btn sm ghost" onClick={() => analyzeInstagram("voice")} disabled={busy.startsWith("ig_")}>
                      {busy === "ig_ai_voice" ? "…" : "Voice & storytelling"}
                    </button>
                    <button className="bw-btn sm ghost" onClick={() => analyzeInstagram("campaigns")} disabled={busy.startsWith("ig_")}>
                      {busy === "ig_ai_campaigns" ? "…" : "Campaigns & series"}
                    </button>
                    <button className="bw-btn sm ghost" onClick={() => analyzeInstagram("hashtags")} disabled={busy.startsWith("ig_")}>
                      {busy === "ig_ai_hashtags" ? "…" : "Hashtag audit"}
                    </button>
                  </div>
                  {busy.startsWith("ig_ai") && (
                    <div className="bw-load" style={{ paddingTop: 12, paddingBottom: 0 }}>
                      <div className="bw-spin" />Reading {igMedia.length} posts, fetching comments…
                    </div>
                  )}
                </div>
              )}

              {igSyncing && (
                <div className="bw-load"><div className="bw-spin" />Fetching {igAccount?.media_count || "your"} posts…</div>
              )}

              {igMedia.length === 0 && !igSyncing && (
                <div className="bw-ig-nodata">
                  <div className="big">No data yet</div>
                  Hit Sync to pull your posts and their live performance numbers.
                </div>
              )}

              {igMedia.length > 0 && (
                <div className="bw-ig-grid">
                  {igMedia.map((post, i) => {
                    const reach    = post.insights?.reach || 0;
                    const plays    = post.insights?.plays || post.play_count || 0;
                    const saves    = post.insights?.saved || 0;
                    const engBase  = reach || plays || 1;
                    const engScore = (post.like_count || 0) + (post.comments_count || 0) + saves;
                    const eng      = engScore > 0 ? ((engScore / engBase) * 100).toFixed(1) : null;
                    const topMetric = reach || plays;
                    const avgMetric = igMedia.filter((p) => p.insights?.reach || p.play_count)
                      .reduce((a, p) => a + (p.insights?.reach || p.play_count || 0), 0) /
                      (igMedia.filter((p) => p.insights?.reach || p.play_count).length || 1);
                    const perfClass = topMetric > avgMetric * 1.3 ? "high" : topMetric > 0 && topMetric < avgMetric * 0.7 ? "low" : "mid";
                    return (
                      <div className={`bw-ig-post${reach > igAvgReach * 1.3 ? " top" : ""}`} key={post.id} style={{ animationDelay: i * 35 + "ms" }}>
                        <div className="ptop">
                          <span className="ptype">{post.media_type === "CAROUSEL_ALBUM" ? "CAROUSEL" : post.media_type}</span>
                          <span className="pdate">{timeAgo(new Date(post.timestamp).getTime())}</span>
                        </div>
                        <div className="pcap">{(post.caption || "(no caption)").slice(0, 90)}{(post.caption || "").length > 90 ? "…" : ""}</div>
                        <div className="bw-ig-metrics">
                          <div className="bw-ig-metric"><div className="mv">{fmtNum(post.like_count || 0)}</div><div className="ml">Likes</div></div>
                          <div className="bw-ig-metric"><div className="mv">{fmtNum(post.comments_count || 0)}</div><div className="ml">Cmts</div></div>
                          {reach > 0 && <div className="bw-ig-metric"><div className="mv">{fmtNum(reach)}</div><div className="ml">Reach</div></div>}
                          {saves > 0 && <div className="bw-ig-metric"><div className="mv">{fmtNum(saves)}</div><div className="ml">Saves</div></div>}
                          {plays > 0 && <div className="bw-ig-metric"><div className="mv">{fmtNum(plays)}</div><div className="ml">Plays</div></div>}
                        </div>
                        <div className="pfooter">
                          {eng !== null ? (
                            <span className={`peng ${perfClass}`}>
                              {perfClass === "high" ? "▲ " : perfClass === "low" ? "▼ " : "● "}{eng}% eng
                            </span>
                          ) : <span />}
                          {post.permalink && <a className="piglink" href={post.permalink} target="_blank" rel="noreferrer">View ↗</a>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {igAnalysis && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 18, color: "var(--ink)" }}>
                      Content Intelligence Report
                    </h3>
                    <button className="bw-copy" style={{ position: "static", float: "none" }} onClick={() => copy(igAnalysis)}>copy</button>
                  </div>
                  <div className="bw-out">{igAnalysis}</div>
                </>
              )}

              <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 14, padding: "16px", marginTop: 20 }}>
                <h4 style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                  Import Reach, Saves & Impressions
                </h4>
                <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 12, lineHeight: 1.6 }}>
                  To get private metrics (reach, saves, impressions) without a developer app:
                  <br />1. Open Instagram → tap your profile → <b>≡</b> → <b>Your activity</b> → <b>Download your information</b>
                  <br />2. Select <b>Some of your information</b> → tick <b>Posts</b> → <b>Download to device</b>
                  <br />3. Open the ZIP → find <b>media_metrics.json</b> → paste below
                </div>
                {importMsg && (
                  <div style={{ fontSize: 12, fontWeight: 700, color: importMsg.startsWith("✓") ? "var(--ok)" : "var(--rose)", marginBottom: 8 }}>
                    {importMsg}
                  </div>
                )}
                <textarea
                  className="bw-input"
                  style={{ minHeight: 80, fontSize: 12, fontFamily: "monospace" }}
                  placeholder="Paste content of media_metrics.json here…"
                  value={importInput}
                  onChange={(e) => setImportInput(e.target.value)}
                />
                <button
                  className="bw-btn sm ok"
                  style={{ marginTop: 8 }}
                  onClick={() => {
                    const r = importInsightsJSON(importInput);
                    setImportMsg(r.error ? "✗ " + r.error : `✓ Imported metrics for ${r.imported} posts.`);
                    if (!r.error) setImportInput("");
                  }}
                  disabled={!importInput.trim()}
                >
                  Import metrics
                </button>
              </div>
            </>
          )}
        </>
      )}

      {activeView === "pinterest" && (
        <div className="bw-ig-setup">
          <h3>Pinterest Analytics</h3>
          <p className="sub">Track Pin impressions, saves, outbound clicks, and top-performing boards.</p>
          <div style={{ background: "var(--card-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <b>Coming soon:</b> Pinterest analytics require OAuth2 with Pinterest API v5.
          </div>
          <button className="bw-btn" disabled>Connect Pinterest (coming soon)</button>
        </div>
      )}

      {activeView === "stories" && (
        <div className="bw-ig-setup">
          <h3>Story Analytics</h3>
          <p className="sub">Track Instagram Story reach, replies, taps forward/back, and exits for the last 14 days.</p>
          <div style={{ background: "var(--card-2)", border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>
            <b>Requires:</b> Instagram API connection with <code>instagram_manage_insights</code> permission.
          </div>
          {igToken && igAccountId ? (
            <button className="bw-btn" onClick={() => {
              fetch("/api/instagram-analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: igToken, action: "stories", igAccountId }),
              }).then((r) => r.json()).then((d) => {
                if (d.error) alert("Stories error: " + d.error);
                else alert("Story data: " + JSON.stringify(d).slice(0, 200));
              });
            }}>
              Sync Stories
            </button>
          ) : (
            <button className="bw-btn ghost" onClick={() => setTab("Settings")}>Connect Instagram first →</button>
          )}
        </div>
      )}
    </>
  );
}

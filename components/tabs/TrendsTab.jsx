"use client";
import React from "react";
import { timeAgo } from "../../lib/utils";

export default function TrendsTab({
  trends,
  trendLastRun,
  busy,
  err,
  activeKey,
  setTab,
  runTrendDiscovery,
  copy,
  setTopicFromTrend,
}) {
  function parseTrends(text) {
    if (!text) return [];
    const blocks = text.split(/\n(?=TREND \d+:|TREND:)/i).filter(Boolean);
    if (blocks.length < 2) return null;
    return blocks.map((b) => {
      const lines = b.split("\n").filter((l) => l.trim());
      const title = (lines[0] || "").replace(/^TREND \d+:|^TREND:/i, "").trim();
      const body = lines.slice(1).join("\n").trim();
      const scoreMatch = body.match(/OPPORTUNITY[:\s]+(HIGH|MEDIUM|LOW)/i);
      const formatMatch = body.match(/FORMAT[:\s]+([^\n]+)/i);
      const score = scoreMatch ? scoreMatch[1].toUpperCase() : "MEDIUM";
      const format = formatMatch ? formatMatch[1].trim() : "";
      return { title, body, score, format };
    });
  }

  const parsed = parseTrends(trends);

  return (
    <>
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
          Trend Intelligence
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 14, lineHeight: 1.6 }}>
          AI scans the journaling, self-development, gifting, and zodiac niches to find content
          opportunities before they peak. Run weekly before planning your content calendar.
          {trendLastRun && (
            <span style={{ color: "var(--muted)", marginLeft: 8 }}>
              Last run {timeAgo(trendLastRun)}.
            </span>
          )}
        </div>
        {!activeKey && (
          <div className="bw-insight" style={{ marginBottom: 12 }}>
            No API key —{" "}
            <button className="bw-edit" onClick={() => setTab("Settings")}>
              add it in Settings →
            </button>
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="bw-btn"
            onClick={runTrendDiscovery}
            disabled={busy === "trends" || !activeKey}
          >
            {busy === "trends" ? "Scanning niches…" : trends ? "Refresh trends →" : "Discover trends →"}
          </button>
          {trends && (
            <button className="bw-btn ghost sm" onClick={() => copy(trends)}>
              Copy all
            </button>
          )}
        </div>
      </div>

      {busy === "trends" && (
        <div className="bw-load">
          <div className="bw-spin" />
          Scanning journaling, gifting, and zodiac niches…
        </div>
      )}

      {err && <div className="bw-note" style={{ color: "var(--rose)", marginBottom: 12 }}>{err}</div>}

      {trends && !parsed && (
        <div className="bw-out">{trends}</div>
      )}

      {parsed && parsed.length > 0 && (
        <>
          <div style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 16, marginBottom: 14, color: "var(--ink-2)" }}>
            {parsed.length} trend opportunities found
          </div>
          <div className="bw-grid">
            {parsed.map((t, i) => (
              <div
                className="bw-trend-card"
                key={i}
                style={{ animationDelay: i * 60 + "ms" }}
              >
                <span className={"tscore" + (t.score === "MEDIUM" ? " medium" : "")}>
                  {t.score === "HIGH" ? "▲ High opportunity" : t.score === "LOW" ? "▼ Low" : "● Medium"}
                </span>
                <div className="ttitle">{t.title}</div>
                <div className="tdesc">{t.body}</div>
                {t.format && (
                  <span className="tformat">{t.format}</span>
                )}
                <div className="bw-cardbtns">
                  <button
                    className="bw-mini go"
                    onClick={() => {
                      setTopicFromTrend(t.title);
                      setTab("Create");
                    }}
                  >
                    Use in Create →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!trends && !busy && (
        <div className="bw-empty">
          <div className="big">No trend data yet</div>
          Hit "Discover trends" above — the AI finds what's growing in your niche right now.
        </div>
      )}
    </>
  );
}

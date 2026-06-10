"use client";
import React from "react";

export default function CoachTab({ coach, busy, err, activeKey, setTab, runCoach, copy, brandBrain }) {
  const insightCount = brandBrain?.learningMemory?.length || 0;
  const personaCount = brandBrain?.personas?.length || 0;
  const hasBrain = personaCount > 0 || insightCount > 0;

  return (
    <>
      {!activeKey && (
        <div className="bw-insight" style={{ marginBottom: 16 }}>
          No API key —{" "}
          <button className="bw-edit" onClick={() => setTab("Settings")}>add it in Settings →</button>
        </div>
      )}

      <div className="bw-coach-header">
        <div>
          <div className="bw-coach-title">Growth Coach</div>
          <div className="bw-coach-sub">
            Reads your Playbook, every measured post, Brand Brain, and follower progress — tells you what to fix and exactly what to post next.
          </div>
        </div>
        {hasBrain && (
          <div className="bw-coach-brain-badge">
            <span className="bw-ai-dot" />
            Brand Brain — {personaCount} persona{personaCount !== 1 ? "s" : ""}, {insightCount} insight{insightCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="bw-row" style={{ marginTop: 4 }}>
        <button className="bw-btn" onClick={runCoach} disabled={busy === "coach"}>
          {busy === "coach" ? "Auditing…" : "Audit & advise me →"}
        </button>
      </div>

      {busy === "coach" && (
        <div className="bw-load">
          <div className="bw-spin" />Reviewing Trox performance with full brand context…
        </div>
      )}

      {!busy && !coach && (
        <div className="bw-empty">
          <div className="big">Ready to coach you</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <div className="bw-coach-checklist-item">
              <span className={hasBrain ? "bw-check-on" : "bw-check-off"}>{hasBrain ? "✓" : "○"}</span>
              Brand Brain — {hasBrain ? `${personaCount} personas, ${insightCount} insights loaded` : "add personas and insights in Brand Brain tab for richer advice"}
            </div>
            <div className="bw-coach-checklist-item">
              <span className="bw-check-off">○</span>
              Measured posts — log results in Posts tab to get specific improvement advice
            </div>
          </div>
        </div>
      )}

      {coach && (
        <div className="bw-out">
          <button className="bw-copy" onClick={() => copy(coach)}>copy</button>
          {coach}
        </div>
      )}
    </>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { upcomingMoments } from "../../lib/brand-brain";
import { computePillarMix } from "../../lib/brand-brain";

export default function CommandCenterTab({
  brandBrain,
  igAccount,
  posts,
  calendarPosts,
  priorities,
  prioritiesLoading,
  weekSummary,
  refreshPriorities,
  setActiveTab,
}) {
  const brain   = brandBrain || {};
  const pillars = brain.pillars || [];
  const moments = brain.seasonalMoments || [];
  const next    = upcomingMoments(moments, 60);
  const mix     = computePillarMix(posts || [], pillars);

  const urgencyColor = { high: "#D4806E", medium: "#C9A86C", low: "#6DC48B" };
  const urgencyLabel = { high: "Urgent", medium: "This week", low: "When ready" };

  return (
    <div className="bw-cmd">
      {/* Header row */}
      <div className="bw-cmd-header">
        <div>
          <div className="bw-cmd-title">Command Center</div>
          <div className="bw-cmd-sub">
            {weekSummary || "Your AI brand manager is ready."}
          </div>
        </div>
        <button className="bw-btn sm" onClick={refreshPriorities} disabled={prioritiesLoading}>
          {prioritiesLoading ? "Analysing…" : "↻ Refresh"}
        </button>
      </div>

      {/* Stat chips */}
      <div className="bw-cmd-chips">
        {igAccount?.followers_count && (
          <div className="bw-cmd-chip">
            <div className="val">{(igAccount.followers_count / 1000).toFixed(1)}K</div>
            <div className="lbl">followers</div>
          </div>
        )}
        <div className="bw-cmd-chip">
          <div className="val">{(calendarPosts || []).length}</div>
          <div className="lbl">scheduled</div>
        </div>
        <div className="bw-cmd-chip">
          <div className="val">{(posts || []).length}</div>
          <div className="lbl">total posts</div>
        </div>
        {next.length > 0 && (
          <div className="bw-cmd-chip highlight">
            <div className="val">{next[0].daysAway}d</div>
            <div className="lbl">to {next[0].label}</div>
          </div>
        )}
      </div>

      {/* AI Priorities */}
      <div className="bw-cmd-section">
        <div className="bw-cmd-label">
          <span className="bw-ai-dot" /> Today&apos;s Priorities
        </div>
        {prioritiesLoading && (
          <div className="bw-load"><div className="bw-spin" /> Assembling your priorities…</div>
        )}
        {!prioritiesLoading && (!priorities || priorities.length === 0) && (
          <div className="bw-cmd-empty">
            Click Refresh to get your AI-assembled priorities for today.
          </div>
        )}
        {priorities && priorities.map((p, i) => (
          <div className="bw-priority-card" key={i} style={{ animationDelay: i * 80 + "ms" }}>
            <div className="bw-priority-left">
              <span className="bw-priority-emoji">{p.emoji}</span>
            </div>
            <div className="bw-priority-body">
              <div className="bw-priority-tag" style={{ color: urgencyColor[p.urgency] }}>
                {urgencyLabel[p.urgency]}
              </div>
              <div className="bw-priority-title">{p.title}</div>
              <div className="bw-priority-text">{p.body}</div>
            </div>
            <button
              className="bw-btn sm"
              onClick={() => setActiveTab(p.tab)}
            >
              {p.cta} →
            </button>
          </div>
        ))}
      </div>

      {/* Pillar Mix Health */}
      <div className="bw-cmd-section">
        <div className="bw-cmd-label">Content Mix Health</div>
        <div className="bw-mix-grid">
          {mix.map((p) => (
            <div className="bw-mix-row" key={p.id}>
              <div className="bw-mix-label">{p.label}</div>
              <div className="bw-mix-bar-bg">
                <div
                  className="bw-mix-bar-fill"
                  style={{ width: `${Math.min(100, p.actual)}%`, background: p.color }}
                />
                <div
                  className="bw-mix-bar-target"
                  style={{ left: `${p.target}%` }}
                />
              </div>
              <div className="bw-mix-nums">
                <span style={{ color: p.color }}>{p.actual}%</span>
                <span className="bw-mix-target">/{p.target}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Seasonal Moments */}
      {next.length > 0 && (
        <div className="bw-cmd-section">
          <div className="bw-cmd-label">Upcoming Moments</div>
          <div className="bw-season-list">
            {next.slice(0, 4).map((m) => (
              <div className="bw-season-row" key={m.id}>
                <div className="bw-season-days">
                  <span>{m.daysAway}</span>
                  <span>days</span>
                </div>
                <div className="bw-season-body">
                  <div className="bw-season-name">{m.label}</div>
                  <div className="bw-season-desc">{m.description}</div>
                </div>
                <button
                  className="bw-mini"
                  onClick={() => setActiveTab("Create")}
                >
                  Create →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

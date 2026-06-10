"use client";
import React, { useState } from "react";
import { channelLabel } from "../../lib/constants";

export default function PostsTab({
  posts,
  savePosts,
  logOpen,
  setLogOpen,
  logForm,
  setLogForm,
  busy,
  submitLog,
  copy,
  brandBrain,
  updatePostPillar,
  refreshPostEngagement,
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterPillar, setFilterPillar] = useState("all");

  const pillars    = brandBrain?.pillars || [];
  const pillarById = {};
  pillars.forEach((p) => { pillarById[p.id] = p; });

  // Build unique channel list from posts
  const usedChannels = [...new Set(posts.map((p) => p.channel).filter(Boolean))];

  const filtered = posts.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterChannel !== "all" && p.channel !== filterChannel) return false;
    if (filterPillar !== "all" && p.pillar !== filterPillar) return false;
    return true;
  });

  const counts = {
    all:       posts.length,
    planned:   posts.filter((p) => p.status === "planned").length,
    published: posts.filter((p) => p.status === "published").length,
    posted:    posts.filter((p) => p.status === "posted").length,
  };

  function openLog(p) {
    setLogOpen(p.id);
    setLogForm({ reach: "", likes: "", comments: "", saves: "", shares: "", follows: "", notes: "" });
  }

  const pillarsWithCount = pillars.map((p) => ({
    ...p,
    count: posts.filter((x) => x.pillar === p.id).length,
  }));

  const unpillagedCount = posts.filter((p) => !p.pillar).length;

  return (
    <>
      {/* Filter Bar */}
      <div className="bw-posts-filterbar">
        <div className="bw-posts-filters">
          {[
            { k: "all",       label: `All (${counts.all})` },
            { k: "planned",   label: `Planned (${counts.planned})` },
            { k: "published", label: `Published (${counts.published})` },
            { k: "posted",    label: `Measured (${counts.posted})` },
          ].map(({ k, label }) => (
            <button
              key={k}
              className={`bw-posts-filter${filterStatus === k ? " on" : ""}`}
              onClick={() => setFilterStatus(k)}
            >
              {label}
            </button>
          ))}
        </div>

        {usedChannels.length > 1 && (
          <div className="bw-posts-filters">
            <button className={`bw-posts-filter sm${filterChannel === "all" ? " on" : ""}`} onClick={() => setFilterChannel("all")}>All channels</button>
            {usedChannels.map((ch) => (
              <button key={ch} className={`bw-posts-filter sm${filterChannel === ch ? " on" : ""}`} onClick={() => setFilterChannel(ch)}>
                {channelLabel(ch)}
              </button>
            ))}
          </div>
        )}

        {pillars.length > 0 && (
          <div className="bw-posts-filters">
            <button className={`bw-posts-filter sm${filterPillar === "all" ? " on" : ""}`} onClick={() => setFilterPillar("all")}>
              All pillars
            </button>
            {pillarsWithCount.map((p) => (
              <button
                key={p.id}
                className={`bw-posts-filter sm${filterPillar === p.id ? " on" : ""}`}
                style={filterPillar === p.id ? { borderColor: p.color, color: p.color } : {}}
                onClick={() => setFilterPillar(p.id)}
              >
                {p.label.split(" ")[0]} ({p.count})
              </button>
            ))}
            {unpillagedCount > 0 && (
              <button
                className={`bw-posts-filter sm${filterPillar === "none" ? " on" : ""}`}
                onClick={() => setFilterPillar("none")}
              >
                Untagged ({unpillagedCount})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pillar tagging nudge */}
      {unpillagedCount > 0 && pillars.length > 0 && (
        <div className="bw-posts-nudge">
          <span className="bw-posts-nudge-icon">◈</span>
          {unpillagedCount} post{unpillagedCount !== 1 ? "s" : ""} have no pillar tag — assign pillars so your Calendar mix health gauge works.
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bw-empty">
          <div className="big">
            {posts.length === 0 ? "No posts yet" : "No posts match this filter"}
          </div>
          {posts.length === 0
            ? "Build content in Create and save it here."
            : "Try a different filter above."}
        </div>
      )}

      <div className="bw-grid">
        {filtered.map((p) => {
          const pillar      = pillarById[p.pillar];
          const pillarColor = pillar?.color;

          return (
            <div
              className="bw-card"
              key={p.id}
              style={pillarColor ? { borderLeft: `3px solid ${pillarColor}` } : {}}
            >
              <div className="bw-meta">
                <span className="bw-fmt">{p.type}</span>
                <span className="bw-fmt" style={{ color: "var(--ink-2)", background: "var(--card-2)", borderColor: "var(--line)" }}>
                  {channelLabel(p.channel)}
                </span>
                <span className={"bw-status " + p.status}>
                  {p.status === "posted" ? "✓ measured" : p.status === "published" ? "↑ live" : "planned"}
                </span>
                {p.scheduledDate && p.status !== "posted" && (
                  <span className="bw-sched-badge">📅 {p.scheduledDate}</span>
                )}
              </div>

              <h4>{p.title}</h4>
              <div className="bw-postbody">{p.content}</div>

              {/* Pillar picker */}
              {pillars.length > 0 && (
                <div className="bw-pillar-picker">
                  <span className="bw-pillar-picker-label">Pillar</span>
                  <select
                    className="bw-select xs"
                    value={p.pillar || ""}
                    onChange={(e) => updatePostPillar(p.id, e.target.value)}
                    style={pillarColor ? { color: pillarColor, borderColor: pillarColor + "55" } : {}}
                  >
                    <option value="">— untagged</option>
                    {pillars.map((pl) => (
                      <option key={pl.id} value={pl.id}>{pl.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Mock engagement for published posts */}
              {p.status === "published" && p.mockEngagement && (
                <div className="bw-mock-eng">
                  <div className="bw-mock-eng-stat">
                    <span className="v">{p.mockEngagement.likes || 0}</span>
                    <span className="l">likes</span>
                  </div>
                  <div className="bw-mock-eng-stat">
                    <span className="v">{p.mockEngagement.comments || 0}</span>
                    <span className="l">comments</span>
                  </div>
                  <div className="bw-mock-eng-stat">
                    <span className="v">{p.mockEngagement.saves || 0}</span>
                    <span className="l">saves</span>
                  </div>
                  <div className="bw-mock-eng-stat">
                    <span className="v">{p.mockEngagement.reach || 0}</span>
                    <span className="l">reach</span>
                  </div>
                </div>
              )}

              {p.insight && <div className="bw-insight">{p.insight}</div>}

              {p.status === "planned" && logOpen !== p.id && (
                <div className="bw-cardbtns">
                  <button className="bw-mini go" onClick={() => openLog(p)}>Log results</button>
                  <button className="bw-mini" onClick={() => copy(p.content)}>Copy</button>
                  <button className="bw-mini" onClick={() => savePosts(posts.filter((x) => x.id !== p.id))}>Delete</button>
                </div>
              )}

              {p.status === "published" && (
                <div className="bw-cardbtns">
                  <button className="bw-mini go" onClick={() => openLog(p)}>Log results</button>
                  {refreshPostEngagement && p.publishedId && (
                    <button className="bw-mini" onClick={() => refreshPostEngagement(p)}>↻ Engagement</button>
                  )}
                  <button className="bw-mini" onClick={() => copy(p.content)}>Copy</button>
                  <button className="bw-mini" onClick={() => savePosts(posts.filter((x) => x.id !== p.id))}>Delete</button>
                </div>
              )}

              {logOpen === p.id && (
                <div>
                  <div className="bw-metricgrid">
                    {[
                      ["reach", "Reach"],
                      ["likes", "Likes"],
                      ["comments", "Comments"],
                      ["saves", "Saves"],
                      ["shares", "Shares"],
                      ["follows", "New followers"],
                    ].map(([k, lbl]) => (
                      <div key={k}>
                        <span className="bw-mlabel">{lbl}</span>
                        <input
                          className="bw-min"
                          type="number"
                          value={logForm[k] || ""}
                          onChange={(e) => setLogForm({ ...logForm, [k]: e.target.value })}
                        />
                      </div>
                    ))}
                  </div>
                  <span className="bw-mlabel" style={{ marginTop: 8 }}>Notes</span>
                  <input
                    className="bw-min"
                    value={logForm.notes || ""}
                    onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
                    placeholder="e.g. lots of DM shares from gift-buyers"
                  />
                  <div className="bw-cardbtns">
                    <button className="bw-mini go" onClick={() => submitLog(p)} disabled={busy === "log_" + p.id}>
                      {busy === "log_" + p.id ? "Learning…" : "Save & learn"}
                    </button>
                    <button className="bw-mini" onClick={() => setLogOpen(null)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

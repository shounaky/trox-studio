"use client";
import React from "react";
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
}) {
  function openLog(p) {
    setLogOpen(p.id);
    setLogForm({ reach: "", likes: "", comments: "", saves: "", shares: "", follows: "", notes: "" });
  }

  return (
    <>
      {posts.length === 0 && (
        <div className="bw-empty">
          <div className="big">No posts yet</div>
          Build content in Create and save it here. After posting, log results so the AI learns.
        </div>
      )}
      <div className="bw-grid">
        {posts.map((p) => (
          <div className="bw-card" key={p.id}>
            <div className="bw-meta">
              <span className="bw-fmt">{p.type}</span>
              <span
                className="bw-fmt"
                style={{
                  color: "var(--ink-2)",
                  background: "var(--card-2)",
                  borderColor: "var(--line)",
                }}
              >
                {channelLabel(p.channel)}
              </span>
              <span className={"bw-status " + p.status}>
                {p.status === "posted" ? "✓ measured" : "planned"}
              </span>
              {p.scheduledDate && p.status !== "posted" && (
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--gold)",
                    fontWeight: 700,
                    padding: "3px 8px",
                    background: "#fdf3e3",
                    borderRadius: 999,
                    border: "1px solid var(--gold-soft)",
                  }}
                >
                  📅 {p.scheduledDate}
                </span>
              )}
            </div>
            <h4>{p.title}</h4>
            <div className="bw-postbody">{p.content}</div>
            {p.insight && <div className="bw-insight">{p.insight}</div>}
            {p.status === "planned" && logOpen !== p.id && (
              <div className="bw-cardbtns">
                <button className="bw-mini go" onClick={() => openLog(p)}>
                  Log results
                </button>
                <button className="bw-mini" onClick={() => copy(p.content)}>
                  Copy
                </button>
                <button
                  className="bw-mini"
                  onClick={() => savePosts(posts.filter((x) => x.id !== p.id))}
                >
                  Delete
                </button>
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
                        onChange={(e) =>
                          setLogForm({ ...logForm, [k]: e.target.value })
                        }
                      />
                    </div>
                  ))}
                </div>
                <span className="bw-mlabel" style={{ marginTop: 8 }}>
                  Notes
                </span>
                <input
                  className="bw-min"
                  value={logForm.notes || ""}
                  onChange={(e) =>
                    setLogForm({ ...logForm, notes: e.target.value })
                  }
                  placeholder="e.g. lots of DM shares from gift-buyers"
                />
                <div className="bw-cardbtns">
                  <button
                    className="bw-mini go"
                    onClick={() => submitLog(p)}
                    disabled={busy === "log_" + p.id}
                  >
                    {busy === "log_" + p.id ? "Learning…" : "Save & learn"}
                  </button>
                  <button className="bw-mini" onClick={() => setLogOpen(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

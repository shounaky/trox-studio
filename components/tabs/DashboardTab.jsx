"use client";
import React from "react";

export default function DashboardTab({
  posts,
  withData,
  followers,
  saveFollowers,
  playbook,
  totalFollows,
  bestSaves,
  pct,
  gained,
  n,
  s,
  goal,
  weeklyReport,
  weeklyReportDate,
  genWeeklyReport,
  busy,
  copy,
}) {
  const timeAgoStr = (ts) => {
    if (!ts) return null;
    const d = Math.floor((Date.now() - ts) / 86400000);
    return d === 0 ? "today" : d === 1 ? "yesterday" : `${d}d ago`;
  };

  return (
    <>
      <div className="bw-goal">
        <div className="bw-goalhead">
          <div className="bw-goalnum">
            +{gained.toLocaleString()}{" "}
            <small>/ 3,000 new followers</small>
          </div>
          <div style={{ color: "var(--ink-2)", fontSize: 12.5 }}>
            {n
              ? `${n.toLocaleString()} now → ${goal.toLocaleString()} goal`
              : "add your numbers below"}
          </div>
        </div>
        <div className="bw-bar">
          <div className="bw-fill" style={{ width: pct + "%" }} />
        </div>
        <div className="bw-goalfoot">
          <div>
            <span className="bw-mlabel">Starting followers</span>
            <input
              className="bw-input bw-smallin"
              type="number"
              value={followers.start}
              placeholder="9107"
              onChange={(e) => saveFollowers({ ...followers, start: e.target.value })}
            />
          </div>
          <div>
            <span className="bw-mlabel">Followers now</span>
            <input
              className="bw-input bw-smallin"
              type="number"
              value={followers.now}
              placeholder="9200"
              onChange={(e) => saveFollowers({ ...followers, now: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="bw-tiles">
        <div className="bw-tile">
          <div className="n">{posts.length}</div>
          <div className="l">Content made</div>
        </div>
        <div className="bw-tile">
          <div className="n">{withData.length}</div>
          <div className="l">Posts measured</div>
        </div>
        <div className="bw-tile">
          <div className="n">{totalFollows.toLocaleString()}</div>
          <div className="l">Follows from posts</div>
        </div>
        <div className="bw-tile">
          <div className="n">{bestSaves.toLocaleString()}</div>
          <div className="l">Best saves</div>
        </div>
      </div>

      <div className="bw-playbook" style={{ marginBottom: 16 }}>
        <h3>
          The Playbook <em>· AI living memory</em>
        </h3>
        <div className="sub">
          Rewritten every time you log results. Survives AI provider switches.
        </div>
        <div className={"body" + (playbook ? "" : " empty")}>
          {playbook ||
            "Empty for now. Create content, post it, log results in Posts — the AI builds Trox's growth playbook here."}
        </div>
      </div>

      <div className="bw-report-card">
        <h3>Weekly Performance Report</h3>
        <div className="sub">
          AI-generated summary of this week's activity, wins, and next steps.
          {weeklyReportDate ? ` Last generated ${timeAgoStr(weeklyReportDate)}.` : " Not generated yet."}
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: weeklyReport ? 12 : 0 }}>
          <button
            className="bw-btn sm"
            onClick={genWeeklyReport}
            disabled={busy === "weekly_report"}
          >
            {busy === "weekly_report" ? "Generating…" : weeklyReport ? "Regenerate report" : "Generate report →"}
          </button>
          {weeklyReport && (
            <button className="bw-btn sm ghost" onClick={() => copy(weeklyReport)}>
              Copy
            </button>
          )}
        </div>
        {busy === "weekly_report" && (
          <div className="bw-load" style={{ padding: "16px 0 0" }}>
            <div className="bw-spin" />
            Reviewing this week's performance…
          </div>
        )}
        {weeklyReport && !busy && (
          <div className="bw-out" style={{ marginTop: 0 }}>
            {weeklyReport}
          </div>
        )}
      </div>
    </>
  );
}

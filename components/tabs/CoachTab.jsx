"use client";
import React from "react";

export default function CoachTab({ coach, busy, err, activeKey, setTab, runCoach, copy }) {
  return (
    <>
      {!activeKey && (
        <div className="bw-insight" style={{ marginBottom: 16 }}>
          No API key —{" "}
          <button className="bw-edit" onClick={() => setTab("Settings")}>
            add it in Settings →
          </button>
        </div>
      )}
      <div className="bw-row">
        <button
          className="bw-btn"
          onClick={runCoach}
          disabled={busy === "coach"}
        >
          {busy === "coach" ? "Auditing…" : "Audit & advise me"}
        </button>
      </div>
      {busy === "coach" && (
        <div className="bw-load">
          <div className="bw-spin" />
          Reviewing Trox performance…
        </div>
      )}
      {!busy && !coach && (
        <div className="bw-empty">
          <div className="big">Your growth coach</div>
          Reads your Playbook, every measured post, and follower progress — tells you what to fix
          and next 3 posts to make.
        </div>
      )}
      {coach && (
        <div className="bw-out">
          <button className="bw-copy" onClick={() => copy(coach)}>
            copy
          </button>
          {coach}
        </div>
      )}
    </>
  );
}

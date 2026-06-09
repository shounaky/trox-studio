"use client";
import React from "react";
import { timeAgo } from "../../lib/utils";

export default function CompetitionTab({
  competitors,
  compInput,
  setCompInput,
  compAnalysis,
  busy,
  err,
  addCompetitor,
  removeCompetitor,
  fetchCompetitor,
  genCompAnalysis,
  copy,
}) {
  return (
    <>
      <div className="bw-comp-add">
        <input
          className="bw-input"
          placeholder="@competitorhandle"
          value={compInput}
          onChange={(e) => setCompInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addCompetitor(); }}
        />
        <button
          className="bw-btn sm"
          onClick={addCompetitor}
          disabled={!compInput.trim() || (busy.startsWith("comp_") && !busy.includes("analysis"))}
        >
          {busy.startsWith("comp_") && !busy.includes("analysis") ? "Fetching…" : "Track"}
        </button>
      </div>

      {competitors.length === 0 && (
        <div className="bw-empty">
          <div className="big">No competitors tracked yet</div>
          Add any Instagram handle above — the app fetches their follower count, post count and
          bio. Then run gap analysis.
        </div>
      )}

      {competitors.length > 0 && (
        <>
          <div className="bw-compgrid">
            {competitors.map((c, i) => (
              <div
                className="bw-compcard"
                key={c.username}
                style={{ animationDelay: i * 50 + "ms", opacity: c.loading ? 0.6 : 1 }}
              >
                <div className="handle">@{c.username}</div>
                <div className="name">
                  {c.loading
                    ? "Fetching…"
                    : c.displayName !== c.username
                    ? c.displayName
                    : c.username}
                </div>
                {!c.loading && !c.error && (c.followers || c.posts) && (
                  <div className="bw-compstats">
                    {c.followers && (
                      <div className="bw-compstat">
                        <div className="val">{c.followers}</div>
                        <div className="lbl">followers</div>
                      </div>
                    )}
                    {c.posts && (
                      <div className="bw-compstat">
                        <div className="val">{c.posts}</div>
                        <div className="lbl">posts</div>
                      </div>
                    )}
                  </div>
                )}
                {c.bio && (
                  <div className="bw-compbio">
                    {c.bio.slice(0, 120)}
                    {c.bio.length > 120 ? "…" : ""}
                  </div>
                )}
                {c.error && (
                  <div className="bw-comperr">
                    Could not fetch — Instagram may have blocked. Try Refresh.
                  </div>
                )}
                <div className="bw-compfooter">
                  <span className="bw-comptime">
                    {c.fetchedAt ? timeAgo(c.fetchedAt) : ""}
                  </span>
                  <div className="bw-compbtns">
                    <button
                      className="bw-mini"
                      onClick={() => fetchCompetitor(c.username)}
                      disabled={!!busy}
                    >
                      ↻
                    </button>
                    <button
                      className="bw-mini"
                      onClick={() => removeCompetitor(c.username)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bw-gap-section">
            <h3>Gap Analysis</h3>
            <div className="sub">
              AI compares Trox vs every tracked competitor — finds gaps and your fastest moves.
            </div>
            <div className="bw-row">
              <button
                className="bw-btn"
                onClick={genCompAnalysis}
                disabled={busy === "comp_analysis"}
              >
                {busy === "comp_analysis" ? "Analysing…" : "Analyse the gap →"}
              </button>
            </div>
            {busy === "comp_analysis" && (
              <div className="bw-load">
                <div className="bw-spin" />
                Reading the competitive landscape…
              </div>
            )}
            {compAnalysis && (
              <div className="bw-out">
                <button className="bw-copy" onClick={() => copy(compAnalysis)}>
                  copy
                </button>
                {compAnalysis}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

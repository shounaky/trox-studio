"use client";
import React, { useState } from "react";
import { CHANNELS, FORMATS, COLLECTIONS, PILLARS, SIGNS, ANGLES, channelLabel } from "../../lib/constants";

const REPURPOSE_PLATFORMS = ["Instagram", "Pinterest", "LinkedIn", "X (Twitter)", "Threads"];

export default function CreateTab({
  channel, setChannel,
  collection, setCollection,
  theme, setTheme,
  sign, setSign,
  angle, setAngle,
  topic, setTopic,
  format, setFormat,
  ideas, setIdeas,
  draftContent, setDraftContent,
  imageBrief, setImageBrief,
  busy,
  err,
  activeKey,
  setTab,
  genIdeas,
  buildContent,
  saveDraft,
  genImageBrief,
  scheduleAndPublish,
  copy,
  // Hook Lab
  hooks,
  hooksLoading,
  genHooks,
  // Voice Check
  voiceResult,
  voiceChecking,
  checkVoice,
  // Repurpose
  repurposeText, setRepurposeText,
  repurposePlatforms, setRepurposePlatforms,
  repurposed, repurposing, doRepurpose,
}) {
  const [showRepurpose, setShowRepurpose] = useState(false);

  const useIdea = (it) => {
    setTopic(it.title);
    if (FORMATS[channel]?.includes(it.format)) setFormat(it.format);
    setDraftContent(null);
    setImageBrief("");
  };

  const toggleRepPlatform = (pl) => {
    const has = (repurposePlatforms || []).includes(pl);
    setRepurposePlatforms(has
      ? repurposePlatforms.filter((p) => p !== pl)
      : [...(repurposePlatforms || []), pl]);
  };

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

      {/* Channel Selector */}
      <div className="bw-channels">
        {CHANNELS.map((c) => (
          <button
            key={c.id}
            className={"bw-chan" + (channel === c.id ? " on" : "")}
            onClick={() => {
              setChannel(c.id);
              setFormat(FORMATS[c.id][0]);
              setIdeas([]);
              setDraftContent(null);
              setImageBrief("");
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Builder Controls */}
      <div className="bw-builder">
        <select className="bw-select" value={collection} onChange={(e) => setCollection(e.target.value)}>
          {COLLECTIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        {(collection === "Legacy" || collection === "Life Pillar") && (
          <select className="bw-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            {PILLARS.map((p) => <option key={p}>{p}</option>)}
          </select>
        )}
        {collection === "Zodiac" && (
          <select className="bw-select" value={sign} onChange={(e) => setSign(e.target.value)}>
            {SIGNS.map((sg) => <option key={sg}>{sg}</option>)}
          </select>
        )}
        <select className="bw-select" value={angle} onChange={(e) => setAngle(e.target.value)}>
          {ANGLES.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>

      {/* Idea Generation */}
      <div className="bw-row">
        <input
          className="bw-input"
          placeholder="Optional extra angle or topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button className="bw-btn ghost" onClick={genIdeas} disabled={busy === "ideas"}>
          {busy === "ideas" ? "…" : "Idea me 5"}
        </button>
      </div>

      {busy === "ideas" && (
        <div className="bw-load"><div className="bw-spin" />Scoping ideas for {channelLabel(channel)}…</div>
      )}

      {ideas.length > 0 && (
        <>
          <div className="bw-grid">
            {ideas.map((it, i) => (
              <div className="bw-card" key={i} style={{ animationDelay: i * 55 + "ms" }}>
                <div className="bw-meta">
                  <span className="bw-fmt">{it.format}</span>
                  <span className={"bw-perf " + (String(it.performance).toLowerCase() === "high" ? "high" : "medium")}>
                    {String(it.performance).toLowerCase() === "high" ? "▲ High" : "● Med"}
                  </span>
                </div>
                <h4>{it.title}</h4>
                <div className="bw-hook">"{it.hook}"</div>
                <div className="bw-why">{it.why}</div>
                <div className="bw-cardbtns">
                  <button className="bw-mini go" onClick={() => useIdea(it)}>Use this →</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bw-note">Estimates blend format, brand fit and your Playbook.</div>
        </>
      )}

      {/* Format + Build */}
      <div className="bw-row" style={{ marginTop: 22 }}>
        <select className="bw-select" value={format} onChange={(e) => setFormat(e.target.value)}>
          {(FORMATS[channel] || FORMATS.instagram).map((f) => <option key={f}>{f}</option>)}
        </select>
        <button className="bw-btn" onClick={buildContent} disabled={busy === "build"}>
          {busy === "build" ? "Crafting…" : "Build the " + format}
        </button>
      </div>

      {busy === "build" && (
        <div className="bw-load"><div className="bw-spin" />Crafting your {format}…</div>
      )}

      {/* Draft Output */}
      {draftContent && (
        <>
          <div className="bw-out mono">
            <button className="bw-copy" onClick={() => copy(draftContent.content)}>copy</button>
            {draftContent.content}
          </div>
          <div className="bw-draftbar">
            <button className="bw-btn" onClick={saveDraft}>Save to Posts →</button>
            <button className="bw-btn ghost" onClick={buildContent}>Regenerate</button>
            {scheduleAndPublish && (
              <button
                className="bw-btn ghost"
                onClick={scheduleAndPublish}
                disabled={busy === "publish"}
              >
                {busy === "publish" ? "Publishing…" : "Publish to Instagram"}
              </button>
            )}
          </div>

          {/* Voice Check */}
          {checkVoice && (
            <div className="bw-voice-check">
              <div className="bw-voice-check-row">
                <span className="bw-voice-check-label">Voice Check</span>
                {voiceResult && (
                  <span className={`bw-voice-badge ${voiceResult.pass ? "pass" : "fail"}`}>
                    {voiceResult.pass ? "✓" : "✗"} {voiceResult.score}/10 — {voiceResult.summary}
                  </span>
                )}
                <button
                  className="bw-mini"
                  onClick={() => checkVoice(draftContent.content)}
                  disabled={voiceChecking}
                >
                  {voiceChecking ? "Checking…" : voiceResult ? "Re-check" : "Check Voice"}
                </button>
              </div>
              {voiceResult && !voiceResult.pass && voiceResult.issues?.length > 0 && (
                <div className="bw-voice-issues">
                  {voiceResult.issues.map((issue, i) => (
                    <div className="bw-voice-issue" key={i}>
                      <span className="bw-voice-issue-flag">⚑ {issue}</span>
                      {voiceResult.suggestions?.[i] && (
                        <span className="bw-voice-issue-fix">→ {voiceResult.suggestions[i]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hook Lab */}
          {genHooks && (
            <div className="bw-hook-lab">
              <div className="bw-hook-lab-header">
                <div className="bw-hook-lab-title">Hook Lab</div>
                <button
                  className="bw-mini"
                  onClick={() => genHooks(draftContent.content)}
                  disabled={hooksLoading}
                >
                  {hooksLoading ? "Generating…" : hooks?.length ? "Regenerate" : "Generate 5 Hooks →"}
                </button>
              </div>
              {hooksLoading && (
                <div className="bw-load"><div className="bw-spin" />Crafting scroll-stopping openers…</div>
              )}
              {hooks?.length > 0 && (
                <div className="bw-hook-cards">
                  {hooks.map((h, i) => (
                    <div className="bw-hook-card" key={i} style={{ animationDelay: i * 60 + "ms" }}>
                      <div className="bw-hook-card-top">
                        <span className="bw-hook-style">{h.style}</span>
                        <span className="bw-hook-score">{h.score}/10</span>
                      </div>
                      <div className="bw-hook-text">&ldquo;{h.hook}&rdquo;</div>
                      <div className="bw-hook-why">{h.why}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Image Brief */}
          <div className="bw-image-brief-section">
            <div className="bw-brief-title">Image Brief</div>
            <div className="bw-brief-sub">
              AI art direction for your photographer or Canva designer.
            </div>
            <button
              className="bw-btn sm ghost"
              onClick={genImageBrief}
              disabled={busy === "image_brief"}
            >
              {busy === "image_brief" ? "Writing brief…" : "Generate Image Brief →"}
            </button>
            {busy === "image_brief" && (
              <div className="bw-load" style={{ paddingTop: 12, paddingBottom: 0 }}>
                <div className="bw-spin" />Composing art direction…
              </div>
            )}
            {imageBrief && (
              <div className="bw-brief-out">
                <button className="bw-copy" style={{ position: "static", float: "right" }} onClick={() => copy(imageBrief)}>
                  copy
                </button>
                {imageBrief}
              </div>
            )}
          </div>
        </>
      )}

      {/* Repurpose Engine */}
      <div className="bw-repurpose">
        <button
          className="bw-repurpose-toggle"
          onClick={() => setShowRepurpose((v) => !v)}
        >
          {showRepurpose ? "▾" : "▸"} Repurpose Engine
          <span className="bw-repurpose-sub">Paste any content → native versions for every platform</span>
        </button>

        {showRepurpose && (
          <div className="bw-repurpose-body">
            <textarea
              className="bw-textarea"
              rows={5}
              placeholder="Paste a blog post, product description, customer review, or any long-form content here…"
              value={repurposeText || ""}
              onChange={(e) => setRepurposeText(e.target.value)}
            />
            <div className="bw-repurpose-platforms">
              <div className="bw-repurpose-pl-label">Generate for:</div>
              {REPURPOSE_PLATFORMS.map((pl) => (
                <button
                  key={pl}
                  className={`bw-chan sm${(repurposePlatforms || []).includes(pl) ? " on" : ""}`}
                  onClick={() => toggleRepPlatform(pl)}
                >
                  {pl}
                </button>
              ))}
            </div>
            <button
              className="bw-btn"
              onClick={doRepurpose}
              disabled={repurposing || !repurposeText?.trim() || !(repurposePlatforms?.length)}
            >
              {repurposing ? "Repurposing…" : "Repurpose →"}
            </button>
            {repurposing && (
              <div className="bw-load"><div className="bw-spin" />Creating native content for each platform…</div>
            )}
            {repurposed?.versions?.length > 0 && (
              <div className="bw-repurposed-list">
                {repurposed.versions.map((v, i) => (
                  <div className="bw-repurposed-card" key={i}>
                    <div className="bw-repurposed-platform">{v.platform}</div>
                    <div className="bw-repurposed-notes">{v.notes}</div>
                    <div className="bw-repurposed-content">
                      <button className="bw-copy" onClick={() => copy(v.content)}>copy</button>
                      {v.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

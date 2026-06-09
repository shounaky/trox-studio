"use client";
import React from "react";
import { CHANNELS, FORMATS, COLLECTIONS, PILLARS, SIGNS, ANGLES, channelLabel } from "../../lib/constants";

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
}) {
  const useIdea = (it) => {
    setTopic(it.title);
    if (FORMATS[channel].includes(it.format)) setFormat(it.format);
    setDraftContent(null);
    setImageBrief("");
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

      <div className="bw-builder">
        <select
          className="bw-select"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
        >
          {COLLECTIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        {(collection === "Legacy" || collection === "Life Pillar") && (
          <select
            className="bw-select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {PILLARS.map((p) => <option key={p}>{p}</option>)}
          </select>
        )}
        {collection === "Zodiac" && (
          <select
            className="bw-select"
            value={sign}
            onChange={(e) => setSign(e.target.value)}
          >
            {SIGNS.map((sg) => <option key={sg}>{sg}</option>)}
          </select>
        )}
        <select
          className="bw-select"
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
        >
          {ANGLES.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>

      <div className="bw-row">
        <input
          className="bw-input"
          placeholder="Optional extra angle or topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          className="bw-btn ghost"
          onClick={genIdeas}
          disabled={busy === "ideas"}
        >
          {busy === "ideas" ? "…" : "Idea me 5"}
        </button>
      </div>

      {busy === "ideas" && (
        <div className="bw-load">
          <div className="bw-spin" />
          Scoping ideas for {channelLabel(channel)}…
        </div>
      )}

      {ideas.length > 0 && (
        <>
          <div className="bw-grid">
            {ideas.map((it, i) => (
              <div
                className="bw-card"
                key={i}
                style={{ animationDelay: i * 55 + "ms" }}
              >
                <div className="bw-meta">
                  <span className="bw-fmt">{it.format}</span>
                  <span
                    className={
                      "bw-perf " +
                      (String(it.performance).toLowerCase() === "high"
                        ? "high"
                        : "medium")
                    }
                  >
                    {String(it.performance).toLowerCase() === "high"
                      ? "▲ High"
                      : "● Med"}
                  </span>
                </div>
                <h4>{it.title}</h4>
                <div className="bw-hook">"{it.hook}"</div>
                <div className="bw-why">{it.why}</div>
                <div className="bw-cardbtns">
                  <button className="bw-mini go" onClick={() => useIdea(it)}>
                    Use this →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bw-note">
            Estimates blend format, brand fit and your Playbook.
          </div>
        </>
      )}

      <div className="bw-row" style={{ marginTop: 22 }}>
        <select
          className="bw-select"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          {FORMATS[channel].map((f) => <option key={f}>{f}</option>)}
        </select>
        <button
          className="bw-btn"
          onClick={buildContent}
          disabled={busy === "build"}
        >
          {busy === "build" ? "Crafting…" : "Build the " + format}
        </button>
      </div>

      {busy === "build" && (
        <div className="bw-load">
          <div className="bw-spin" />
          Crafting your {format}…
        </div>
      )}

      {draftContent && (
        <>
          <div className="bw-out mono">
            <button className="bw-copy" onClick={() => copy(draftContent.content)}>
              copy
            </button>
            {draftContent.content}
          </div>
          <div className="bw-draftbar">
            <button className="bw-btn" onClick={saveDraft}>
              Save to Posts →
            </button>
            <button className="bw-btn ghost" onClick={buildContent}>
              Regenerate
            </button>
            {scheduleAndPublish && (
              <button
                className="bw-btn ghost"
                onClick={scheduleAndPublish}
                disabled={busy === "publish"}
                title="Requires Instagram Graph API connection with publish permission"
              >
                {busy === "publish" ? "Publishing…" : "Publish to Instagram"}
              </button>
            )}
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "16px",
              marginTop: 16,
            }}
          >
            <div
              style={{
                fontFamily: "'Fraunces'",
                fontWeight: 600,
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              Image Brief
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 12 }}>
              AI art direction for your photographer or Canva designer — exact
              composition, props, lighting, colour palette.
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
                <div className="bw-spin" />
                Composing art direction…
              </div>
            )}
            {imageBrief && (
              <>
                <div className="bw-brief-out">
                  <button
                    className="bw-copy"
                    style={{ position: "static", float: "right" }}
                    onClick={() => copy(imageBrief)}
                  >
                    copy
                  </button>
                  {imageBrief}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

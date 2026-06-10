"use client";
import React, { useState } from "react";
import { upcomingMoments } from "../../lib/brand-brain";

export default function BrandBrainTab({ brandBrain, saveBrandBrain, addInsight }) {
  const brain = brandBrain || {};
  const [activeSection, setActiveSection] = useState("personas");
  const [newInsight, setNewInsight] = useState("");
  const [newGoodVoice, setNewGoodVoice] = useState("");
  const [newBadVoice, setNewBadVoice] = useState("");

  const personas        = brain.personas        || [];
  const pillars         = brain.pillars         || [];
  const seasonalMoments = brain.seasonalMoments || [];
  const learningMemory  = brain.learningMemory  || [];
  const voiceExamples   = brain.voiceExamples   || { good: [], avoid: [] };

  const next = upcomingMoments(seasonalMoments, 120);

  function updatePillarTarget(id, val) {
    const updated = pillars.map((p) =>
      p.id === id ? { ...p, target: Math.max(0, Math.min(100, parseInt(val) || 0)) } : p
    );
    saveBrandBrain({ ...brain, pillars: updated });
  }

  function handleAddInsight() {
    if (!newInsight.trim()) return;
    addInsight(newInsight.trim());
    setNewInsight("");
  }

  function addGoodVoice() {
    if (!newGoodVoice.trim()) return;
    saveBrandBrain({
      ...brain,
      voiceExamples: {
        ...voiceExamples,
        good: [...(voiceExamples.good || []), newGoodVoice.trim()],
      },
    });
    setNewGoodVoice("");
  }

  function addBadVoice() {
    if (!newBadVoice.trim()) return;
    saveBrandBrain({
      ...brain,
      voiceExamples: {
        ...voiceExamples,
        avoid: [...(voiceExamples.avoid || []), newBadVoice.trim()],
      },
    });
    setNewBadVoice("");
  }

  function removeGood(i) {
    const good = [...(voiceExamples.good || [])];
    good.splice(i, 1);
    saveBrandBrain({ ...brain, voiceExamples: { ...voiceExamples, good } });
  }

  function removeBad(i) {
    const avoid = [...(voiceExamples.avoid || [])];
    avoid.splice(i, 1);
    saveBrandBrain({ ...brain, voiceExamples: { ...voiceExamples, avoid } });
  }

  function removeInsight(id) {
    saveBrandBrain({
      ...brain,
      learningMemory: learningMemory.filter((m) => m.id !== id),
    });
  }

  const sections = ["personas", "pillars", "voice", "seasons", "memory"];
  const sectionLabels = {
    personas: "Personas",
    pillars:  "Pillars",
    voice:    "Voice",
    seasons:  "Calendar",
    memory:   "Learning",
  };

  return (
    <div className="bw-brain">
      <div className="bw-brain-header">
        <div className="bw-brain-title">Brand Brain</div>
        <div className="bw-brain-sub">The knowledge layer that makes every AI output feel like Trox.</div>
      </div>

      <div className="bw-brain-nav">
        {sections.map((s) => (
          <button
            key={s}
            className={`bw-brain-navbtn${activeSection === s ? " on" : ""}`}
            onClick={() => setActiveSection(s)}
          >
            {sectionLabels[s]}
          </button>
        ))}
      </div>

      {/* PERSONAS */}
      {activeSection === "personas" && (
        <div className="bw-brain-section">
          <div className="bw-brain-section-title">Who you&apos;re writing for</div>
          <div className="bw-persona-grid">
            {personas.map((p) => (
              <div className="bw-persona-card" key={p.id}>
                <div className="bw-persona-emoji">{p.emoji}</div>
                <div className="bw-persona-name">{p.name}</div>
                <div className="bw-persona-desc">{p.description}</div>
                <div className="bw-persona-meta">
                  <div className="bw-persona-platforms">
                    {p.platforms?.map((pl) => (
                      <span className="bw-persona-pill" key={pl}>{pl}</span>
                    ))}
                  </div>
                  <div className="bw-persona-triggers">
                    <span className="bw-brain-label">Triggers</span>
                    {p.triggers?.map((t) => (
                      <span className="bw-trigger-pill" key={t}>{t}</span>
                    ))}
                  </div>
                  <div className="bw-persona-pains">
                    <span className="bw-brain-label">Pain Points</span>
                    {p.painPoints?.map((pp, i) => (
                      <span className="bw-pain-item" key={i}>• {pp}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PILLARS */}
      {activeSection === "pillars" && (
        <div className="bw-brain-section">
          <div className="bw-brain-section-title">Content pillar targets</div>
          <div className="bw-pillar-note">Adjust the percentage each pillar should occupy in your overall content mix.</div>
          <div className="bw-pillar-list">
            {pillars.map((p) => (
              <div className="bw-pillar-row" key={p.id}>
                <div className="bw-pillar-dot" style={{ background: p.color }} />
                <div className="bw-pillar-name">{p.label}</div>
                <div className="bw-pillar-slider-wrap">
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={p.target}
                    className="bw-pillar-slider"
                    onChange={(e) => updatePillarTarget(p.id, e.target.value)}
                    style={{ "--fill": p.color }}
                  />
                </div>
                <div className="bw-pillar-pct" style={{ color: p.color }}>{p.target}%</div>
              </div>
            ))}
          </div>
          <div className="bw-pillar-total">
            Total: {pillars.reduce((s, p) => s + p.target, 0)}%
            {pillars.reduce((s, p) => s + p.target, 0) !== 100 && (
              <span className="bw-pillar-warn"> (should add to 100%)</span>
            )}
          </div>
        </div>
      )}

      {/* VOICE */}
      {activeSection === "voice" && (
        <div className="bw-brain-section">
          <div className="bw-brain-section-title">Voice & Tone</div>
          <div className="bw-voice-cols">
            <div className="bw-voice-col">
              <div className="bw-voice-col-title good">✓ Write like this</div>
              {(voiceExamples.good || []).map((ex, i) => (
                <div className="bw-voice-example good" key={i}>
                  <span className="bw-voice-text">&ldquo;{ex}&rdquo;</span>
                  <button className="bw-voice-del" onClick={() => removeGood(i)}>×</button>
                </div>
              ))}
              <div className="bw-voice-add">
                <input
                  className="bw-input sm"
                  placeholder="Add a good voice example…"
                  value={newGoodVoice}
                  onChange={(e) => setNewGoodVoice(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addGoodVoice(); }}
                />
                <button className="bw-mini" onClick={addGoodVoice}>Add</button>
              </div>
            </div>

            <div className="bw-voice-col">
              <div className="bw-voice-col-title bad">✗ Never write like this</div>
              {(voiceExamples.avoid || []).map((ex, i) => (
                <div className="bw-voice-example bad" key={i}>
                  <span className="bw-voice-text">&ldquo;{ex}&rdquo;</span>
                  <button className="bw-voice-del" onClick={() => removeBad(i)}>×</button>
                </div>
              ))}
              <div className="bw-voice-add">
                <input
                  className="bw-input sm"
                  placeholder="Add a bad voice example…"
                  value={newBadVoice}
                  onChange={(e) => setNewBadVoice(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addBadVoice(); }}
                />
                <button className="bw-mini" onClick={addBadVoice}>Add</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEASONAL CALENDAR */}
      {activeSection === "seasons" && (
        <div className="bw-brain-section">
          <div className="bw-brain-section-title">Seasonal Content Calendar</div>
          <div className="bw-pillar-note">Upcoming moments your brand should own.</div>
          <div className="bw-season-cards">
            {next.map((m) => (
              <div className="bw-season-card" key={m.id}>
                <div className="bw-season-card-days">
                  <div className="big">{m.daysAway}</div>
                  <div>days</div>
                </div>
                <div className="bw-season-card-body">
                  <div className="bw-season-card-label">{m.label}</div>
                  <div className="bw-season-card-cat">{m.category === "india" ? "🇮🇳 India" : "🌍 Global"}</div>
                  <div className="bw-season-card-desc">{m.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEARNING MEMORY */}
      {activeSection === "memory" && (
        <div className="bw-brain-section">
          <div className="bw-brain-section-title">Learning Memory</div>
          <div className="bw-pillar-note">Insights that shape AI output. The AI reads these when generating content.</div>
          <div className="bw-memory-add">
            <input
              className="bw-input"
              placeholder="e.g. Reels with journaling prompts get 2× saves vs product-only content"
              value={newInsight}
              onChange={(e) => setNewInsight(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddInsight(); }}
            />
            <button className="bw-btn sm" onClick={handleAddInsight}>+ Add Insight</button>
          </div>
          {learningMemory.length === 0 && (
            <div className="bw-empty">
              No insights yet. Add what you&apos;ve learned about what works — the AI will use it.
            </div>
          )}
          <div className="bw-memory-list">
            {[...learningMemory].reverse().map((m) => (
              <div className="bw-memory-item" key={m.id}>
                <div className="bw-memory-text">{m.text}</div>
                <div className="bw-memory-meta">
                  <span>{m.source}</span>
                  <span>{new Date(m.addedAt).toLocaleDateString("en-IN")}</span>
                </div>
                <button className="bw-voice-del" onClick={() => removeInsight(m.id)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

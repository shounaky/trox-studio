"use client";
import React, { useState } from "react";
import { channelLabel } from "../../lib/constants";
import { dateStr } from "../../lib/utils";
import { computePillarMix } from "../../lib/brand-brain";

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDow = (first.getDay() + 6) % 7; // Mon=0
  const days = [];
  for (let i = 0; i < startDow; i++) {
    const d = new Date(year, month, 1 - startDow + i);
    days.push({ date: d, current: false });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: new Date(year, month, d), current: true });
  }
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: new Date(year, month + 1, i), current: false });
  }
  return days;
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DOW = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function CalendarTab({
  posts,
  schedule,
  calendarYear,
  calendarMonth,
  setCalendarYear,
  setCalendarMonth,
  schedulePost,
  unschedulePost,
  calendarPlan,
  genCalendarPlan,
  busy,
  setTab,
  copy,
  brandBrain,
  publishPost,
  publishLoading,
  // Series Builder
  seriesBriefs,
  seriesBusy,
  genContentSeries,
  addSeriesToPosts,
}) {
  const [pickerOpen, setPickerOpen] = useState(null);
  const [pickerDate, setPickerDate] = useState("");
  const [showSeries, setShowSeries] = useState(false);
  const [seriesTheme, setSeriesTheme] = useState("");
  const [seriesCount, setSeriesCount] = useState(4);
  const [seriesPillar, setSeriesPillar] = useState("");

  const today    = dateStr(new Date());
  const days     = buildMonthGrid(calendarYear, calendarMonth);
  const pillars  = brandBrain?.pillars || [];

  const pillarById = {};
  pillars.forEach((p) => { pillarById[p.id] = p; });

  const scheduleByDate = {};
  Object.entries(schedule || {}).forEach(([postId, ds]) => {
    if (!scheduleByDate[ds]) scheduleByDate[ds] = [];
    scheduleByDate[ds].push(postId);
  });

  // Posts scheduled this month for mix health
  const thisMonthPrefix = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}`;
  const thisMonthPosts  = Object.entries(schedule || {})
    .filter(([, ds]) => ds.startsWith(thisMonthPrefix))
    .map(([id]) => posts.find((p) => p.id === id))
    .filter(Boolean);
  const mixData = computePillarMix(thisMonthPosts, pillars);

  function prevMonth() {
    if (calendarMonth === 0) { setCalendarYear(calendarYear - 1); setCalendarMonth(11); }
    else setCalendarMonth(calendarMonth - 1);
  }
  function nextMonth() {
    if (calendarMonth === 11) { setCalendarYear(calendarYear + 1); setCalendarMonth(0); }
    else setCalendarMonth(calendarMonth + 1);
  }
  function goToday() {
    const n = new Date();
    setCalendarYear(n.getFullYear());
    setCalendarMonth(n.getMonth());
  }

  const unscheduledPosts = posts.filter(
    (p) => p.status === "planned" && !(schedule && schedule[p.id])
  );

  function confirmSchedule(postId) {
    if (!pickerDate) return;
    schedulePost(postId, pickerDate);
    setPickerOpen(null);
    setPickerDate("");
  }

  return (
    <>
      {/* Calendar Header */}
      <div className="bw-cal-header">
        <div className="bw-cal-nav">
          <button className="bw-btn sm ghost" onClick={prevMonth}>←</button>
          <span className="bw-cal-title">{MONTH_NAMES[calendarMonth]} {calendarYear}</span>
          <button className="bw-btn sm ghost" onClick={goToday}>Today</button>
          <button className="bw-btn sm ghost" onClick={nextMonth}>→</button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="bw-btn sm" onClick={genCalendarPlan} disabled={busy === "calendar_plan"}>
            {busy === "calendar_plan" ? "Planning…" : "AI fill gaps →"}
          </button>
          <button className="bw-btn sm ghost" onClick={() => setTab("Create")}>+ New post</button>
        </div>
      </div>

      {/* Mix Health Gauge */}
      {pillars.length > 0 && (
        <div className="bw-cal-mix">
          <div className="bw-cal-mix-label">
            {MONTH_NAMES[calendarMonth]} mix — {thisMonthPosts.length} post{thisMonthPosts.length !== 1 ? "s" : ""}
          </div>
          <div className="bw-cal-mix-bars">
            {mixData.map((p) => (
              <div className="bw-cal-mix-row" key={p.id}>
                <div className="bw-cal-mix-name">{p.label.split(" ")[0]}</div>
                <div className="bw-cal-mix-bar-bg">
                  <div
                    className="bw-cal-mix-bar-fill"
                    style={{ width: `${Math.min(100, p.actual)}%`, background: p.color }}
                  />
                  <div className="bw-cal-mix-bar-target" style={{ left: `${p.target}%` }} />
                </div>
                <span style={{ color: p.delta > 5 ? "#6DC48B" : p.delta < -5 ? "#D4806E" : "var(--ink-2)", fontSize: 11 }}>
                  {p.actual}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div style={{ overflowX: "auto" }}>
        <table className="bw-cal-grid">
          <thead>
            <tr>{DOW.map((d) => <th key={d}>{d}</th>)}</tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, wi) => (
              <tr key={wi}>
                {days.slice(wi * 7, wi * 7 + 7).map((cell, di) => {
                  const ds       = dateStr(cell.date);
                  const isToday  = ds === today;
                  const dayPosts = (scheduleByDate[ds] || [])
                    .map((id) => posts.find((p) => p.id === id))
                    .filter(Boolean);
                  return (
                    <td
                      key={di}
                      className={
                        "bw-cal-day" +
                        (isToday ? " today" : "") +
                        (!cell.current ? " other-month" : "")
                      }
                    >
                      <div className="dn">{cell.date.getDate()}</div>
                      {dayPosts.map((p) => {
                        const pillarColor = pillarById[p.pillar]?.color;
                        return (
                          <span
                            key={p.id}
                            className={"bw-cal-pill " + p.status}
                            title={p.title}
                            onClick={() => unschedulePost(p.id)}
                            style={{
                              cursor: "pointer",
                              ...(pillarColor ? { borderLeft: `3px solid ${pillarColor}` } : {}),
                            }}
                          >
                            {p.type} · {p.title.slice(0, 16)}
                          </span>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {busy === "calendar_plan" && (
        <div className="bw-load"><div className="bw-spin" />Building your content plan for {MONTH_NAMES[calendarMonth]}…</div>
      )}

      {calendarPlan && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "'Fraunces'", fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>
              AI Content Plan
            </span>
            <button className="bw-copy" style={{ position: "static", float: "none" }} onClick={() => copy(calendarPlan)}>
              copy
            </button>
          </div>
          <div className="bw-out">{calendarPlan}</div>
        </div>
      )}

      {/* Content Series Builder */}
      <div className="bw-series-builder">
        <button
          className="bw-series-toggle"
          onClick={() => setShowSeries((v) => !v)}
        >
          {showSeries ? "▾" : "▸"} Plan a Content Series
          <span className="bw-series-sub">Generate a multi-post campaign from a single brief</span>
        </button>

        {showSeries && (
          <div className="bw-series-body">
            <div className="bw-series-form">
              <div className="bw-series-field">
                <label className="bw-field-label">Series Theme</label>
                <input
                  className="bw-input"
                  placeholder="e.g. Diwali gifting — 5 reasons to journal this season"
                  value={seriesTheme}
                  onChange={(e) => setSeriesTheme(e.target.value)}
                />
              </div>
              <div className="bw-series-row">
                <div className="bw-series-field sm">
                  <label className="bw-field-label">Posts</label>
                  <select
                    className="bw-select xs"
                    value={seriesCount}
                    onChange={(e) => setSeriesCount(+e.target.value)}
                  >
                    {[2, 3, 4, 5, 6, 8].map((n) => (
                      <option key={n} value={n}>{n} posts</option>
                    ))}
                  </select>
                </div>
                {(brandBrain?.pillars || []).length > 0 && (
                  <div className="bw-series-field sm">
                    <label className="bw-field-label">Pillar</label>
                    <select
                      className="bw-select xs"
                      value={seriesPillar}
                      onChange={(e) => setSeriesPillar(e.target.value)}
                    >
                      <option value="">— any —</option>
                      {(brandBrain?.pillars || []).map((p) => (
                        <option key={p.id} value={p.id}>{p.label.split(" ")[0]}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <button
                className="bw-btn"
                onClick={() => genContentSeries && genContentSeries(seriesTheme, seriesCount, seriesPillar)}
                disabled={seriesBusy || !seriesTheme.trim()}
              >
                {seriesBusy ? "Planning series…" : "Generate Series Plan →"}
              </button>
            </div>

            {seriesBusy && (
              <div className="bw-load"><div className="bw-spin" />Designing your {seriesCount}-post series…</div>
            )}

            {seriesBriefs && (
              <div className="bw-series-result">
                <div className="bw-series-result-header">
                  <div>
                    <div className="bw-series-name">{seriesBriefs.seriesName}</div>
                    <div className="bw-series-hook">{seriesBriefs.seriesHook}</div>
                  </div>
                  <button
                    className="bw-btn sm ok"
                    onClick={() => addSeriesToPosts && addSeriesToPosts(seriesBriefs, seriesPillar)}
                  >
                    Add all to Posts →
                  </button>
                </div>
                <div className="bw-series-posts">
                  {(seriesBriefs.posts || []).map((p) => (
                    <div className="bw-series-post" key={p.number}>
                      <div className="bw-series-post-num">{p.number}</div>
                      <div className="bw-series-post-body">
                        <div className="bw-series-post-fmt">{p.format}</div>
                        <div className="bw-series-post-title">{p.title}</div>
                        <div className="bw-series-post-hook">&ldquo;{p.hook}&rdquo;</div>
                        <div className="bw-series-post-meta">{p.angle} · CTA: {p.cta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Unscheduled Queue */}
      <div className="bw-cal-unscheduled">
        <h3>
          Unscheduled ({unscheduledPosts.length})
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 400, marginLeft: 8, fontFamily: "'Mulish'" }}>
            Click a post to schedule · click a calendar pill to unschedule
          </span>
        </h3>
        {unscheduledPosts.length === 0 ? (
          <div className="bw-empty" style={{ paddingTop: 24 }}>
            <div className="big" style={{ fontSize: 16 }}>All posts scheduled</div>
            Build more content in Create to fill next month.
          </div>
        ) : (
          <div className="bw-grid">
            {unscheduledPosts.map((p) => {
              const pillarColor = pillarById[p.pillar]?.color;
              return (
                <div className="bw-card" key={p.id} style={pillarColor ? { borderTop: `2px solid ${pillarColor}` } : {}}>
                  <div className="bw-meta">
                    <span className="bw-fmt">{p.type}</span>
                    <span className="bw-fmt" style={{ color: "var(--ink-2)", background: "var(--card-2)", borderColor: "var(--line)" }}>
                      {channelLabel(p.channel)}
                    </span>
                    {p.pillar && pillarColor && (
                      <span className="bw-fmt" style={{ color: pillarColor, borderColor: pillarColor + "44" }}>
                        {pillarById[p.pillar]?.label.split(" ")[0]}
                      </span>
                    )}
                  </div>
                  <h4>{p.title}</h4>
                  <div className="bw-postbody">{p.content}</div>
                  <div className="bw-cardbtns">
                    {pickerOpen === p.id ? (
                      <>
                        <input
                          type="date"
                          className="bw-min"
                          value={pickerDate}
                          min={today}
                          onChange={(e) => setPickerDate(e.target.value)}
                          style={{ width: "auto" }}
                        />
                        <button className="bw-mini go" onClick={() => confirmSchedule(p.id)} disabled={!pickerDate}>
                          Schedule
                        </button>
                        <button className="bw-mini" onClick={() => setPickerOpen(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="bw-mini go" onClick={() => { setPickerOpen(p.id); setPickerDate(""); }}>
                          Schedule →
                        </button>
                        {publishPost && (
                          <button
                            className="bw-mini"
                            onClick={() => publishPost(p)}
                            disabled={publishLoading === p.id}
                          >
                            {publishLoading === p.id ? "Publishing…" : "Publish"}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

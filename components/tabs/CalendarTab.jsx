"use client";
import React, { useState } from "react";
import { channelLabel } from "../../lib/constants";
import { dateStr } from "../../lib/utils";

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
}) {
  const [pickerOpen, setPickerOpen] = useState(null); // postId being scheduled
  const [pickerDate, setPickerDate] = useState("");

  const today = dateStr(new Date());
  const days = buildMonthGrid(calendarYear, calendarMonth);

  const scheduleByDate = {};
  Object.entries(schedule || {}).forEach(([postId, ds]) => {
    if (!scheduleByDate[ds]) scheduleByDate[ds] = [];
    scheduleByDate[ds].push(postId);
  });

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
      <div className="bw-cal-header">
        <div className="bw-cal-nav">
          <button className="bw-btn sm ghost" onClick={prevMonth}>←</button>
          <span className="bw-cal-title">
            {MONTH_NAMES[calendarMonth]} {calendarYear}
          </span>
          <button className="bw-btn sm ghost" onClick={goToday}>Today</button>
          <button className="bw-btn sm ghost" onClick={nextMonth}>→</button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="bw-btn sm"
            onClick={genCalendarPlan}
            disabled={busy === "calendar_plan"}
          >
            {busy === "calendar_plan" ? "Planning…" : "AI fill gaps →"}
          </button>
          <button
            className="bw-btn sm ghost"
            onClick={() => setTab("Create")}
          >
            + New post
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="bw-cal-grid">
          <thead>
            <tr>
              {DOW.map((d) => <th key={d}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: Math.ceil(days.length / 7) }).map((_, wi) => (
              <tr key={wi}>
                {days.slice(wi * 7, wi * 7 + 7).map((cell, di) => {
                  const ds = dateStr(cell.date);
                  const dayPosts = (scheduleByDate[ds] || [])
                    .map((id) => posts.find((p) => p.id === id))
                    .filter(Boolean);
                  const isToday = ds === today;
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
                      {dayPosts.map((p) => (
                        <span
                          key={p.id}
                          className={"bw-cal-pill " + p.status}
                          title={p.title}
                          onClick={() => unschedulePost(p.id)}
                          style={{ cursor: "pointer" }}
                        >
                          {p.type} · {p.title.slice(0, 18)}
                        </span>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {busy === "calendar_plan" && (
        <div className="bw-load">
          <div className="bw-spin" />
          Building your content plan for {MONTH_NAMES[calendarMonth]}…
        </div>
      )}

      {calendarPlan && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "'Fraunces'",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--ink)",
              }}
            >
              AI Content Plan
            </span>
            <button className="bw-copy" style={{ position: "static", float: "none" }} onClick={() => copy(calendarPlan)}>
              copy
            </button>
          </div>
          <div className="bw-out">{calendarPlan}</div>
        </div>
      )}

      <div className="bw-cal-unscheduled">
        <h3>
          Unscheduled ({unscheduledPosts.length})
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 400, marginLeft: 8, fontFamily: "'Mulish'" }}>
            Click a post to schedule it
          </span>
        </h3>
        {unscheduledPosts.length === 0 ? (
          <div className="bw-empty" style={{ paddingTop: 24 }}>
            <div className="big" style={{ fontSize: 16 }}>All posts scheduled</div>
            Build more content in Create to fill next month.
          </div>
        ) : (
          <div className="bw-grid">
            {unscheduledPosts.map((p) => (
              <div className="bw-card" key={p.id}>
                <div className="bw-meta">
                  <span className="bw-fmt">{p.type}</span>
                  <span className="bw-fmt" style={{ color: "var(--ink-2)", background: "var(--card-2)", borderColor: "var(--line)" }}>
                    {channelLabel(p.channel)}
                  </span>
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
                      <button
                        className="bw-mini go"
                        onClick={() => confirmSchedule(p.id)}
                        disabled={!pickerDate}
                      >
                        Schedule
                      </button>
                      <button className="bw-mini" onClick={() => setPickerOpen(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="bw-mini go"
                      onClick={() => { setPickerOpen(p.id); setPickerDate(""); }}
                    >
                      Schedule →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

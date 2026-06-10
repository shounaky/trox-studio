"use client";
import React, { useState } from "react";

const LABEL_META = {
  "hot-lead":  { color: "#D4806E", text: "Hot Lead" },
  lead:         { color: "#C9A86C", text: "Lead" },
  love:         { color: "#6DC48B", text: "Love" },
  general:      { color: "#7BA7F0", text: "General" },
};

const INTENT_LABELS = {
  purchase_inquiry:       "Purchase",
  bulk_inquiry:           "Bulk Order",
  product_question:       "Product Q",
  customisation_inquiry:  "Custom",
  shipping_inquiry:       "Shipping",
  positive_review:        "Review",
  repeat_buyer:           "Repeat",
  engagement:             "Engage",
};

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function InboxTab({
  inboxMessages,
  inboxLoading,
  inboxError,
  drafting,
  draftReply,
  updateInboxMessage,
  refreshInbox,
}) {
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(null);

  const msgs = inboxMessages || [];

  const filtered = filter === "all"
    ? msgs
    : filter === "leads"
    ? msgs.filter((m) => m.lead)
    : msgs.filter((m) => m.label === filter);

  const activeMsg = msgs.find((m) => m.id === activeId);

  const labelCounts = {
    "hot-lead": msgs.filter((m) => m.label === "hot-lead").length,
    lead:       msgs.filter((m) => m.lead && m.label !== "hot-lead").length,
    love:       msgs.filter((m) => m.label === "love").length,
    general:    msgs.filter((m) => m.label === "general").length,
  };

  return (
    <div className="bw-inbox">
      <div className="bw-inbox-header">
        <div>
          <div className="bw-inbox-title">Unified Inbox</div>
          <div className="bw-inbox-sub">AI-triaged comments and DMs across all connected platforms.</div>
        </div>
        <button className="bw-btn sm" onClick={refreshInbox} disabled={inboxLoading}>
          {inboxLoading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>

      {/* Filters */}
      <div className="bw-inbox-filters">
        <button className={`bw-inbox-filter${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>
          All ({msgs.length})
        </button>
        <button className={`bw-inbox-filter hot${filter === "hot-lead" ? " on" : ""}`} onClick={() => setFilter("hot-lead")}>
          Hot Leads ({labelCounts["hot-lead"]})
        </button>
        <button className={`bw-inbox-filter lead${filter === "leads" ? " on" : ""}`} onClick={() => setFilter("leads")}>
          Leads ({labelCounts.lead})
        </button>
        <button className={`bw-inbox-filter love${filter === "love" ? " on" : ""}`} onClick={() => setFilter("love")}>
          Love ({labelCounts.love})
        </button>
      </div>

      {inboxLoading && (
        <div className="bw-load"><div className="bw-spin" /> Loading inbox…</div>
      )}
      {inboxError && <div className="bw-err">{inboxError}</div>}

      <div className="bw-inbox-split">
        {/* Message list */}
        <div className="bw-inbox-list">
          {filtered.length === 0 && !inboxLoading && (
            <div className="bw-empty">No messages in this filter.</div>
          )}
          {filtered.map((m) => {
            const meta = LABEL_META[m.label] || LABEL_META.general;
            return (
              <div
                key={m.id}
                className={`bw-inbox-msg${activeId === m.id ? " active" : ""}${m.replied ? " replied" : ""}`}
                onClick={() => setActiveId(m.id)}
              >
                <div className="bw-inbox-msg-top">
                  <span className="bw-inbox-author">{m.author}</span>
                  <span className="bw-inbox-time">{timeAgo(m.time)}</span>
                </div>
                <div className="bw-inbox-preview">
                  {m.text.length > 90 ? m.text.slice(0, 90) + "…" : m.text}
                </div>
                <div className="bw-inbox-tags">
                  <span className="bw-inbox-label" style={{ color: meta.color, borderColor: meta.color }}>
                    {meta.text}
                  </span>
                  {m.intent && (
                    <span className="bw-inbox-intent">
                      {INTENT_LABELS[m.intent] || m.intent}
                    </span>
                  )}
                  {m.replied && <span className="bw-inbox-replied">✓ Replied</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail pane */}
        <div className="bw-inbox-detail">
          {!activeMsg && (
            <div className="bw-inbox-detail-empty">
              Select a message to reply
            </div>
          )}
          {activeMsg && (
            <>
              <div className="bw-inbox-detail-author">{activeMsg.author}</div>
              <div className="bw-inbox-detail-context">
                On post: <em>{activeMsg.postCaption}</em>
              </div>
              <div className="bw-inbox-detail-msg">&ldquo;{activeMsg.text}&rdquo;</div>

              {activeMsg.draft && (
                <div className="bw-inbox-draft">
                  <div className="bw-inbox-draft-label">AI Draft Reply</div>
                  <textarea
                    className="bw-textarea"
                    value={activeMsg.draft}
                    rows={4}
                    onChange={(e) => updateInboxMessage(activeMsg.id, { draft: e.target.value })}
                  />
                  <div className="bw-inbox-draft-actions">
                    <button
                      className="bw-btn sm"
                      onClick={() => updateInboxMessage(activeMsg.id, { replied: true })}
                    >
                      Mark Sent ✓
                    </button>
                    <button
                      className="bw-mini"
                      onClick={() => draftReply(activeMsg)}
                      disabled={drafting === activeMsg.id}
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {!activeMsg.draft && (
                <button
                  className="bw-btn"
                  onClick={() => draftReply(activeMsg)}
                  disabled={drafting === activeMsg.id}
                >
                  {drafting === activeMsg.id ? "Drafting…" : "Draft AI Reply →"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

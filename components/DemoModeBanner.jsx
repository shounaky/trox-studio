"use client";
import React from "react";

export default function DemoModeBanner({ settings }) {
  const integrations = [
    { label: "Groq AI",     live: !!(settings?.groqKey || settings?.groqApiKey) },
    { label: "Claude AI",   live: !!(settings?.claudeKey || settings?.claudeApiKey) },
    { label: "Instagram",   live: !!(settings?.igSessionId) },
    { label: "Ayrshare",    live: !!(settings?.ayrshareKey) },
  ];

  const liveCount  = integrations.filter((i) => i.live).length;
  const totalCount = integrations.length;

  if (liveCount === totalCount) return null;

  return (
    <div className="bw-demo-banner">
      <span className="bw-demo-icon">◎</span>
      <span className="bw-demo-text">
        Demo mode — {liveCount}/{totalCount} integrations live.{" "}
        {integrations.filter((i) => !i.live).map((i) => i.label).join(", ")} not connected.
      </span>
      <span className="bw-demo-pill">All features work with mock data</span>
    </div>
  );
}

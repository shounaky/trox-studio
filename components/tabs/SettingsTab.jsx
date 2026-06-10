"use client";
import React, { useState } from "react";
import { maskKey } from "../../lib/utils";

const SECTIONS = ["AI", "Instagram", "Publishing", "Developer"];

export default function SettingsTab({
  aiProvider, selectProvider,
  groqKey, claudeKey,
  keyInput, setKeyInput,
  keySaved, saveKey,
  igSessionId, igSessionInput, setIgSessionInput, saveSession,
  igAppId, igAppIdInput, setIgAppIdInput,
  igAppSecret, igAppSecretInput, setIgAppSecretInput,
  igAccount, igError, oauthStarting,
  startInstagramOAuth, disconnectInstagram,
  webhookUrl, setWebhookUrl, saveWebhookUrl,
  apiKey, generateApiKey, revokeApiKey,
}) {
  const [section, setSection] = useState("AI");
  const [showApiKey, setShowApiKey] = useState(false);
  const [ayrshareKey, setAyrshareKey] = useState("");

  return (
    <div className="bw-settings">
      <div className="bw-settings-header">
        <h2>Settings</h2>
        <p className="sub">
          All keys are saved in your browser only — never sent anywhere except the AI provider you choose.
        </p>
      </div>

      {/* Section nav */}
      <div className="bw-settings-nav">
        {SECTIONS.map((s) => (
          <button
            key={s}
            className={`bw-settings-navbtn${section === s ? " on" : ""}`}
            onClick={() => setSection(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── AI Provider ─────────────────────────────────────────────────── */}
      {section === "AI" && (
        <div className="bw-settings-section">
          <div className="bw-section-title">AI Provider</div>
          <p className="bw-section-desc">
            Pick which AI engine powers content generation, the Coach, and all smart features. You
            can save keys for both — switching is instant.
          </p>

          <div className="bw-providers">
            <div
              className={"bw-provider" + (aiProvider === "groq" ? " active" : "")}
              onClick={() => selectProvider("groq")}
            >
              <div className="pname">Groq</div>
              <span className="pbadge free">FREE</span>
              <div className="pdesc">
                Llama 3.3 70B — blazing fast, free forever. No credit card needed.
                Get your key at <b>console.groq.com</b>
              </div>
              {aiProvider === "groq" && <div className="pcheck">✓ Active</div>}
            </div>
            <div
              className={"bw-provider" + (aiProvider === "claude" ? " active" : "")}
              onClick={() => selectProvider("claude")}
            >
              <div className="pname">Claude (Anthropic)</div>
              <span className="pbadge paid">~$3–5/month</span>
              <div className="pdesc">
                Claude Sonnet 4.6 — higher quality outputs, better brand voice adherence.
                Get your key at <b>console.anthropic.com</b>
              </div>
              {aiProvider === "claude" && <div className="pcheck">✓ Active</div>}
            </div>
          </div>

          <div className="bw-keyblock">
            <h4>Groq API Key</h4>
            <div className="kdesc">
              Free at <b>console.groq.com</b> → API Keys → Create API Key. Starts with <b>gsk_</b>.
            </div>
            {groqKey
              ? <div className="bw-keystatus set">✓ Saved: {maskKey(groqKey)}</div>
              : <div className="bw-keystatus unset">Not saved yet</div>}
            <div className="bw-keyrow" style={{ marginTop: 10 }}>
              <input
                className="bw-input"
                type="password"
                placeholder={groqKey ? "Paste new key to replace" : "Paste your gsk_… key"}
                value={keyInput.groq}
                onChange={(e) => setKeyInput({ ...keyInput, groq: e.target.value })}
              />
              <button
                className={"bw-btn sm" + (groqKey ? "" : " ok")}
                onClick={() => saveKey("groq")}
                disabled={!keyInput.groq.trim()}
              >
                {groqKey ? "Replace" : "Save"}
              </button>
            </div>
            {keySaved === "groq" && (
              <div className="bw-savednote">✓ Groq key saved — you're ready to create!</div>
            )}
          </div>

          <div className="bw-keyblock">
            <h4>
              Claude API Key{" "}
              <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}>(optional)</span>
            </h4>
            <div className="kdesc">
              Get it at <b>console.anthropic.com</b> → API Keys. Starts with <b>sk-ant-</b>.
              Select Claude above to activate it.
            </div>
            {claudeKey
              ? <div className="bw-keystatus set">✓ Saved: {maskKey(claudeKey)}</div>
              : <div className="bw-keystatus unset">Not saved yet</div>}
            <div className="bw-keyrow" style={{ marginTop: 10 }}>
              <input
                className="bw-input"
                type="password"
                placeholder={claudeKey ? "Paste new key to replace" : "Paste your sk-ant-… key"}
                value={keyInput.claude}
                onChange={(e) => setKeyInput({ ...keyInput, claude: e.target.value })}
              />
              <button
                className="bw-btn sm"
                onClick={() => saveKey("claude")}
                disabled={!keyInput.claude.trim()}
              >
                {claudeKey ? "Replace" : "Save"}
              </button>
            </div>
            {keySaved === "claude" && <div className="bw-savednote">✓ Claude key saved!</div>}
          </div>
        </div>
      )}

      {/* ── Instagram ───────────────────────────────────────────────────── */}
      {section === "Instagram" && (
        <div className="bw-settings-section">
          <div className="bw-section-title">Instagram</div>
          <p className="bw-section-desc">
            Two ways to connect. Session cookie is the fastest — no developer app needed.
            OAuth gives you the full Instagram Graph API and is required for publishing.
          </p>

          {/* Session cookie */}
          <div className="bw-keyblock">
            <h4>
              Session Cookie{" "}
              <span className="bw-badge-easiest">EASIEST</span>
            </h4>
            <div className="kdesc">
              Pulls posts, likes, comments and reel plays directly. No developer app needed.
              <br /><br />
              <b>How to get it (1 min):</b><br />
              1. Log into instagram.com on desktop<br />
              2. Press <b>F12</b> → Application → Cookies → instagram.com<br />
              3. Find <b>sessionid</b> → double-click its Value → copy it<br />
              4. Paste below
            </div>
            {igSessionId
              ? <div className="bw-keystatus set">✓ Session saved: {maskKey(igSessionId)}</div>
              : <div className="bw-keystatus unset">Not set</div>}
            <div className="bw-keyrow" style={{ marginTop: 10 }}>
              <input
                className="bw-input"
                type="password"
                placeholder={igSessionId ? "Paste new session to replace" : "Paste sessionid value here…"}
                value={igSessionInput}
                onChange={(e) => setIgSessionInput(e.target.value)}
              />
              <button
                className={"bw-btn sm" + (igSessionId ? "" : " ok")}
                onClick={saveSession}
                disabled={!igSessionInput.trim()}
              >
                {igSessionId ? "Replace" : "Save"}
              </button>
            </div>
            {igSessionId && (
              <div className="bw-savednote">✓ Session saved — go to Analytics and hit Sync!</div>
            )}
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
              Session IDs expire when you log out. If Sync fails, paste a fresh one.
            </div>
          </div>

          {/* OAuth */}
          <div className="bw-keyblock">
            <h4>
              Connect via OAuth{" "}
              {igAccount && (
                <span style={{ color: "var(--ok)", fontWeight: 700, fontSize: 12 }}>
                  ✓ @{igAccount.username}
                </span>
              )}
            </h4>
            <div className="kdesc">
              One-time setup. Your Instagram must be a <b>Business or Creator account</b> linked to
              a Facebook Page.
            </div>

            {igError && (
              <div className="bw-error-block">{igError}</div>
            )}

            {igAccount && (
              <div className="bw-ig-connected" style={{ marginBottom: 12 }}>
                <div className="bw-ig-avatar-ph">
                  {(igAccount.username || "T")[0].toUpperCase()}
                </div>
                <div className="info">
                  <div className="handle">✓ @{igAccount.username}</div>
                  <div className="stats">{igAccount.followers_count?.toLocaleString()} followers</div>
                </div>
                <button className="bw-mini" style={{ marginLeft: "auto" }} onClick={disconnectInstagram}>
                  Disconnect
                </button>
              </div>
            )}

            <div className="bw-setup-steps">
              <div className="bw-setup-label">One-time setup (3 steps)</div>
              <div className="bw-ig-step">
                <span className="num">1</span>
                <span>
                  Go to <b>developers.facebook.com</b> → My Apps → Create App → choose <b>Business</b>
                </span>
              </div>
              <div className="bw-ig-step">
                <span className="num">2</span>
                <span>
                  App Settings → Basic → copy <b>App ID</b> and <b>App Secret</b> → paste below
                </span>
              </div>
              <div className="bw-ig-step">
                <span className="num">3</span>
                <span>
                  Instagram → API setup → OAuth Redirect URIs → add:
                  <br />
                  <code className="bw-code-inline">
                    {typeof window !== "undefined" ? window.location.origin : "https://your-domain"}
                    /api/auth/instagram/callback
                  </code>
                </span>
              </div>
            </div>

            <div className="bw-field" style={{ marginBottom: 10 }}>
              <label className="bw-field-label">App ID</label>
              <input
                className="bw-input"
                placeholder={igAppId ? "App ID saved — enter new to update" : "Paste App ID (numbers only)"}
                value={igAppIdInput}
                onChange={(e) => setIgAppIdInput(e.target.value)}
              />
            </div>
            <div className="bw-field" style={{ marginBottom: 14 }}>
              <label className="bw-field-label">App Secret</label>
              <input
                className="bw-input"
                type="password"
                placeholder={igAppSecret ? "App Secret saved — enter new to update" : "Paste App Secret"}
                value={igAppSecretInput}
                onChange={(e) => setIgAppSecretInput(e.target.value)}
              />
            </div>

            <button
              className={"bw-btn" + (igAccount ? " ghost" : "")}
              style={{ width: "100%" }}
              onClick={startInstagramOAuth}
              disabled={
                oauthStarting ||
                (!igAppId && !igAppIdInput.trim()) ||
                (!igAppSecret && !igAppSecretInput.trim())
              }
            >
              {oauthStarting
                ? "Opening Facebook login…"
                : igAccount
                ? "Reconnect Instagram →"
                : "Connect Instagram →"}
            </button>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
              Clicking Connect opens Facebook login in this tab. After you approve, you'll land back
              here with your account connected.
            </div>
          </div>
        </div>
      )}

      {/* ── Publishing ──────────────────────────────────────────────────── */}
      {section === "Publishing" && (
        <div className="bw-settings-section">
          <div className="bw-section-title">Publishing</div>
          <p className="bw-section-desc">
            Connect a publishing API to go live directly from Trox Studio. Currently in preview —
            Ayrshare integration ships next.
          </p>

          <div className="bw-keyblock">
            <h4>
              Ayrshare{" "}
              <span className="bw-badge-soon">COMING SOON</span>
            </h4>
            <div className="kdesc">
              Ayrshare connects to Instagram, LinkedIn, X, Threads and Pinterest with one API key.
              Get your key at <b>app.ayrshare.com</b> → Profile → API Key.
            </div>
            <div className="bw-keyrow" style={{ marginTop: 10 }}>
              <input
                className="bw-input"
                type="password"
                placeholder="Paste Ayrshare API key…"
                value={ayrshareKey}
                onChange={(e) => setAyrshareKey(e.target.value)}
                disabled
              />
              <button className="bw-btn sm" disabled>Save</button>
            </div>
            <div className="bw-coming-soon-note">
              Publishing integration is in development. For now, posts go to Mock Publishing — all
              content is saved locally with simulated engagement so you can plan and measure.
            </div>
          </div>

          <div className="bw-keyblock" style={{ opacity: 0.6 }}>
            <h4>Mock Publishing <span className="bw-badge-active">ACTIVE</span></h4>
            <div className="kdesc">
              All posts published from Calendar are stored locally with simulated engagement data.
              No API key needed. Engagement refreshes automatically as time passes.
            </div>
            <div style={{ fontSize: 12, color: "var(--ok)", fontWeight: 700, marginTop: 8 }}>
              ✓ Mock publishing is always on — no setup required.
            </div>
          </div>
        </div>
      )}

      {/* ── Developer ───────────────────────────────────────────────────── */}
      {section === "Developer" && (
        <div className="bw-settings-section">
          <div className="bw-section-title">Developer</div>
          <p className="bw-section-desc">
            Webhook notifications and API access for connecting Trox Studio to Zapier, Make, or n8n.
          </p>

          <div className="bw-keyblock">
            <h4>Webhook URL</h4>
            <div className="kdesc">
              Trox Studio POSTs a JSON event to this URL whenever a post is saved, results are
              logged, or a weekly report is generated.
            </div>
            <div className="bw-keyrow" style={{ marginTop: 10 }}>
              <input
                className="bw-input"
                type="url"
                placeholder="https://hooks.zapier.com/…"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <button
                className="bw-btn sm ok"
                onClick={saveWebhookUrl}
                disabled={!webhookUrl}
              >
                Save
              </button>
            </div>
            {webhookUrl && (
              <div style={{ fontSize: 11, color: "var(--ok)", fontWeight: 700, marginTop: 6 }}>
                ✓ Webhook active — events will POST to this URL
              </div>
            )}
          </div>

          <div className="bw-keyblock">
            <h4>API Key</h4>
            <div className="kdesc">
              Authenticate programmatic requests to Trox Studio from external services.
              Treat it like a password — do not share it publicly.
            </div>
            {apiKey ? (
              <>
                <div className="bw-apikey-row">
                  <span className="key-lbl">Key</span>
                  <span className="key-val">{showApiKey ? apiKey : maskKey(apiKey)}</span>
                  <button className="bw-mini" onClick={() => setShowApiKey(!showApiKey)}>
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                  <button
                    className="bw-mini"
                    onClick={() => { try { navigator.clipboard.writeText(apiKey); } catch {} }}
                  >
                    Copy
                  </button>
                </div>
                <button
                  className="bw-mini"
                  style={{ marginTop: 8, color: "var(--rose)", borderColor: "var(--rose)" }}
                  onClick={revokeApiKey}
                >
                  Revoke & regenerate
                </button>
              </>
            ) : (
              <button className="bw-btn sm" onClick={generateApiKey} style={{ marginTop: 10 }}>
                Generate API Key →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

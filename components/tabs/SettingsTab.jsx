"use client";
import React, { useState } from "react";
import { maskKey } from "../../lib/utils";

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
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="bw-settings">
      <h2>Settings</h2>
      <p className="sub">
        Your API key is saved in your browser only — never sent anywhere except the AI provider you
        choose. Switching providers never loses your Playbook or posts.
      </p>

      <h3>Choose AI Provider</h3>
      <div className="bw-providers">
        <div
          className={"bw-provider" + (aiProvider === "groq" ? " active" : "")}
          onClick={() => selectProvider("groq")}
        >
          <div className="pname">Groq</div>
          <span className="pbadge free">FREE</span>
          <div className="pdesc">
            Llama 3.3 70B. Blazing fast, free forever. No credit card needed. Get key at
            console.groq.com
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
            Claude Opus 4.5. Higher quality outputs, better brand voice. Get key at
            console.anthropic.com
          </div>
          {aiProvider === "claude" && <div className="pcheck">✓ Active</div>}
        </div>
      </div>

      <div className="bw-keyblock">
        <h4>Groq API Key</h4>
        <div className="kdesc">
          Get it free at <b>console.groq.com</b> → API Keys → Create API Key. Starts with{" "}
          <b>gsk_</b>.
        </div>
        {groqKey && <div className="bw-keystatus set">✓ Key saved: {maskKey(groqKey)}</div>}
        {!groqKey && <div className="bw-keystatus unset">No key saved yet</div>}
        <div className="bw-keyrow" style={{ marginTop: 10 }}>
          <input
            className="bw-input"
            type="password"
            placeholder={groqKey ? "Paste new key to replace" : "Paste your gsk_... key here"}
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
          <div className="bw-savednote">✓ Groq key saved! You can start using the app.</div>
        )}
      </div>

      <div className="bw-keyblock">
        <h4>
          Claude API Key{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: 12 }}>(optional)</span>
        </h4>
        <div className="kdesc">
          Get it at <b>console.anthropic.com</b> → API Keys. Starts with <b>sk-ant-</b>. Switch to
          Claude above to use it.
        </div>
        {claudeKey && <div className="bw-keystatus set">✓ Key saved: {maskKey(claudeKey)}</div>}
        {!claudeKey && <div className="bw-keystatus unset">No key saved yet</div>}
        <div className="bw-keyrow" style={{ marginTop: 10 }}>
          <input
            className="bw-input"
            type="password"
            placeholder={claudeKey ? "Paste new key to replace" : "Paste your sk-ant-... key here"}
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

      <h3 style={{ marginTop: 8 }}>Instagram Live Analytics</h3>

      <div className="bw-keyblock" style={{ marginBottom: 12 }}>
        <h4>
          Session Cookie{" "}
          <span
            style={{
              background: "#dcf5e9",
              color: "#1d6b3e",
              fontSize: 10,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 999,
              marginLeft: 6,
            }}
          >
            EASIEST
          </span>
        </h4>
        <div className="kdesc">
          Gets all posts with likes, comments and video/reel plays. No developer app needed — just
          copy one value from your browser.
          <br />
          <br />
          <b>How to get it (1 min):</b>
          <br />
          1. Log into instagram.com on your desktop browser
          <br />
          2. Press <b>F12</b> → Application tab → Cookies → click instagram.com
          <br />
          3. Find the row named <b>sessionid</b> → double-click its Value → copy it
          <br />
          4. Paste below
        </div>
        {igSessionId && (
          <div className="bw-keystatus set">✓ Session saved: {maskKey(igSessionId)}</div>
        )}
        {!igSessionId && <div className="bw-keystatus unset">Not set</div>}
        <div className="bw-keyrow" style={{ marginTop: 10 }}>
          <input
            className="bw-input"
            type="password"
            placeholder={
              igSessionId ? "Paste new session to replace" : "Paste sessionid value here…"
            }
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
          <div className="bw-savednote">✓ Session saved — go to the Analytics tab and hit Sync!</div>
        )}
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
          Session IDs expire when you log out of Instagram. If Sync fails, just paste a fresh one.
        </div>
      </div>

      <div className="bw-keyblock">
        <h4>
          Connect Instagram{" "}
          {igAccount && (
            <span style={{ color: "var(--ok)", fontWeight: 700, fontSize: 12 }}>
              ✓ @{igAccount.username}
            </span>
          )}
        </h4>
        <div className="kdesc">
          One-time setup — then reconnecting is a single click. Your Instagram must be a{" "}
          <b>Business or Creator account</b> linked to a Facebook Page.
        </div>
        {igError && (
          <div
            style={{
              fontSize: 12,
              color: "var(--rose)",
              marginBottom: 8,
              padding: "8px 10px",
              background: "#fef2f2",
              borderRadius: 8,
            }}
          >
            {igError}
          </div>
        )}
        {igAccount && (
          <div className="bw-ig-connected" style={{ marginBottom: 12 }}>
            <div className="bw-ig-avatar-ph">
              {(igAccount.username || "T")[0].toUpperCase()}
            </div>
            <div className="info">
              <div className="handle">✓ Connected as @{igAccount.username}</div>
              <div className="stats">{igAccount.followers_count?.toLocaleString()} followers</div>
            </div>
            <button
              className="bw-mini"
              style={{ marginLeft: "auto" }}
              onClick={disconnectInstagram}
            >
              Disconnect
            </button>
          </div>
        )}
        <div
          style={{
            background: "var(--card-2)",
            border: "1px solid var(--line)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 800,
              color: "var(--blue)",
              marginBottom: 10,
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            One-time setup (3 steps)
          </div>
          <div className="bw-ig-step">
            <span className="num">1</span>
            <span>
              Go to <b>developers.facebook.com</b> → <b>My Apps</b> → <b>Create App</b> → choose{" "}
              <b>Business</b> → give it any name → Create
            </span>
          </div>
          <div className="bw-ig-step">
            <span className="num">2</span>
            <span>
              Inside your new app → left sidebar → <b>App settings → Basic</b> → copy your{" "}
              <b>App ID</b> and <b>App Secret</b> and paste them below
            </span>
          </div>
          <div className="bw-ig-step">
            <span className="num">3</span>
            <span>
              Still in the app → left sidebar → <b>Instagram → API setup</b> → scroll to{" "}
              <b>OAuth Redirect URIs</b> → add exactly this URL:
              <br />
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  background: "var(--card)",
                  padding: "3px 7px",
                  borderRadius: 5,
                  display: "inline-block",
                  marginTop: 4,
                  wordBreak: "break-all",
                }}
              >
                {typeof window !== "undefined" ? window.location.origin : "https://your-vercel-url"}
                /api/auth/instagram/callback
              </span>
            </span>
          </div>
        </div>
        <div className="bw-field" style={{ marginBottom: 10 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--blue)",
              display: "block",
              marginBottom: 5,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            App ID
          </label>
          <input
            className="bw-input"
            placeholder={igAppId ? "App ID saved — enter new to update" : "Paste App ID (numbers only)"}
            value={igAppIdInput}
            onChange={(e) => setIgAppIdInput(e.target.value)}
          />
        </div>
        <div className="bw-field" style={{ marginBottom: 14 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "var(--blue)",
              display: "block",
              marginBottom: 5,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            App Secret
          </label>
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
          Clicking Connect opens Facebook login in this tab. After you approve, you land back here
          automatically with your account connected.
        </div>
      </div>

      <div className="bw-dev-section">
        <h3>Developer</h3>
        <p className="sub">
          Webhook notifications and API access for connecting Trox Studio to external tools like
          Zapier, Make, or n8n.
        </p>

        <div className="bw-keyblock" style={{ marginBottom: 12 }}>
          <h4>Webhook URL</h4>
          <div className="kdesc">
            Trox Studio will POST a JSON event to this URL whenever a post is saved, results are
            logged, or a weekly report is generated. Compatible with Zapier, Make, and n8n.
          </div>
          <div className="bw-keyrow">
            <input
              className="bw-input"
              type="url"
              placeholder="https://hooks.zapier.com/..."
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
              ✓ Webhook active — events will be sent to this URL
            </div>
          )}
        </div>

        <div className="bw-keyblock">
          <h4>API Key</h4>
          <div className="kdesc">
            Use this key to authenticate programmatic requests to Trox Studio from external
            services. Treat it like a password — do not share it publicly.
          </div>
          {apiKey ? (
            <>
              <div className="bw-apikey-row">
                <span className="key-lbl">Key</span>
                <span className="key-val">
                  {showApiKey ? apiKey : maskKey(apiKey)}
                </span>
                <button
                  className="bw-mini"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
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
    </div>
  );
}

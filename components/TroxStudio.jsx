"use client";

import React, { useState, useEffect } from "react";

import { TABS, channelLabel } from "../lib/constants";
import { uid, parseJSON, buildInstructions, buildImageBriefInstructions, dateStr } from "../lib/utils";
import { persist, recall, recallStr, forget, forgetMany, KEYS } from "../lib/storage";
import { BRAND_KB, TROX_DEFAULT, learnCtx } from "../lib/prompts";

// DashboardTab retired — content moved to CommandCenterTab
import CreateTab from "./tabs/CreateTab";
import PostsTab from "./tabs/PostsTab";
import CalendarTab from "./tabs/CalendarTab";
import TrendsTab from "./tabs/TrendsTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import CompetitionTab from "./tabs/CompetitionTab";
import CoachTab from "./tabs/CoachTab";
import SettingsTab from "./tabs/SettingsTab";
import CursorEffect from "./CursorEffect";
import CommandCenterTab from "./tabs/CommandCenterTab";
import BrandBrainTab from "./tabs/BrandBrainTab";
import InboxTab from "./tabs/InboxTab";
import DemoModeBanner from "./DemoModeBanner";
import { loadBrandBrain, saveBrandBrainToStorage, brandBrainCtx, shortBrainCtx, addInsightToMemory, computePillarMix, upcomingMoments as getBrainMoments, getHashtagsForPillar } from "../lib/brand-brain";
import { MockProvider } from "../lib/providers/mock-publishing";

const MARQUEE = ["TROX STUDIO","·","AI CONTENT INTELLIGENCE","·","@TROXCREATIONS","·","PREMIUM HANDCRAFTED JOURNALS","·","EST. 2024","·","TROX STUDIO","·","AI CONTENT INTELLIGENCE","·","@TROXCREATIONS","·","PREMIUM HANDCRAFTED JOURNALS","·","EST. 2024","·"];

// ---------------------------------------------------------------------------
// Main component — state, functions, and layout only
// All tab UI lives in components/tabs/
// ---------------------------------------------------------------------------

export default function TroxStudio() {
  const [loaded, setLoaded] = useState(false);

  // Brand
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState(TROX_DEFAULT);
  const [editing, setEditing] = useState(false);
  const [playbook, setPlaybook] = useState("");

  // Content
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState({ start: "9107", now: "9107" });
  const [logOpen, setLogOpen] = useState(null);
  const [logForm, setLogForm] = useState({});

  // Create tab
  const [channel, setChannel] = useState("instagram");
  const [collection, setCollection] = useState("General brand");
  const [theme, setTheme] = useState("Relationships");
  const [sign, setSign] = useState("Aries");
  const [angle, setAngle] = useState("Any angle");
  const [topic, setTopic] = useState("");
  const [format, setFormat] = useState("Reel");
  const [ideas, setIdeas] = useState([]);
  const [draftContent, setDraftContent] = useState(null);
  const [imageBrief, setImageBrief] = useState("");

  // Calendar (FR-016)
  const [schedule, setSchedule] = useState({});
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarPlan, setCalendarPlan] = useState("");

  // Trends (FR-018)
  const [trends, setTrends] = useState("");
  const [trendLastRun, setTrendLastRun] = useState(null);

  // Weekly report (FR-025)
  const [weeklyReport, setWeeklyReport] = useState("");
  const [weeklyReportDate, setWeeklyReportDate] = useState(null);

  // Competition
  const [competitors, setCompetitors] = useState([]);
  const [compInput, setCompInput] = useState("");
  const [compAnalysis, setCompAnalysis] = useState("");

  // Coach
  const [coach, setCoach] = useState("");

  // AI / Settings
  const [aiProvider, setAiProvider] = useState("groq");
  const [groqKey, setGroqKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [keyInput, setKeyInput] = useState({ groq: "", claude: "" });
  const [keySaved, setKeySaved] = useState("");

  // Instagram
  const [igToken, setIgToken] = useState("");
  const [igTokenInput, setIgTokenInput] = useState("");
  const [igAccountId, setIgAccountId] = useState("");
  const [igAccount, setIgAccount] = useState(null);
  const [igMedia, setIgMedia] = useState([]);
  const [igSyncing, setIgSyncing] = useState(false);
  const [igError, setIgError] = useState("");
  const [igAnalysis, setIgAnalysis] = useState("");
  const [igLastSync, setIgLastSync] = useState(null);
  const [igAppId, setIgAppId] = useState("");
  const [igAppSecret, setIgAppSecret] = useState("");
  const [igAppIdInput, setIgAppIdInput] = useState("");
  const [igAppSecretInput, setIgAppSecretInput] = useState("");
  const [igSessionId, setIgSessionId] = useState("");
  const [igSessionInput, setIgSessionInput] = useState("");
  const [oauthStarting, setOauthStarting] = useState(false);

  // Developer (FR-028/029)
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Brand Brain
  const [brandBrain, setBrandBrain] = useState(null);

  // Inbox
  const [inboxMessages, setInboxMessages] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const [drafting, setDrafting] = useState("");

  // Create enhancements
  const [hooks, setHooks] = useState([]);
  const [hooksLoading, setHooksLoading] = useState(false);
  const [voiceResult, setVoiceResult] = useState(null);
  const [voiceChecking, setVoiceChecking] = useState(false);
  const [repurposeText, setRepurposeText] = useState("");
  const [repurposePlatforms, setRepurposePlatforms] = useState(["Instagram"]);
  const [repurposed, setRepurposed] = useState(null);
  const [repurposing, setRepurposing] = useState(false);

  // Command Center
  const [priorities, setPriorities] = useState([]);
  const [prioritiesLoading, setPrioritiesLoading] = useState(false);
  const [weekSummary, setWeekSummary] = useState("");
  const [publishLoading, setPublishLoading] = useState("");

  // Create — pillar tagging
  const [draftPillar, setDraftPillar] = useState("");

  // Caption Formatter
  const [formattedCaption, setFormattedCaption] = useState("");
  const [formatBusy, setFormatBusy] = useState(false);

  // Hashtag Vault
  const [hashtagSuggesting, setHashtagSuggesting] = useState("");

  // Content Series
  const [seriesBriefs, setSeriesBriefs] = useState(null);
  const [seriesBusy, setSeriesBusy] = useState(false);

  // UI
  const [tab, setTab] = useState("Home");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  // ---------------------------------------------------------------------------
  // Boot: hydrate from localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let p = recall(KEYS.profile, null);
    if (!p) { p = TROX_DEFAULT; persist(KEYS.profile, p); }
    setProfile(p);
    setPlaybook(recallStr(KEYS.playbook));
    setPosts(recall(KEYS.posts, []));
    setFollowers(recall(KEYS.followers, { start: "9107", now: "9107" }));
    setCompetitors(recall(KEYS.competitors, []));
    setAiProvider(recallStr(KEYS.aiProvider, "groq"));
    setGroqKey(recallStr(KEYS.groqKey));
    setClaudeKey(recallStr(KEYS.claudeKey));
    setIgToken(recallStr(KEYS.igToken));
    setIgAccountId(recallStr(KEYS.igAccountId));
    setIgAccount(recall(KEYS.igAccount, null));
    setIgMedia(recall(KEYS.igMedia, []));
    const ls = localStorage.getItem(KEYS.igLastSync);
    if (ls) setIgLastSync(+ls);
    setIgAppId(recallStr(KEYS.igAppId));
    setIgAppSecret(recallStr(KEYS.igAppSecret));
    setIgSessionId(recallStr(KEYS.igSession));
    setSchedule(recall(KEYS.schedule, {}));
    setWeeklyReport(recallStr(KEYS.weeklyReport));
    const wrd = localStorage.getItem(KEYS.weeklyReportDate);
    if (wrd) setWeeklyReportDate(+wrd);
    setTrends(recallStr(KEYS.trendLastRun + "_data"));
    const trd = localStorage.getItem(KEYS.trendLastRun);
    if (trd) setTrendLastRun(+trd);
    setWebhookUrl(recallStr(KEYS.webhookUrl));
    setApiKey(recallStr(KEYS.apiKey));
    setBrandBrain(loadBrandBrain());

    // OAuth callback
    try {
      const params = new URLSearchParams(window.location.search);
      const tok = params.get("ig_token");
      const igErr = params.get("ig_error");
      if (tok || igErr) window.history.replaceState({}, "", window.location.pathname);
      if (igErr) setIgError(decodeURIComponent(igErr));
      if (tok) {
        const t = decodeURIComponent(tok);
        setIgToken(t); persist(KEYS.igToken, t);
        fetch("/api/instagram-analytics", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: t, action: "setup" }),
        }).then((r) => r.json()).then((d) => {
          if (!d.error) {
            setIgAccountId(d.igAccountId); setIgAccount(d.account);
            persist(KEYS.igAccountId, d.igAccountId);
            persist(KEYS.igAccount, d.account);
          }
        }).catch(() => {});
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Auto-load inbox when switching to Inbox tab
  useEffect(() => {
    if (tab === "Inbox" && inboxMessages.length === 0 && !inboxLoading) {
      loadInbox();
    }
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Core helpers
  // ---------------------------------------------------------------------------
  const savePosts = (n) => { setPosts(n); persist(KEYS.posts, n); };
  const saveFollowers = (n) => { setFollowers(n); persist(KEYS.followers, n); };
  const saveCompetitors = (n) => { setCompetitors(n); persist(KEYS.competitors, n); };
  const saveProfile = () => { setProfile({ ...draft }); setEditing(false); persist(KEYS.profile, draft); };
  const startEdit = () => { setDraft(profile || TROX_DEFAULT); setEditing(true); };
  const selectProvider = (p) => { setAiProvider(p); persist(KEYS.aiProvider, p); };
  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch {} };
  const activeKey = aiProvider === "groq" ? groqKey : claudeKey;
  const providerLabel = aiProvider === "groq" ? "Groq (free)" : "Claude";

  function noKeyGuard() {
    if (!activeKey) { setErr("Add your API key in the Settings tab first."); setTab("Settings"); return true; }
    return false;
  }

  async function callAI(prompt) {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, provider: aiProvider, apiKey: activeKey || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.error || "API error " + res.status);
    return data.text || "";
  }

  async function dispatchWebhook(event, payload) {
    if (!webhookUrl) return;
    fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, payload, webhookUrl }),
    }).catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // Brand Brain
  // ---------------------------------------------------------------------------
  function saveBrandBrain(newBrain) {
    setBrandBrain(newBrain);
    saveBrandBrainToStorage(newBrain);
  }

  function addInsight(text) {
    const updated = addInsightToMemory(brandBrain, text, "manual");
    saveBrandBrain(updated);
  }

  function autoLearn(text, source = "performance") {
    if (!text || !brandBrain) return;
    const updated = addInsightToMemory(brandBrain, text, source);
    saveBrandBrain(updated);
  }

  async function suggestHashtags(pillarId, pillarLabel, existingTags) {
    if (noKeyGuard()) return;
    setHashtagSuggesting(pillarId);
    try {
      const d = await callGenerate("suggest-hashtags", { pillarLabel, existingTags });
      if (d.hashtags?.length && brandBrain) {
        const vault = brandBrain.hashtagVault || {};
        const existing = vault[pillarId] || [];
        const newTags = (d.hashtags || []).filter((t) => !existing.includes(t));
        const updated = { ...vault, [pillarId]: [...existing, ...newTags] };
        saveBrandBrain({ ...brandBrain, hashtagVault: updated });
      }
    } catch (e) { setErr(e.message); }
    setHashtagSuggesting("");
  }

  async function genContentSeries(theme, postCount, pillarId) {
    if (noKeyGuard() || !theme?.trim()) return;
    setSeriesBusy(true); setSeriesBriefs(null);
    const pillar = brandBrain?.pillars?.find((p) => p.id === pillarId);
    try {
      const d = await callGenerate("content-series", {
        theme,
        postCount,
        channel: "Instagram",
        pillarLabel: pillar?.label || "",
      });
      setSeriesBriefs(d);
    } catch (e) { setErr(e.message); }
    setSeriesBusy(false);
  }

  function addSeriesToPosts(seriesData, pillarId) {
    if (!seriesData?.posts?.length) return;
    const newPosts = seriesData.posts.map((p) => ({
      id: uid(),
      type: p.format || "Post",
      channel: "instagram",
      title: `[${seriesData.seriesName}] ${p.title}`,
      content: `Hook: ${p.hook}\n\nAngle: ${p.angle}\n\nCTA: ${p.cta}`,
      pillar: pillarId || "",
      status: "planned",
      createdAt: Date.now(),
      metrics: null,
      insight: "",
    }));
    savePosts([...newPosts, ...posts]);
    setSeriesBriefs(null);
    setTab("Posts");
  }

  async function formatCaption(caption, captionChannel) {
    if (noKeyGuard() || !caption?.trim()) return;
    setFormatBusy(true); setFormattedCaption("");
    try {
      const d = await callGenerate("format-caption", { caption, channel: captionChannel });
      setFormattedCaption(d.formatted || "");
    } catch (e) { setErr(e.message); }
    setFormatBusy(false);
  }

  // ---------------------------------------------------------------------------
  // Inbox
  // ---------------------------------------------------------------------------
  async function loadInbox() {
    setInboxLoading(true); setInboxError("");
    try {
      const res = await fetch("/api/inbox");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setInboxMessages(data.messages || []);
    } catch (e) { setInboxError(e.message); }
    setInboxLoading(false);
  }

  function updateInboxMessage(id, updates) {
    setInboxMessages((prev) => prev.map((m) => m.id === id ? { ...m, ...updates } : m));
  }

  async function draftReply(message) {
    if (noKeyGuard()) return;
    setDrafting(message.id);
    try {
      const res = await fetch("/api/inbox", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "draft-reply", message, brandCtx: brandBrainCtx(brandBrain), provider: aiProvider, apiKey: activeKey || undefined }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      updateInboxMessage(message.id, { draft: data.reply });
    } catch (e) { setErr(e.message); }
    setDrafting("");
  }

  // ---------------------------------------------------------------------------
  // Generate helper — calls /api/generate (hooks, repurpose, voice-check, command-center)
  // ---------------------------------------------------------------------------
  async function callGenerate(action, payload = {}) {
    const res = await fetch("/api/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, provider: aiProvider, apiKey: activeKey || undefined, brandCtx: brandBrainCtx(brandBrain), voiceExamples: brandBrain?.voiceExamples, ...payload }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) throw new Error(data.error || "API error " + res.status);
    return data;
  }

  async function genHooks(content) {
    if (noKeyGuard()) return;
    setHooksLoading(true);
    try { const d = await callGenerate("hooks", { content }); setHooks(d.hooks || []); }
    catch (e) { setErr(e.message); }
    setHooksLoading(false);
  }

  async function checkVoice(content) {
    if (noKeyGuard()) return;
    setVoiceChecking(true);
    try { const d = await callGenerate("voice-check", { content }); setVoiceResult(d); }
    catch (e) { setErr(e.message); }
    setVoiceChecking(false);
  }

  async function doRepurpose() {
    if (noKeyGuard() || !repurposeText.trim() || !repurposePlatforms.length) return;
    setRepurposing(true); setRepurposed(null);
    try { const d = await callGenerate("repurpose", { sourceText: repurposeText, platforms: repurposePlatforms }); setRepurposed(d); }
    catch (e) { setErr(e.message); }
    setRepurposing(false);
  }

  async function publishPost(post) {
    setPublishLoading(post.id);
    try {
      const result = await MockProvider.publish(post);
      savePosts(posts.map((p) => p.id === post.id ? { ...p, status: "published", publishedId: result.id } : p));
    } catch (e) { setErr(e.message); }
    setPublishLoading("");
  }

  async function refreshPriorities() {
    if (noKeyGuard()) return;
    setPrioritiesLoading(true);
    try {
      const calendarPosts = Object.keys(schedule).map((id) => posts.find((p) => p.id === id)).filter(Boolean);
      const mix  = computePillarMix(posts, brandBrain?.pillars || []);
      const next = getBrainMoments(brandBrain?.seasonalMoments || [], 60);
      const d = await callGenerate("command-center", { calendarPosts, pillarMix: mix, upcomingMoments: next, igAccount });
      setPriorities(d.priorities || []);
      setWeekSummary(d.weekSummary || "");
    } catch (e) { setErr(e.message); }
    setPrioritiesLoading(false);
  }

  // ---------------------------------------------------------------------------
  // Mock engagement refresh
  // ---------------------------------------------------------------------------
  async function refreshPostEngagement(post) {
    if (!post.publishedId) return;
    try {
      const eng = await MockProvider.getEngagement(post.publishedId);
      if (eng) savePosts(posts.map((p) => p.id === post.id ? { ...p, mockEngagement: eng } : p));
    } catch {}
  }

  // ---------------------------------------------------------------------------
  // Settings
  // ---------------------------------------------------------------------------
  function saveKey(type) {
    const val = keyInput[type].trim();
    if (!val) return;
    if (type === "groq") { setGroqKey(val); persist(KEYS.groqKey, val); }
    else { setClaudeKey(val); persist(KEYS.claudeKey, val); }
    setKeyInput({ ...keyInput, [type]: "" });
    setKeySaved(type);
    setTimeout(() => setKeySaved(""), 2500);
  }

  function saveSession() {
    const s = igSessionInput.trim();
    if (!s) return;
    setIgSessionId(s); persist(KEYS.igSession, s);
    setIgSessionInput(""); setIgError("");
  }

  function saveWebhookUrl() {
    persist(KEYS.webhookUrl, webhookUrl);
  }

  async function generateApiKey() {
    const res = await fetch("/api/apikeys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate" }),
    });
    const data = await res.json();
    if (data.key) { setApiKey(data.key); persist(KEYS.apiKey, data.key); }
  }

  function revokeApiKey() {
    setApiKey(""); forget(KEYS.apiKey);
  }

  // ---------------------------------------------------------------------------
  // Instagram
  // ---------------------------------------------------------------------------
  async function syncInstagram() {
    if (!igToken || !igAccountId) return;
    setIgSyncing(true); setIgError("");
    const call = (body) => fetch("/api/instagram-analytics", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json());
    try {
      const [mediaData, accData] = await Promise.all([
        call({ token: igToken, action: "media", igAccountId }),
        call({ token: igToken, action: "account", igAccountId }),
      ]);
      if (mediaData.error) throw new Error(mediaData.error);
      const enriched = await Promise.all((mediaData.data || []).map(async (post) => {
        const ins = await call({ token: igToken, action: "post_insights", igAccountId, mediaId: post.id, mediaType: post.media_type });
        const insights = {};
        for (const m of (ins.data || [])) insights[m.name] = m.values?.[0]?.value ?? m.value ?? 0;
        return { ...post, insights };
      }));
      setIgMedia(enriched); persist(KEYS.igMedia, enriched);
      if (!accData.error) { setIgAccount(accData); persist(KEYS.igAccount, accData); }
      const now = Date.now(); setIgLastSync(now); persist(KEYS.igLastSync, String(now));
      dispatchWebhook("IG_SYNC_COMPLETED", { count: enriched.length });
    } catch (e) { setIgError(e.message); }
    setIgSyncing(false);
  }

  async function syncWithSession() {
    if (!igSessionId) { setIgError("No session ID saved. Add it in Settings first."); return; }
    setIgSyncing(true); setIgError("");
    try {
      const res = await fetch("/api/instagram-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: igSessionId, username: "troxcreations" }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const mapped = (data.posts || []).map((p) => ({ ...p, insights: { plays: p.play_count || 0 } }));
      setIgMedia(mapped); setIgAccount({ ...data.account });
      persist(KEYS.igMedia, mapped); persist(KEYS.igAccount, data.account);
      const now = Date.now(); setIgLastSync(now); persist(KEYS.igLastSync, String(now));
      dispatchWebhook("IG_SYNC_COMPLETED", { count: mapped.length });
    } catch (e) { setIgError(e.message); }
    setIgSyncing(false);
  }

  function disconnectInstagram() {
    setIgToken(""); setIgAccountId(""); setIgAccount(null); setIgMedia([]);
    setIgLastSync(null); setIgAnalysis(""); setIgSessionId("");
    forgetMany([KEYS.igToken, KEYS.igAccountId, KEYS.igAccount, KEYS.igMedia, KEYS.igLastSync, KEYS.igSession]);
  }

  async function startInstagramOAuth() {
    const id = igAppIdInput.trim() || igAppId;
    const secret = igAppSecretInput.trim() || igAppSecret;
    if (!id || !secret) { setIgError("Enter your App ID and App Secret first."); return; }
    setOauthStarting(true); setIgError("");
    if (igAppIdInput.trim()) { setIgAppId(id); persist(KEYS.igAppId, id); }
    if (igAppSecretInput.trim()) { setIgAppSecret(secret); persist(KEYS.igAppSecret, secret); }
    try {
      const res = await fetch("/api/auth/instagram/start", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appId: id, appSecret: secret }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.oauthUrl;
    } catch (e) { setIgError(e.message); setOauthStarting(false); }
  }

  // ---------------------------------------------------------------------------
  // Analytics
  // ---------------------------------------------------------------------------
  async function analyzeInstagram(mode = "full") {
    if (!igMedia.length || noKeyGuard()) return;
    setBusy("ig_ai_" + mode); setIgAnalysis(""); setErr("");
    const postCorpus = igMedia.map((p, i) => {
      const hashtags = ((p.caption || "").match(/#\w+/g) || []).join(" ");
      const date = new Date(p.timestamp);
      const metrics = [
        `♥${p.like_count || 0}`, `💬${p.comments_count || 0}`,
        p.play_count ? `▶${p.play_count}` : null,
        p.insights?.reach ? `👁${p.insights.reach}` : null,
        p.insights?.saved ? `🔖${p.insights.saved}` : null,
      ].filter(Boolean).join(" ");
      const commentSnippet = p._comments?.length
        ? `\n  Top comments: ${p._comments.slice(0, 3).map((c) => `"${c.text.slice(0, 60)}"`).join(" | ")}`
        : "";
      return `[${i + 1}] ${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })} | ${p.is_reel ? "REEL" : p.media_type} | ${metrics}\nCaption: ${(p.caption || "(none)").slice(0, 350)}${(p.caption || "").length > 350 ? "…" : ""}${hashtags ? `\nHashtags: ${hashtags}` : ""}${commentSnippet}`;
    }).join("\n\n");

    const byType = {}, byDay = {}, byHour = {};
    for (const p of igMedia) {
      const t = p.is_reel ? "REEL" : p.media_type === "CAROUSEL_ALBUM" ? "CAROUSEL" : "IMAGE/POST";
      byType[t] = (byType[t] || 0) + 1;
      const d = new Date(p.timestamp);
      const day = d.toLocaleDateString("en-US", { weekday: "short" });
      byDay[day] = (byDay[day] || 0) + 1;
      byHour[d.getHours()] = (byHour[d.getHours()] || 0) + 1;
    }
    const topDay = Object.entries(byDay).sort(([, a], [, b]) => b - a)[0]?.[0] || "unknown";
    const avgLikes = Math.round(igMedia.reduce((a, p) => a + (p.like_count || 0), 0) / igMedia.length);
    const avgComments = Math.round(igMedia.reduce((a, p) => a + (p.comments_count || 0), 0) / igMedia.length);
    const topPost = [...igMedia].sort((a, b) => ((b.like_count || 0) + (b.comments_count || 0)) - ((a.like_count || 0) + (a.comments_count || 0)))[0];
    const allHashtags = igMedia.flatMap((p) => ((p.caption || "").match(/#\w+/g) || []));
    const hFreq = {};
    allHashtags.forEach((h) => { hFreq[h] = (hFreq[h] || 0) + 1; });
    const topHashtags = Object.entries(hFreq).sort(([, a], [, b]) => b - a).slice(0, 15).map(([h, n]) => `${h}(×${n})`).join(", ");

    const prompts = {
      full: `Produce a FULL CONTENT INTELLIGENCE REPORT:\n\n1. BRAND VOICE FINGERPRINT\n   - Writing style, emotional register, recurring phrases\n   - Signature hooks and CTAs\n\n2. CAMPAIGNS & CONTENT SERIES DETECTED\n   - Name each series, list post numbers, score vs avg (${avgLikes} likes avg)\n\n3. STORYTELLING ARCHITECTURE\n   - Narrative frameworks used\n   - What story types are MISSING\n\n4. HASHTAG STRATEGY AUDIT\n   - Clusters working vs dead weight\n   - 8 specific hashtags to add immediately\n\n5. POSTING PATTERNS\n   - Frequency, gaps, peak day: ${topDay}\n   - Ideal weekly calendar\n\n6. ENGAGEMENT ANALYSIS\n   - Top post: "${(topPost?.caption || "").slice(0, 100)}" — why did it work?\n   - Format breakdown: ${Object.entries(byType).map(([t, n]) => `${t}: ${n}`).join(", ")}\n\n7. NEXT 30 DAYS: 5 specific post briefs + 1 campaign concept\n\nBe specific — reference actual post captions and numbers. Plain text, no markdown.`,
      voice: `Analyse ONLY the brand voice across all ${igMedia.length} posts: (1) linguistic fingerprint, (2) caption structure hook→CTA, (3) emotional register, (4) what's missing vs premium journal brands, (5) 3-sentence voice guide. Plain text, no markdown.`,
      campaigns: `Identify ALL content campaigns/series in ${igMedia.length} posts. Name each, list post numbers, rate engagement. Recommend 2 new campaign concepts for Zodiac, VMKG, Legacy, Life Pillar. Plain text, no markdown.`,
      hashtags: `Complete hashtag audit. Top used: ${topHashtags}. Analyse clusters, working vs dead weight, what's missing for gift-buyers vs journaling vs zodiac audiences. Give 25 hashtags split into 4 buckets. Plain text, no markdown.`,
    };

    try {
      const out = await callAI(`${learnCtx(profile, playbook)}\n\n@${igAccount?.username || "troxcreations"} — ${igAccount?.followers_count} followers — ${igMedia.length} posts\n\nALL POSTS:\n${postCorpus}\n\n${prompts[mode] || prompts.full}`);
      setIgAnalysis(out);
    } catch (e) { setErr(e.message); }
    setBusy("");
  }

  async function fetchTopCommentsThenAnalyze() {
    if (!igSessionId || !igMedia.length) { analyzeInstagram("full"); return; }
    setBusy("ig_comments"); setErr("");
    const top8 = [...igMedia].sort((a, b) => ((b.like_count || 0) + (b.comments_count || 0)) - ((a.like_count || 0) + (a.comments_count || 0))).slice(0, 8);
    const updated = [...igMedia];
    await Promise.all(top8.map(async (post) => {
      try {
        const res = await fetch("/api/instagram-comments", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: igSessionId, mediaId: post.id }),
        });
        const data = await res.json();
        const idx = updated.findIndex((p) => p.id === post.id);
        if (idx !== -1 && data.comments?.length) updated[idx] = { ...updated[idx], _comments: data.comments };
      } catch {}
    }));
    setIgMedia(updated); persist(KEYS.igMedia, updated);
    setBusy("");
    analyzeInstagram("full");
  }

  function importInsightsJSON(raw) {
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      const entries = parsed?.media_owner_statistics || parsed?.organic_insights_media || [];
      if (!entries.length) return { imported: 0, error: "Unrecognised format. Paste the content of media_metrics.json from your Instagram data export." };
      let imported = 0;
      const updated = [...igMedia];
      for (const entry of entries) {
        const smd = entry.string_map_data || {};
        const reach = parseInt(smd["Reach"]?.value || smd["reach"]?.value || "0");
        const saves = parseInt(smd["Saves"]?.value || smd["saves"]?.value || smd["Saved"]?.value || "0");
        const impressions = parseInt(smd["Impressions"]?.value || smd["impressions"]?.value || "0");
        const ts = smd["Creation Timestamp"]?.timestamp;
        const caption = entry.title?.replace(/^Post - /, "").slice(0, 80) || "";
        if (!ts && !caption) continue;
        const idx = updated.findIndex((p) => {
          if (ts && Math.abs(new Date(p.timestamp).getTime() / 1000 - ts) < 300) return true;
          if (caption && p.caption?.startsWith(caption.slice(0, 40))) return true;
          return false;
        });
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], insights: { ...updated[idx].insights, reach, saved: saves, impressions } };
          imported++;
        }
      }
      if (imported > 0) { setIgMedia(updated); persist(KEYS.igMedia, updated); }
      return { imported };
    } catch (e) { return { imported: 0, error: "Could not parse file: " + e.message }; }
  }

  // ---------------------------------------------------------------------------
  // Content creation
  // ---------------------------------------------------------------------------
  function composeSubject() {
    const parts = [];
    if (collection !== "General brand") parts.push(collection + " Collection");
    if ((collection === "Legacy" || collection === "Life Pillar") && theme) parts.push(theme + " theme");
    if (collection === "Zodiac" && sign) parts.push(sign + " edition");
    if (angle !== "Any angle") parts.push("angle: " + angle);
    return [parts.join(" — "), topic.trim()].filter(Boolean).join(" · ");
  }

  async function genIdeas() {
    if (noKeyGuard()) return;
    setBusy("ideas"); setErr(""); setIdeas([]);
    const subject = composeSubject();
    const bb = shortBrainCtx(brandBrain);
    try {
      const out = await callAI(`${learnCtx(profile, playbook)}${bb ? "\n\n" + bb : ""}\n\nPlatform: ${channelLabel(channel)}. Generate 5 content ideas${subject ? " focused on: " + subject : ""} to win NEW followers. Write for the personas above.\nReturn ONLY a JSON array. Each object: {"title","format","hook","why","performance"}.\nformat from: ${["Reel","Carousel","Post","Story"].join(" / ")}\nhook: scroll-stopping opener, max 14 words\nperformance: "High" or "Medium"`);
      setIdeas(parseJSON(out));
    } catch (e) { setErr(e.message || "Couldn't generate ideas — try again."); }
    setBusy("");
  }

  async function buildContent() {
    if (noKeyGuard()) return;
    const subject = composeSubject();
    if (!subject) { setErr("Pick a collection/theme or type a topic first."); return; }
    setBusy("build"); setErr(""); setDraftContent(null); setImageBrief(""); setFormattedCaption("");
    const bb = shortBrainCtx(brandBrain);
    try {
      const out = await callAI(`${learnCtx(profile, playbook)}${bb ? "\n\n" + bb : ""}\n\nCreate a ${format} for ${channelLabel(channel)} about: ${subject}.\n${buildInstructions(format)}\nWrite 100% in Trox's premium, reflective, philosophical voice. Speak to the personas above. Plain text only, no markdown.`);
      setDraftContent({ channel, type: format, title: subject, content: out });
      dispatchWebhook("POST_GENERATED", { title: subject, format, channel });
    } catch (e) { setErr(e.message || "Couldn't build that — try again."); }
    setBusy("");
  }

  async function genImageBrief() {
    if (!draftContent || noKeyGuard()) return;
    setBusy("image_brief"); setErr("");
    try {
      const out = await callAI(`${learnCtx(profile, playbook)}\n\n${buildImageBriefInstructions(draftContent.type, draftContent.title)}`);
      setImageBrief(out);
    } catch (e) { setErr(e.message); }
    setBusy("");
  }

  function saveDraft() {
    if (!draftContent) return;
    savePosts([{ id: uid(), ...draftContent, pillar: draftPillar || "", createdAt: Date.now(), status: "planned", metrics: null, insight: "" }, ...posts]);
    setDraftContent(null); setImageBrief(""); setDraftPillar(""); setTab("Posts");
  }

  function updatePostPillar(postId, pillarId) {
    savePosts(posts.map((p) => p.id === postId ? { ...p, pillar: pillarId } : p));
  }

  async function submitLog(p) {
    if (noKeyGuard()) return;
    setBusy("log_" + p.id); setErr("");
    const m = { ...logForm };
    try {
      const out = await callAI(`${learnCtx(profile, playbook)}\n\nA ${p.type} just went live on ${channelLabel(p.channel)} for Trox Creations.\nTopic: "${p.title}"\nResults: reach ${m.reach || "?"}, likes ${m.likes || "?"}, comments ${m.comments || "?"}, saves ${m.saves || "?"}, shares ${m.shares || "?"}, new followers ${m.follows || "?"}. Notes: ${m.notes || "none"}.\n\n1) ONE sentence takeaway starting with "Insight:".\n2) UPDATED PLAYBOOK as 4-7 bullet rules. Start with "PLAYBOOK:".`);
      const iM = out.match(/Insight:(.*?)(PLAYBOOK:|$)/is);
      const pM = out.match(/PLAYBOOK:([\s\S]*)$/i);
      const insight = iM ? iM[1].trim() : out.slice(0, 220);
      const newPlay = pM ? pM[1].trim() : playbook;
      savePosts(posts.map((x) => x.id === p.id ? { ...x, status: "posted", metrics: m, insight } : x));
      setPlaybook(newPlay); persist(KEYS.playbook, newPlay);
      if (m.follows && !isNaN(+m.follows)) saveFollowers({ ...followers, now: String(+(followers.now || followers.start || 0) + +m.follows) });
      setLogOpen(null);
      if (insight) autoLearn(insight, "performance");
      dispatchWebhook("POST_METRICS_LOGGED", { title: p.title, insight });
    } catch (e) { setErr(e.message || "Couldn't analyze — try again."); }
    setBusy("");
  }

  // ---------------------------------------------------------------------------
  // Competition
  // ---------------------------------------------------------------------------
  async function fetchCompetitor(username, existing) {
    setBusy("comp_" + username);
    const list = (existing || competitors).map((c) => c.username === username ? { ...c, loading: true, error: null } : c);
    saveCompetitors(list);
    try {
      const res = await fetch("/api/instagram?username=" + encodeURIComponent(username));
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      let postsData = null;
      let contentStats = null;

      // If session ID is saved, fetch actual post content for richer gap analysis
      if (igSessionId) {
        try {
          const sr = await fetch("/api/instagram-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId: igSessionId, username }),
          });
          if (sr.ok) {
            const sd = await sr.json();
            if (sd.posts?.length) {
              postsData = sd.posts.slice(0, 12);
              const n = postsData.length;
              const reels = postsData.filter((p) => p.is_reel).length;
              const carousels = postsData.filter((p) => p.media_type === "CAROUSEL_ALBUM").length;
              const images = n - reels - carousels;
              const avgLikes = Math.round(postsData.reduce((s, p) => s + (p.like_count || 0), 0) / n);
              const avgComments = Math.round(postsData.reduce((s, p) => s + (p.comments_count || 0), 0) / n);
              const tagMap = {};
              postsData.forEach((p) => {
                (p.caption || "").match(/#[\w]+/g)?.forEach((t) => { tagMap[t] = (tagMap[t] || 0) + 1; });
              });
              const topHashtags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
              contentStats = { reels, carousels, images, totalPosts: n, avgLikes, avgComments, topHashtags };
            }
          }
        } catch (_) { /* session fetch failed silently — fall back to profile-only */ }
      }

      saveCompetitors((existing || competitors).map((c) => c.username === username
        ? { ...c, ...data, posts_data: postsData, content_stats: contentStats, loading: false, error: null }
        : c));
    } catch (e) {
      saveCompetitors((existing || competitors).map((c) => c.username === username ? { ...c, loading: false, error: e.message } : c));
    }
    setBusy("");
  }

  async function addCompetitor() {
    const username = compInput.replace("@", "").trim().toLowerCase();
    if (!username || competitors.find((c) => c.username === username)) { setCompInput(""); return; }
    const list = [...competitors, { username, displayName: username, followers: null, posts: null, bio: null, fetchedAt: null, loading: true, error: null }];
    saveCompetitors(list); setCompInput("");
    await fetchCompetitor(username, list);
  }

  const removeCompetitor = (username) => saveCompetitors(competitors.filter((c) => c.username !== username));

  async function genCompAnalysis() {
    if (noKeyGuard() || !competitors.length) { setErr("Add at least one competitor first."); return; }
    setBusy("comp_analysis"); setErr(""); setCompAnalysis("");

    // Build rich competitor profiles using real content data where available
    const compProfiles = competitors.map((c) => {
      const lines = [`@${c.username} (${c.displayName}): ${c.followers || "?"} followers, ${c.posts || "?"} posts`];
      if (c.bio) lines.push(`Bio: "${c.bio}"`);
      const cs = c.content_stats;
      if (cs) {
        const { reels, carousels, images, totalPosts: n, avgLikes, avgComments, topHashtags } = cs;
        lines.push(`Content mix (last ${n} posts): ${reels} Reels (${Math.round(reels / n * 100)}%), ${carousels} Carousels (${Math.round(carousels / n * 100)}%), ${images} Images (${Math.round(images / n * 100)}%)`);
        lines.push(`Avg engagement per post: ${avgLikes} likes, ${avgComments} comments`);
        if (topHashtags.length) lines.push(`Top hashtags used: ${topHashtags.join(", ")}`);
      }
      if (c.posts_data?.length) {
        lines.push(`Sample recent captions:`);
        c.posts_data.slice(0, 6).forEach((p, i) => {
          if (p.caption) {
            const fmt = p.is_reel ? "Reel" : p.media_type === "CAROUSEL_ALBUM" ? "Carousel" : "Post";
            lines.push(`  ${i + 1}. [${fmt} — ${p.like_count || 0} likes, ${p.comments_count || 0} comments] "${p.caption.slice(0, 200).replace(/\n/g, " ")}"`);
          }
        });
      }
      return lines.join("\n");
    }).join("\n\n---\n\n");

    // Build Trox's own content snapshot
    const troxFollowers = +(followers.now || followers.start || 0);
    let troxContent = `Followers: ${troxFollowers}`;
    if (igMedia?.length) {
      const n = igMedia.length;
      const avgL = Math.round(igMedia.reduce((s, p) => s + (p.like_count || 0), 0) / n);
      const avgC = Math.round(igMedia.reduce((s, p) => s + (p.comments_count || 0), 0) / n);
      const troxReels = igMedia.filter((p) => p.is_reel).length;
      const troxCarousels = igMedia.filter((p) => p.media_type === "CAROUSEL_ALBUM").length;
      const tagMap2 = {};
      igMedia.forEach((p) => { (p.caption || "").match(/#[\w]+/g)?.forEach((t) => { tagMap2[t] = (tagMap2[t] || 0) + 1; }); });
      const troxTags = Object.entries(tagMap2).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([t]) => t);
      troxContent += `\nContent mix (${n} posts): ${troxReels} Reels (${Math.round(troxReels / n * 100)}%), ${troxCarousels} Carousels (${Math.round(troxCarousels / n * 100)}%), ${n - troxReels - troxCarousels} Images`;
      troxContent += `\nAvg engagement: ${avgL} likes, ${avgC} comments per post`;
      if (troxTags.length) troxContent += `\nTop hashtags: ${troxTags.join(", ")}`;
      const topPost = [...igMedia].sort((a, b) => ((b.like_count || 0) + (b.comments_count || 0)) - ((a.like_count || 0) + (a.comments_count || 0)))[0];
      if (topPost?.caption) troxContent += `\nBest performing post: "${topPost.caption.slice(0, 200).replace(/\n/g, " ")}" (${topPost.like_count || 0} likes)`;
      troxContent += `\nSample captions:\n` + igMedia.slice(0, 4).map((p, i) => {
        const fmt = p.is_reel ? "Reel" : p.media_type === "CAROUSEL_ALBUM" ? "Carousel" : "Post";
        return `  ${i + 1}. [${fmt} — ${p.like_count || 0} likes] "${(p.caption || "").slice(0, 180).replace(/\n/g, " ")}"`;
      }).join("\n");
    }

    const hasContentData = competitors.some((c) => c.posts_data?.length);
    const dataNote = hasContentData ? "" : "\n\nNote: No Instagram session ID set — analysis is based on profile data only. Add your session ID in Settings and re-fetch competitors for caption-level analysis.";

    const bbCtxComp = brandBrain ? `\n\n${brandBrainCtx(brandBrain)}` : "";
    const prompt = `${learnCtx(profile, playbook)}${bbCtxComp}

TROX CREATIONS:
${troxContent}

COMPETITORS:
${compProfiles}
${dataNote}

You are an unbiased senior social media strategist with no loyalty to any brand. Analyse the data above and produce a structured report in exactly these 5 sections:

1. COMPETITOR STRENGTHS
For each competitor, name 2-3 specific things they are genuinely doing well: content format mix, engagement levels, caption hooks, hashtag reach, or positioning. Use actual numbers from the data. Do not understate their strengths.

2. TROX CREATIONS STRENGTHS
What Trox is genuinely doing well based on its brand, voice, and post data. Be specific and evidence-based.

3. WHERE TROX LAGS
Name the 2-3 specific areas where competitors outperform Trox right now. Be direct: format, frequency, engagement rate, or content angle. Show the gap with numbers where possible.

4. CONTENT GAPS — 3 UNCONTESTED ANGLES
Three content angles or formats that none of the competitors are owning well. For each: name the gap, explain why it is available, and describe exactly what a Trox post exploiting that gap would look like (format, hook, angle).

5. THIS WEEK'S MOVES
Two specific posts to create this week. Give the exact format (Reel/Carousel/Post), the opening hook word-for-word, and a one-sentence reason why it beats the competition right now.

Plain text. No markdown symbols. Every claim must be grounded in the data provided above — no invented statistics.`;

    try {
      const out = await callAI(prompt);
      setCompAnalysis(out);
      // Auto-extract the biggest gap and add to Brand Brain memory
      const gapMatch = out.match(/CONTENT GAPS[^]*?ANGLE[:\s]*([^\n]+)/i) || out.match(/UNCONTESTED[:\s-–]+([^\n]+)/i);
      if (gapMatch?.[1]?.trim()) autoLearn("Competitive gap: " + gapMatch[1].trim(), "competition");
      dispatchWebhook("COMP_ANALYSIS_GENERATED", { competitorCount: competitors.length, hasContentData });
    } catch (e) { setErr(e.message || "Couldn't run analysis — try again."); }
    setBusy("");
  }

  async function runCoach() {
    if (noKeyGuard()) return;
    setBusy("coach"); setErr(""); setCoach("");
    const done    = posts.filter((p) => p.metrics).slice(0, 8);
    const summary = done.length ? done.map((p) => `- ${p.type} "${p.title}": reach ${p.metrics.reach || "?"}, saves ${p.metrics.saves || "?"}`).join("\n") : "No measured posts yet.";
    const bbCtx   = brandBrain ? `\n\n${brandBrainCtx(brandBrain)}` : "";
    try {
      const out = await callAI(`${learnCtx(profile, playbook)}${bbCtx}\n\nPerformance: ${summary}\nFollowers: started ${+(followers.start || 0)}, now ${+(followers.now || followers.start || 0)}, target ${+(followers.start || 0) + 3000}.\n\nWORKING — 2 things driving growth. FIX — 2 things to change now. NEXT MOVES — 3 specific posts to make next (give exact format, hook, and angle). Be specific and reference actual post data. Plain text, no markdown.`);
      setCoach(out);
    } catch (e) { setErr(e.message || "Couldn't run the audit — try again."); }
    setBusy("");
  }

  // ---------------------------------------------------------------------------
  // Calendar (FR-016)
  // ---------------------------------------------------------------------------
  function schedulePost(postId, ds) {
    const updated = { ...schedule, [postId]: ds };
    setSchedule(updated); persist(KEYS.schedule, updated);
    savePosts(posts.map((p) => p.id === postId ? { ...p, scheduledDate: ds } : p));
  }

  function unschedulePost(postId) {
    const updated = { ...schedule };
    delete updated[postId];
    setSchedule(updated); persist(KEYS.schedule, updated);
    savePosts(posts.map((p) => p.id === postId ? { ...p, scheduledDate: null } : p));
  }

  async function genCalendarPlan() {
    if (noKeyGuard()) return;
    setBusy("calendar_plan"); setErr("");
    const scheduledCount = Object.keys(schedule).length;
    const monthName = new Date(calendarYear, calendarMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const bb = shortBrainCtx(brandBrain);
    const pillarTargets = (brandBrain?.pillars || []).map((p) => `${p.label} ${p.target}%`).join(", ");
    const upcomingStr = getBrainMoments(brandBrain?.seasonalMoments || [], 60).slice(0, 3).map((m) => `${m.label} (${m.daysAway}d away)`).join(", ");
    try {
      const out = await callAI(`${learnCtx(profile, playbook)}${bb ? "\n\n" + bb : ""}\n\nCreate a content calendar for ${monthName} for @troxcreations.\n\nCurrently scheduled: ${scheduledCount} posts in this month.\nUnscheduled posts ready to use: ${posts.filter((p) => p.status === "planned" && !schedule[p.id]).length}\n${pillarTargets ? "Pillar targets: " + pillarTargets : ""}\n${upcomingStr ? "Upcoming moments: " + upcomingStr : ""}\n\nGenerate a complete month content plan:\n- Exact dates and days (Mon-Fri only, 4-5 posts/week)\n- Post format (Reel/Carousel/Post) for each slot\n- Content pillar for each post\n- Best time of day for each post type (IST)\n- 1-2 sentence hook for each post\n\nFormat: DATE — DAY — FORMAT — PILLAR — TOPIC — HOOK — TIME\nPlain text, no markdown.`);
      setCalendarPlan(out);
    } catch (e) { setErr(e.message); }
    setBusy("");
  }

  // ---------------------------------------------------------------------------
  // Trends (FR-018)
  // ---------------------------------------------------------------------------
  async function runTrendDiscovery() {
    if (noKeyGuard()) return;
    setBusy("trends"); setErr("");
    try {
      const res = await fetch("/api/trends", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandContext: learnCtx(profile, playbook).slice(0, 600),
          provider: aiProvider,
          apiKey: activeKey,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTrends(data.text);
      persist(KEYS.trendLastRun + "_data", data.text);
      const now = Date.now(); setTrendLastRun(now); persist(KEYS.trendLastRun, String(now));
      dispatchWebhook("TREND_DISCOVERED", { count: 6 });
    } catch (e) { setErr(e.message); }
    setBusy("");
  }

  // ---------------------------------------------------------------------------
  // Weekly Report (FR-025)
  // ---------------------------------------------------------------------------
  async function genWeeklyReport() {
    if (noKeyGuard()) return;
    setBusy("weekly_report"); setErr("");
    const recentPosts = posts.slice(0, 10);
    const measured = recentPosts.filter((p) => p.metrics);
    try {
      const out = await callAI(`${learnCtx(profile, playbook)}\n\nGenerate a WEEKLY PERFORMANCE REPORT for @troxcreations.\n\nThis week's activity:\n- Total posts created: ${posts.length}\n- Posts with logged results: ${measured.length}\n- Follower count: ${followers.now || followers.start}\n- Follower goal: ${+(followers.start || 0) + 3000}\n${measured.length ? "\nRecent results:\n" + measured.map((p) => `- ${p.type} "${p.title}": reach ${p.metrics?.reach || "?"}, saves ${p.metrics?.saves || "?"}, follows ${p.metrics?.follows || "?"}`).join("\n") : ""}\n\nReport structure:\n1. THIS WEEK SUMMARY — 2-3 sentences on overall performance\n2. TOP WIN — the single best thing that happened\n3. WHAT TO IMPROVE — 1 specific thing to change next week\n4. NEXT WEEK PLAN — 3 specific post recommendations with format and hook\n5. GOAL TRACKER — followers now vs target, what's needed\n\nBe direct, specific, encouraging. Plain text, no markdown.`);
      setWeeklyReport(out);
      persist(KEYS.weeklyReport, out);
      const now = Date.now(); setWeeklyReportDate(now); persist(KEYS.weeklyReportDate, String(now));
      // Auto-extract top learning from report and add to Brand Brain memory
      const topWinMatch = out.match(/TOP WIN[:\s-–]+([^\n]+)/i);
      const improveMatch = out.match(/WHAT TO IMPROVE[:\s-–]+([^\n]+)/i);
      const learnText = topWinMatch?.[1]?.trim() || improveMatch?.[1]?.trim();
      if (learnText) autoLearn("Weekly report: " + learnText, "weekly-report");
      dispatchWebhook("WEEKLY_REPORT_GENERATED", { date: new Date().toISOString() });
    } catch (e) { setErr(e.message); }
    setBusy("");
  }

  // ---------------------------------------------------------------------------
  // Dashboard calculations
  // ---------------------------------------------------------------------------
  const s = +(followers.start || 0), n = +(followers.now || followers.start || 0);
  const goal = s + 3000, gained = Math.max(0, n - s);
  const pct = Math.max(0, Math.min(100, (gained / 3000) * 100));
  const withData = posts.filter((p) => p.metrics);
  const totalFollows = withData.reduce((a, p) => a + (+p.metrics.follows || 0), 0);
  const bestSaves = withData.reduce((a, p) => Math.max(a, +p.metrics.saves || 0), 0);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (!loaded) {
    return (
      <div className="bw-root">
        <div className="bw-wrap">
          <div className="bw-load">
            <div className="bw-spin" />
            opening the studio…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bw-root">
      <CursorEffect />
      <svg className="bw-topwave" viewBox="0 0 1200 54" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,30 C150,55 350,5 600,28 C850,50 1050,8 1200,26 L1200,0 L0,0 Z" fill="#C9A86C" opacity="0.08" />
        <path d="M0,38 C200,18 400,52 640,34 C880,16 1040,46 1200,32 L1200,0 L0,0 Z" fill="#7BA7F0" opacity="0.06" />
      </svg>
      <div className="bw-wrap">
        <div className="bw-head">
          <div>
            <div className="bw-logo"><b>TROX</b> <span>Studio</span></div>
            <div className="bw-tag">AI social manager · handcrafted journals · growing @troxcreations</div>
          </div>
          <div className="bw-headright">
            <button className="bw-aichip" onClick={() => setTab("Settings")} style={{ cursor: "pointer", border: "1px solid var(--line)" }}>
              <span className={"dot" + (activeKey ? "" : " amber")} />
              {providerLabel} {activeKey ? "ready" : "— tap to add key"}
            </button>
            {profile && !editing && (
              <div className="bw-brandchip">
                <span>Brand: <b>{profile.name}</b></span>
                <button className="bw-edit" onClick={startEdit}>edit</button>
              </div>
            )}
          </div>
        </div>

        {editing ? (
          <div className="bw-setup">
            <h2>Brand Brain</h2>
            <p className="sub">Pre-loaded from your site. Tweak anything — feeds every idea, script and caption.</p>
            {[["sells", "What you sell", false], ["audience", "Target audience", false], ["voice", "Brand voice", true], ["goal", "Current focus", false]].map(([k, label, area]) => (
              <div className="bw-field" key={k}>
                <label>{label}</label>
                {area
                  ? <textarea className="bw-input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
                  : <input className="bw-input" value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />}
              </div>
            ))}
            <button className="bw-btn" onClick={saveProfile}>Save Brand Brain →</button>
          </div>
        ) : (
          <>
            <DemoModeBanner settings={{ groqKey, claudeKey, igSessionId, ayrshareKey: "" }} />
            <div className="bw-marquee">
              <div className="bw-marquee-track">
                {MARQUEE.map((item, i) => (
                  <span key={i} className={item === "·" ? "dot" : ""}>{item}</span>
                ))}
              </div>
            </div>
            <div className="bw-tabs">
              {TABS.map((t) => (
                <button key={t} className={"bw-tab" + (tab === t ? " on" : "")} onClick={() => { setTab(t); setErr(""); setCompAnalysis(""); }}>
                  {t}
                </button>
              ))}
            </div>

            <div key={tab} className="bw-tab-content">
              {tab === "Home" && (
                <CommandCenterTab
                  brandBrain={brandBrain} igAccount={igAccount}
                  posts={posts} calendarPosts={Object.keys(schedule).map((id) => posts.find((p) => p.id === id)).filter(Boolean)}
                  priorities={priorities} prioritiesLoading={prioritiesLoading}
                  weekSummary={weekSummary} refreshPriorities={refreshPriorities}
                  setActiveTab={setTab}
                  followers={followers} saveFollowers={saveFollowers}
                  weeklyReport={weeklyReport} weeklyReportDate={weeklyReportDate}
                  genWeeklyReport={genWeeklyReport} weeklyBusy={busy} copy={copy} />
              )}

              {tab === "Brand Brain" && (
                <BrandBrainTab brandBrain={brandBrain} saveBrandBrain={saveBrandBrain} addInsight={addInsight}
                  suggestHashtags={suggestHashtags} hashtagSuggesting={hashtagSuggesting} />
              )}

              {tab === "Create" && (
                <CreateTab channel={channel} setChannel={setChannel} collection={collection} setCollection={setCollection}
                  theme={theme} setTheme={setTheme} sign={sign} setSign={setSign}
                  angle={angle} setAngle={setAngle} topic={topic} setTopic={setTopic}
                  format={format} setFormat={setFormat} ideas={ideas} setIdeas={setIdeas}
                  draftContent={draftContent} setDraftContent={setDraftContent}
                  imageBrief={imageBrief} setImageBrief={setImageBrief}
                  busy={busy} err={err} activeKey={activeKey} setTab={setTab}
                  genIdeas={genIdeas} buildContent={buildContent} saveDraft={saveDraft}
                  genImageBrief={genImageBrief} copy={copy}
                  hooks={hooks} hooksLoading={hooksLoading} genHooks={genHooks}
                  voiceResult={voiceResult} voiceChecking={voiceChecking} checkVoice={checkVoice}
                  repurposeText={repurposeText} setRepurposeText={setRepurposeText}
                  repurposePlatforms={repurposePlatforms} setRepurposePlatforms={setRepurposePlatforms}
                  repurposed={repurposed} repurposing={repurposing} doRepurpose={doRepurpose}
                  draftPillar={draftPillar} setDraftPillar={setDraftPillar} brandBrain={brandBrain}
                  formattedCaption={formattedCaption} formatBusy={formatBusy} formatCaption={formatCaption} />
              )}

              {tab === "Posts" && (
                <PostsTab posts={posts} savePosts={savePosts} logOpen={logOpen} setLogOpen={setLogOpen}
                  logForm={logForm} setLogForm={setLogForm} busy={busy} submitLog={submitLog} copy={copy}
                  brandBrain={brandBrain} updatePostPillar={updatePostPillar}
                  refreshPostEngagement={refreshPostEngagement} />
              )}

              {tab === "Calendar" && (
                <CalendarTab posts={posts} schedule={schedule}
                  calendarYear={calendarYear} calendarMonth={calendarMonth}
                  setCalendarYear={setCalendarYear} setCalendarMonth={setCalendarMonth}
                  schedulePost={schedulePost} unschedulePost={unschedulePost}
                  calendarPlan={calendarPlan} genCalendarPlan={genCalendarPlan}
                  busy={busy} setTab={setTab} copy={copy}
                  brandBrain={brandBrain} publishPost={publishPost} publishLoading={publishLoading}
                  seriesBriefs={seriesBriefs} seriesBusy={seriesBusy}
                  genContentSeries={genContentSeries} addSeriesToPosts={addSeriesToPosts} />
              )}

              {tab === "Inbox" && (
                <InboxTab
                  inboxMessages={inboxMessages} inboxLoading={inboxLoading} inboxError={inboxError}
                  drafting={drafting} draftReply={draftReply}
                  updateInboxMessage={updateInboxMessage} refreshInbox={loadInbox} />
              )}

              {tab === "Trends" && (
                <TrendsTab trends={trends} trendLastRun={trendLastRun} busy={busy} err={err}
                  activeKey={activeKey} setTab={setTab} runTrendDiscovery={runTrendDiscovery}
                  copy={copy} setTopicFromTrend={(t) => { setTopic(t); setTab("Create"); }} />
              )}

              {tab === "Analytics" && (
                <AnalyticsTab igSessionId={igSessionId} igToken={igToken} igAccountId={igAccountId}
                  igAccount={igAccount} igMedia={igMedia} igSyncing={igSyncing}
                  igError={igError} igLastSync={igLastSync} igAnalysis={igAnalysis}
                  busy={busy} setTab={setTab} syncInstagram={syncInstagram}
                  syncWithSession={syncWithSession} disconnectInstagram={disconnectInstagram}
                  analyzeInstagram={analyzeInstagram} fetchTopCommentsThenAnalyze={fetchTopCommentsThenAnalyze}
                  importInsightsJSON={importInsightsJSON} copy={copy} />
              )}

              {tab === "Competition" && (
                <CompetitionTab competitors={competitors} compInput={compInput} setCompInput={setCompInput}
                  compAnalysis={compAnalysis} busy={busy} err={err}
                  addCompetitor={addCompetitor} removeCompetitor={removeCompetitor}
                  fetchCompetitor={fetchCompetitor} genCompAnalysis={genCompAnalysis} copy={copy} />
              )}

              {tab === "Coach" && (
                <CoachTab coach={coach} busy={busy} err={err} activeKey={activeKey}
                  setTab={setTab} runCoach={runCoach} copy={copy} brandBrain={brandBrain} />
              )}

              {tab === "Settings" && (
                <SettingsTab aiProvider={aiProvider} selectProvider={selectProvider}
                  groqKey={groqKey} claudeKey={claudeKey}
                  keyInput={keyInput} setKeyInput={setKeyInput}
                  keySaved={keySaved} saveKey={saveKey}
                  igSessionId={igSessionId} igSessionInput={igSessionInput}
                  setIgSessionInput={setIgSessionInput} saveSession={saveSession}
                  igAppId={igAppId} igAppIdInput={igAppIdInput} setIgAppIdInput={setIgAppIdInput}
                  igAppSecret={igAppSecret} igAppSecretInput={igAppSecretInput}
                  setIgAppSecretInput={setIgAppSecretInput} igAccount={igAccount}
                  igError={igError} oauthStarting={oauthStarting}
                  startInstagramOAuth={startInstagramOAuth} disconnectInstagram={disconnectInstagram}
                  webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} saveWebhookUrl={saveWebhookUrl}
                  apiKey={apiKey} generateApiKey={generateApiKey} revokeApiKey={revokeApiKey} />
              )}
            </div>

            {err && <div className="bw-err">{err}</div>}
          </>
        )}
      </div>
    </div>
  );
}

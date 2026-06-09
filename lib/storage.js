export const KEYS = {
  profile: "trox_profile",
  playbook: "trox_playbook",
  posts: "trox_posts",
  followers: "trox_followers",
  competitors: "trox_competitors",
  aiProvider: "trox_ai_provider",
  groqKey: "trox_groq_key",
  claudeKey: "trox_claude_key",
  igToken: "trox_ig_token",
  igAccountId: "trox_ig_account_id",
  igAccount: "trox_ig_account",
  igMedia: "trox_ig_media",
  igLastSync: "trox_ig_last_sync",
  igAppId: "trox_ig_app_id",
  igAppSecret: "trox_ig_app_secret",
  igSession: "trox_ig_session",
  schedule: "trox_schedule",
  weeklyReport: "trox_weekly_report",
  weeklyReportDate: "trox_weekly_report_date",
  trendLastRun: "trox_trend_last_run",
  webhookUrl: "trox_webhook_url",
  apiKey: "trox_api_key",
  workspace: "trox_workspace",
  workspaces: "trox_workspaces",
};

export const persist = (k, v) => {
  try {
    localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
  } catch {}
};

export const recall = (k, fallback = null) => {
  try {
    const r = localStorage.getItem(k);
    return r !== null ? JSON.parse(r) : fallback;
  } catch {
    return fallback;
  }
};

export const recallStr = (k, fallback = "") => {
  try {
    return localStorage.getItem(k) || fallback;
  } catch {
    return fallback;
  }
};

export const forget = (k) => {
  try {
    localStorage.removeItem(k);
  } catch {}
};

export function forgetMany(keys) {
  keys.forEach(forget);
}

"use client";

import { getSupabaseClient, isSupabaseConfigured } from "./supabase";
import { persist, recall, KEYS } from "./storage";

// Unified data layer — uses Supabase when configured, localStorage as fallback.
// All methods are async even when using localStorage so callers are consistent.

export async function getProfile(userId) {
  if (isSupabaseConfigured() && userId) {
    const sb = getSupabaseClient();
    const { data } = await sb.from("brands").select("*").eq("id", userId).single();
    if (data) return data;
  }
  return recall(KEYS.profile, null);
}

export async function saveProfile(profile, userId) {
  persist(KEYS.profile, profile);
  if (isSupabaseConfigured() && userId) {
    const sb = getSupabaseClient();
    await sb.from("brands").upsert({ ...profile, id: userId });
  }
}

export async function getPosts(brandId) {
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    const { data } = await sb
      .from("posts")
      .select("*, post_metrics(*)")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });
    if (data?.length) return data;
  }
  return recall(KEYS.posts, []);
}

export async function savePosts(posts, brandId) {
  persist(KEYS.posts, posts);
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    await sb.from("posts").upsert(
      posts.map((p) => ({ ...p, brand_id: brandId }))
    );
  }
}

export async function getPlaybook(brandId) {
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    const { data } = await sb
      .from("playbooks")
      .select("content")
      .eq("brand_id", brandId)
      .single();
    if (data?.content) return data.content;
  }
  return recall(KEYS.playbook, "");
}

export async function savePlaybook(content, brandId) {
  persist(KEYS.playbook, content);
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    await sb.from("playbooks").upsert({ brand_id: brandId, content });
  }
}

export async function getIgPosts(brandId) {
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    const { data } = await sb
      .from("ig_posts")
      .select("*")
      .eq("brand_id", brandId)
      .order("timestamp", { ascending: false });
    if (data?.length) return data;
  }
  return recall(KEYS.igMedia, []);
}

export async function saveIgPosts(posts, brandId) {
  persist(KEYS.igMedia, posts);
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    await sb.from("ig_posts").upsert(
      posts.map((p) => ({
        ig_media_id: p.id,
        brand_id: brandId,
        media_type: p.media_type,
        is_reel: p.is_reel || false,
        caption: p.caption,
        timestamp: p.timestamp,
        like_count: p.like_count,
        comment_count: p.comments_count,
        play_count: p.play_count,
        reach: p.insights?.reach,
        impressions: p.insights?.impressions,
        saved: p.insights?.saved,
        permalink: p.permalink,
      })),
      { onConflict: "ig_media_id" }
    );
  }
}

export async function getCompetitors(brandId) {
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    const { data } = await sb
      .from("competitors")
      .select("*")
      .eq("brand_id", brandId);
    if (data?.length) return data;
  }
  return recall(KEYS.competitors, []);
}

export async function saveCompetitors(competitors, brandId) {
  persist(KEYS.competitors, competitors);
  if (isSupabaseConfigured() && brandId) {
    const sb = getSupabaseClient();
    await sb.from("competitors").upsert(
      competitors.map((c) => ({ ...c, brand_id: brandId }))
    );
  }
}

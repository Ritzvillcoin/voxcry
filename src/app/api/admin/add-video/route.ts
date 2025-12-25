// src/app/api/admin/add-video/route.ts
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function normalizeHandle(input: string) {
  const s = (input || "").trim();
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}

// Accepts both:
// - https://www.tiktok.com/@handle/video/123
// - https://www.tiktok.com/@handle/photo/123
function extractTikTokPostInfo(
  tiktokUrl: string
): { postId: string; postType: "video" | "photo" } | null {
  const m = (tiktokUrl || "").match(/\/(video|photo)\/(\d+)/);
  if (!m) return null;
  const postType = (m[1] as "video" | "photo") ?? "video";
  const postId = m[2] ?? "";
  if (!postId) return null;
  return { postId, postType };
}

// Optional: keep this loose so you can add/rename formats without redeploying validation.
function normalizeFormat(input: string) {
  return (input || "").trim().replace(/\s+/g, " ");
}

type Body = {
  adminToken: string;
  creator_handle: string; // "@handle" or "handle"
  tiktok_url: string; // full TikTok post URL (video or photo)
  format: string; // e.g. "Result-first", "POV", "Tutorial"
};

export async function POST(req: Request) {
  if (!hasKV()) {
    return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
  }

  const body = (await req.json()) as Partial<Body>;

  // simple admin auth
  if (!process.env.ADMIN_TOKEN || body.adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const handle = normalizeHandle(body.creator_handle || "");
  const tiktokUrl = (body.tiktok_url || "").trim();
  const postInfo = extractTikTokPostInfo(tiktokUrl);

  // NEW: format
  const format = normalizeFormat(body.format || "");

  if (!handle) {
    return NextResponse.json({ ok: false, error: "missing_creator_handle" }, { status: 400 });
  }
  if (!tiktokUrl || !postInfo) {
    return NextResponse.json({ ok: false, error: "invalid_tiktok_post_url" }, { status: 400 });
  }
  if (!format) {
    return NextResponse.json({ ok: false, error: "missing_format" }, { status: 400 });
  }

  const { postId, postType } = postInfo;

  const now = Math.floor(Date.now() / 1000); // unix seconds

  // 1) creator base (handle only). NX so you don't overwrite later.
  await kv.set(`creator:base:${handle}`, { handle }, { nx: true });

  // 2) newest creators index (sorted set)
  await kv.zadd("creators:z", { score: now, member: handle });

  // 3) newest posts for creator (sorted set). Keep key name as videos:z for backward compatibility.
  await kv.zadd(`creator:videos:z:${handle}`, { score: now, member: postId });

  // 4) post record (video or photo). Keep field name "video_id" for compatibility.
  // NEW: store format on the video record
  await kv.set(`video:base:${postId}`, {
    video_id: postId,
    creator_handle: handle,
    tiktok_url: tiktokUrl,
    added_at: now,
    post_type: postType,
    format, // ✅ NEW
  });

  return NextResponse.json({
    ok: true,
    handle,
    video_id: postId,
    post_type: postType,
    format, // ✅ NEW
    added_at: now,
  });
}



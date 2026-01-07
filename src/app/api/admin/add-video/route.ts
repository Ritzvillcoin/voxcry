import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function extractTikTokPostInfo(url: string): { postId: string; postType: "video" | "photo" } | null {
  const m = (url || "").match(/\/(video|photo)\/(\d+)/);
  if (!m) return null;
  return { postType: m[1] as "video" | "photo", postId: m[2] };
}

type AuditData = {
  score: number;
  verdict: "SIGNAL" | "NOISE";
  summary: string;
  noiseTax: number;
};

export async function POST(req: Request) {
  if (!hasKV()) return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });

  const { adminToken, creator_handle, tiktok_url, format, audit } = (await req.json());

  // Simple auth
  if (!process.env.ADMIN_TOKEN || adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const postInfo = extractTikTokPostInfo(tiktok_url);
  if (!postInfo || !creator_handle || !audit) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const { postId, postType } = postInfo;
  const now = Math.floor(Date.now() / 1000);

  // 1. Ensure creator exists
  await kv.set(`creator:base:${creator_handle}`, { handle: creator_handle }, { nx: true });
  await kv.zadd("creators:z", { score: now, member: creator_handle });

  // 2. Add video to creator's feed
  await kv.zadd(`creator:videos:z:${creator_handle}`, { score: now, member: postId });

  // 3. IMPORTANT: Add to Global Audit Registry for "Next" navigation on Review Page
  // We use LPUSH to keep the newest audit at the top
  await kv.lpush("audit_registry", postId);

  // 4. Store complete post record with JSON Audit
  await kv.set(`video:base:${postId}`, {
    video_id: postId,
    creator_handle,
    tiktok_url,
    added_at: now,
    post_type: postType,
    format,
    audit, // Structured JSON object
  });

  return NextResponse.json({ ok: true, handle: creator_handle, video_id: postId });
}



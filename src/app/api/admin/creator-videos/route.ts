import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function normalizeHandle(input: string) {
  const s = decodeURIComponent((input || "").trim());
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}

function stripAt(handle: string) {
  return handle.replace(/^@/, "");
}

type VideoBase = {
  video_id?: string;
  creator_handle?: string;
  tiktok_url?: string;
  added_at?: number;
  post_type?: "video" | "photo";
};

export async function GET(req: Request) {
  if (!hasKV()) {
    return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const handle = normalizeHandle(searchParams.get("handle") || "");
  const limitRaw = Number(searchParams.get("limit") || "6");
  const limit = Number.isFinite(limitRaw) ? Math.max(1, Math.min(20, limitRaw)) : 6;

  if (!handle) {
    return NextResponse.json({ ok: false, error: "missing_handle" }, { status: 400 });
  }

  try {
    const idsRaw = await kv.zrange(`creator:videos:z:${handle}`, 0, limit - 1, { rev: true });
    const ids = Array.isArray(idsRaw) ? idsRaw.map((x) => String(x)) : [];

    const items: Array<{ video_id: string; tiktok_url: string; added_at: number }> = [];

    for (const id of ids) {
      const vb = await kv.get<VideoBase>(`video:base:${id}`);

      const tiktokUrl =
        vb?.tiktok_url ??
        `https://www.tiktok.com/@${stripAt(handle)}/video/${id}`; // fallback

      items.push({
        video_id: id,
        tiktok_url: tiktokUrl,
        added_at: typeof vb?.added_at === "number" ? vb.added_at : 0,
      });
    }

    return NextResponse.json({ ok: true, handle, items }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "unknown_error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

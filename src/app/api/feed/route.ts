import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type FeedItem = {
  creator_handle: string; 
  tiktok_link: string;   
};

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function normalizeHandle(handle: string) {
  const h = (handle || "").trim();
  return h.startsWith("@") ? h : `@${h}`;
}

function handleForUrl(handle: string) {
  return normalizeHandle(handle).replace(/^@/, "");
}

export async function GET(req: Request) {
  if (!hasKV()) {
    return NextResponse.json({ items: [] as FeedItem[] }, { status: 200 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.max(1, Math.min(500, Number(searchParams.get("limit") ?? 200)));
  
  // NEW: Capture the 'focus' parameter from the URL
  const focusRaw = searchParams.get("focus");

  // 1) Get the newest creator handles
  let handles = (await kv.zrange<string[]>("creators:z", 0, limit - 1, {
    rev: true,
  })) ?? [];

  // 2) Focus Logic: If a handle is requested, prioritize it
  if (focusRaw) {
    const focusHandle = normalizeHandle(focusRaw);
    // Remove it from its current position and put it at index 0
    const otherHandles = handles.filter(h => normalizeHandle(h) !== focusHandle);
    handles = [focusHandle, ...otherHandles];
  }

  const items: FeedItem[] = [];

  for (const rawHandle of handles) {
    const handle = normalizeHandle(rawHandle);

    const videoIds = (await kv.zrange<string[]>(
      `creator:videos:z:${handle}`,
      0,
      0,
      { rev: true }
    )) ?? [];

    const videoId = videoIds[0];
    if (!videoId) continue;

    const videoBase = await kv.get<{ tiktok_url?: string }>(`video:base:${videoId}`);
    const tiktokUrl =
      videoBase?.tiktok_url ??
      `https://www.tiktok.com/@${handleForUrl(handle)}/video/${videoId}`;

    items.push({
      creator_handle: handle,
      tiktok_link: tiktokUrl,
    });
  }

  return NextResponse.json({ items }, { status: 200 });
}
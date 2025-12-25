import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// 1. Define types to satisfy the TypeScript compiler
type FeedItem = {
  creator_handle: string;
  tiktok_link: string;
  format: string; // ✅ NEW
};

type VideoMetadata = {
  tiktok_url?: string;
  added_at?: number;
  format?: string; // ✅ NEW
};

function normalizeHandle(handle: string) {
  const h = (handle || "").trim();
  return h.startsWith("@") ? h : `@${h}`;
}

function handleForUrl(handle: string) {
  return normalizeHandle(handle).replace(/^@/, "");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Set a sensible limit (50 is optimal for speed and UX)
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit") ?? 50)));
    const focusRaw = searchParams.get("focus");

    // 2. Fetch the Top Handles from your ladder
    let handles =
      (await kv.zrange<string[]>("creators:z", 0, limit - 1, {
        rev: true,
      })) ?? [];

    // 3. Inject Scout Target if it's provided and not already at the top
    if (focusRaw) {
      const focusHandle = normalizeHandle(focusRaw);
      const otherHandles = handles.filter((h) => normalizeHandle(h) !== focusHandle);
      handles = [focusHandle, ...otherHandles];
    }

    if (handles.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // 4. PIPELINE 1: Get the LATEST video ID for every handle in a single batch
    const pipe1 = kv.pipeline();
    handles.forEach((h) => {
      pipe1.zrange(`creator:videos:z:${normalizeHandle(h)}`, 0, 0, { rev: true });
    });

    // Executing the pipeline returns an array of arrays (since zrange returns a list)
    const allVideoIdsResults = await pipe1.exec<string[][]>();

    // 5. PIPELINE 2: Get the metadata for those specific video IDs
    const pipe2 = kv.pipeline();
    const activeMapping: { handle: string; id: string }[] = [];

    allVideoIdsResults.forEach((ids, index) => {
      if (ids && ids[0]) {
        const id = String(ids[0]);
        activeMapping.push({ handle: handles[index], id });
        pipe2.get<VideoMetadata>(`video:base:${id}`);
      }
    });

    const allMeta = await pipe2.exec<(VideoMetadata | null)[]>();

    // 6. Map back to the exact format the Frontend expects (FeedItem[])
    const items: FeedItem[] = activeMapping.map((map, i) => {
      const videoBase = allMeta[i];

      const tiktokUrl =
        videoBase?.tiktok_url ??
        `https://www.tiktok.com/@${handleForUrl(map.handle)}/video/${map.id}`;

      const format =
        typeof videoBase?.format === "string" && videoBase.format.trim()
          ? videoBase.format.trim()
          : "—";

      return {
        creator_handle: map.handle,
        tiktok_link: tiktokUrl,
        format, // ✅ NEW
      };
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Feed API Error:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

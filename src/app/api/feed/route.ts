import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// What the frontend expects (expanded, but backward compatible)
type FeedItem = {
  creator_handle: string;
  tiktok_link: string;
  format: string;

  // NEW (for blog/audit cards)
  slug?: string;
  blog_title?: string;
  summary?: string;
  final_label?: "SIGNAL" | "MIXED" | "NOISE";
  quality_score?: number;
  audit_url?: string; // /video/[slug]
};

type VideoMetadata = {
  tiktok_url?: string;
  added_at?: number;
  format?: string;
};

type VideoAuditRecord = {
  slug: string;
  tiktok_url: string;
  creator_handle?: string;
  format?: string;

  final_label?: "SIGNAL" | "MIXED" | "NOISE";
  quality_score?: number;

  blog_title?: string;
  summary?: string;

  created_at?: string;
  updated_at?: string;

  pack_slug?: string;
  pack_title?: string;
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

    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit") ?? 50)));
    const focusRaw = searchParams.get("focus");

    // 1) Top handles from ladder
    let handles =
      (await kv.zrange<string[]>("creators:z", 0, limit - 1, { rev: true })) ?? [];

    // 2) Inject focus handle on top
    if (focusRaw) {
      const focusHandle = normalizeHandle(focusRaw);
      const otherHandles = handles.filter((h) => normalizeHandle(h) !== focusHandle);
      handles = [focusHandle, ...otherHandles];
    }

    if (handles.length === 0) return NextResponse.json({ items: [] });

    // 3) PIPE 1: latest video id per handle
    const pipe1 = kv.pipeline();
    handles.forEach((h) => {
      pipe1.zrange(`creator:videos:z:${normalizeHandle(h)}`, 0, 0, { rev: true });
    });
    const allVideoIdsResults = await pipe1.exec<string[][]>();

    // 4) PIPE 2: try audit first, then base fallback
    const pipeAudit = kv.pipeline();
    const mapping: { handle: string; id: string }[] = [];

    allVideoIdsResults.forEach((ids, index) => {
      if (ids && ids[0]) {
        const id = String(ids[0]);
        mapping.push({ handle: handles[index], id });
        // Audit record uses new key video:v1:{slug} where slug = postId
        pipeAudit.get<VideoAuditRecord>(`video:v1:${id}`);
      }
    });

    const auditResults = await pipeAudit.exec<(VideoAuditRecord | null)[]>();

    // Prepare fallback fetches for those without audits
    const pipeBase = kv.pipeline();
    const baseIdx: number[] = [];

    auditResults.forEach((audit, i) => {
      if (!audit) {
        baseIdx.push(i);
        const id = mapping[i].id;
        pipeBase.get<VideoMetadata>(`video:base:${id}`);
      }
    });

    const baseResults = baseIdx.length
      ? await pipeBase.exec<(VideoMetadata | null)[]>()
      : [];

    let baseCursor = 0;

    // 5) Build items
    const items: FeedItem[] = mapping.map((m, i) => {
      const audit = auditResults[i];

      // If audit exists, prefer it
      if (audit?.tiktok_url) {
  const format =
    typeof audit.format === "string" && audit.format.trim()
      ? audit.format.trim()
      : "—";

  const finalLabel =
    audit.final_label === "SIGNAL" || audit.final_label === "MIXED" || audit.final_label === "NOISE"
      ? audit.final_label
      : undefined;

  return {
    creator_handle: normalizeHandle(m.handle),
    tiktok_link: audit.tiktok_url,
    format,

    slug: audit.slug || m.id,
    blog_title: audit.blog_title || "",
    summary: audit.summary || "",
    final_label: finalLabel,
    quality_score: typeof audit.quality_score === "number" ? audit.quality_score : undefined,
    audit_url: `/video/${audit.slug || m.id}`,
  };
}


      // Otherwise fall back to old video:base
      const videoBase = baseIdx.includes(i) ? baseResults[baseCursor++] : null;

      const tiktokUrl =
        videoBase?.tiktok_url ??
        `https://www.tiktok.com/@${handleForUrl(m.handle)}/video/${m.id}`;

      const format =
        typeof videoBase?.format === "string" && videoBase.format.trim()
          ? videoBase.format.trim()
          : "—";

      return {
        creator_handle: normalizeHandle(m.handle),
        tiktok_link: tiktokUrl,
        format,
      };
    });

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Feed API Error:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

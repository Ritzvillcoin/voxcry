import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Payload = {
  adminToken: string;
  slug: string; // TikTok postId

  creator_handle?: string;
  tiktok_url: string;
  format?: string;

  pack_slug?: string;
  pack_title?: string;

  audit: {
    score: number;
    verdict: "SIGNAL" | "NOISE" | "MIXED";
  };

  blog: {
    title: string;
    summary: string;
    body?: string;
  };
};

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function normalizeHandle(handle: string) {
  const h = (handle || "").trim();
  if (!h) return "";
  return h.startsWith("@") ? h : `@${h}`;
}

export async function POST(req: Request) {
  try {
    const ADMIN_TOKEN = requireEnv("ADMIN_TOKEN");
    const body = (await req.json()) as Payload;

    if (!body?.adminToken || body.adminToken !== ADMIN_TOKEN) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
    if (!body?.slug?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }
    if (!body?.tiktok_url?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing tiktok_url" }, { status: 400 });
    }
    if (!body?.blog?.title?.trim() || !body?.blog?.summary?.trim()) {
      return NextResponse.json({ ok: false, error: "Missing blog title/summary" }, { status: 400 });
    }

    const slug = body.slug.trim(); // postId
    const key = `video:v1:${slug}`;

    // Preserve created_at if record exists
    type StoredVideoRecord = {
  created_at?: string;
};

const prev = (await kv.get<StoredVideoRecord>(key)) ?? null;

    const createdAt = prev?.created_at || new Date().toISOString();

    const creatorHandle = normalizeHandle(body.creator_handle || "");
    const packSlug = (body.pack_slug || "").trim();
    const packTitle = (body.pack_title || "").trim();
    const format = (body.format || "").trim();

    const record = {
      slug,
      tiktok_url: body.tiktok_url.trim(),
      creator_handle: creatorHandle,
      format,

      pack_slug: packSlug,
      pack_title: packTitle,

      final_label: body.audit.verdict,
      quality_score: Number(body.audit.score),

      blog_title: body.blog.title.trim(),
      summary: body.blog.summary.trim(),
      blog_body: (body.blog.body || "").trim(),

      created_at: createdAt,
      updated_at: new Date().toISOString(),
    };

    // 1) Save audit blog record
    await kv.set(key, record);

    // 2) Latest audits index (newest first)
    {
      const indexKey = "video:index:v1";
      const existing = (await kv.get<string[]>(indexKey)) ?? [];
      const next = [slug, ...existing.filter((x) => x !== slug)];
      await kv.set(indexKey, next);
    }

    // 3) Keep legacy feed schema in sync so /api/feed + HirePassFeed show the latest
    {
      const ts = Date.now();

      // (a) video:base:${id} (metadata used by /api/feed fallback)
      await kv.set(`video:base:${slug}`, {
        tiktok_url: record.tiktok_url,
        added_at: ts,
        format: record.format || "",
      });

      // (b) creator:videos:z:${@handle} (latest post per creator)
      if (creatorHandle) {
        await kv.zadd(`creator:videos:z:${creatorHandle}`, { score: ts, member: slug });

        // ✅ IMPORTANT: timestamp ladder — bump creator to top
        await kv.zadd("creators:z", { score: ts, member: creatorHandle });
      }
    }

    // 4) Optional: collection index (only if pack_slug provided)
    if (packSlug) {
      const idxKey = `collection:v1:${packSlug}`;
      const existing = (await kv.get<string[]>(idxKey)) ?? [];
      const next = [slug, ...existing.filter((x) => x !== slug)];
      await kv.set(idxKey, next);
    }

    return NextResponse.json({
      ok: true,
      slug,
      audit_url: `/video/${slug}`,
    });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}




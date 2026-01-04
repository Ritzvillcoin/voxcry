import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

type Body = {
  adminToken: string;
  title: string;
  description: string;
  category: string;
  videoIds: string[];
  slug: string;
};

type CollectionData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  videoIds: string[];
  added_at: number;
  status: "PUBLISHED" | "DRAFT";
};

export async function POST(req: Request) {
  if (!hasKV()) {
    return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
  }

  const body = (await req.json()) as Partial<Body>;

  // 1) Auth
  if (!process.env.ADMIN_TOKEN || body.adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // 2) Data Normalization
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const category = String(body.category || "social-intelligence").trim();
  const slug = String(body.slug || "").trim().toLowerCase();
  const videoIdsRaw = Array.isArray(body.videoIds) ? body.videoIds : [];
  const videoIds = videoIdsRaw.map(id => String(id).trim()).filter(Boolean);

  if (!title || !slug || videoIds.length < 5) {
    return NextResponse.json({ ok: false, error: "invalid_data" }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000);

  try {
    // 3) Global Video Deduplication Check
    const checks = await Promise.all(
      videoIds.map(async (id) => {
        const usedBy = await kv.get<string>(`video:used:${id}`);
        return { id, usedBy };
      })
    );

    const collisions = checks.filter(x => x.usedBy);
    if (collisions.length) {
      return NextResponse.json({ ok: false, error: "video_already_in_archive", collisions }, { status: 409 });
    }

    // 4) Slug Deduplication
    const existing = await kv.get<CollectionData>(`collection:base:${slug}`);
    if (existing) {
      return NextResponse.json({ ok: false, error: "slug_taken" }, { status: 409 });
    }

    // 5) Build Collection Object
    const collectionData: CollectionData = {
      slug,
      title,
      description,
      category,
      videoIds,
      added_at: now,
      status: "PUBLISHED",
    };

    // 6) ATOMIC PERSISTENCE
    await Promise.all([
      // Store main data
      kv.set(`collection:base:${slug}`, collectionData),
      // Add to main chronological index
      kv.zadd("collections:z", { score: now, member: slug }),
      // Add to category-specific set for filtering
      kv.sadd(`collections:category:${category}`, slug),
      // Mark videos as indexed
      ...videoIds.map(id => kv.set(`video:used:${id}`, slug))
    ]);

    return NextResponse.json({ ok: true, slug, category, status: "INDEXED" });
  } catch (error: unknown) {
    console.error("AUDIT_PERSIST_ERROR:", error);
    return NextResponse.json({ ok: false, error: "database_error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

type Body = {
  adminToken: string;
  title: string;
  description: string;
  videoIds: string[];
  slug: string;
};

type CollectionData = {
  slug: string;
  title: string;
  description: string;
  videoIds: string[];
  added_at: number;
  status: "PUBLISHED" | "DRAFT";
};

function normalizeId(id: string) {
  return String(id || "").trim();
}

function normalizeSlug(slug: string) {
  return String(slug || "").trim().toLowerCase();
}

export async function POST(req: Request) {
  if (!hasKV()) {
    return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
  }

  const body = (await req.json()) as Partial<Body>;

  // 1) Simple Admin Auth
  if (!process.env.ADMIN_TOKEN || body.adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // 2) Validation + normalization
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const slug = normalizeSlug(String(body.slug || ""));
  const videoIdsRaw = Array.isArray(body.videoIds) ? body.videoIds : [];
  const videoIds = videoIdsRaw.map(normalizeId).filter(Boolean);

  if (!title || !slug || videoIds.length < 5) {
    return NextResponse.json(
      { ok: false, error: "missing_fields_or_insufficient_videos" },
      { status: 400 }
    );
  }

  // 3) Block duplicates within this submission
  const seen = new Set<string>();
  const localDupes: string[] = [];
  for (const id of videoIds) {
    if (seen.has(id)) localDupes.push(id);
    seen.add(id);
  }
  if (localDupes.length) {
    return NextResponse.json(
      { ok: false, error: "duplicate_in_submission", duplicates: Array.from(new Set(localDupes)) },
      { status: 400 }
    );
  }

  const now = Math.floor(Date.now() / 1000);

  try {
    // 4) Block duplicates already used anywhere on VoxCry
    // Index key: video:used:<videoId> -> <slug>
    const checks = await Promise.all(
      videoIds.map(async (id) => {
        const usedBy = await kv.get<string>(`video:used:${id}`);
        return { id, usedBy: usedBy || null };
      })
    );

    const collisions = checks.filter((x) => x.usedBy);
    if (collisions.length) {
      return NextResponse.json(
        { ok: false, error: "duplicate_videos", collisions },
        { status: 409 }
      );
    }

    // Optional: prevent overwriting an existing collection slug
    const existing = await kv.get<CollectionData>(`collection:base:${slug}`);
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "slug_already_exists", slug },
        { status: 409 }
      );
    }

    // 5) Write collection
    const collectionData: CollectionData = {
      slug,
      title,
      description,
      videoIds,
      added_at: now,
      status: "PUBLISHED",
    };

    await kv.set(`collection:base:${slug}`, collectionData);

    // 6) Add to index
    await kv.zadd("collections:z", { score: now, member: slug });

    // 7) Mark each video as used by this collection
    await Promise.all(videoIds.map((id) => kv.set(`video:used:${id}`, slug)));

    return NextResponse.json(
      { ok: true, slug, title, added_at: now },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "kv_write_error";
    console.error("ADMIN_WRITE_ERROR:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

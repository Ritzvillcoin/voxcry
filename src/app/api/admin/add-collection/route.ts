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

export async function POST(req: Request) {
  if (!hasKV()) {
    return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
  }

  const body = (await req.json()) as Partial<Body>;

  // 1. Simple Admin Auth
  if (!process.env.ADMIN_TOKEN || body.adminToken !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // 2. Validation
  const { title, description, videoIds, slug } = body;

  if (!title || !slug || !videoIds || videoIds.length < 5) {
    return NextResponse.json({ 
      ok: false, 
      error: "missing_fields_or_insufficient_videos" 
    }, { status: 400 });
  }

  const now = Math.floor(Date.now() / 1000); // unix seconds

  try {
    // 3. Store the Collection Object
    // Key format: collection:base:5-tiktoks-for-panic-attacks
    const collectionData = {
      slug,
      title: title.trim(),
      description: description?.trim() || "",
      videoIds,
      added_at: now,
      status: "PUBLISHED"
    };

    await kv.set(`collection:base:${slug}`, collectionData);

    // 4. Add to Index of All Collections (Sorted Set)
    // This allows you to fetch the latest collections for your UI later
    await kv.zadd("collections:z", { score: now, member: slug });

    return NextResponse.json({
      ok: true,
      slug,
      title,
      added_at: now,
    });

  } catch (error: unknown) {
    // Determine the error message safely
    const message = error instanceof Error ? error.message : "kv_write_error";
    
    console.error("ADMIN_WRITE_ERROR:", message);
    
    return NextResponse.json({ 
        ok: false, 
        error: message 
    }, { status: 500 });
  }
}
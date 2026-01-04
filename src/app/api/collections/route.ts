import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

type Collection = {
  slug: string;
  title: string;
  description: string;
  videoIds: string[];
  status: string;
  added_at: number;
};

export async function GET(request: Request) {
  try {
    if (!hasKV()) {
      return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const start = (page - 1) * limit;
    const stop = start + limit - 1;

    // Fetch slugs and total count in parallel
    const [slugs, totalItems] = await Promise.all([
      kv.zrange<string[]>("collections:z", start, stop, { rev: true }),
      kv.zcard("collections:z")
    ]);

    const safeSlugs = slugs || [];

    // Hydrate objects and filter for PUBLISHED only
    const items = (
      await Promise.all(
        safeSlugs.map(async (slug) => {
          const key = `collection:base:${String(slug).trim().toLowerCase()}`;
          const data = await kv.get<Collection>(key);
          return data && data.status === "PUBLISHED" ? data : null;
        })
      )
    ).filter((c): c is Collection => c !== null);

    // Accurate hasMore: Have we processed fewer slugs than the total existing?
    const hasMore = (start + safeSlugs.length) < totalItems;

    return NextResponse.json({ 
      ok: true, 
      data: items,
      hasMore: hasMore 
    }, { status: 200 });

  } catch (err) {
    console.error("Collections API Error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
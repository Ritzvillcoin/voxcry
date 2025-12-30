import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> } // 1. Change to Promise
) {
  try {
    if (!hasKV()) {
      return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
    }

    // 2. Await the params (Required in newer Next.js versions)
    const resolvedParams = await params;
    const slug = resolvedParams.slug?.toLowerCase();

    if (!slug) {
      return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 });
    }

    const kvKey = `collection:base:${slug}`;
    
    // 3. Fetch from KV
    const collection = await kv.get(kvKey);

    if (!collection) {
      console.warn(`[404] Key not found: ${kvKey}`);
      return NextResponse.json({ ok: false, error: "collection_not_found" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      data: collection
    }, { status: 200 });

  } catch (error) {
    console.error("Collection API Error:", error);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
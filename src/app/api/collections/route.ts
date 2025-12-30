// src/app/api/collections/route.ts
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

export async function GET() {
  try {
    if (!hasKV()) {
      return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 500 });
    }

    // Pull latest slugs from your sorted set (newest first)
    // NOTE: Vercel KV zrange supports { rev: true } for reverse order.
    const slugs =
      (await kv.zrange<string[]>("collections:z", 0, 50, { rev: true })) || [];

    // Hydrate each slug into the full collection object
    const items = (
      await Promise.all(
        slugs.map(async (slug) => {
          const key = `collection:base:${String(slug).trim().toLowerCase()}`;
          const c = await kv.get<Collection>(key);
          return c?.status === "PUBLISHED" ? c : null;
        })
      )
    ).filter(Boolean) as Collection[];

    return NextResponse.json({ ok: true, data: items }, { status: 200 });
  } catch (err) {
    console.error("Collections API Error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}

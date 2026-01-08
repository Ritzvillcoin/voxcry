import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type VideoAudit = {
  slug: string;
  tiktok_url: string;
  creator_handle?: string;

  pack_slug?: string;
  pack_title?: string;

  final_label: "SIGNAL" | "MIXED" | "NOISE";
  quality_score: number;

  blog_title: string;
  summary?: string;
  blog_body?: string;

  created_at: string;
  updated_at?: string;
};

export async function GET() {
  try {
    // Index of audit slugs (latest first)
    const indexKey = "video:index:v1";
    const slugs = (await kv.get<string[]>(indexKey)) ?? [];

    if (!slugs.length) {
      return NextResponse.json({ ok: true, data: null }, { status: 200 });
    }

    // Load the first existing audit (skip deleted/missing)
    for (const slug of slugs.slice(0, 20)) {
      const data = (await kv.get(`video:v1:${slug}`)) as VideoAudit | null;
      if (data) {
        return NextResponse.json({ ok: true, data }, { status: 200 });
      }
    }

    return NextResponse.json({ ok: true, data: null }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}

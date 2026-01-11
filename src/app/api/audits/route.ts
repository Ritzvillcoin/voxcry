import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Define the type here so the API knows what it's returning
type VideoAudit = {
  slug: string;
  blog_title: string;
  final_label: string;
  quality_score: number;
  summary?: string;
  created_at: string;
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const indexKey = "video:index:v1";
    const allSlugs = (await kv.get<string[]>(indexKey)) ?? [];

    if (!allSlugs.length) {
      return NextResponse.json({ ok: true, data: [], hasMore: false });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const pageSlugs = allSlugs.slice(start, end);

    const keys = pageSlugs.map(slug => `video:v1:${slug}`);
    
    // Fix: Specify the type in mget
    const items = await kv.mget<VideoAudit[]>(...keys);

    // Fix: Remove 'any' and use the Type
    const validItems = items.filter((item): item is VideoAudit => item !== null);

    return NextResponse.json({ 
      ok: true, 
      data: validItems,
      hasMore: end < allSlugs.length 
    });
  } catch (err) {
    console.error("Audits List API Error:", err);
    return NextResponse.json({ 
      ok: false, 
      error: err instanceof Error ? err.message : "internal_server_error" 
    }, { status: 500 });
  }
}
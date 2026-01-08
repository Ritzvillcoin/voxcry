// src/app/api/video/[slug]/route.ts
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Ctx = unknown;

function getSlugFromCtx(ctx: Ctx): string {
  if (!ctx || typeof ctx !== "object") return "";
  const params = (ctx as { params?: unknown }).params;
  if (!params || typeof params !== "object") return "";
  const slug = (params as { slug?: unknown }).slug;
  return typeof slug === "string" ? slug.trim() : "";
}

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const slug = getSlugFromCtx(ctx);

    if (!slug) {
      return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    const data = await kv.get(`video:v1:${slug}`);

    if (!data) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: unknown) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}


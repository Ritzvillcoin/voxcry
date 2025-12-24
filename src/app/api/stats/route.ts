import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

function normalizeHandle(input: string) {
  const s = decodeURIComponent((input || "").trim());
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}

async function getKVNumber(key: string): Promise<number> {
  const v = await kv.get(key);
  return typeof v === "number" ? v : Number(v ?? 0);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = normalizeHandle(searchParams.get("handle") || "");

  if (!handle) {
    return NextResponse.json({ ok: false, error: "missing_handle" }, { status: 400 });
  }

  try {
    // Reference your specific KV Schema from the POST route
    const hire = await getKVNumber(`hp:v1:hire:${handle}`);
    const pass = await getKVNumber(`hp:v1:pass:${handle}`);
    
    const total = hire + pass;
    const hirePct = total > 0 ? Math.round((hire / total) * 100) : 0;
    const passPct = total > 0 ? Math.round((pass / total) * 100) : 0;

    // Fetch the video list (ZSET) like your other route
    const idsRaw = await kv.zrange(`creator:videos:z:${handle}`, 0, 0, { rev: true });
    const latestVideoId = idsRaw?.[0] ? String(idsRaw[0]) : null;

    return NextResponse.json({
      ok: true,
      handle,
      stats: {
        hire,
        pass,
        total,
        hirePct,
        passPct
      },
      latestVideoId
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "request_failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
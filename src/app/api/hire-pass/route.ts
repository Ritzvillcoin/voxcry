// src/app/api/hire-pass/route.ts
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

type Vote = "hire" | "pass";

type VoteBody = {
  creator_handle: string;
  vote: Vote;
  voterId: string;
};

function hasKV() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKVNumber(key: string): Promise<number> {
  const v = await kv.get(key);
  return typeof v === "number" ? v : Number(v ?? 0);
}

function isVoteBody(x: unknown): x is VoteBody {
  if (!x || typeof x !== "object") return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.creator_handle === "string" &&
    typeof b.voterId === "string" &&
    (b.vote === "hire" || b.vote === "pass")
  );
}

export async function POST(req: Request) {
  const body: unknown = await req.json();

  if (!isVoteBody(body)) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const { creator_handle, vote, voterId } = body;

  // 1 vote per creator per voter
  const dedupeKey = `hp:v1:voted:${creator_handle}:${voterId}`;

  if (!hasKV()) {
    // No KV configured — fail loudly rather than pretend votes worked.
    return NextResponse.json({ ok: false, error: "kv_not_configured" }, { status: 503 });
  }

  // NX means set only if not exists
  const setResult = await kv.set(dedupeKey, 1, {
    nx: true,
    ex: 60 * 60 * 24 * 365, // 1 year
  });

  const deduped = setResult !== "OK";

  if (!deduped) {
    if (vote === "hire") await kv.incr(`hp:v1:hire:${creator_handle}`);
    else await kv.incr(`hp:v1:pass:${creator_handle}`);
  }

  const hire = await getKVNumber(`hp:v1:hire:${creator_handle}`);
  const pass = await getKVNumber(`hp:v1:pass:${creator_handle}`);
  const total = Math.max(1, hire + pass);

  return NextResponse.json({
    hire,
    pass,
    hirePct: Math.round((hire / total) * 100),
    passPct: Math.round((pass / total) * 100),
    deduped,
  });
}



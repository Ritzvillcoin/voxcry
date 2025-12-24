import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

type Body = { handle?: string; sticker?: string };

export async function POST(req: Request) {
  try {
    const { handle, sticker } = (await req.json()) as Body;

    if (!handle || !sticker) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const key = `sticker:${handle}:${sticker}`;
    await kv.incr(key);

    return NextResponse.json({ success: true });
  } catch (_e: unknown) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

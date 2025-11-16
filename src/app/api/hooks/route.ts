import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("SERVER KEY:", process.env.HF_API_URL);

  const body = await req.json().catch(() => ({}));
  const clientKey = req.headers.get("x-api-key");
  const systemKey = process.env.VOXCRY_API_KEY;

  /*if (!clientKey || clientKey !== systemKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }*/

  const prompt = body.prompt;
  console.log("PROMPT:", prompt);
  if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
  }

  const hfResp = await fetch(process.env.HF_API_URL!, {
    method: "POST",
    headers: {
      //Authorization: `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await hfResp.json();
  return NextResponse.json(data);
}

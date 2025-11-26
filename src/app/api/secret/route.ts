import secret from "@/data/creators.json";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
  const token = req.headers.get("x-api-key");

  if (token !== process.env.MY_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(secret);
}

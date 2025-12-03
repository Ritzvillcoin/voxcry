import { NextResponse } from "next/server";
import data from "@/data/topCreators.json";

export async function GET(req: Request) {
  const apiKey = req.headers.get("x-api-key");

  if (apiKey !== process.env.MY_SECRET_KEY) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    { creators: data },
    { status: 200 }
  );
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {  
  console.log("API HIT");   
  const body = await req.json();
  console.log("BODY:", body);

  const filePath = path.join(process.cwd(), "data", "creators_submit.json");

  let existing = [];

  // load existing json
  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    existing = JSON.parse(raw);
  }

  existing.push({
    ...body,
    created_at: new Date().toISOString(),
  });

  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

  return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.error();
  }
}

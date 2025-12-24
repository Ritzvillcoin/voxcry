import { kv } from "@vercel/kv";
import Nav from "@/app/components/Nav";
import TikTokEmbed from "@/app/components/TikTokEmbed";
import StickerWall from "@/app/components/StickerWall";
import Link from "next/link";
import Footer from "@/app/components/Footer";

// List of stickers we want to track
const STICKER_LIST = ["W", "L", "AURA", "MID", "COOKED", "MUNCH"];

async function getKVNumber(key: string): Promise<number> {
  const v = await kv.get(key);
  return typeof v === "number" ? v : Number(v ?? 0);
}

export default async function SharePage({ params }: { params: Promise<{ handle: string }> }) {
  // 1. Await and decode the handle
  const { handle: rawHandle } = await params;
  const decoded = decodeURIComponent(rawHandle);
  const handle = decoded.startsWith('@') ? decoded : `@${decoded}`;

  // 2. Fetch Vote Stats
  const hire = await getKVNumber(`hp:v1:hire:${handle}`);
  const pass = await getKVNumber(`hp:v1:pass:${handle}`);
  
  const total = hire + pass;
  const hirePct = total > 0 ? Math.round((hire / total) * 100) : 0;
  const isViral = hirePct >= 50;

  // 3. Fetch Sticker Stats
  const stickerCounts: Record<string, number> = {};
  for (const s of STICKER_LIST) {
    stickerCounts[s] = await getKVNumber(`sticker:${handle}:${s}`);
  }

  // 4. Fetch latest video ID
  const idsRaw = await kv.zrange(`creator:videos:z:${handle}`, 0, 0, { rev: true });
  const latestVideoId = idsRaw?.[0] ? String(idsRaw[0]) : null;

  return (
    <main className="min-h-screen bg-white pb-24">
      <Nav />
      
      <div className="mx-auto max-w-xl px-4 pt-32">
        
        {/* --- SECTION 1: THE IDENTITY --- */}
        <div className="border-[4px] border-black bg-black p-6 mb-8 shadow-[10px_10px_0px_0px_rgba(173,255,0,1)]">
          <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase break-all leading-tight">
            {handle}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-2 w-2 rounded-full bg-[#ADFF00] animate-pulse" />
            <p className="text-[#ADFF00] font-black text-[10px] uppercase tracking-[0.2em]">Live Scout Report</p>
          </div>
        </div>

      {/* --- SECTION 2: THE MAIN SCORE (CONDENSED) --- */}
<div className="border-[4px] border-black bg-white p-6 mb-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
  <p className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest italic leading-none">
    Community Vibe Check
  </p>
  
  <div className="flex items-center justify-center gap-6">
    {/* Percentage: Large but controlled */}
    <div className="text-7xl font-black italic tracking-tighter leading-none select-none">
      {hirePct}%
    </div>

    {/* Vertical Divider */}
    <div className="h-12 w-[2px] bg-black/10" />

    {/* Badge & Stats Stack */}
    <div className="flex flex-col items-start">
      <div className={`
        border-[3px] border-black px-4 py-1 text-xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2
        ${isViral ? 'bg-[#ADFF00]' : 'bg-zinc-200'}
      `}>
        {isViral ? 'VIRAL 🔥' : 'FLOP 🧊'}
      </div>
      <div className="flex gap-2 items-baseline">
        <span className="text-[10px] font-black uppercase text-zinc-400">Scouts:</span>
        <span className="font-black text-sm">{total}</span>
      </div>
    </div>
  </div>
</div>
        {/* --- SECTION 3: STICKER WALL (INTERACTIVE) --- */}
        <div className="mb-8">
          <StickerWall handle={handle} initialCounts={stickerCounts} />
        </div>

       {/* THE "DISAGREE" BUTTON - SENDS USER TO FEED WITH FOCUS */}
        <Link href={`/?scout=${rawHandle}`} className="group block border-[4px] border-black bg-black p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0px_8px_0px_0px_rgba(173,255,0,1)] mb-8">
          <p className="font-black italic text-2xl uppercase text-white group-hover:text-[#ADFF00]">Disagree with the stats? ⚔️</p>
          <p className="text-[10px] uppercase font-bold text-zinc-500 mt-1">Vote for {handle} in the live feed</p>
        </Link>

        {/* --- SECTION 5: THE EVIDENCE --- */}
        {latestVideoId && (
          <div className="border-[4px] border-black p-5 bg-zinc-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black uppercase text-xs tracking-widest italic">Latest Evidence</h3>
              <div className="h-[2px] flex-1 bg-black/10 mx-4" />
            </div>
            <TikTokEmbed videoUrl={`https://www.tiktok.com/${handle}/video/${latestVideoId}`} />
          </div>
        )}

      </div>
       <Footer />
    </main>
    
  );
}
"use client";

import { useState } from "react";

const STICKERS = ["W", "L", "AURA", "MID", "COOKED", "MUNCH"];

// Helper to give a "random" feel to rotations
const getRotation = (index: number) => {
  const rotations = ["rotate-1", "-rotate-2", "rotate-3", "-rotate-1", "rotate-2", "-rotate-3"];
  return rotations[index % rotations.length];
};

export default function StickerWall({ handle, initialCounts }: { handle: string, initialCounts: Record<string, number> }) {
  const [counts, setCounts] = useState(initialCounts);
  const [loading, setLoading] = useState<string | null>(null);

  async function addSticker(sticker: string) {
    if (loading) return;
    setLoading(sticker);

    try {
      const res = await fetch("/api/sticker", {
        method: "POST",
        body: JSON.stringify({ handle, sticker }),
      });
      const data = await res.json();
      if (data.success) {
        setCounts(prev => ({ ...prev, [sticker]: (prev[sticker] || 0) + 1 }));
      }
    } catch (e) {
      console.error("Failed to slap sticker", e);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="w-full border-[4px] border-black bg-[#ADFF00] p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black uppercase italic leading-none tracking-tighter text-black">
          The Room is Saying...
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase">Live</span>
        </div>
      </div>
      
      {/* RANDOMIZED FLEX LAYOUT */}
      <div className="flex flex-wrap justify-center gap-4">
        {STICKERS.map((s, i) => (
          <button
            key={s}
            onClick={() => addSticker(s)}
            disabled={!!loading}
            className={`
              ${getRotation(i)}
              group relative flex items-center gap-3 bg-white border-[3px] border-black py-2 px-4
              shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:scale-95 transition-all
              ${loading === s ? "opacity-50" : "opacity-100"}
            `}
          >
            {/* THE WORD */}
            <span className="text-2xl font-black italic uppercase tracking-tighter leading-none">
              {s}
            </span>
            
            {/* THE NUMBER */}
            <span className="text-sm font-black tabular-nums border-l-2 border-black pl-2">
              {counts[s] || 0}
            </span>
          </button>
        ))}
      </div>
      
      <p className="mt-8 text-center text-[10px] font-black uppercase text-black/40 italic tracking-widest">
        Tap to slap a tag on {handle}
      </p>
    </div>
  );
}
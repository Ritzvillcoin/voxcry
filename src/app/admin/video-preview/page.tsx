"use client";

import { useState } from "react";
import TikTokEmbed from "@/app/components/TikTokEmbed";
import Link from "next/link";

type Item = {
  video_id: string;
  tiktok_url: string;
  added_at: number;
};

function normalizeHandle(input: string) {
  const s = (input || "").trim();
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}

export default function AdminVideoPreviewPage() {
  const [handle, setHandle] = useState("");
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function load() {
    const h = normalizeHandle(handle);
    if (!h) {
      setError("Enter a creator handle (ex: @infiniteelliott)");
      return;
    }

    setLoading(true);
    setError("");
    setItem(null);

    try {
      const res = await fetch(
        `/api/admin/creator-videos?handle=${encodeURIComponent(h)}&limit=1`,
        { cache: "no-store" }
      );

      const data = (await res.json()) as { ok?: boolean; error?: string; items?: Item[] };

      if (!res.ok || !data.ok) {
        setError(data?.error || `Request failed: ${res.status}`);
        return;
      }

      const first = Array.isArray(data.items) ? data.items[0] : null;
      if (!first) {
        setError("No videos found for that handle.");
        return;
      }

      setItem(first);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "request_failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* MAIN CONTAINER */}
      <div className="border-[4px] border-black bg-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[4px] border-black pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Check My Video
            </h1>
            <p className="text-[11px] font-bold uppercase text-zinc-500 mt-1">
              Admin Debugger v1.0
            </p>
          </div>

          <Link
            href="/"
            className="inline-block bg-black text-white px-4 py-2 font-black uppercase italic text-xs shadow-[4px_4px_0px_0px_rgba(173,255,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            ← Back to Feed
          </Link>
        </div>

        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_160px]">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@infiniteelliott"
            className="w-full border-[3px] border-black bg-zinc-50 px-4 py-4 font-bold placeholder:text-zinc-400 outline-none focus:bg-[#ADFF00]/10 transition-colors"
          />

          <button
            onClick={load}
            disabled={loading}
            className="w-full border-[3px] border-black bg-[#ADFF00] py-4 font-black uppercase italic text-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 disabled:opacity-50 transition-all"
          >
            {loading ? "..." : "LOAD SCAN"}
          </button>
        </div>

        {/* STATUS MESSAGES */}
        {error && (
          <div className="mt-6 border-[3px] border-black bg-red-100 p-4 font-bold text-red-600 uppercase text-xs italic">
            Error: {error}
          </div>
        )}

        {!loading && !error && !item && (
          <div className="mt-6 border-[3px] border-black bg-zinc-100 p-8 text-center">
            <p className="text-xs font-black uppercase text-zinc-400 tracking-widest italic">
              System Idle. Awaiting Handle.
            </p>
          </div>
        )}

        {/* VIDEO PREVIEW RESULT */}
        {item && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="border-[4px] border-black bg-black p-2 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
               <TikTokEmbed videoUrl={item.tiktok_url} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-[3px] border-black bg-zinc-50 p-4">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400">Database Entry</p>
                <p className="font-mono text-xs font-bold">{item.video_id}</p>
              </div>
              
              <a
                href={item.tiktok_url}
                target="_blank"
                rel="noreferrer"
                className="bg-black text-white px-4 py-2 font-black uppercase italic text-[11px] hover:bg-[#ADFF00] hover:text-black transition-colors"
              >
                Open Source URL ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER DECORATION */}
      <p className="mt-8 text-center text-[10px] font-black uppercase text-zinc-400 italic tracking-[0.3em]">
        VoxCry Internal Verification System
      </p>
    </div>
  );
}



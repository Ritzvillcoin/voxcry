"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TikTokEmbed from "./TikTokEmbed";

type FeedItem = {
  creator_handle: string;
  tiktok_link: string;
};

type VoteResult = {
  hire: number;
  pass: number;
  hirePct: number;
  passPct: number;
  deduped?: boolean;
};

function getOrCreateVoterId() {
  if (typeof window === "undefined") return "";
  const key = "voxcry_voter_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function normalizeHandle(h: string) {
  const s = (h || "").trim();
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}

function extractVideoId(url: string) {
  const m = (url || "").match(/\/video\/(\d+)/);
  return m?.[1] ?? null;
}

export default function HirePassFeed({
  showResultMs = 900,
  autoAdvance = false,
  limit = 200,
  openLabel = "VIEW ON TIKTOK",
}: {
  showResultMs?: number;
  autoAdvance?: boolean;
  limit?: number;
  openLabel?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VoteResult | null>(null);
  const [voterId, setVoterId] = useState<string>("");
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setVoterId(getOrCreateVoterId());
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/feed?limit=${encodeURIComponent(String(limit))}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Feed API failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setFeed(data?.items || []);
          setIndex(0);
          setResult(null);
        }
     } catch (e: unknown) {
  const message = e instanceof Error ? e.message : "request_failed";
  setLoadError(message);
} finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [limit]);

  useEffect(() => {
    if (!feed.length) return;
    if (index < 0 || index >= feed.length) {
      setIndex(0);
      setResult(null);
    }
  }, [feed.length, index]);

  const current = feed[index];

  // FIXED: Safety guards for useMemo
  const currentHandle = useMemo(() => {
    if (!current) return "";
    return normalizeHandle(current.creator_handle || "");
  }, [current]);

  const currentVideoId = useMemo(() => {
    if (!current) return null;
    return extractVideoId(current.tiktok_link || "");
  }, [current]);

  function next() {
    if (!feed.length) return;
    setResult(null);
    setIndex((prev) => (prev + 1) % feed.length);
  }

  function openInTikTok() {
    if (!current?.tiktok_link) return;
    window.open(current.tiktok_link, "_blank", "noopener,noreferrer");
  }

  async function vote(v: "hire" | "pass") {
    if (!current || busy || result) return;
    setBusy(true);
    try {
      const id = voterId || getOrCreateVoterId();
      const res = await fetch("/api/hire-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_handle: currentHandle,
          vote: v,
          voterId: id,
        }),
      });
      const data = await res.json();
      setResult(data);
      if (autoAdvance) window.setTimeout(() => next(), showResultMs);
    } catch {
      setResult({ hire: 0, pass: 0, hirePct: 0, passPct: 0 });
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="text-center py-20 font-black italic uppercase animate-pulse">Scouting...</div>;
  if (loadError || !current) return <div className="text-center py-20 text-zinc-500 underline uppercase">{loadError || "Empty Feed"}</div>;

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideoId ?? index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Main Neo-Brutalist Container */}
          <div className="border-[4px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-5">
            
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-5">
              <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                UGC SCOUT v1.0
              </div>
              <div className="font-black text-black tabular-nums italic">
                {/*{index + 1}/{feed.length}*/}
                 <button
                onClick={openInTikTok}
                className="w-full text-center font-black uppercase text-[11px] tracking-tighter text-black underline decoration-[3px] decoration-[#ADFF00] underline-offset-4"
              >
                {openLabel}
              </button>
              </div>
            </div>

            {/* TikTok Embed Area */}
            <div className="border-[4px] border-black bg-zinc-100 h-[460px] w-full overflow-hidden relative mb-6">
              <div className="h-full w-full" onClick={(e) => e.stopPropagation()}>
                <TikTokEmbed key={currentVideoId} videoUrl={current.tiktok_link} />
              </div>
            </div>

            {/* Voting or Results */}
            {!result ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  disabled={busy}
                  onClick={(e) => { e.stopPropagation(); vote("hire"); }}
                  className="bg-[#ADFF00] border-[4px] border-black py-4 text-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  Viral 🔥
                </button>
                <button
                  disabled={busy}
                  onClick={(e) => { e.stopPropagation(); vote("pass"); }}
                  className="bg-zinc-200 border-[4px] border-black py-4 text-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-zinc-500"
                >
                  Flop 🧊
                </button>
              </div>
            ) : (
              <div className="border-[4px] border-black p-4 bg-zinc-50 space-y-4">
                <div className="flex justify-between font-black uppercase text-xs">
                  <span>Audience Verdict</span>
                  <span className="text-zinc-400">{result.hire + result.pass} Votes</span>
                </div>
                
                <div className="h-10 border-[4px] border-black bg-white flex overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.hirePct}%` }}
                    className="h-full bg-[#ADFF00] border-r-[4px] border-black" 
                  />
                </div>
                
                <div className="flex justify-between font-black text-[10px] uppercase">
                  <span>Viral: {result.hirePct}%</span>
                  <span>Flop: {result.passPct}%</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="w-full bg-black text-white py-4 font-black uppercase italic text-lg hover:bg-zinc-800 transition-all"
                >
                  Next Candidate →
                </button>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-6 space-y-3">
             

              {!result && (
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="w-full text-center font-black uppercase text-[10px] text-zinc-400 hover:text-black transition-colors"
                >
                  Skip this one
                </button>
              )}
            </div>
          </div>

          {/* Background Offset Decor */}
          <div className="absolute -top-3 -left-3 -z-10 w-full h-full border-[2px] border-black/10" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}






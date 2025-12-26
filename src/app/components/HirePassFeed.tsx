"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TikTokEmbed from "./TikTokEmbed";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FeedItem = {
  creator_handle: string;
  tiktok_link: string;
  format?: string; // ✅ NEW
};

type VoteResult = {
  hire: number;
  pass: number;
  hirePct: number;
  passPct: number;
  deduped?: boolean;
};

type HirePassFeedProps = {
  limit?: number;
  openLabel?: string;
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

// Wrapper for Suspense + searchParams
export default function HirePassFeed(props: HirePassFeedProps) {
  return (
    <Suspense
      fallback={
        <div className="text-center py-20 font-black italic uppercase animate-pulse">
          Loading Feed...
        </div>
      }
    >
      <FeedContent {...props} />
    </Suspense>
  );
}

function FeedContent({ limit = 50, openLabel = "VIEW ON TIKTOK" }: HirePassFeedProps) {
  const searchParams = useSearchParams();
  const scoutTarget = searchParams.get("scout");

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
        let url = `/api/feed?limit=${encodeURIComponent(String(limit))}`;
        if (scoutTarget) url += `&focus=${encodeURIComponent(scoutTarget)}`;

        const res = await fetch(url, { cache: "no-store" });
        const data = (await res.json()) as { items?: FeedItem[] };

        if (!cancelled) {
          setFeed(Array.isArray(data.items) ? data.items : []);
          setIndex(0);
          setResult(null);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load feed";
        if (!cancelled) setLoadError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [limit, scoutTarget]);

  const current = feed[index];

  const currentHandle = useMemo(
    () => (current ? normalizeHandle(current.creator_handle) : ""),
    [current]
  );

  const currentVideoId = useMemo(
    () => (current ? extractVideoId(current.tiktok_link) : null),
    [current]
  );

  const cleanHandle = useMemo(() => currentHandle.replace("@", ""), [currentHandle]);

  const currentFormat = useMemo(() => {
    const f = (current?.format || "").trim();
    return f || "—";
  }, [current]);

  function next() {
    if (!feed.length) return;
    setResult(null);
    setIndex((prev) => (prev + 1) % feed.length);
  }

  const shareResult = async () => {
    if (!current) return;

    const shareUrl = `https://www.voxcry.com/${cleanHandle}`;
    const shareData = {
      title: "Voxcry Vibe Check",
      text: `The verdict is in for ${currentHandle}. See the official report:`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled share
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied! 📋");
      } catch {
        // clipboard blocked
      }
    }
  };

  async function vote(v: "hire" | "pass") {
    if (!current || busy || result) return;

    setBusy(true);
    try {
      const res = await fetch("/api/hire-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_handle: currentHandle,
          vote: v,
          voterId: voterId || getOrCreateVoterId(),
        }),
      });

      const data = (await res.json()) as VoteResult;
      setResult(data);
    } catch {
      setResult({ hire: 0, pass: 0, hirePct: 0, passPct: 0 });
    } finally {
      setBusy(false);
    }
  }

  if (loading)
    return (
      <div className="text-center py-20 font-black italic uppercase animate-pulse">
        Scouting...
      </div>
    );

  if (loadError || !current)
    return (
      <div className="text-center py-20 text-zinc-500 underline uppercase">
        {loadError || "Empty Feed"}
      </div>
    );

  return (
    <div className="relative mx-auto max-w-md px-4 py-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideoId ?? index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="relative"
        >
          <div className="border-[4px] border-black bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-5">
            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase">
                  {scoutTarget === cleanHandle ? "CHALLENGE MODE ⚔️" : "UGC SCOUT v1.0"}
                </div>

                {/* ✅ NEW: Skip button (works anytime, no vote required) */}
                <button
                  type="button"
                  onClick={next}
                  disabled={busy || feed.length <= 1}
                  className="border-[3px] border-black bg-white px-2 py-[2px] text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50"
                  title="Skip to next"
                >
                  Skip →
                </button>
              </div>

              <button
                type="button"
                onClick={() => window.open(current.tiktok_link, "_blank")}
                className="font-black uppercase text-[11px] text-black underline decoration-[3px] decoration-[#ADFF00] underline-offset-4"
              >
                {openLabel}
              </button>
            </div>

            {/* FORMAT LABEL */}
            <div className="mb-4 flex items-center gap-2">
              <span className="bg-[#ADFF00] border-[3px] border-black px-2 py-[2px] text-[10px] font-black uppercase">
                FORMAT
              </span>
              <span className="text-[12px] font-black uppercase text-black">{currentFormat}</span>
            </div>

            <div className="border-[4px] border-black bg-zinc-100 h-[460px] w-full overflow-hidden relative mb-6">
              <TikTokEmbed
                key={currentVideoId ?? current.tiktok_link}
                videoUrl={current.tiktok_link}
              />
            </div>

            {!result ? (
              <div className="grid grid-cols-2 gap-4">
                <button
                  disabled={busy}
                  onClick={() => vote("hire")}
                  className="bg-[#ADFF00] border-[4px] border-black py-4 text-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  Viral 🔥
                </button>
                <button
                  disabled={busy}
                  onClick={() => vote("pass")}
                  className="bg-zinc-200 border-[4px] border-black py-4 text-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-zinc-500"
                >
                  Flop 🧊
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <Link
                  href={`/${cleanHandle}`}
                  className="group block border-[4px] border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-zinc-400 leading-none">
                    Verdict Locked 🔒
                  </p>
                  <p className="font-black italic text-2xl uppercase leading-none group-hover:text-[#ADFF00] transition-colors">
                    VIEW SCOUT REPORT
                  </p>
                  <p className="text-[10px] font-bold uppercase mt-2 opacity-60">
                    See the community vibe check
                  </p>
                </Link>

                <button
                  onClick={shareResult}
                  className="w-full bg-[#ADFF00] border-[4px] border-black py-4 font-black uppercase italic text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  SEND VIBE CHECK ⚡
                </button>

                {/* ✅ Removed: "Next Candidate →" button */}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}








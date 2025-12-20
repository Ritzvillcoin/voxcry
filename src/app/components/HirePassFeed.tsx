"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import TikTokEmbed from "./TikTokEmbed";

type FeedItem = {
  creator_handle: string; // "@handle" (or "handle" — we'll normalize)
  tiktok_link: string;    // TikTok VIDEO URL
};

type VoteResult = {
  hire: number;
  pass: number;
  hirePct: number;
  passPct: number;
  deduped?: boolean;
};

function getOrCreateVoterId() {
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
  subtitle = "Will this creator go viral?",
  showResultMs = 900, // used only if autoAdvance=true
  autoAdvance = false, // manual next by default
  limit = 200,
}: {
  subtitle?: string;
  showResultMs?: number;
  autoAdvance?: boolean;
  limit?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VoteResult | null>(null);

  // hydration-safe: do NOT read localStorage / crypto during render
  const [voterId, setVoterId] = useState<string>("");

  // feed from KV (via /api/feed)
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>("");

  const [index, setIndex] = useState(0);

  // after mount: set voterId
  useEffect(() => {
    setVoterId(getOrCreateVoterId());
  }, []);

  // load feed
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

        const data = (await res.json()) as { items?: FeedItem[] };
        const items = Array.isArray(data?.items) ? data.items : [];

        if (!cancelled) {
          setFeed(items);
          setIndex(0);
          setResult(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setFeed([]);
          setLoadError(e?.message || "Failed to load feed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  // keep index valid if feed changes
  useEffect(() => {
    if (!feed.length) return;
    if (index < 0 || index >= feed.length) {
      setIndex(0);
      setResult(null);
    }
  }, [feed.length, index]);

  const current = feed[index];

  const currentHandle = useMemo(() => normalizeHandle(current?.creator_handle || ""), [current]);
  const currentVideoId = useMemo(() => extractVideoId(current?.tiktok_link || ""), [current]);

  function next() {
    if (!feed.length) return;
    setResult(null);
    setIndex((prev) => (prev + 1) % feed.length);
  }

  async function vote(v: "hire" | "pass") {
    // prevent voting again once result is shown
    if (!current || busy || result) return;

    setBusy(true);
    try {
      const id = voterId || getOrCreateVoterId();
      if (!voterId) setVoterId(id);

      const res = await fetch("/api/hire-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_handle: currentHandle, // ✅ matches your vote keys hp:v1:hire:@handle
          vote: v,
          voterId: id,
        }),
      });

      const data = (await res.json()) as VoteResult;
      setResult(data);

      if (autoAdvance) {
        window.setTimeout(() => next(), showResultMs);
      }
    } catch {
      setResult({ hire: 0, pass: 0, hirePct: 0, passPct: 0, deduped: false });
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center text-gray-300">
        Loading feed…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center text-gray-300">
        <div className="text-white font-semibold">Failed to load feed</div>
        <div className="mt-2 text-xs text-gray-400">{loadError}</div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center text-gray-300">
        No creators/videos found in KV.
      </div>
    );
  }

  const hirePct = result?.hirePct ?? 0;
  const passPct = result?.passPct ?? 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentHandle}:${currentVideoId ?? index}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.18 }}
          className="rounded-3xl bg-zinc-900/70 p-4 shadow-xl ring-1 ring-white/10"
          onClick={() => {
            // tap card to go Next, but only after voting
            if (result && !busy) next();
          }}
          role="button"
        >
          {/* Header: handle only */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-white">{currentHandle}</div>
              <div className="mt-1 text-xs text-gray-500">{subtitle}</div>
            </div>

            <div className="text-right text-xs text-gray-500">
              {index + 1}/{feed.length}
            </div>
          </div>

          {/* TikTok (always visible) */}
          <div className="mt-4 overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10">
            <div className="px-2 pb-3 pt-2" onClick={(e) => e.stopPropagation()}>
              <TikTokEmbed key={currentVideoId ?? current.tiktok_link} videoUrl={current.tiktok_link} />
            </div>
          </div>

          {/* Vote Buttons */}
          {!result ? (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation();
                  vote("hire");
                }}
                className="rounded-2xl bg-white py-3 font-bold text-black disabled:opacity-60"
              >
                VIRAL ✅
              </button>
              <button
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation();
                  vote("pass");
                }}
                className="rounded-2xl bg-zinc-800 py-3 font-bold text-white disabled:opacity-60"
              >
                FLOP ❌
              </button>
            </div>
          ) : null}

          {/* Crowd verdict (stays until Next) */}
          {result ? (
            <div className="mt-4 rounded-2xl bg-black/30 p-4 ring-1 ring-white/10">
              <div className="mb-2 text-sm font-semibold text-white">
                Crowd verdict
                {result.deduped ? (
                  <span className="ml-2 text-xs font-normal text-gray-400">
                    (your vote already counted)
                  </span>
                ) : null}
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-3 bg-white"
                  style={{ width: `${Math.max(0, Math.min(100, hirePct))}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-xs text-gray-300">
                <span>
                  Viral {hirePct}% ({result.hire})
                </span>
                <span>
                  Flop {passPct}% ({result.pass})
                </span>
              </div>

              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="w-full rounded-2xl bg-white py-3 font-bold text-black"
                >
                  Next →
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-gray-500">
                Tip: you can also tap the card to go Next.
              </p>
            </div>
          ) : (
            <div className="mt-3 text-center text-xs text-gray-500">Vote after watching.</div>
          )}

          {/* Optional skip before voting */}
          {!result ? (
            <div className="mt-3 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                disabled={busy}
                className="text-xs text-gray-400 underline underline-offset-4 disabled:opacity-60"
              >
                Skip → next
              </button>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}






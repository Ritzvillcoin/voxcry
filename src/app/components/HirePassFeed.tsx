"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import creators from "@/data/mobile-app-creators.json";

export type CreatorItem = {
  creator_name: string;
  creator_handle: string;
  tiktok_link: string;

  followers?: string;
  posting_frequency?: string;
  category?: string;
  niche?: string;
  region?: string;
  performance_health?: string;
  risk_score?: string;
  start_from?: string;
  notes?: string;

  cover_image?: string; // optional thumbnail/screenshot URL
};

type VoteResult = {
  hire: number;
  pass: number;
  hirePct: number;
  passPct: number;
  deduped?: boolean;
};

function getOrCreateVoterId() {
  if (typeof window === "undefined") return "server";
  const key = "voxcry_voter_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function pickNextIndexWithHistory(
  list: CreatorItem[],
  currentIndex: number,
  excludeHandles: string[]
) {
  const n = list.length;
  if (n <= 1) return 0;

  // 1) avoid last-N
  let exclude = new Set(excludeHandles);
  let candidates: number[] = [];
  for (let i = 0; i < n; i++) {
    if (!exclude.has(list[i].creator_handle)) candidates.push(i);
  }
  if (candidates.length) return candidates[randomInt(candidates.length)];

  // 2) fallback: avoid only immediate repeat
  exclude = new Set([list[currentIndex].creator_handle]);
  candidates = [];
  for (let i = 0; i < n; i++) {
    if (!exclude.has(list[i].creator_handle)) candidates.push(i);
  }
  if (candidates.length) return candidates[randomInt(candidates.length)];

  // 3) worst case
  return currentIndex;
}

export default function HirePassFeed({
  //title = "Hire or Pass: Mobile App Creators",
  subtitle = "Will this creator go viral?",
  showResultMs = 900, // used only if autoAdvance=true
  historySize = 10,
  autoAdvance = false, // ✅ manual next by default
}: {
  title?: string;
  subtitle?: string;
  showResultMs?: number;
  historySize?: number;
  autoAdvance?: boolean;
}) {
  const list = creators as unknown as CreatorItem[];

  const [busy, setBusy] = useState(false);
  //const [voterId, setVoterId] = useState("");
  const [result, setResult] = useState<VoteResult | null>(null);
  const [voterId] = useState(() => getOrCreateVoterId());

  // random starting creator
  const [index, setIndex] = useState(() =>
    list.length ? randomInt(list.length) : 0
  );

  // session-only: no repeats in last N
  const recentRef = useRef<string[]>([]);

  //useEffect(() => setVoterId(getOrCreateVoterId()), []);

  // keep index valid if list changes
  useEffect(() => {
    if (!list.length) return;

    if (index < 0 || index >= list.length) {
      setIndex(randomInt(list.length));
      setResult(null);
    }

    // prune recent list to handles that still exist
    const valid = new Set(list.map((c) => c.creator_handle));
    recentRef.current = recentRef.current.filter((h) => valid.has(h)).slice(0, historySize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.length]);

  const current = list[index];

  function next() {
    if (!current || !list.length) return;

    setResult(null);

    // Update recent history: put current at the front, keep unique, trim to historySize
    const updatedRecent = [
      current.creator_handle,
      ...recentRef.current.filter((h) => h !== current.creator_handle),
    ].slice(0, historySize);

    recentRef.current = updatedRecent;

    // Pick next index not in recent list
    const nextIndex = pickNextIndexWithHistory(list, index, updatedRecent);
    setIndex(nextIndex);
  }

  async function vote(v: "hire" | "pass") {
    // ✅ prevent voting again once result is shown; user must hit Next
    if (!current || busy || result) return;

    setBusy(true);
    try {
      const res = await fetch("/api/hire-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creator_handle: current.creator_handle,
          vote: v,
          voterId,
        }),
      });

      const data = (await res.json()) as VoteResult;
      setResult(data);

      // optional auto-advance
      if (autoAdvance) {
        window.setTimeout(() => next(), showResultMs);
      }
    } catch {
      // If API fails, still show something and allow next
      setResult({ hire: 0, pass: 0, hirePct: 0, passPct: 0, deduped: false });
    } finally {
      setBusy(false);
    }
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center text-gray-300">
        No creators loaded.
      </div>
    );
  }

  const hirePct = result?.hirePct ?? 0;
  const passPct = result?.passPct ?? 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
     {/* <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
      </div> */}

      <AnimatePresence mode="wait">
        <motion.div
          key={current.creator_handle}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.18 }}
          className="rounded-3xl bg-zinc-900/70 p-4 shadow-xl ring-1 ring-white/10"
          onClick={() => {
            // ✅ tap card to go Next, but only after voting
            if (result && !busy) next();
          }}
          role="button"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-white">
                {current.creator_name}
              </div>
              <a
                href={current.tiktok_link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-gray-300 underline underline-offset-4"
                onClick={(e) => e.stopPropagation()}
              >
                @{current.creator_handle}
              </a>
            </div>

            <div className="text-right text-xs text-gray-400">
              <div>{current.followers ?? ""}</div>
              <div>{current.region ?? ""}</div>
            </div>
          </div>

          {/* Media */}
          {current.cover_image ? (
            <div className="mt-4 overflow-hidden rounded-2xl">
              <img
                src={current.cover_image}
                alt={current.creator_name}
                className="h-[520px] w-full object-cover"
                draggable={false}
              />
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-zinc-800/60 p-5 text-sm text-gray-300">
              <div className="font-semibold text-white">Niche</div>
              <div className="mt-1">{current.niche ?? "—"}</div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-zinc-900/60 p-3">
                  <div className="text-gray-400">Performance</div>
                  <div className="mt-1 text-white">
                    {current.performance_health ?? "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-zinc-900/60 p-3">
                  <div className="text-gray-400">Risk</div>
                  <div className="mt-1 text-white">{current.risk_score ?? "—"}</div>
                </div>
              </div>
            </div>
          )}

          {/* Vote Buttons (hidden once voted) */}
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
                <span>Viral {hirePct}% ({result.hire})</span>
                <span>Flop {passPct}% ({result.pass})</span>
              </div>

              {/* Manual Next row */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="w-full rounded-2xl bg-white py-3 font-bold text-black"
                >
                  Next →
                </button>

                <a
                  href={current.tiktok_link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full rounded-2xl bg-zinc-800 py-3 text-center font-bold text-white"
                >
                  Watch
                </a>
              </div>

              <p className="mt-3 text-center text-xs text-gray-500">
                Tip: you can also tap the card to go Next.
              </p>
            </div>
          ) : (
            <div className="mt-3 text-center text-xs text-gray-500">
              No repeats in the last {historySize} creators (per session).
            </div>
          )}

          {/* Optional manual skip when not voted */}
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
                Skip → next creator
              </button>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}



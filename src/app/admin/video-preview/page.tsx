"use client";

import { useState } from "react";
import TikTokEmbed from "@/app/components/TikTokEmbed";

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
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [limit, setLimit] = useState<number>(6);

  async function load() {
    const h = normalizeHandle(handle);
    if (!h) {
      setError("Enter a creator handle (ex: @infiniteelliott)");
      return;
    }

    setLoading(true);
    setError("");
    setItems([]);

    try {
      const res = await fetch(
        `/api/admin/creator-videos?handle=${encodeURIComponent(h)}&limit=${encodeURIComponent(
          String(limit)
        )}`,
        { cache: "no-store" }
      );

      const data = (await res.json()) as { ok?: boolean; error?: string; items?: Item[] };

      if (!res.ok || !data.ok) {
        setError(data?.error || `Request failed: ${res.status}`);
        return;
      }

      setItems(Array.isArray(data.items) ? data.items : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "request_failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl bg-zinc-900/70 p-5 shadow-xl ring-1 ring-white/10">
        <div className="text-xl font-bold text-white">Admin — Video preview</div>
        <div className="mt-1 text-sm text-gray-400">
          Enter a handle to load newest videos from KV and preview in the embed player.
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px_140px]">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@infiniteelliott"
            className="w-full rounded-xl bg-zinc-800 px-3 py-3 text-white outline-none ring-1 ring-white/10"
          />

          <input
            value={String(limit)}
            onChange={(e) => {
              const n = Number(e.target.value);
              setLimit(Number.isFinite(n) ? Math.max(1, Math.min(20, n)) : 6);
            }}
            inputMode="numeric"
            className="w-full rounded-xl bg-zinc-800 px-3 py-3 text-white outline-none ring-1 ring-white/10"
            title="Limit"
          />

          <button
            onClick={load}
            disabled={loading}
            className="w-full rounded-2xl bg-white py-3 font-bold text-black shadow-sm active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load videos"}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm text-red-200 ring-1 ring-white/10">
            {error}
          </div>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm text-gray-400 ring-1 ring-white/10">
            No videos found. Make sure these exist:
            <div className="mt-2 text-xs text-gray-500">
              ZSET: <span className="text-gray-300">creator:videos:z:@handle</span>
              <br />
              JSON: <span className="text-gray-300">video:base:&lt;post_id&gt;</span> with{" "}
              <span className="text-gray-300">tiktok_url</span>
            </div>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {items.map((it) => (
            <div
              key={it.video_id}
              className="overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10"
            >
              <div className="px-2 pb-3 pt-2">
                {/* Uses your existing component API */}
                <TikTokEmbed videoUrl={it.tiktok_url} />
              </div>

              <div className="flex items-center justify-between px-4 pb-4 text-xs text-gray-400">
                <div>post_id: {it.video_id}</div>
                <a
                  href={it.tiktok_url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Open on TikTok →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


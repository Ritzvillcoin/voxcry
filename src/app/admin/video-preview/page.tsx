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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-3xl bg-zinc-900/70 p-5 shadow-xl ring-1 ring-white/10">
         <div className="flex items-center justify-between gap-3">
          <div className="text-xl font-bold text-white">Check My Video</div>

          <a
            href="https://voxcry.com"
            className="text-sm text-gray-300 underline underline-offset-4 hover:text-white"
            title="Back to VoxCry"
          >
            ← Back to VoxCry
          </a>
        </div>
        <div className="mt-1 text-sm text-gray-400">
          Enter a handle to load the newest video and preview in the embed player.
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="@infiniteelliott"
            className="w-full rounded-xl bg-zinc-800 px-3 py-3 text-white outline-none ring-1 ring-white/10"
          />

          <button
            onClick={load}
            disabled={loading}
            className="w-full rounded-2xl bg-white py-3 font-bold text-black shadow-sm active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load latest"}
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm text-red-200 ring-1 ring-white/10">
            {error}
          </div>
        ) : null}

        {!loading && !error && !item ? (
          <div className="mt-4 rounded-2xl bg-black/30 p-4 text-sm text-gray-400 ring-1 ring-white/10">
            No video loaded yet.
          </div>
        ) : null}

        {item ? (
          <div className="mt-6 overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10">
            <div className="px-2 pb-3 pt-2">
              <TikTokEmbed videoUrl={item.tiktok_url} />
            </div>

            <div className="flex items-center justify-between px-4 pb-4 text-xs text-gray-400">
              <div>post_id: {item.video_id}</div>
              <a
                href={item.tiktok_url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                Open on TikTok →
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}




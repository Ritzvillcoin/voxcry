"use client";

import { useMemo, useState } from "react";
import { slugify } from "@/utils/helpers"; // <--- Add this import

// Reuse your existing extractor
function extractTikTokPostId(tiktokUrl: string) {
  const m = (tiktokUrl || "").match(/\/(video|photo)\/(\d+)/);
  return m?.[2] ?? "";
}

export default function AdminAddCollectionPage() {
  const [adminToken, setAdminToken] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // State for 5 URL inputs
  const [urls, setUrls] = useState(["", "", "", "", ""]);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const slug = useMemo(() => slugify(title), [title]);
  const videoIds = useMemo(() => urls.map(url => extractTikTokPostId(url)).filter(id => id !== ""), [urls]);

  async function submit() {
    setMsg("");

    if (!adminToken.trim()) return setMsg("Missing admin token.");
    if (!title.trim()) return setMsg("Collection needs a title.");
    if (videoIds.length < 5) return setMsg("You need 5 valid TikTok URLs.");

    setBusy(true);
    try {
      const res = await fetch("/api/admin/add-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminToken: adminToken.trim(),
          title: title.trim(),
          description: description.trim(),
          videoIds, // Just the IDs like ["741...", "742..."]
          slug
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setMsg(`Error: ${data?.error || res.status}`);
        return;
      }

      setMsg(`✅ Collection Created: /collection/${slug}`);
      // Reset form but keep token
      setTitle("");
      setDescription("");
      setUrls(["", "", "", "", ""]);
    } catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  console.error("Submission failed:", errorMessage);
  // Set your error state here using errorMessage
} finally {
      setBusy(false);
    }
  }

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Admin — Create Collection</h1>
      <p className="mt-2 text-sm text-gray-400">Save a curated set of 5 videos to KV.</p>

      <div className="mt-6 space-y-4 rounded-2xl bg-zinc-900/70 p-6 ring-1 ring-white/10">
        <label className="block">
          <div className="text-xs text-gray-400">Admin token</div>
          <input
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            type="password"
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10"
          />
        </label>

        <label className="block">
          <div className="text-xs text-gray-400">Collection Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 5 TikToks for Panic Attacks"
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10"
          />
          <div className="mt-1 text-[10px] text-gray-500 font-mono">Slug: {slug}</div>
        </label>

        <label className="block">
          <div className="text-xs text-gray-400">Description</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10"
            rows={2}
          />
        </label>

        <div className="space-y-3">
          <div className="text-xs text-gray-400">TikTok URLs (Need 5)</div>
          {urls.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#ADFF2F] font-bold text-xs">#{i+1}</span>
              <input
                value={url}
                onChange={(e) => handleUrlChange(i, e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/..."
                className="flex-1 rounded-xl bg-zinc-800 px-3 py-2 text-white text-xs outline-none ring-1 ring-white/10"
              />
            </div>
          ))}
        </div>

        <button
          disabled={busy}
          onClick={submit}
          className="w-full rounded-2xl bg-[#ADFF2F] py-3 font-bold text-black disabled:opacity-60 transition-transform active:scale-95"
        >
          {busy ? "COMMITTING TO KV..." : "PUBLISH COLLECTION"}
        </button>

        {msg && (
          <div className="rounded-xl bg-black/30 p-3 text-sm text-center text-gray-200 ring-1 ring-white/10 border-l-4 border-[#ADFF2F]">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
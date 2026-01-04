"use client";

import { useMemo, useState } from "react";
import { slugify } from "@/utils/helpers";
import Link from "next/link";

function extractTikTokPostId(tiktokUrl: string) {
  const m = (tiktokUrl || "").match(/\/(video|photo)\/(\d+)/);
  return m?.[2] ?? "";
}

const CATEGORIES = [
  { id: "social-intelligence", label: "Social Intelligence" },
  { id: "cognitive-architecture", label: "Cognitive Architecture" },
  { id: "emotional-regulation", label: "Emotional Regulation" },
  { id: "financial-autonomy", label: "Financial Autonomy" },
  { id: "personal-knowledge", label: "Personal Knowledge" },
];

export default function AdminAddCollectionPage() {
  const [adminToken, setAdminToken] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("social-intelligence");
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
          category,
          videoIds,
          slug
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(`Error: ${data?.error || res.status}`);
        return;
      }

      setMsg(`✅ Collection Created: /collection/${slug}`);
      setTitle("");
      setDescription("");
      setUrls(["", "", "", "", ""]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      setMsg(`System Error: ${errorMessage}`);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black italic text-white uppercase tracking-tighter">Audit Registry</h1>
        <span className="text-[10px] font-mono text-[#ADFF2F] border border-[#ADFF2F] px-2 py-1 uppercase">Mission: 10M</span>
      </div>

      <div className="space-y-4 rounded-2xl bg-zinc-900/70 p-6 ring-1 ring-white/10">
        <label className="block">
          <div className="text-[10px] uppercase font-mono text-gray-400 tracking-widest">Admin Token</div>
          <input
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            type="password"
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#ADFF2F]"
          />
        </label>

        <label className="block">
          <div className="text-[10px] uppercase font-mono text-gray-400 tracking-widest">Category Architecture</div>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10 appearance-none cursor-pointer"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <div className="text-[10px] uppercase font-mono text-gray-400 tracking-widest">Tactical Pack Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Social Anxiety Protocol"
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#ADFF2F]"
          />
          <div className="mt-1 text-[10px] text-zinc-500 font-mono italic">slug_id: {slug}</div>
        </label>

        <label className="block">
          <div className="text-[10px] uppercase font-mono text-gray-400 tracking-widest">Description (Context)</div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High-density insights for..."
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10 focus:ring-[#ADFF2F]"
            rows={2}
          />
        </label>

        <div className="space-y-3">
          <div className="text-[10px] uppercase font-mono text-gray-400 tracking-widest">Verified Selection (0.1%)</div>
          {urls.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#ADFF2F] font-mono text-xs font-bold">0{i+1}</span>
              <input
                value={url}
                onChange={(e) => handleUrlChange(i, e.target.value)}
                placeholder="TikTok URL..."
                className="flex-1 rounded-xl bg-zinc-800 px-3 py-2 text-white text-xs outline-none ring-1 ring-white/10 focus:ring-[#ADFF2F]"
              />
            </div>
          ))}
        </div>

        <button
          disabled={busy}
          onClick={submit}
          className="w-full rounded-2xl bg-[#ADFF2F] py-4 font-black uppercase text-black disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(173,255,47,0.2)]"
        >
          {busy ? "COMMITTING AUDIT..." : "VERIFY & PUBLISH"}
        </button>

        {msg && (
          <div className="rounded-xl bg-black/30 p-3 text-sm text-center text-gray-200 ring-1 ring-[#ADFF2F]/30 border-l-4 border-[#ADFF2F] font-mono uppercase text-[10px]">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
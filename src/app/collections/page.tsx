"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CollectionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/collections", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (json.ok) setItems(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-4 border-[#ADFF2F] px-5 py-3 font-black uppercase tracking-tight hover:bg-[#ADFF2F] hover:text-black transition"
          >
            <span className="text-xl leading-none">←</span>
            Back to Home
          </Link>
        </div>

        <h1 className="text-5xl font-black uppercase italic tracking-tighter">
          Collections
        </h1>

        {loading ? (
          <p className="mt-6 text-zinc-400">Loading…</p>
        ) : (
          <div className="mt-10 grid gap-4">
            {items.map((c) => (
              <Link
                key={c.slug}
                href={`/collection/${c.slug}`}
                className="block border-4 border-[#ADFF2F] p-6 hover:bg-[#ADFF2F] hover:text-black transition"
              >
                <div className="text-xs font-mono uppercase tracking-widest opacity-70">
                  {c.videoIds?.length || 0} VIDEOS • TIKTOK PACK
                </div>
                <div className="mt-2 text-2xl font-black">{c.title}</div>
                <div className="mt-3 text-sm opacity-80 line-clamp-2">
                  {c.description}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


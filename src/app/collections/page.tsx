"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Collection = {
  slug: string;
  title: string;
  description: string;
  videoIds: string[];
  status: "PUBLISHED" | "DRAFT" | string;
  added_at: number;
};

type CollectionsResponse =
  | { ok: true; data: Collection[] }
  | { ok: false; error: string };

export default function CollectionsPage() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/collections", { cache: "no-store" });
        if (!res.ok) return;

        const json = (await res.json()) as CollectionsResponse;
        if (json.ok) setItems(json.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleShare = async (e: React.MouseEvent, collection: Collection) => {
    // Prevent the Link component from navigating when clicking the button
    e.preventDefault();
    e.stopPropagation();

    if (!collection?.slug) return;

    const url = `${window.location.origin}/collection/${collection.slug}`;
    const title = collection.title;

    // 1. Try Native Web Share API (Works on Mobile & some Desktop Browsers)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this TikTok pack: ${title}`,
          url: url,
        });
        return; 
      } catch (err) {
        console.log("Share API interaction failed or dismissed", err);
      }
    }

    // 2. Fallback: Modern Clipboard API (Works on Firefox/Chrome/Safari)
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(collection.slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (err) {
      // 3. Ultimate Fallback: Textarea hack (For very old or restricted browsers)
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedSlug(collection.slug);
        setTimeout(() => setCopiedSlug(null), 2000);
      } catch (copyErr) {
        console.error("Manual copy failed", copyErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 selection:bg-[#ADFF2F] selection:text-black">
      <div className="max-w-3xl mx-auto">
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
          <p className="mt-6 text-zinc-400 font-mono animate-pulse uppercase text-sm tracking-widest">
            Fetching_Archive_Data...
          </p>
        ) : (
          <div className="mt-10 grid gap-6">
            {items.map((c) => (
              <Link
                key={c.slug}
                href={`/collection/${c.slug}`}
                className="group relative block border-4 border-[#ADFF2F] p-6 hover:bg-[#ADFF2F] hover:text-black transition duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="text-xs font-mono uppercase tracking-widest opacity-70">
                    {c.videoIds?.length || 0} VIDEOS • ARCHIVE_ENTRY
                  </div>
                  
                  {/* SHARE BUTTON: Correctly passes the whole object 'c' */}
                  <button
                    onClick={(e) => handleShare(e, c)}
                    className="z-20 border-2 border-current px-3 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    {copiedSlug === c.slug ? "COPIED!" : "SHARE_LINK"}
                  </button>
                </div>

                <div className="mt-4 text-3xl font-black uppercase italic leading-none tracking-tight">
                  {c.title}
                </div>
                
                <div className="mt-3 text-sm font-medium opacity-80 line-clamp-2 max-w-xl">
                  {c.description}
                </div>

                {/* VISUAL HINT FOR HOVER */}
                <div className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                  OPEN_COLLECTION →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}



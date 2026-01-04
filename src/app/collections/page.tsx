"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  | { ok: true; data: Collection[]; hasMore: boolean }
  | { ok: false; error: string };

export default function CollectionsPage() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const isFetching = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchCollections = useCallback(async (pageNum: number) => {
    if (isFetching.current) return;
    
    try {
      isFetching.current = true;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`/api/collections?page=${pageNum}&limit=10`, { cache: "no-store" });
      const json = (await res.json()) as CollectionsResponse;

      if (json.ok) {
        setItems((prev) => (pageNum === 1 ? json.data : [...prev, ...json.data]));
        setHasMore(json.hasMore); 
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCollections(1);
  }, [fetchCollections]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching.current) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchCollections(nextPage);
            return nextPage;
          });
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "200px" // Start loading when user is 200px from the bottom
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, fetchCollections]);

  const handleShare = async (e: React.MouseEvent, collection: Collection) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/collection/${collection.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: collection.title, url });
        return;
      } catch (err) { console.log(err); }
    }
    
    await navigator.clipboard.writeText(url);
    setCopiedSlug(collection.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 selection:bg-[#ADFF2F] selection:text-black">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-4 border-[#ADFF2F] px-5 py-3 font-black uppercase tracking-tight hover:bg-[#ADFF2F] hover:text-black transition"
          >
            ← Back to Home
          </Link>
        </div>

        <h1 className="text-5xl font-black uppercase italic tracking-tighter">Collections</h1>

        {loading ? (
          <p className="mt-6 text-zinc-400 font-mono animate-pulse uppercase text-sm">Fetching_Archive_Data...</p>
        ) : (
          <div className="mt-10 grid gap-6">
            {items.map((c, index) => (
              <Link
                key={`${c.slug}-${index}`}
                href={`/collection/${c.slug}`}
                className="group relative block border-4 border-[#ADFF2F] p-6 hover:bg-[#ADFF2F] hover:text-black transition duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="text-xs font-mono uppercase tracking-widest opacity-70">
                    {c.videoIds?.length || 0} VIDEOS • ARCHIVE_ENTRY
                  </div>
                  <button
                    onClick={(e) => handleShare(e, c)}
                    className="z-20 border-2 border-current px-3 py-1 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-colors"
                  >
                    {copiedSlug === c.slug ? "COPIED!" : "SHARE_LINK"}
                  </button>
                </div>
                <div className="mt-4 text-3xl font-black uppercase italic leading-none">{c.title}</div>
                <div className="mt-3 text-sm font-medium opacity-80 line-clamp-2">{c.description}</div>
              </Link>
            ))}

            <div ref={observerTarget} className="h-20 flex items-center justify-center">
              {loadingMore && (
                <span className="text-[#ADFF2F] font-black italic animate-bounce text-xs">
                  LOADING_MORE_PACKS...
                </span>
              )}
              {!hasMore && items.length > 0 && (
                <span className="text-zinc-600 font-black italic text-xs uppercase">
                  End of Archive // All Packs Loaded
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


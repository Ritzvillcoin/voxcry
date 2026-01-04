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
  // Fixed: Removed 'page' and used ',' to skip the unused variable
  const [, setPage] = useState(1);
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

  useEffect(() => {
    fetchCollections(1);
  }, [fetchCollections]);

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
        rootMargin: "200px" 
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
          <p className="mt-6 text-zinc-400 font-mono animate-pulse uppercase text-sm tracking-widest">
            Fetching...
          </p>
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
                <div className="mt-4 text-3xl font-black uppercase italic leading-none tracking-tight">
                  {c.title}
                </div>
                <div className="mt-3 text-sm font-medium opacity-80 line-clamp-2 max-w-xl">
                  {c.description}
                </div>
              </Link>
            ))}

            <div ref={observerTarget} className="mt-12 mb-20 flex flex-col items-center justify-center gap-4">
              {loadingMore ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-1 w-32 bg-zinc-800 overflow-hidden">
                    <div className="h-full bg-[#ADFF2F] animate-[loading_1s_ease-in-out_infinite]" 
                        style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-[#ADFF2F] font-mono text-[10px] tracking-[0.3em] uppercase animate-pulse">
                    Fetching...
                  </span>
                </div>
              ) : (
                !hasMore && items.length > 0 && (
                  <div className="text-center">
                    <div className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-2">
                      {"/// ARCHIVE_COMPLETE ///"}
                    </div>
                    <div className="text-zinc-700 text-[9px] uppercase tracking-tighter">
                      All {items.length} collections synchronized successfully.
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


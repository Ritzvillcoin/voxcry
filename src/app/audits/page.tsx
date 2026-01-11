"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

// Define the interface to replace 'any'
interface VideoAudit {
  slug: string;
  blog_title: string;
  summary?: string;
  final_label: string;
  quality_score: number;
  created_at: string;
}

export default function AuditsPage() {
  const [items, setItems] = useState<VideoAudit[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Fix: Removed the unused 'page' state since pageNum is passed through fetchAudits
  const observerTarget = useRef<HTMLDivElement>(null);
  const isFetching = useRef(false);
  const currentPage = useRef(1);

  const fetchAudits = useCallback(async (pageNum: number) => {
    if (isFetching.current) return;
    
    try {
      isFetching.current = true;
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const res = await fetch(`/api/audits?page=${pageNum}&limit=10`);
      const json = await res.json();

      if (json.ok) {
        setItems((prev) => (pageNum === 1 ? json.data : [...prev, ...json.data]));
        setHasMore(json.hasMore);
      }
    } catch {
      // Fix: Removed unused 'err' variable
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchAudits(1);
  }, [fetchAudits]);

  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching.current) {
          currentPage.current += 1;
          fetchAudits(currentPage.current);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, loading, fetchAudits]);

  const handleShare = async (e: React.MouseEvent, audit: VideoAudit) => {
    e.preventDefault();
    e.stopPropagation();
    const shareData = {
      title: `Voxcry Audit: ${audit.blog_title}`,
      url: `${window.location.origin}/video/${audit.slug}`,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try { await navigator.share(shareData); return; } catch { /* ignore error */ }
    }
    await navigator.clipboard.writeText(shareData.url);
    setCopiedSlug(audit.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 border-4 border-[#ADFF2F] px-5 py-2 font-black uppercase hover:bg-[#ADFF2F] hover:text-black transition">
            ← VOXCRY
          </Link>
        </div>

        <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">Collections</h1>
        <p className="text-[#ADFF2F] font-mono text-[10px] uppercase tracking-widest mb-10">
          Digital Wellness Protocol // Signal Analysis
        </p>

        {loading && items.length === 0 ? (
          <div className="font-mono text-zinc-500 animate-pulse uppercase tracking-widest">
            Fetching...
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map((audit, idx) => (
              <Link 
                key={`${audit.slug}-${idx}`} 
                href={`/video/${audit.slug}`} 
                className="group relative block border-4 border-[#ADFF2F] p-6 hover:bg-[#ADFF2F] hover:text-black transition duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                      audit.final_label === 'SIGNAL' ? 'bg-white text-black' : 'bg-zinc-800 text-white'
                    }`}>
                      {audit.final_label}
                    </span>
                    <span className="border-2 border-current px-2 py-0.5 text-[10px] font-black">
                      SCORE: {audit.quality_score}/8
                    </span>
                  </div>
                 <button 
  onClick={(e) => handleShare(e, audit)} 
  className="z-20 border-2 border-current px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-colors flex items-center gap-2"
>
  {copiedSlug === audit.slug ? (
    "LINK_COPIED"
  ) : (
    <>
      <span>SHARE</span>
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="shrink-0"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
    </>
  )}
</button>
                </div>
                <h2 className="text-3xl font-black uppercase italic leading-none tracking-tight">{audit.blog_title}</h2>
                {audit.summary && <p className="mt-4 text-sm font-medium opacity-80 line-clamp-2 leading-tight">{audit.summary}</p>}
                <div className="mt-6 font-mono text-[9px] uppercase tracking-[0.2em] opacity-50 flex justify-between">
                  <span>REF: {audit.slug}</span>
                  <span>{new Date(audit.created_at).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}

            <div ref={observerTarget} className="py-10 flex flex-col items-center">
              {loadingMore && (
                <div className="font-mono text-[#ADFF2F] text-[10px] animate-pulse uppercase">
                  Loading...
                </div>
              )}
             {!hasMore && items.length > 0 && (
  <div className="text-zinc-700 font-mono text-[10px] uppercase">
    {"/// End_of_Collections ///"}
  </div>
)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
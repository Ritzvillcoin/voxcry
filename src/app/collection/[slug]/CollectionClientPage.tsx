"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

interface CollectionData {
  title: string;
  description: string;
  videoIds: string[]; // This can now contain full URLs or IDs
}

/**
 * UTILITY: Extract Video Info
 * Detects if a string is a TikTok ID, YouTube ID, or full URL
 */
function getPlatformInfo(input: string) {
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytShortsRegex = /youtube\.com\/shorts\/([^"&?\/\s]{11})/;
  const tiktokRegex = /tiktok\.com\/.*\/video\/(\d+)/;

  if (ytShortsRegex.test(input)) return { platform: 'youtube', id: input.match(ytShortsRegex)![1] };
  if (ytRegex.test(input)) return { platform: 'youtube', id: input.match(ytRegex)![1] };
  if (tiktokRegex.test(input)) return { platform: 'tiktok', id: input.match(tiktokRegex)![1] };
  
  // Fallback: Assume it's a TikTok ID if it's purely numeric, else YouTube ID
  return /^\d+$/.test(input) 
    ? { platform: 'tiktok', id: input } 
    : { platform: 'youtube', id: input };
}

/**
 * COMPONENT: Universal Video Embed
 */
function VideoEmbed({ videoInput }: { videoInput: string }) {
  const { platform, id } = getPlatformInfo(videoInput);

  const containerStyle = "relative w-full max-w-[325px] mx-auto overflow-hidden bg-black border-[6px] border-black shadow-[12px_12px_0px_0px_#ADFF2F]";
  const iframeBaseStyle = "w-full h-full min-h-[580px] border-none";

  return (
    <div className={containerStyle}>
      <div className="relative w-full min-h-[580px] flex items-center justify-center pt-2">
        {platform === 'tiktok' ? (
          <iframe
            src={`https://www.tiktok.com/embed/v2/${id}`}
            className={iframeBaseStyle}
            allowFullScreen
            scrolling="no"
            allow="autoplay; encrypted-media; fullscreen"
          />
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${id}?modestbranding=1&rel=0&controls=1&showinfo=0`}
            className={iframeBaseStyle}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>
    </div>
  );
}

export default function CollectionClientPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCollection() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/collection/${slug}`);
        const json = await res.json();

        if (res.ok && json.ok && json.data) {
          setCollection(json.data);
        } else {
          setError(true);
        }
      } catch (err: unknown) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCollection();
  }, [slug]);

  if (error) return notFound();
  if (loading || !collection) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#ADFF2F] font-black uppercase italic">
      GETTING_YOUR_PACK...
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-8">
        <Link href="/collections" className="text-[#ADFF2F] font-black uppercase text-xs hover:underline tracking-widest">
          ← ALL_ARCHIVES
        </Link>
      </div>

      <div className="w-full max-w-2xl border-[6px] border-[#ADFF2F] bg-zinc-900 p-6 md:p-10 shadow-[20px_20px_0px_0px_rgba(173,255,47,0.15)]">
        <div className="text-xs font-mono uppercase tracking-widest text-[#ADFF2F] mb-4">
          {collection.videoIds.length} VIDEOS • VOXCRY_PACK
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black uppercase italic leading-none tracking-tighter mb-6">
          {collection.title}
        </h1>
        
        <p className="text-zinc-400 font-medium text-lg border-l-4 border-zinc-700 pl-4">
          {collection.description}
        </p>

        <div className="mt-16 flex flex-col gap-24">
          {collection.videoIds.map((id, index) => (
            <div key={`${id}-${index}`} className="relative pt-12">
              <div className="absolute top-0 -left-2 z-20 bg-white text-black text-[10px] font-black px-3 py-1 border-2 border-black rotate-[-2deg] shadow-[4px_4px_0px_0px_#000]">
                CLIP_0{index + 1}
              </div>
              <VideoEmbed videoInput={id} />
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t-4 border-black text-center">
          <Link href="/collections" className="bg-[#ADFF2F] text-black px-10 py-5 font-black uppercase italic hover:scale-105 transition-transform inline-block text-xl border-4 border-black">
            RETURN_TO_COLLECTIONS
          </Link>
        </div>
      </div>
    </main>
  );
}
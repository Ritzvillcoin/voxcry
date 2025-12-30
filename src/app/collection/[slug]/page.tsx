"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

// Define the structure of your data to satisfy TypeScript
interface CollectionData {
  title: string;
  description: string;
  videoIds: string[];
}

function TikTokEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full aspect-[9/16] bg-zinc-900 border-[6px] border-black shadow-[12px_12px_0px_0px_#ADFF2F]">
      <iframe
        src={`https://www.tiktok.com/embed/v2/${videoId}`}
        className="w-full h-full"
        allowFullScreen
        scrolling="no"
        allow="autoplay; encrypted-media; fullscreen"
      />
    </div>
  );
}

export default function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  // Use the interface here instead of 'any'
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
      } catch (err: unknown) { // Use 'unknown' instead of 'any'
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCollection();
  }, [slug]);

  if (error) return notFound();
  if (loading || !collection) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#ADFF2F]">
      LOADING...
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-32">
      <header className="max-w-3xl mx-auto mt-12 mb-24 border-b-8 border-[#ADFF2F] pb-8">
        <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter">
          {collection.title}
        </h1>
        <p className="mt-8 text-zinc-400 text-xl border-l-4 border-zinc-800 pl-6">
          {collection.description}
        </p>
      </header>

      <section className="max-w-md mx-auto flex flex-col gap-40">
        {collection.videoIds.map((id, index) => (
          <div key={`${id}-${index}`} className="relative">
            <div className="absolute -top-12 -left-8 z-10 bg-[#ADFF2F] text-black text-xl font-black px-4 py-1 border-[3px] border-black rotate-[-3deg]">
              CLIP_0{index + 1}
            </div>
            <TikTokEmbed videoId={id} />
          </div>
        ))}
      </section>

      <footer className="mt-48 text-center">
        <Link href="/" className="bg-[#ADFF2F] text-black px-12 py-6 font-black text-2xl border-4 border-black inline-block">
          RETURN TO HOME
        </Link>
      </footer>
    </main>
  );
}
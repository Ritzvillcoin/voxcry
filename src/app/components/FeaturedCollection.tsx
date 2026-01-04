import Link from "next/link";

interface Collection {
  slug: string;
  title: string;
  description: string;
  videoIds: string[];
}

export default async function FeaturedCollection() {
  // Use the Absolute URL for the build process
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  let latest: Collection | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/collections`, {
      next: { revalidate: 60 } // Refresh data every 60 seconds
    });
    
    // This is where your error was happening. 
    // If the response isn't OK, we catch it before it tries to parse JSON.
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        latest = json.data[0];
      }
    }
  } catch (err) {
    console.error("Build-time fetch failed:", err);
  }

  if (!latest) return null;

  return (
    <section className="px-6 py-20 bg-black">
      <div className="max-w-4xl mx-auto">
        <Link href={`/collection/${latest.slug}`} className="group block">
          <div className="border-[6px] border-[#ADFF2F] p-8 bg-zinc-900 shadow-[12px_12px_0px_0px_rgba(173,255,47,0.3)] transition-all group-hover:shadow-[12px_12px_0px_0px_#ADFF2F] group-hover:-translate-x-1 group-hover:-translate-y-1">
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#ADFF2F] text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                LATEST_RELEASE
              </span>
              <span className="text-zinc-500 font-mono text-[10px] uppercase">
                {latest.videoIds?.length || 0} CLIPS
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic mt-2 tracking-tighter leading-none">
              {latest.title}
            </h2>
            
            <p className="text-zinc-400 mt-6 text-lg max-w-xl font-medium">
              {latest.description}
            </p>
            
            <div className="mt-10 flex items-center text-[#ADFF2F] font-black uppercase italic text-xl">
              OPEN_PLAYLIST 
              <span className="ml-4 transition-transform group-hover:translate-x-3">→</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

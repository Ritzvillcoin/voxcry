import Link from "next/link";

export default function FeaturedCollection() {
  return (
    <section className="px-6 py-20 bg-black">
      <div className="max-w-4xl mx-auto">
        <Link href="/collection/5-tiktoks-for-the-left-on-read" className="group block">
          <div className="border-[6px] border-[#ADFF2F] p-8 bg-zinc-900 shadow-[12px_12px_0px_0px_rgba(173,255,47,0.3)] transition-all group-hover:shadow-[12px_12px_0px_0px_#ADFF2F] group-hover:-translate-x-1 group-hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#ADFF2F] text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                TIKTOK_PACK
              </span>
              <span className="text-zinc-500 font-mono text-[10px] uppercase">
                VOL_01
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic mt-2 tracking-tighter leading-none">
              5 Tiktoks for the <br/> <span className="text-[#ADFF2F]">Left-on-Read</span>
            </h2>
            
           <p className="text-zinc-400 mt-6 text-lg max-w-xl font-medium">
  A curated collection of videos to help you stop overthinking and start laughing at the &quot;delivered&quot; status.
</p>
            
            <div className="mt-10 flex items-center text-[#ADFF2F] font-black uppercase italic text-xl">
              WATCH_COLLECTION 
              <span className="ml-4 transition-transform group-hover:translate-x-3">→</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
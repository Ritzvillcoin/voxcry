import Link from "next/link";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Logos from "./components/Logos";
import Footer from "./components/Footer";
import HirePassFeed from "./components/HirePassFeed";
import SubstackSubscribe from "./components/SubstackSubscribe";
import FeaturedCollection from "./components/FeaturedCollection";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HirePassFeed />
        
        <section className="mx-auto max-w-5xl px-6 py-16 bg-white text-black">
          {/* The MISSION Highlight */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
              <span className="text-7xl md:text-9xl font-black italic tracking-tighter text-black leading-none">
                10M+
              </span>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black uppercase italic leading-none text-black">
                  Video Audit Goal
                </span>
                <span className="text-sm font-mono uppercase tracking-[0.2em] text-[#ADFF2F] bg-black px-2 py-1 mt-1 inline-block w-fit">
                  Mission: Life Architecture
                </span>
              </div>
            </div>
            
            {/* The Multi-Year Progress Bar */}
            <div className="mt-8">
              <div className="flex justify-between text-[10px] font-mono uppercase mb-1">
                <span className="text-zinc-400">Current Progress: 5,000 / 10,000,000</span>
                <span className="text-black font-bold">0.05% COMPLETE</span>
              </div>
              <div className="h-[6px] w-full max-w-2xl bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#ADFF2F]" style={{ width: '0.05%' }}></div>
              </div>
            </div>
          </div>

          {/* The Narrative Hook: Beyond the Scroll */}
          <p className="mt-4 text-black text-2xl md:text-4xl font-black max-w-3xl leading-tight tracking-tight uppercase">
            Beyond the Scroll. I am filtering 10 million videos to protect your attention. 
          </p>
          
          <p className="mt-6 text-zinc-600 text-lg md:text-xl max-w-2xl leading-relaxed">
            Move from chaos to clarity. I filter global content to find the <span className="bg-[#ADFF2F] px-1 font-bold text-black text-2xl">top 0.1%</span>—providing 
            the calm, structured, and authentic value you need to build your life.
          </p>

          {/* Reclaim Attention Section */}
          <p className="mt-8 text-black text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight italic">
            Reclaim your attention. <br />
            <span className="text-[#ADFF2F] bg-black px-2">Start building by design.</span>
          </p>

          <p className="mt-4 text-zinc-500 text-lg max-w-xl">
            The 10M Audit is a mission to protect the human experience from the algorithm. 
            I find the signal; you architect the life.
          </p>

          {/* Action Section */}
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-black uppercase text-lg hover:bg-[#ADFF2F] hover:text-black transition-all active:scale-95 shadow-[8px_8px_0px_#ADFF2F]"
            >
              Explore Playlists →
            </Link>

            <div className="flex flex-col border-l-2 border-zinc-100 pl-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                Database Registry
              </span>
              <span className="text-[11px] font-mono uppercase font-bold text-black flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ADFF2F] animate-ping"></span>
                Live Indexing in Progress
              </span>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        <section className="px-4">
          <FeaturedCollection />       
        </section>

        {/* Registry / Subscription Section */}
        <section className="px-4 border-t border-black/5 pt-24 md:pt-32">
          <SubstackSubscribe 
            heading="The Creator Registry"
            subheading="Our architecture is designed to help 1M creators move beyond the default scroll. Subscribe for cognitive curation, signal-to-noise audits, and protocols for intentional growth."
          />
        </section>
      </main>
      <Footer />
    </>
  );
}
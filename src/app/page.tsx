import Link from "next/link";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import HirePassFeed from "./components/HirePassFeed";
import SubstackSubscribe from "./components/SubstackSubscribe";
import FeaturedCollection from "./components/FeaturedCollection";

export default function Home() {
  // Progress (keep if you want, but it's now framed as curation progress)
  const currentProgress = 7000;
  const goal = 10000000;
  const progressPercent = Math.min(100, (currentProgress / goal) * 100);

  return (
    <>
      <Nav />
      <main>
        {/* Keep your existing hero component (but ideally make Hero playlist-first too) */}
        <Hero />

        {/* ✅ PLAYLISTS FIRST */}
        <section className="mx-auto max-w-5xl px-6 pt-10 md:pt-16">
          <div className="border-4 border-black bg-white text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
            <div className="flex flex-col gap-6">
              {/* Top label */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  PLAYLIST DROPS
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                  5 clips • 1 mood • no doomscroll
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-6xl font-black uppercase italic leading-[0.9] tracking-tighter">
                Curated playlists you’ll actually finish.
              </h2>

              {/* Subhead */}
              <p className="text-zinc-700 text-lg md:text-xl max-w-2xl leading-relaxed">
                VoxCry filters the feed into tight 5-video drops—funny, useful, and
                worth your time. If it doesn’t hit, it doesn’t make the playlist.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 font-black uppercase text-lg hover:bg-[#ADFF2F] hover:text-black transition-all active:scale-95 shadow-[8px_8px_0px_#ADFF2F]"
                >
                  Browse Playlists →
                </Link>

                {/*<Link
                  href="/collections"
                  className="inline-flex items-center gap-2 border-4 border-black bg-white px-8 py-4 font-black uppercase text-lg hover:bg-black hover:text-white transition-all active:scale-95"
                >
                  Latest Drops
                </Link>*/}
              </div>

              {/* Progress bar (reframed) */}
              <div className="pt-6 border-t border-black/10">
                <div className="flex justify-between text-[10px] font-mono uppercase mb-1">
                  <span className="text-zinc-500">
                    Curation progress: {currentProgress.toLocaleString()} /{" "}
                    {goal.toLocaleString()}
                  </span>
                  <span className="text-black font-bold">
                    {progressPercent.toFixed(2)}%
                  </span>
                </div>

                <div className="h-[6px] w-full max-w-2xl bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#ADFF2F] transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <p className="mt-3 text-[12px] text-zinc-500 max-w-2xl">
                  The long game: filter the internet into watchable, shareable playlists
                  that don’t waste your attention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Featured playlists module (kept, moved up) */}
        <section className="px-4 mt-10 md:mt-14">
          <FeaturedCollection />
        </section>

        {/* OPTIONAL: voting feed (secondary) */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
           <div className="flex flex-col items-center text-center">
  {/*<div className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
    Optional
  </div>*/}
  <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
    Vote this clip (Hit / Noise)
  </h3>
  <p className="mt-2 text-zinc-500 max-w-xl mx-auto">
    This helps train VoxCry’s taste. But playlists are the main event.
  </p>
</div>

            {/*<Link
              href="/collections"
              className="inline-flex items-center gap-2 text-black bg-[#ADFF2F] px-6 py-3 font-black uppercase hover:opacity-90 transition active:scale-95 border-4 border-black"
            >
              Go back to Playlists →
            </Link>*/}
          </div>

          <HirePassFeed />
        </section>

        {/* Newsletter / Subscription */}
        <section className="px-4 border-t border-black/5 pt-24 md:pt-32">
          <SubstackSubscribe
            heading="Get Playlist Drops"
            subheading="Weekly drops + the best clips we found (and why they made the cut). No noise. Just the hits."
          />
        </section>
      </main>

      <Footer />
    </>
  );
}

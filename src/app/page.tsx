import Link from "next/link";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import HirePassFeed from "./components/HirePassFeed";
import SubstackSubscribe from "./components/SubstackSubscribe";
import FeaturedLatestAudit from "./components/FeaturedLatestAudit";

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
         <HirePassFeed />
          <section className="px-4 mt-10 md:mt-14">
          <FeaturedLatestAudit />
        </section>
        {/* ✅ PLAYLISTS FIRST */}
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


                <span className="text-zinc-400">Current Progress: {currentProgress.toLocaleString()} / {goal.toLocaleString()}



                </span>


                <span className="text-black font-bold">{progressPercent.toFixed(2)}%</span>

            </div>
          <div className="h-[6px] w-full max-w-2xl bg-zinc-100 rounded-full overflow-hidden">


                <div className="h-full bg-[#ADFF2F] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>



              </div>


            </div>


          </div>





          {/* The Narrative Hook: Beyond the Scroll */}


          <p className="mt-4 text-black text-2xl md:text-4xl font-black max-w-3xl leading-tight tracking-tight uppercase">


            Beyond the Scroll. I am filtering 10 million videos to protect your attention. 


          </p>


          


          <p className="mt-6 text-zinc-600 text-lg md:text-xl max-w-2xl leading-relaxed">


         Move from chaos to clarity. I cut the noise and spotlight the <span className="bg-[#ADFF2F] px-1 font-bold text-black text-2xl">top 0.1%</span>—calm, structured insights you can use in real life.


          </p>





          {/* Reclaim Attention Section */}


          <p className="mt-8 text-black text-2xl md:text-3xl font-black uppercase tracking-tighter leading-tight italic">


            Reclaim your attention. <br />


           <span className="text-[#ADFF2F] bg-black px-2">Live on purpose</span>

          </p>




          {/*<div className="mt-6 flex flex-wrap gap-3">*/}


          <p className="mt-4 text-zinc-500 text-lg max-w-xl">


            The 10M Review is a mission to protect the human experience from the algorithm. 



            I find the signal; you take back control.


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

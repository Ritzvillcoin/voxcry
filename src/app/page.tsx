import Link from "next/link";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Logos from "./components/Logos";
import FeatureGrid from "./components/FeatureGrid";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
//import Generator from "./components/Generator";
//import CreatorDirectory from "./components/CreatorDirectory";
import HirePassFeed from "./components/HirePassFeed";
import SubstackSubscribe from "./components/SubstackSubscribe";
import FeaturedCollection from "./components/FeaturedCollection"; // 1. Import it


export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HirePassFeed />
         {/* ✅ INDEXABLE CONTENT (server-rendered) */}
        <section className="mx-auto max-w-5xl px-6 py-10">
          <p className="mt-4 text-zinc-400 text-lg max-w-2xl">
            Meme Therapy + mini shows, curated into 5-video packs. Pick a vibe, binge the clips,
            and share the pack with friends.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 border-4 border-[#ADFF2F] px-5 py-3 font-black uppercase hover:bg-[#ADFF2F] hover:text-black transition"
            >
              Browse Collections →
            </Link>            
          </div>

          <p className="mt-6 text-[11px] font-mono uppercase tracking-widest text-zinc-600">
            New packs added regularly 
          </p>
        </section>

        {/* 2. Add the Collection link here */}
        <FeaturedCollection />
        <SubstackSubscribe className="mb-10" />
         {/*<Logos /> */}
      </main>
      <Footer />
    </>
  );
}

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Logos from "./components/Logos";
import FeatureGrid from "./components/FeatureGrid";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
//import Generator from "./components/Generator";
import CreatorDirectory from "./components/CreatorDirectory";
import HirePassFeed from "./components/HirePassFeed";
import SubstackSubscribe from "./components/SubstackSubscribe";


export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HirePassFeed />
         {/*<CreatorDirectory />
        <Generator /> */}
        {/*<FeatureGrid />
        <CTA />
        <Contact /> */}
        <SubstackSubscribe className="mb-10" />
         {/*<Logos /> */}
      </main>
      <Footer />
    </>
  );
}

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

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
         <CreatorDirectory />
        {/*<Generator /> */}
        <Logos />
        {/*<FeatureGrid />
        <CTA />*/}
        <Contact />
      </main>
      <Footer />
    </>
  );
}

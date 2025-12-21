export default function Hero() {
  return (
    <header className="relative mx-auto mt-24 max-w-6xl px-4 text-center">
      <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
        <span className="text-brand-400">Viral 🔥</span> or{" "}
        <span className="text-brand-400">Flop 🧊</span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
       High-potential UGC videos—discover, vote, support on TikTok.
      </p>

      {/*!--<div className="mt-8 flex items-center justify-center gap-3">
        <a href="#pricing" className="button-primary">See Pricing</a>
        <a href="#contact" className="button-outline">Book a demo</a>
      </div> */}
    </header>
  );
}

export default function Hero() {
  return (
    <header className="relative mx-auto mt-24 max-w-6xl px-4 text-center">
      <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
        Personalized <span className="text-brand-400">Hook Generator</span>
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg text-[var(--muted)]">
       Voxcry trains a smart model that remembers your unique rhythm and hosts it for you — ready to write viral hooks in your tone, 24 / 7. You own your model. We make it easy.
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <a href="#pricing" className="button-primary">See Pricing</a>
        <a href="#contact" className="button-outline">Book a demo</a>
      </div>
    </header>
  );
}

export default function CTA() {
  return (
    <section
      id="start"
      className="mx-auto my-24 max-w-6xl px-4 text-center text-white"
    >
      <div className="rounded-2xl border border-white/10 bg-black/40 p-10 backdrop-blur">
        <h3 className="text-2xl font-semibold">
          Ready to find the right UGC creators?
        </h3>

        <p className="mt-3 text-gray-300">
          We’ll generate AI-powered
          creator screening reports — complete with niche, style, engagement
          health, and brand fit. Perfect UGC matches in minutes.
        </p>

        <a
          href="#contact"
          className="mt-6 inline-block rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white hover:bg-indigo-400"
        >
          Screen Creators →
        </a>
      </div>
    </section>
  );
}

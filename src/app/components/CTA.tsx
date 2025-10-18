export default function CTA() {
  return (
    <section id="start" className="mx-auto my-24 max-w-6xl px-4 text-center text-white">
      <div className="rounded-2xl border border-white/10 bg-black/40 p-10 backdrop-blur">
        <h3 className="text-2xl font-semibold">Ready to train your voice?</h3>
        <p className="mt-3 text-gray-300">
          Upload 20–50 of your best posts. We’ll train and host your model in 48 hours —
          so you can start creating hooks that sound like you.
        </p>
        <a
          href="#pricing"
          className="mt-6 inline-block rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white hover:bg-indigo-400"
        >
          Train My Model →
        </a>
      </div>
    </section>
  );
}

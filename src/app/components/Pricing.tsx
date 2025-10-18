export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto mt-20 max-w-6xl px-4">
      <h2 className="text-center text-3xl font-bold">Train &amp; Host Your Model</h2>
      <p className="mt-2 text-center text-gray-300">
        We handle the AI setup — you keep the voice.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-xl font-semibold">Train My Hook Model</h3>
          <p className="mt-1 text-indigo-300">One-time setup — your tone, learned.</p>
          <p className="mt-4 text-3xl font-bold">$49</p>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li>• Fine-tuned LoRA trained on 20–50 of your posts</li>
            <li>• Delivered in 24–48 hours</li>
            <li>• 1 free refinement if needed</li>
            <li>• Yours forever — we just host it</li>
          </ul>
          <a
            href="#start"
            className="mt-6 inline-block rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400"
          >
            Train My Model
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur ring-2 ring-indigo-400">
          <h3 className="text-xl font-semibold">Host &amp; Generate</h3>
          <p className="mt-1 text-indigo-300">Your model, always online.</p>
          <p className="mt-4 text-3xl font-bold">$9 / mo</p>
          <ul className="mt-4 space-y-2 text-gray-300">
            <li>• Private hosted instance on Voxcry cloud</li>
            <li>• Instant hook generation UI</li>
            <li>• API access for automation</li>
            <li>• Secure backups of your LoRA</li>
          </ul>
          <a
            href="#start"
            className="mt-6 inline-block rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400"
          >
            Start Hosting
          </a>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Manage multiple tones or clients?{" "}
        <a href="#agency" className="underline underline-offset-4">
          See Agency Plans
        </a>
      </p>
    </section>
  );
}

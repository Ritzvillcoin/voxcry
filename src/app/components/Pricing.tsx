export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto mt-20 max-w-6xl px-4">
      <h2 className="text-center text-3xl font-bold">Creator Screening Pricing</h2>
      <p className="mt-2 text-center text-gray-300">
        Simple, transparent pricing for AI-powered UGC creator analysis.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        
        {/* --- Single Reports --- */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 className="text-xl font-semibold">Single Creator Report</h3>
          <p className="mt-1 text-indigo-400">
            Pay-as-you-go AI screening for UGC creators.
          </p>
          <p className="mt-4 text-3xl font-bold">$9</p>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li>• AI-powered niche & style analysis</li>
            <li>• Engagement, views & posting frequency</li>
            <li>• Brand-fit summary (2–3 sentences)</li>
            <li>• Delivered instantly</li>
          </ul>
          <a
            href="#start"
            className="mt-6 inline-block rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400"
          >
            Screen a Creator
          </a>
        </div>

        {/* --- Best Value Bundle --- */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur ring-2 ring-indigo-400">
          <h3 className="text-xl font-semibold">Creator Packs (Best Value)</h3>
          <p className="mt-1 text-indigo-300">For brands, UGC teams, and agencies.</p>
          <p className="mt-4 text-3xl font-bold">From $29</p>
          <ul className="mt-4 space-y-2 text-gray-400">
            <li>• 5–25 creator reports (discounted)</li>
            <li>• AI-powered screening reports in minutes</li>
            <li>• Team-friendly sharing tools</li>
            <li>• Perfect for campaigns & product launches</li>
          </ul>
          <a
            href="#start"
            className="mt-6 inline-block rounded-lg bg-indigo-500 px-5 py-3 font-medium text-white hover:bg-indigo-400"
          >
            Get Creator Pack
          </a>
        </div>

      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Working with multiple brands or creators?{" "}
        <a href="#agency" className="underline underline-offset-4">
          See Agency Plans
        </a>
      </p>
    </section>
  );
}

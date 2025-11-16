const features = [
  {
    title: "AI-Powered Creator Screening",
    body: "Instant analysis of niche, content style, engagement health, and posting behavior."
  },
  {
    title: "Brand-Fit Intelligence",
    body: "Every creator is evaluated through AI-driven criteria — ensuring perfect alignment with your product category, UGC style, and campaign goals."
  },
  {
    title: "Fast, Private, Accurate",
    body: "No scraping or logins required. All insights are generated with isolated AI models."
  },
  {
    title: "Built for UGC Teams & Agencies",
    body: "Use VoxCry to evaluate creators, build curated lists, and share ready-to-use screening reports with clients or internal teams."
  }
];


export default function FeatureGrid() {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <div className="grid gap-4 md:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="card p-6">
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-[var(--muted)]">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

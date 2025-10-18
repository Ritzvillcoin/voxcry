const features = [
  {
    title: "Personalized LoRA",
    body: "We fine-tune on your text samples (hooks, emails, replies) so outputs match your tone."
  },
  {
    title: "Live Knowledge",
    body: "Connect a simple FAQ/KB so answers stay fresh without retraining."
  },
  {
    title: "Fast & Private",
    body: "TinyLlama + adapters for speed and low cost. Your data stays isolated."
  },
  {
    title: "Multi-Use",
    body: "Generate hooks, emails, and customer support replies from one model."
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

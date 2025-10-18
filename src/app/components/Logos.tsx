export default function Logos() {
  const items = ["Creators", "Agencies", "E-commerce", "Hospitality", "Local Services"];
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <div className="card px-6 py-4">
        <p className="text-center text-sm text-[var(--muted)]">
          Trusted by small businesses & teams across:
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm">
          {items.map((x) => (
            <span key={x} className="rounded-full border border-white/10 px-3 py-1 text-[var(--muted)]">{x}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

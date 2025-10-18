export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[var(--muted)]">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <p>© {new Date().getFullYear()} Voxcry. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold">Voxcry</span>
          <span className="rounded bg-brand-500/20 px-2 py-0.5 text-xs text-brand-200"></span>
        </Link>
        <div className="flex items-center gap-3">
          {/*<Link href="#pricing" className="button-outline">Pricing</Link>*/}
          <Link href="#contact" className="button-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}

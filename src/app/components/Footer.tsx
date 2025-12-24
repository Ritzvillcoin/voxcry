import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t-[4px] border-black bg-black py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* BRAND BLOCK */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="bg-[#ADFF00] text-black px-4 py-1 font-black text-2xl italic tracking-tighter border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              VOXCRY
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Scouting the Future of UGC
            </p>
          </div>

          {/* NAV LINKS */}
          <div className="flex items-center gap-6">
            <Link
              href="/term/"
              className="text-zinc-200 font-black uppercase text-[11px] tracking-wide opacity-90 hover:opacity-100 hover:text-white underline underline-offset-4 decoration-zinc-600"
            >
              Terms
            </Link>
            <Link
              href="/privacy/"
              className="text-zinc-200 font-black uppercase text-[11px] tracking-wide opacity-90 hover:opacity-100 hover:text-white underline underline-offset-4 decoration-zinc-600"
            >
              Privacy
            </Link>
          </div>

          {/* COPYRIGHT BLOCK */}
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black uppercase text-zinc-400">
              © {new Date().getFullYear()} Voxcry
              <br />
              <span className="text-[#ADFF00]">Built for the viral age</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

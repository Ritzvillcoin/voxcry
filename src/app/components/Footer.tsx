export default function Footer() {
  return (
    <footer className="mt-24 border-t-[4px] border-black bg-black py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* BRAND BLOCK */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="bg-[#ADFF00] text-black px-4 py-1 font-black text-2xl italic tracking-tighter border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              VOXCRY
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Scouting the Future of UGC
            </p>
          </div>

          {/* NAV LINKS */}
          <div className="flex gap-6">
            <a href="/term" className="text-sm font-black uppercase italic text-white hover:text-[#ADFF00] transition-colors">
              Terms
            </a>
            <a href="/privacy" className="text-sm font-black uppercase italic text-white hover:text-[#ADFF00] transition-colors">
              Privacy
            </a>
          </div>

          {/* COPYRIGHT BLOCK */}
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black uppercase text-zinc-400">
              © {new Date().getFullYear()} Voxcry Corp. <br />
              <span className="text-[#ADFF00]">Built for the viral age.</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
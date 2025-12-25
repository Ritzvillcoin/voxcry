export default function Hero() {
  return (
    <header className="relative mx-auto mt-32 max-w-6xl px-4 text-center">
      {/* BACKGROUND ACCENT - Subtle grid or floating shapes could go here */}
      
      <div className="inline-block border-[4px] border-black bg-white px-6 py-2 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
        <span className="text-xs font-black uppercase tracking-[0.2em] text-black">
          Daily UGC Scouting
        </span>
      </div>

      <h1 className="mx-auto max-w-4xl text-5xl font-black leading-none md:text-8xl uppercase italic tracking-tighter text-white">
        <span className="inline-block bg-[#ADFF00] text-black px-4 py-1 border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2 mr-2">
          Viral 🔥
        </span>
        <span className="block md:inline mt-4 md:mt-0"> OR </span>
        <span className="inline-block bg-white text-black px-4 py-1 border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2 ml-2">
          Flop 🧊
        </span>
      </h1>

      <div className="mx-auto mt-12 max-w-2xl border-[4px] border-black bg-black p-6 shadow-[10px_10px_0px_0px_rgba(173,255,0,0.3)]">
        <p className="text-lg md:text-xl font-bold leading-relaxed text-[#ADFF00] uppercase italic">
          Discover winning UGC formats and rising creators
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 animate-pulse rounded-full bg-[#ADFF00]"></span>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-500">
            Live Voting Enabled
          </span>
        </div>
      </div>
    </header>
  );
}

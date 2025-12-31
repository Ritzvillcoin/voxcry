"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-[4px] border-black bg-[#ADFF00]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <div className="bg-black text-[#ADFF00] px-3 py-1 font-black text-lg md:text-xl italic tracking-tighter border-[3px] border-black group-hover:bg-white group-hover:text-black transition-colors">
            VOXCRY
          </div>
          {/* Hidden on very small screens to save space */}
          <span className="hidden sm:block border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            BETA
          </span>
        </Link>
         
        {/* BUTTONS CONTAINER */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/collections"
            className="bg-black text-white border-[3px] border-black px-3 md:px-4 py-2 font-black text-[10px] md:text-xs uppercase italic shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {/* Show short text on mobile, long on desktop */}
            <span className="md:hidden">PACKS</span>
            <span className="hidden md:inline">Collections</span>
          </Link>

          <Link 
            href="/admin/video-preview"
            className="bg-black text-white border-[3px] border-black px-3 md:px-4 py-2 font-black text-[10px] md:text-xs uppercase italic shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {/* Show icon or short text on mobile */}
            <span className="md:hidden">PREVIEW</span>
            <span className="hidden md:inline">Check My Video</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
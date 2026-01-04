"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-[4px] border-black bg-[#ADFF00]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2 sm:px-4 py-3">
        
        {/* LOGO - Scaled down slightly on mobile */}
        <Link href="/" className="group flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="bg-black text-[#ADFF00] px-2 md:px-3 py-1 font-black text-base md:text-xl italic tracking-tighter border-[3px] border-black group-hover:bg-white group-hover:text-black transition-colors">
            VOXCRY
          </div>
          {/* BETA tag hidden on very small phones to prevent overflow */}
          <span className="hidden sm:block border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            BETA
          </span>
        </Link>
         
        {/* BUTTONS - Tighter padding on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          <Link 
            href="/collections"
            className="bg-black text-white border-[2px] md:border-[3px] border-black px-2 md:px-4 py-1.5 md:py-2 font-black text-[10px] md:text-xs uppercase italic shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)] md:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            Playlists
          </Link>
          
          <Link 
            href="/admin/video-preview"
            className="bg-black text-white border-[2px] md:border-[3px] border-black px-2 md:px-4 py-1.5 md:py-2 font-black text-[10px] md:text-xs uppercase italic shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)] md:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            Preview
          </Link>
        </div>
      </div>
    </nav>
  );
}
"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b-[4px] border-black bg-[#ADFF00]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        {/* LOGO - Original Link Function */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="bg-black text-[#ADFF00] px-3 py-1 font-black text-xl italic tracking-tighter border-[3px] border-black group-hover:bg-white group-hover:text-black transition-colors">
            VOXCRY
          </div>
          {/* Keep the original span structure if you want to add text later */}
          <span className="rounded-none border-2 border-black bg-white px-2 py-0.5 text-[10px] font-bold text-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            BETA
          </span>
        </Link>
         
        <div className="flex items-center gap-4">
          {/* ORIGINAL BUTTON: Check My Video */}
          <Link 
            href="/admin/video-preview"
            className="bg-black text-white border-[3px] border-black px-4 py-2 font-black text-xs uppercase italic shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Check My Video
          </Link>
        </div>
      </div>
    </nav>
  );
}

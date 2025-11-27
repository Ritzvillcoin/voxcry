"use client";

import AdUnit from "./AdUnit";

export default function StickyAd() {
  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 
        bg-white border-t border-gray-300
        flex justify-center
        h-[60px] md:h-[80px]
        z-50
      "
    >
      <div className="w-full max-w-[728px] h-full flex items-center justify-center">
        <AdUnit slot="4361094013" />
      </div>
    </div>
  );
}

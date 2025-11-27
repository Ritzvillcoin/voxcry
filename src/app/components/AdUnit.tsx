"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

interface AdUnitProps {
  slot: string;
}

export default function AdUnit({ slot }: AdUnitProps) {
  useEffect(() => {
    const id = setTimeout(() => {
      try {
       
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn("AdSense error suppressed:", e);
      }
    }, 300);

    return () => clearTimeout(id);
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        width: "100%",
        minWidth: 320,
        height: 60, // reasonable default (banner-height)
      }}
      data-ad-client="ca-pub-6091519166758261"
      data-ad-slot={slot}
      data-ad-format=""
      data-full-width-responsive="true"
    />
  );
}

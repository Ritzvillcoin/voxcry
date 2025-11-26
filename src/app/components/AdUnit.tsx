"use client";

import { useEffect } from "react";

export default function AdUnit({ slot, style }: { slot: string; style?: any }) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style || { display: "block" }}
      data-ad-client="ca-pub-6091519166758261"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

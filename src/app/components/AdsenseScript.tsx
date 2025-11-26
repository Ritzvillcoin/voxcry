"use client";

import Script from "next/script";

export default function AdsenseScript() {
  return (
    <Script
      id="adsense-script"
      async
      strategy="beforeInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6091519166758261"
      crossOrigin="anonymous"
    />
  );
}

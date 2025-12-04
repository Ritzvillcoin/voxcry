"use client";

import Script from "next/script";

export default function AdsenseScript() {
  return (
    <Script
      id="adsense-script"
      async
      strategy="beforeInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7162370150732704"
      crossOrigin="anonymous"
    />
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleTagManager from "./components/GoogleTagManager";
//import AdsenseScript from "./components/AdsenseScript";
import StickyAd from "./components/StickyAd";
import GoogleAnalytics from "./components/GoogleAnalytics";

//import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://voxcry.com"),

  title: {
    default: "VoxCry — Discover rising creators and curated TikTok video packs",
    template: "%s | VoxCry",
  },

  description:
    "Discover curated TikTok video collections featuring rising UGC creators. Browse what’s trending, explore creators fast, and jump straight to the source on TikTok.",

  openGraph: {
    type: "website",
    url: "https://voxcry.com",
    siteName: "VoxCry",
    title: "VoxCry — Discover rising creators. Browse curated TikTok video packs",
    description:
      "Discover curated TikTok video collections featuring rising UGC creators. Browse what’s trending, explore creators fast, and jump straight to the source on TikTok.",
    images: [
      {
        url: "/og.png", // add this image in /public
        width: 1200,
        height: 630,
        alt: "VoxCry — Discover TikTok video pack & UGC creators",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VoxCry — Discover TikTok video pack & UGC creators",
    description:
      "Discover curated TikTok video collections featuring rising UGC creators. Browse what’s trending, explore creators fast, and jump straight to the source on TikTok.",
    images: ["/og.png"],
  },

  // Keep keywords short + realistic (Google mostly ignores keywords meta anyway)
  keywords: [
    "UGC creators",
    "TikTok Video Pack",
    "influencer marketing",
    "Meme Therapy",
    "mini shows",
  ],

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* ⭐ Add your custom <head> here */}
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-7162370150732704"
        />
      </head>
      <body>
       {/*<AdsenseScript />*/}
       <GoogleAnalytics />
        <div className="min-h-screen pb-[120px] md:pb-[160px]">
        {children}
        </div>
        {/*<StickyAd />*/}
        </body>
    </html>
  );
}

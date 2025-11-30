import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GoogleTagManager from "./components/GoogleTagManager";
import AdsenseScript from "./components/AdsenseScript";
import StickyAd from "./components/StickyAd";
import GoogleAnalytics from "./components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "AI-Powered creator screening",
  description:
    "VoxCry connects brands with the right creators through simple, accurate AI analysis.",
  keywords: [
    "AI creator vetting",
    "AI creator screening",
    "AI influencer vetting",
    "free AI influencer screening",
    "creator verification tool",
    "influencer verification tool",
    "AI creator analysis",
    "AI UGC vetting",
    "AI brand safety check",
    "free AI creator risk scoring",
    "fake follower detection tool",
    "creator authenticity checker",
    "creator audience demographics",
    "AI brand-creator matching",
    "creator content quality scoring",
    "free AI creator insights",
    "TikTok creator analysis tool",
    "TikTok creator screening AI",
    "UGC content analysis AI",
    "content style classification AI",
    "creator hook analysis",
    "free creator performance scoring",
    "creator performance analyzer",
    "free engagement quality analysis",
    "influencer transparency tool",
    "audience authenticity check",
    "creator niche classification AI",
    "brand safety for creators",
    "UGC creator analysis",
    "creator vetting",
    "free screened Tiktok creators",
    "AI creator insights platform",
    "AI content breakdown tool",
    "automated creator vetting system",
    "AI-powered creator performance audit",
  ],
  metadataBase: new URL("https://voxcry.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* ⭐ Add your custom <head> here */}
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-6091519166758261"
        />
      </head>
      <body>
       <AdsenseScript />
        <AdsenseScript />
        <div className="min-h-screen pb-[120px] md:pb-[160px]">
        {children}
        </div>
        <StickyAd />
        </body>
    </html>
  );
}

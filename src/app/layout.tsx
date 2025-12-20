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
    default: "VoxCry — Find Vetted TikTok & UGC Creators",
    template: "%s | VoxCry",
  },

  description:
    "Discover vetted TikTok and UGC creators and post briefs to get fast replies. VoxCry helps brands and agencies shortlist creators with simple performance signals and a creator-first workflow.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "https://voxcry.com",
    siteName: "VoxCry",
    title: "VoxCry — Find Vetted TikTok & UGC Creators",
    description:
      "Discover vetted creators and post briefs to get fast replies. Simple creator screening and a creator-first workflow.",
    images: [
      {
        url: "/og.png", // add this image in /public
        width: 1200,
        height: 630,
        alt: "VoxCry — Vetted TikTok & UGC creators",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "VoxCry — Find Vetted TikTok & UGC Creators",
    description:
      "Discover vetted creators and post briefs to get fast replies. Simple creator screening and a creator-first workflow.",
    images: ["/og.png"],
  },

  // Keep keywords short + realistic (Google mostly ignores keywords meta anyway)
  keywords: [
    "UGC creators",
    "TikTok creators",
    "creator vetting",
    "creator screening",
    "influencer marketing",
    "UGC briefs",
    "brand creator matching",
    "creator directory",
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

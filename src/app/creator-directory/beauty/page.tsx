/* -----------------------------------------------------
   📄 SERVER COMPONENT — metadata + wrapper ONLY
----------------------------------------------------- */

/* -----------------------------------------------------
   📄 SERVER COMPONENT — metadata + wrapper ONLY
----------------------------------------------------- */

export const metadata = {
  title: "Best TikTok Creators for Beauty Niche | VoxCry AI-Powered Creator Vetting",
  description:
    "Discover top-performing TikTok creators vetted by VoxCry’s AI-powered analysis. Browse creators with strong engagement, reliable performance, and low risk scores — ideal for brands, agencies, and UGC buyers.",
  keywords: [
    "TikTok creators for Beauty",
    "best TikTok creators for beauty",
    "TikTok creators vetted by AI",
    "AI creator vetting",
    "TikTok influencer analysis",
    "TikTok creator audit",
    "high-engagement TikTok creators",
    "brand-safe TikTok creators",
    "creator performance analysis",
    "influencer risk score",
    "AI influencer screening",
    "VoxCry creator analysis",
    "VoxCry beauty creators",
  ],
};

import Link from "next/link";
import BeautyCreatorsClient from "./BeautyCreatorsClient";

export default function Page() {
  return (
    <main className="px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header = product / tool vibe, not blog */}
        <header className="flex flex-col gap-3 border-b pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
              VoxCry Creator Shortlist
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Beauty TikTok Creators Vetted by VoxCry
            </h1>
            <p className="mt-2 text-sm text-gray-400 max-w-xl">
              Curated list of beauty, skincare, and GRWM creators scored on
              engagement quality and risk — built for brands, agencies, and UGC
              buyers who care about performance, not hype.
            </p>

            <div className="mt-3">
              <Link
                href="/"
                className="text-xs text-blue-500 hover:text-blue-600 underline underline-offset-2"
              >
                ← Back to creator directory
              </Link>
            </div>
          </div>

          {/* Optional: small “stats” block to feel more like a dashboard */}
          <div className="mt-4 md:mt-0">
            <div className="rounded-lg border bg-gray-900/40 px-4 py-3 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Creators in this shortlist</span>
                <span className="font-semibold">Beauty niche</span>
              </div>
              <p className="mt-1 text-[11px] text-gray-500">
                Data is reviewed periodically. For a live, custom audit of any
                creator, use VoxCry&apos;s full audit service.
              </p>
            </div>
          </div>
        </header>

        {/* TOOL AREA: client component renders the actual list / filters */}
        <section>
          <BeautyCreatorsClient />
        </section>
      </div>
    </main>
  );
}




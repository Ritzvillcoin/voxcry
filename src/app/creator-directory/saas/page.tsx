/* -----------------------------------------------------
   📄 SERVER COMPONENT — metadata + wrapper ONLY
----------------------------------------------------- */

export const metadata = {
  title: "Best TikTok Creators for SaaS & App Niche | VoxCry AI-Powered Creator Vetting",
  description:
    "Curated list of SaaS, software, and app-focused TikTok creators scored on engagement quality and risk — built for brands, agencies, and UGC buyers who care about performance, not hype.",
  keywords: [
    "TikTok SaaS creators",
    "best TikTok creators for SaaS",
    "software influencers on TikTok",
    "app TikTok creators",
    "B2B SaaS creators",
    "TikTok creators vetted by AI",
    "AI creator vetting",
    "TikTok influencer analysis",
    "high-engagement TikTok creators",
    "brand-safe TikTok creators",
    "creator performance analysis",
    "influencer risk score",
    "AI influencer screening",
    "VoxCry creator analysis",
    "VoxCry SaaS creators",
  ],
};

import Link from "next/link";
import Generator from "../../components/Generator";

export default function Page() {
  return (
    <main className="px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Top header area */}
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
              VoxCry creator shortlist
            </p>

            <h1 className="mt-1 text-4xl font-bold tracking-tight">
              SaaS & App TikTok Creators Vetted by VoxCry
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-gray-500">
             AI & SaaS Creator Shortlist is a handpicked list of creators who actually know how to talk about software, AI tools, and SaaS products—not just dance or go viral once. Instead of scrolling TikTok for hours, you get a focused pool of creators already making content around AI, automation, productivity apps, dev tools, and B2B software.
            </p>

            <div className="mt-4">
              <Link
                href="/"
                className="text-sm text-blue-500 underline underline-offset-2 hover:text-blue-600"
              >
                ← Back to creator directory
              </Link>
            </div>
          </div>

          {/* Grey info box on the right */}
          <aside className="w-full max-w-sm md:mt-2">
            <div className="rounded-lg bg-gray-100 px-4 py-3 text-xs text-gray-600">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold">Creators in this shortlist</span>
                <span className="font-semibold">SaaS & app niche</span>
              </div>
              <p>
                Data is reviewed periodically. For a live, custom audit of any
                creator, use VoxCry&apos;s full audit service.
              </p>
            </div>
          </aside>
        </header>

        {/* Divider, matching other niche pages */}
        <hr className="border-gray-200" />

        {/* SaaS shortlist */}
        <section className="mt-6">
          <Generator niche="saas" category="all" />
        </section>
      </div>
    </main>
  );
}

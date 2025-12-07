/* -----------------------------------------------------
   📄 SERVER COMPONENT — metadata + wrapper ONLY
----------------------------------------------------- */

export const metadata = {
  title: "Best TikTok Creators for Tech & Gadget Niche | VoxCry AI-Powered Creator Vetting",
  description:
    "Curated list of tech, gadget, and setup creators scored on engagement quality and risk — built for brands, agencies, and UGC buyers who care about performance, not hype.",
  keywords: [
    "TikTok tech creators",
    "best TikTok creators for tech",
    "tech influencers on TikTok",
    "gadget TikTokers",
    "setup TikTok creators",
    "TikTok creators vetted by AI",
    "AI creator vetting",
    "TikTok influencer analysis",
    "high-engagement TikTok creators",
    "brand-safe TikTok creators",
    "creator performance analysis",
    "influencer risk score",
    "AI influencer screening",
    "VoxCry creator analysis",
    "VoxCry tech creators",
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
              Tech & Gadget TikTok Creators Vetted by VoxCry
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-gray-500">
              Curated list of tech, gadget, desk-setup, and device breakdown
              creators scored on engagement quality and risk — built for brands,
              agencies, and UGC buyers who care about performance, not hype.
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
                <span className="font-semibold">Tech & gadget niche</span>
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

        {/* Tech shortlist */}
        <section className="mt-6">
          <Generator niche="tech" category="all" />
        </section>
      </div>
    </main>
  );
}

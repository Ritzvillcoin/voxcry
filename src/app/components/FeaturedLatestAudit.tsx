import Link from "next/link";

type VideoAudit = {
  slug: string;
  tiktok_url: string;
  creator_handle?: string;

  pack_slug?: string;
  pack_title?: string;

  final_label: "SIGNAL" | "MIXED" | "NOISE";
  quality_score: number;

  blog_title: string;
  summary?: string;

  created_at: string;
  updated_at?: string;
};

export default async function FeaturedCollection() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  let latest: VideoAudit | null = null;

  try {
    const res = await fetch(`${baseUrl}/api/video-blogs/latest`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const json = await res.json();
      latest = json?.ok ? (json.data as VideoAudit | null) : null;
    }
  } catch (err) {
    console.error("Build-time fetch failed:", err);
  }

  if (!latest) return null;

  const label = latest.final_label;
  const score = latest.quality_score;
  const summary = (latest.summary || "").trim();

  return (
    <section className="px-6 py-20 bg-black">
      <div className="max-w-4xl mx-auto">
        <Link href={`/video/${latest.slug}`} className="group block">
          <div className="border-[6px] border-[#ADFF2F] p-8 bg-zinc-900 shadow-[12px_12px_0px_0px_rgba(173,255,47,0.3)] transition-all group-hover:shadow-[12px_12px_0px_0px_#ADFF2F] group-hover:-translate-x-1 group-hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#ADFF2F] text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter">
                LATEST_AUDIT
              </span>

              <span className="text-zinc-500 font-mono text-[10px] uppercase">
                {label} • {score}/8
              </span>

              {latest.creator_handle ? (
                <span className="text-zinc-600 font-mono text-[10px] uppercase">
                  {latest.creator_handle}
                </span>
              ) : null}
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic mt-2 tracking-tighter leading-none">
              {latest.blog_title}
            </h2>

            <p className="text-zinc-400 mt-6 text-lg max-w-xl font-medium">
              {summary || "Read the full audit on VoxCry."}
            </p>

            <div className="mt-10 flex items-center text-[#ADFF2F] font-black uppercase italic text-xl">
              READ_AUDIT
              <span className="ml-4 transition-transform group-hover:translate-x-3">→</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

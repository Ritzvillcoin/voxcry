"use client";

export default function CreatorDirectory() {
  const categories = [
    {
      title: "Fitness Creators",
      description:
        "Performance-screened creators in fitness, wellness, and coaching content.",
      slug: "fitness",
      status: "live",
    },
    {
      title: "Beauty Creators",
      description:
        "Creators specialising in cosmetics, skincare, GRWM, and beauty tutorials.",
      slug: "beauty",
      status: "live",
    },
    {
      title: "Amazon Review Creators",
      description:
        "Product reviewers and Amazon-finds creators ideal for UGC and shoppable content.",
      slug: "", // premium / on request
      status: "premium",
    },
    { title: "Travel Creators", 
      description: "Creators focused on travel, exploring, and lifestyle adventure.", 
      slug: "travel",
      status: "live", 
    },
    { title: "Food & Cooking Creators", 
      description: "Cooking demos, food reviews, and recipe creators.",
       slug: "food" },
    { title: "Tech & Gadget Creators", 
      description: "Tech reviews, gadgets, setups, and device breakdowns.",
      slug: "tech", 
      status: "live",
     },
    { title: "Family & Lifestyle Creators", description: "Daily life, parenting, lifestyle vlogs, and routines.", slug: "lifestyle" },
  ];

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
            VoxCry creator shortlists
          </p>
          <h2 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
            Explore TikTok creator shortlists by niche
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            Each shortlist is curated with VoxCry’s AI-assisted screening,
            focusing on engagement quality, consistency, and brand safety.
            Live lists are free to explore; premium lists are available on
            request for brands that need deeper, bespoke access.
          </p>
        </header>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const isLive = cat.status === "live";
            const href = isLive
              ? `/creator-directory/${cat.slug}`
              : "/#contact";

            const statusLabel = isLive
              ? "Live · Free access"
              : "Premium · On request";

            const statusClass = isLive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-100";

            const ctaText = isLive ? "Open shortlist →" : "Talk to us →";

            return (
              <a
                key={cat.title}
                href={href}
                className={
                  "flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition-all " +
                  "hover:shadow-md hover:-translate-y-0.5"
                }
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold">{cat.title}</h3>
                    <span
                      className={
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium " +
                        statusClass
                      }
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>

                <div className="mt-4 text-sm font-medium text-blue-600">
                  {ctaText}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}



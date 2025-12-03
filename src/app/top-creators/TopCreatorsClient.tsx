"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* -----------------------------------------------------
   🔒 Types
----------------------------------------------------- */
export interface Creator {
  creator_name: string;
  creator_handle: string;
  tiktok_link: string;
  followers: string;
  posting_frequency: string;
  category: string;
  niche: string;
  region: string;
  performance_health: string;
  risk_score: string;
  notes: string;
}

interface ApiResponse {
  creators: Creator[];
}

/* -----------------------------------------------------
   🎨 Client Component
----------------------------------------------------- */
export default function TopCreatorsClient() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/top-creators", {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!res.ok) throw new Error("API error");

        const data: ApiResponse = await res.json();
        setCreators(data.creators);
      } catch {
        setError("Failed to load top creators.");
      }
      setLoading(false);
    }

    load();
  }, []);

  return (
    <section className="mx-auto mt-10 max-w-5xl px-4 text-center text-white mb-0">
      <h1 className="text-4xl font-extrabold">Top Creators</h1>
      <p className="mt-3 text-gray-400 max-w-xl mx-auto">
        Curated list of top-performing TikTok creators vetted by VoxCry AI.
      </p>

      {loading && <p className="mt-8 text-gray-400">Loading creators…</p>}
      {error && <p className="mt-8 text-red-400">{error}</p>}

      <AnimatePresence>
        {!loading && creators.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-10 text-left"
          >
            <h3 className="mb-3 text-xl font-semibold text-indigo-400">
              All Creators
            </h3>

            <ul className="space-y-3">
              <li
                className="
                flex items-center justify-between
                gap-4 px-4 py-2 text-xs font-semibold text-gray-400
                uppercase tracking-wide border-b border-white/10
                "
              >
                <div className="min-w-[180px]">Name / Niche</div>
                <div className="min-w-[200px]">TikTok Link</div>
                <div className="min-w-[120px] text-center">
                  Posting Frequency
                </div>
                <div className="min-w-[120px] text-center">Performance</div>
                <div className="min-w-[120px] text-center">Risk</div>
                <div className="min-w-[80px] text-center">Region</div>
              </li>

              {creators.map((c, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    w-full rounded-lg border border-white/10 bg-white/5
                    p-4 shadow-md text-sm
                  "
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col min-w-[180px]">
                      <span className="font-semibold text-gray-300">
                        {c.creator_name}
                      </span>
                      <span className="text-xs text-gray-400">{c.niche}</span>
                    </div>

                    <div className="min-w-[200px] break-all">
                      <a
                        href={c.tiktok_link}
                        target="_blank"
                        className="text-indigo-400 underline"
                      >
                        {c.tiktok_link}
                      </a>
                    </div>

                    <div className="min-w-[120px] text-center text-gray-400">
                      {c.posting_frequency}
                    </div>
                    <div className="min-w-[120px] text-center text-gray-400">
                      {c.performance_health}
                    </div>
                    <div className="min-w-[120px] text-center text-gray-400">
                      {c.risk_score}
                    </div>
                    <div className="min-w-[80px] text-center text-gray-400">
                      {c.region}
                    </div>
                  </div>

                  <div className="mt-2 text-gray-400">
                    <strong>Notes:</strong> {c.notes}
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

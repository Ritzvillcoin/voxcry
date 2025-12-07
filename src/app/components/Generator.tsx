"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import AdUnit from "./AdUnit"; // keep / remove depending on if you use it

/* -----------------------------------------------------
   🔒 Strong TypeScript Models
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
  creators: Creator[]; // Expecting your API to return { creators: [...] }
}

interface GeneratorProps {
  /** Niche to filter by, e.g. "beauty", "fitness", "amazon" */
  niche: string;
  /** Category to filter by; defaults to "all" */
  category?: "all" | "awareness" | "lead_gen" | "sales";
}

/* -----------------------------------------------------
   🔍 Helpers
----------------------------------------------------- */
function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function filterCreators(
  creators: Creator[],
  niche: string,
  category: string
): Creator[] {
  const normalizedNiche = normalize(niche);

  const byCategory =
    category === "all"
      ? creators
      : creators.filter((c) => c.category === category);

  if (!normalizedNiche) return byCategory;

  return byCategory.filter((c) =>
    c.niche.toLowerCase().includes(normalizedNiche)
  );
}

/* -----------------------------------------------------
   🎨 Component
----------------------------------------------------- */
export default function Generator({
  niche,
  category = "all",
}: GeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Creator[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------------------------------
     🚀 Fetch + filter on mount / when props change
  ----------------------------------------------------- */
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const res = await fetch("/api/secret", {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!res.ok) throw new Error("Unauthorized or API error");

        const data: ApiResponse = await res.json();
        const filtered = filterCreators(data.creators, niche, category);

        if (filtered.length === 0) {
          setError("No creators found for this shortlist.");
        } else {
          setResults(filtered);
        }
      } catch (err) {
        setError("Failed to load creator database.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [niche, category]);

  /* -----------------------------------------------------
     🎨 UI
  ----------------------------------------------------- */
  return (
    <section className="mx-auto mt-10 max-w-5xl px-4 text-white mb-0">
      {/* Heading */}
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h3 className="text-xl font-semibold text-indigo-400">
          Creator Shortlist
        </h3>
        <p className="text-xs text-gray-500">
          Niche: <span className="font-medium text-gray-300">{niche}</span>{" "}
          · Category:{" "}
          <span className="font-medium text-gray-300">
            {category === "all" ? "All" : category}
          </span>
        </p>
      </div>

      {loading && (
        <p className="mt-4 text-sm text-gray-400">Loading creators…</p>
      )}

      {error && !loading && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}

      {/* RESULTS */}
      <AnimatePresence>
        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-4 text-left"
          >
            <ul className="space-y-3">
              {/* HEADER */}
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
                <div className="min-w-[120px] text-center">
                  Performance
                </div>
                <div className="min-w-[120px] text-center">Risk</div>
                <div className="min-w-[80px] text-center">Region</div>
              </li>

              {/* ITEMS */}
              {results.map((c, i) => (
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
                    {/* Name / niche */}
                    <div className="flex flex-col min-w-[180px]">
                      <span className="font-semibold text-gray-200">
                        {c.creator_name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {c.niche}
                      </span>
                    </div>

                    {/* TikTok link */}
                    <div className="min-w-[200px] break-all">
                      <a
                        href={c.tiktok_link}
                        target="_blank"
                        rel="noreferrer"
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

                  {/* Notes */}
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdUnit from "./AdUnit"; 

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

/* -----------------------------------------------------
   🔍 Helper: Normalize query formatting
----------------------------------------------------- */
function normalizeInput(input: string): string {
  return input.trim().toLowerCase();
}

/* -----------------------------------------------------
   🔍 Helper: Filter creators
----------------------------------------------------- */
function filterCreators(
  creators: Creator[],
  query: string,
  category: string
): Creator[] {
  const lower = normalizeInput(query);
  const isHandle = lower.startsWith("@");

  // First filter by category
  const list = creators.filter((c) => c.category === category);

  if (isHandle) {
    return list.filter(
      (c) => c.creator_handle?.toLowerCase() === lower
    );
  }

  // Niche search
  return list.filter((c) =>
    c.niche.toLowerCase().includes(lower)
  );
}

/* -----------------------------------------------------
   🎨 Component
----------------------------------------------------- */
export default function Generator() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("awareness");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Creator[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------------------------------
     🚀 Main Search Function (Fully Typed)
  ----------------------------------------------------- */
  async function generate() {
    setResults([]);
    setError(null);

    if (!query.trim()) {
      setError("Enter a niche or a TikTok handle.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/secret", {
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      });

      if (!res.ok) throw new Error("Unauthorized or API error");

      // Strong typing enforced:
      const data: ApiResponse = await res.json();
      const filtered = filterCreators(data.creators, query, category);

      if (filtered.length === 0) {
        setError("No creators found for this search.");
      } else {
        setResults(filtered);
      }
    } catch (err) {
      setError("Failed to load creator database.");
    }

    setLoading(false);
  }

  /* -----------------------------------------------------
     🎨 UI
  ----------------------------------------------------- */
  return (
    <section className="mx-auto mt-10 max-w-5xl px-4 text-center text-white mb-0">

      {/* INPUT + CATEGORY */}
      <div className="mt-6 flex items-end">
        {/* Input */}
        <div className="flex-1 flex flex-col">
          <label className="mb-1 block text-sm text-gray-400">
            Enter a niche OR TikTok handle
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="fitness OR @fitmomjessie"
            className="w-full h-[44px] border border-white/10 bg-black/40 px-3 text-white rounded-l-lg"
          />
        </div>

        {/* Category Selector */}
        <div className="flex w-48 flex-col">
          <label className="mb-1 block text-sm text-gray-400">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-[44px] border border-white/10 bg-black/40 px-3 text-white rounded-r-lg"
          >
            <option value="awareness">Brand Awareness</option>
            <option value="lead_gen">Lead Generation</option>
            <option value="sales">Sales/Conversion</option>
          </select>
        </div>
      </div>

      {/* Search button */}
      <div className="mt-8">
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search Creators"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}
     
      {/* RESULTS */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-10 text-left"
          >
            <h3 className="mb-3 text-xl font-semibold text-indigo-400">
              Results
            </h3>

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
                <div className="min-w-[120px] text-center">Posting Frequency</div>
                <div className="min-w-[120px] text-center">Performance</div>
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
                      <span className="font-semibold text-gray-400">
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

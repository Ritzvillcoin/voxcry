"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Generator() {
  const [query, setQuery] = useState(""); // single input
  const [category, setCategory] = useState("awareness");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setResults([]);
    setError(null);

    if (!query.trim()) {
      setError("Enter a niche or a TikTok handle.");
      return;
    }

    setLoading(true);

    try {
      //const res = await fetch("/data/creators.json");
       // ⭐ SECURE FETCH ON CLICK
    const res = await fetch("/api/secret", {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY!,
      },
    });

    if (!res.ok) {
      throw new Error("Unauthorized or API error");
    }
      const creators = await res.json();

      const input = query.trim().toLowerCase();
      const isHandle = input.startsWith("@");

      // Filter first by category
      let filtered = creators.filter((c: any) => c.category === category);

      if (isHandle) {
        // HANDLE SEARCH
        filtered = filtered.filter(
          (c: any) => c.creator_handle?.toLowerCase() === input
        );
      } else {
        // NICHE SEARCH (contains match)
        filtered = filtered.filter((c: any) =>
          c.niche.toLowerCase().includes(input)
        );
      }

      if (filtered.length === 0) {
        setError("No creators found for this search.");
      } else {
        setResults(filtered);
      }
    } catch {
      setError("Failed to load creator database.");
    }

    setLoading(false);
  }

  return (
    <section className="mx-auto my-10 max-w-5xl px-4 text-center text-white">
      <h2 className="text-3xl font-bold">Search Micro Creators</h2>
      { /*<p className="mt-2 text-gray-400">
        Enter a niche (e.g. fitness, skincare) OR a TikTok handle (e.g. @fitmom).
      </p> */}

      {/* INPUT + CATEGORY ON SAME LINE */}
      <div className="mt-6 flex items-end">

        {/* Input Box */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm text-gray-400 mb-1">
            Enter a niche OR TikTok handle
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="fitness OR @fitmomjessie"
            className="
              w-full
              h-[44px]
              border border-white/10
              bg-black/40
              px-3
              text-white
              rounded-l-lg
            "
          />
        </div>

        {/* Category Selection */}
        <div className="flex flex-col w-48">
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="
              w-full
              h-[44px]
              border border-white/10
              bg-black/40
              px-3
              text-white
              rounded-r-lg
            "
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

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-10 text-left"
          >
            <h3 className="mb-3 text-xl font-semibold text-indigo-400">Results</h3>

          <ul className="space-y-3">

  {/* HEADER ROW — aligned with result columns */}
  <li
    className="
      flex 
      items-center 
      justify-between 
      gap-4
      px-4
      py-2
      text-xs
      font-semibold
      text-gray-400
      uppercase
      tracking-wide
      border-b border-white/10
    "
  >
    <div className="min-w-[180px]">Name / Niche</div>
    <div className="min-w-[200px]">TikTok Link</div>
     <div className="min-w-[120px] text-center">Posting Frequency</div>
    <div className="min-w-[120px] text-center">Performance</div>
    <div className="min-w-[120px] text-center">Risk</div>
    <div className="min-w-[80px] text-center">Region</div>
  </li>

  {results.map((c, i) => (
    <motion.li
      key={i}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        w-full
        rounded-lg 
        border border-white/10 
        bg-white/5 
        p-4
        shadow-md
        text-sm
      "
    >

      {/* FIRST ROW — matches header layout */}
      <div className="flex items-center justify-between gap-4">

        {/* Name + Niche */}
        <div className="flex flex-col min-w-[180px]">
          <span className="font-semibold text-gray-400">{c.creator_name}</span>
          <span className="text-gray-400 text-xs">{c.niche}</span>
        </div>

        {/* TikTok Link */}
        <div className="min-w-[200px] break-all">
          <a
            href={c.tiktok_link}
            target="_blank"
            className="text-indigo-400 underline"
          >
            {c.tiktok_link}
          </a>
        </div>
        {/* Posting frequency */}
        <div className="text-gray-400 min-w-[120px] text-center">
          {c.posting_frequency}
        </div>
        {/* Performance */}
        <div className="text-gray-400 min-w-[120px] text-center">
          {c.performance_health}
        </div>
         {/* Risk */}
        <div className="text-gray-400 min-w-[120px] text-center">
          {c.risk_score}
        </div>
        {/* Region */}
        <div className="text-gray-400 min-w-[80px] text-center">
          {c.region}
        </div>

      </div>

      {/* SECOND ROW — Notes ONLY */}
      <div className="text-gray-400 mt-2">
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

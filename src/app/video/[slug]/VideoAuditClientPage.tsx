"use client";

import { useEffect, useState, use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import TikTokEmbed from "@/app/components/TikTokEmbed";
import Footer from "@/app/components/Footer";

// Definining the specific types to remove the 'any' errors
type AuditRow = {
  criterion: string;
  verdict: "YES" | "NO" | "UNKNOWN";
  note: string;
};

interface VideoAudit {
  slug: string;
  tiktok_url: string;
  creator_handle?: string;
  format?: string;
  pack_slug?: string;
  pack_title?: string;
  final_label: "SIGNAL" | "MIXED" | "NOISE";
  quality_score: number;
  blog_title: string;
  summary?: string;
  blog_body?: string;
  audit_table?: AuditRow[];
  created_at: string;
}

export default function VideoAuditClientPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [data, setData] = useState<VideoAudit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAudit() {
      try {
        const res = await fetch(`/api/video/${slug}`);
        const json = await res.json();
        if (json.ok) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch audit:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAudit();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#ADFF2F] font-mono font-black uppercase italic">
      GETTING_SIGNAL_DATA...
    </div>
  );
  
  if (!data) return notFound();

  // Utility formatters preserved from your original logic
  const fmt = (iso?: string) => iso ? new Date(iso).toLocaleDateString(undefined, { 
    year: "numeric", month: "short", day: "numeric" 
  }) : "";
  
  const labelChip = (label: string) => {
    const common = "inline-flex items-center border-4 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest";
    if (label === "SIGNAL") return `${common} bg-[#ADFF2F] text-black`;
    if (label === "NOISE") return `${common} bg-red-500 text-black`;
    return `${common} bg-yellow-300 text-black`;
  };

  const verdictPill = (v: string) => {
    const base = "inline-flex items-center border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase";
    if (v === "YES") return `${base} bg-[#ADFF2F] text-black`;
    if (v === "NO") return `${base} bg-red-500 text-black`;
    return `${base} bg-zinc-200 text-black`;
  };

  const packSlug = (data.pack_slug || "").trim();
  const watchMoreHref = packSlug ? `/audits/${packSlug}` : "/audits";

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow mx-auto max-w-4xl px-6 py-10 font-mono">
        {/* TOP NAVIGATION */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 border-4 border-black bg-white px-4 py-2 font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition">
            ← VoxCry
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="border-4 border-black bg-[#ADFF2F] px-3 py-1 text-[10px] font-black uppercase tracking-widest">Video Audit</span>
            {data.format && <span className="border-4 border-black bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]">{data.format}</span>}
          </div>
        </div>

        {/* HERO HEADER CARD */}
        <div className="border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">{fmt(data.created_at) || "—"}</span>
              {data.creator_handle && (
                <a href={`https://www.tiktok.com/${data.creator_handle}`} target="_blank" rel="noreferrer" className="border-4 border-black bg-white px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition">
                  {data.creator_handle}
                </a>
              )}
              <a href={data.tiktok_url} target="_blank" rel="noreferrer" className="border-4 border-black bg-white px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition">Open TikTok →</a>
            </div>
            <h1 className="mt-2 text-3xl md:text-5xl font-black uppercase italic leading-[0.95] tracking-tighter">{data.blog_title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className={labelChip(data.final_label)}>{data.final_label}</span>
              <span className="inline-flex items-center border-4 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">Score {data.quality_score}/8</span>
            </div>
            {data.summary && <p className="mt-4 text-[16px] leading-7 font-medium text-zinc-900">{data.summary}</p>}
          </div>
        </div>

        {/* VIDEO EMBED */}
        <div className="mt-8 border-4 border-black bg-white p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <TikTokEmbed key={data.slug} videoUrl={data.tiktok_url} />
        </div>

        {/* AUDITOR NOTES */}
        {data.blog_body && (
          <div className="mt-8 border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">Notes</span>
              <span className="border-4 border-black bg-[#ADFF2F] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]">Why it hits / why it misses</span>
            </div>
            <div className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">{data.blog_body}</div>
          </div>
        )}

        {/* CRITERIA BREAKDOWN TABLE */}
        {data.audit_table && data.audit_table.length > 0 && (
          <div className="mt-8 border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="overflow-hidden border-4 border-black">
              <table className="w-full border-collapse text-left">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-3 text-[10px] font-black uppercase">Criterion</th>
                    <th className="p-3 text-[10px] font-black uppercase">Verdict</th>
                    <th className="p-3 text-[10px] font-black uppercase">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {data.audit_table.map((r, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-zinc-50"}>
                      <td className="p-3 border-t-2 border-black font-black uppercase text-xs">{r.criterion}</td>
                      <td className="p-3 border-t-2 border-black"><span className={verdictPill(r.verdict)}>{r.verdict}</span></td>
                      <td className="p-3 border-t-2 border-black text-sm text-zinc-800">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA: WATCH MORE ON VOXCRY */}
        <div className="mt-10 border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Watch more</div>
              <div className="mt-1 text-lg font-black uppercase">{data.pack_title || "VoxCry Collections"}</div>
              <div className="mt-1 text-sm text-zinc-700">{packSlug ? "Same vibe, 5-clip drops." : "Browse curated playlists."}</div>
            </div>
            <Link href={watchMoreHref} className="inline-flex items-center justify-center border-4 border-black bg-black px-7 py-4 font-black uppercase text-white shadow-[8px_8px_0px_0px_#ADFF2F] hover:-translate-x-0.5 hover:-translate-y-0.5 transition">
              Watch more on VoxCry →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
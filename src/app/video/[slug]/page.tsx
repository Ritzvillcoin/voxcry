import type { Metadata } from "next";
import Link from "next/link";
import TikTokEmbed from "@/app/components/TikTokEmbed";

export const dynamic = "force-dynamic";

type AuditRow = {
  criterion: string;
  verdict: "YES" | "NO" | "UNKNOWN";
  note: string;
};

type VideoAudit = {
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
  updated_at?: string;
};

type ApiResponse =
  | { ok: true; data: VideoAudit }
  | { ok: false; error: string };

function baseUrl() {
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}

// ✅ no `any`: supports params being object OR Promise-like
async function getSlugFromProps(props: unknown): Promise<string> {
  if (!props || typeof props !== "object") return "";

  const maybeParams = (props as { params?: unknown }).params;
  const params =
    maybeParams && typeof maybeParams === "object" && "then" in (maybeParams as object)
      ? await (maybeParams as Promise<unknown>)
      : maybeParams;

  if (!params || typeof params !== "object") return "";
  const slug = (params as { slug?: unknown }).slug;

  return typeof slug === "string" ? slug.trim() : "";
}

async function fetchAudit(slug: string): Promise<VideoAudit | null> {
  if (!slug) return null;

  const res = await fetch(`${baseUrl()}/api/video/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const json = (await res.json()) as ApiResponse;
  if (!json || typeof json !== "object") return null;

  return "ok" in json && (json as { ok: boolean }).ok ? (json as { data: VideoAudit }).data : null;
}

function fmt(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function labelChip(label: VideoAudit["final_label"]) {
  const common =
    "inline-flex items-center border-4 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest";
  if (label === "SIGNAL") return `${common} bg-[#ADFF2F] text-black`;
  if (label === "NOISE") return `${common} bg-red-500 text-black`;
  return `${common} bg-yellow-300 text-black`;
}

function verdictPill(v: AuditRow["verdict"]) {
  const base =
    "inline-flex items-center border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase";
  if (v === "YES") return `${base} bg-[#ADFF2F] text-black`;
  if (v === "NO") return `${base} bg-red-500 text-black`;
  return `${base} bg-zinc-200 text-black`;
}

export async function generateMetadata(props: unknown): Promise<Metadata> {
  const slug = await getSlugFromProps(props);
  const data = await fetchAudit(slug);

  if (!data) return { title: "Video Audit • VoxCry" };

  const desc = `${data.final_label} • ${data.quality_score}/8 • ${
    (data.summary || "Video audit + explanation.").trim()
  }`;

  return {
    title: `${data.blog_title} • VoxCry`,
    description: desc,
    openGraph: {
      title: `${data.blog_title} • VoxCry`,
      description: desc,
      url: `/video/${data.slug}`,
      type: "article",
    },
  };
}

export default async function Page(props: unknown) {
  const slug = await getSlugFromProps(props);
  const data = await fetchAudit(slug);

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="border-4 border-black bg-white p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-2xl font-black uppercase">Not found</h1>
          <p className="mt-2 text-zinc-700">
            This video audit doesn’t exist (or hasn’t been published yet).
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex border-4 border-black bg-black px-5 py-3 font-black uppercase text-white shadow-[6px_6px_0px_0px_#ADFF2F] hover:-translate-x-0.5 hover:-translate-y-0.5 transition"
          >
            Back home →
          </Link>
        </div>
      </div>
    );
  }

  const published = fmt(data.created_at);
  const updated = fmt(data.updated_at);
  const showUpdated = Boolean(updated && updated !== published);

  const summary = (data.summary || "").trim();
  const body = (data.blog_body || "").trim();

  const rows = Array.isArray(data.audit_table) ? data.audit_table : [];
  const hasTable = rows.length > 0;

  const packSlug = (data.pack_slug || "").trim();
  const watchMoreHref = packSlug ? `/audits/${packSlug}` : "/audits";

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* TOP STRIP */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 border-4 border-black bg-white px-4 py-2 font-black uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition"
        >
          ← VoxCry
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="border-4 border-black bg-[#ADFF2F] px-3 py-1 text-[10px] font-black uppercase tracking-widest">
            Video Audit
          </span>
          {data.format ? (
            <span className="border-4 border-black bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]">
              {data.format}
            </span>
          ) : null}
        </div>
      </div>

      {/* HERO CARD */}
      <div className="border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              {published || "—"}
            </span>

            {showUpdated ? (
              <span className="bg-white border-4 border-black px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]">
                Updated {updated}
              </span>
            ) : null}

            {data.creator_handle ? (
              <a
                href={`https://www.tiktok.com/${data.creator_handle}`}
                target="_blank"
                rel="noreferrer"
                className="border-4 border-black bg-white px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition"
              >
                {data.creator_handle}
              </a>
            ) : null}

            <a
              href={data.tiktok_url}
              target="_blank"
              rel="noreferrer"
              className="border-4 border-black bg-white px-3 py-1 text-[10px] font-black uppercase hover:bg-black hover:text-white transition"
            >
              Open TikTok →
            </a>
          </div>

          <h1 className="mt-2 text-3xl md:text-5xl font-black uppercase italic leading-[0.95] tracking-tighter">
            {data.blog_title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={labelChip(data.final_label)}>{data.final_label}</span>
            <span className="inline-flex items-center border-4 border-black bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              Score {data.quality_score}/8
            </span>
          </div>

          {summary ? (
            <p className="mt-4 text-[16px] leading-7 font-medium text-zinc-900">
              {summary}
            </p>
          ) : null}
        </div>
      </div>

      {/* EMBED */}
      <div className="mt-8 border-4 border-black bg-white p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <TikTokEmbed key={data.slug} videoUrl={data.tiktok_url} />
      </div>

      {/* BODY / NOTES */}
      {body ? (
        <div className="mt-8 border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              Notes
            </span>
            <span className="border-4 border-black bg-[#ADFF2F] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]">
              Why it hits / why it misses
            </span>
          </div>

          <div className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-800">
            {body}
          </div>
        </div>
      ) : null}

      {/* AUDIT TABLE (optional) */}
      {hasTable ? (
        <div className="mt-8 border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
              Breakdown
            </span>
            <span className="border-4 border-black bg-white px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em]">
              criteria-based
            </span>
          </div>

          <div className="overflow-hidden border-4 border-black">
            <table className="w-full border-collapse">
              <thead className="bg-black text-white">
                <tr>
                  <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest">
                    Criterion
                  </th>
                  <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest">
                    Verdict
                  </th>
                  <th className="p-3 text-left text-[10px] font-black uppercase tracking-widest">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr
                    key={`${r.criterion}-${idx}`}
                    className={idx % 2 === 0 ? "bg-white" : "bg-zinc-50"}
                  >
                    <td className="p-3 align-top font-black uppercase text-xs tracking-tight">
                      {r.criterion}
                    </td>
                    <td className="p-3 align-top">
                      <span className={verdictPill(r.verdict)}>{r.verdict}</span>
                    </td>
                    <td className="p-3 align-top text-sm text-zinc-800">
                      {r.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* CTA */}
      <div className="mt-10 border-4 border-black bg-white p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
              Watch more
            </div>
            <div className="mt-1 text-lg font-black uppercase">
              {data.pack_title ? data.pack_title : "VoxCry Collections"}
            </div>
            <div className="mt-1 text-sm text-zinc-700">
              {packSlug ? "Same vibe, 5-clip drops." : "Browse curated playlists."}
            </div>
          </div>

          <Link
            href={watchMoreHref}
            className="inline-flex items-center justify-center border-4 border-black bg-black px-7 py-4 font-black uppercase text-white shadow-[8px_8px_0px_0px_#ADFF2F] hover:-translate-x-0.5 hover:-translate-y-0.5 transition"
          >
            Watch more on VoxCry →
          </Link>
        </div>
      </div>
    </div>
  );
}



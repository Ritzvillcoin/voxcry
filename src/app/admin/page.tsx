"use client";

import { useMemo, useState } from "react";

function normalizeHandle(input: string) {
  const s = (input || "").trim();
  if (!s) return "";
  return s.startsWith("@") ? s : `@${s}`;
}

function extractTikTokPostId(tiktokUrl: string) {
  const m = (tiktokUrl || "").match(/\/(video|photo)\/(\d+)/);
  return m?.[2] ?? "";
}

function extractTikTokHandle(tiktokUrl: string) {
  const m = (tiktokUrl || "").match(/tiktok\.com\/@([^\/\?\#]+)/i);
  const raw = m?.[1] ?? "";
  return raw ? normalizeHandle(raw) : "";
}

const FORMAT_OPTIONS = [
  "POV Skit / Mini Story",
  "Mini Series",
  "POV Relatable (Talking-Head Reaction/Meme)",
  "POV relatable relationship humor (curiosity + payoff)",
  "POV Relatable Roleplay (Talking-Head Skit)",
  "POV Relatable (Hot Take Talking-Head)",
  "Lifestyle Montage",
  "Tutorial (Step-by-step)",
  "Problem → Solution",
  "Storytime",
  "Talking-Head Intro (Big Text) + Question Prompt Hook",
  "Hot take / Opinion",
  "List / Ranking",
  "Reaction / Stitch",
  "Text-on-screen montage",
] as const;

export default function AdminAddVideoPage() {
  const [adminToken, setAdminToken] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [format, setFormat] = useState<string>(FORMAT_OPTIONS[0]);

  // Audit States
  const [score, setScore] = useState<number>(8);

  // Mini-blog fields (NEW)
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSummary, setBlogSummary] = useState(""); // short: 1–3 lines
  const [blogBody, setBlogBody] = useState("");       // optional: longer notes (plain text/markdown)

  // Optional: assign to pack later or now (NEW)
  const [packSlug, setPackSlug] = useState("");       // e.g. "texting-anxiety"
  const [packTitle, setPackTitle] = useState("");     // e.g. "Texting Anxiety"

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [auditUrl, setAuditUrl] = useState<string>("");

  const handle = useMemo(() => extractTikTokHandle(tiktokUrl), [tiktokUrl]);
  const postId = useMemo(() => extractTikTokPostId(tiktokUrl), [tiktokUrl]);

  // Recommend: slug = postId (stable + unique)
  const slug = useMemo(() => (postId ? postId : ""), [postId]);

  async function submit() {
    setMsg("");
    setAuditUrl("");

    if (!adminToken.trim()) { setMsg("Missing token."); return; }
    if (!postId) { setMsg("Invalid TikTok URL."); return; }
    if (!blogTitle.trim()) { setMsg("Please provide a Blog Title."); return; }
    if (!blogSummary.trim()) { setMsg("Please provide a short Blog Summary."); return; }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/add-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminToken: adminToken.trim(),
          slug, // audit slug
          creator_handle: handle,
          tiktok_url: tiktokUrl.trim(),
          format,
          pack_slug: packSlug.trim() || undefined,
          pack_title: packTitle.trim() || undefined,
          audit: {
            score: Number(score),
            verdict: score >= 6 ? "SIGNAL" : "NOISE",
          },
          blog: {
            title: blogTitle.trim(),
            summary: blogSummary.trim(),
            body: blogBody.trim(), // optional
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMsg(`Error: ${data?.error || res.status}`);
        return;
      }

      setMsg(`✅ Audit Published: ${data.slug} | Score: ${score}/8`);
      setAuditUrl(data.audit_url || "");

      // reset (keep pack slug if you want)
      setTiktokUrl("");
      setBlogTitle("");
      setBlogSummary("");
      setBlogBody("");
    } catch (e: unknown) {
      setMsg(`Error: ${e instanceof Error ? e.message : "failed"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 font-mono">
      <h1 className="text-2xl font-bold text-white uppercase italic">Architect — Publish Audit</h1>

      <div className="mt-6 space-y-4 rounded-xl bg-zinc-900 p-6 border border-white/10 shadow-2xl">
        <input
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder="ADMIN_TOKEN"
          type="password"
          className="w-full rounded bg-zinc-800 p-2 text-white border border-white/10 outline-none focus:border-white/30"
        />

        <input
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
          placeholder="TikTok Post URL"
          className="w-full rounded bg-zinc-800 p-2 text-white border border-white/10 outline-none"
        />

        <div className="text-xs text-gray-400">
          Detected: <span className="text-white/80">{handle || "—"}</span>{" "}
          | PostId/Slug: <span className="text-white/80">{slug || "—"}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full rounded bg-zinc-800 p-2 text-white border border-white/10"
          >
            {FORMAT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full rounded bg-zinc-800 p-2 text-white border border-white/10"
          >
            {[8,7,6,5,4,3,2,1,0].map(n => (
              <option key={n} value={n}>Score: {n}/8</option>
            ))}
          </select>
        </div>

        {/* Pack assignment (optional) */}
        <div className="grid grid-cols-2 gap-4">
          <input
            value={packSlug}
            onChange={(e) => setPackSlug(e.target.value)}
            placeholder='pack_slug (optional) e.g. "texting-anxiety"'
            className="w-full rounded bg-zinc-800 p-2 text-white border border-white/10 outline-none"
          />
          <input
            value={packTitle}
            onChange={(e) => setPackTitle(e.target.value)}
            placeholder='pack_title (optional) e.g. "Texting Anxiety"'
            className="w-full rounded bg-zinc-800 p-2 text-white border border-white/10 outline-none"
          />
        </div>

        {/* Mini blog (NEW) */}
        <input
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          placeholder="Blog Title (required)"
          className="w-full rounded bg-zinc-800 p-2 text-white border border-white/10 outline-none focus:border-white/30"
        />

        <textarea
          value={blogSummary}
          onChange={(e) => setBlogSummary(e.target.value)}
          placeholder="Blog Summary (required) — 1–3 lines"
          rows={3}
          className="w-full rounded bg-zinc-800 p-3 text-white border border-white/10 resize-none outline-none focus:border-white/30"
        />

        <textarea
          value={blogBody}
          onChange={(e) => setBlogBody(e.target.value)}
          placeholder="Mini blog body (optional) — write like a Medium-style audit. You can use plain text or light markdown."
          rows={6}
          className="w-full rounded bg-zinc-800 p-3 text-white border border-white/10 resize-none outline-none focus:border-white/30"
        />

        <button
          disabled={busy}
          onClick={submit}
          className={`w-full rounded py-4 font-black uppercase tracking-widest transition-all ${
            score >= 6 ? "bg-green-500 text-black" : "bg-red-600 text-white"
          } disabled:opacity-50`}
        >
          {busy ? "PUBLISHING..." : "Publish Audit"}
        </button>

        {msg && (
          <div className="text-center text-xs text-gray-300 bg-black/40 p-2 rounded border border-white/5">
            {msg}
            {auditUrl && (
              <div className="mt-2">
                <a className="underline text-white" href={auditUrl} target="_blank" rel="noreferrer">
                  Open audit page →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




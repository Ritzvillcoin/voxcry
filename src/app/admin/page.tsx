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

export default function AdminAddVideoPage() {
  const [adminToken, setAdminToken] = useState("");
  const [creatorHandle, setCreatorHandle] = useState("@");
  const [tiktokUrl, setTiktokUrl] = useState("");

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const handle = useMemo(() => normalizeHandle(creatorHandle), [creatorHandle]);
  //const videoId = useMemo(() => extractVideoId(tiktokUrl), [tiktokUrl]);
  const postId = useMemo(() => extractTikTokPostId(tiktokUrl), [tiktokUrl]);

  async function submit() {
    setMsg("");

    if (!adminToken.trim()) {
      setMsg("Missing admin token.");
      return;
    }
    if (!handle) {
      setMsg("Missing creator handle.");
      return;
    }
    if (!tiktokUrl.trim() || !postId) {
      setMsg("TikTok URL must be a valid video URL: /@handle/video/<id>");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/add-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminToken: adminToken.trim(),
          creator_handle: handle,
          tiktok_url: tiktokUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(`Error: ${data?.error || res.status}`);
        return;
      }

      setMsg(`✅ Added ${data.handle} video ${data.video_id} (ts=${data.added_at})`);
      setTiktokUrl("");
    } catch (e: unknown) {
  const message = e instanceof Error ? e.message : "request_failed";
  setMsg(`Error: ${message}`);
}
 finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">Admin — Add Creator Video</h1>
      <p className="mt-2 text-sm text-gray-400">
        Adds creator + newest-first indexes + video record into KV.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl bg-zinc-900/70 p-4 ring-1 ring-white/10">
        <label className="block">
          <div className="text-xs text-gray-400">Admin token</div>
          <input
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            placeholder="ADMIN_TOKEN"
            type="password"
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10"
          />
        </label>

        <label className="block">
          <div className="text-xs text-gray-400">Creator handle</div>
          <input
            value={creatorHandle}
            onChange={(e) => setCreatorHandle(e.target.value)}
            placeholder="@infiniteelliott"
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10"
          />
        </label>

        <label className="block">
          <div className="text-xs text-gray-400">TikTok video URL</div>
          <input
            value={tiktokUrl}
            onChange={(e) => setTiktokUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@infiniteelliott/video/7584179042291698999"
            className="mt-2 w-full rounded-xl bg-zinc-800 px-3 py-2 text-white outline-none ring-1 ring-white/10"
          />
          <div className="mt-2 text-xs text-gray-500">
            Parsed: <span className="text-gray-300">{handle || "—"}</span>
            | post_id: <span className="text-gray-300">{postId || "—"}</span>
          </div>
        </label>

        <button
          disabled={busy}
          onClick={submit}
          className="w-full rounded-2xl bg-white py-3 font-bold text-black disabled:opacity-60"
        >
          {busy ? "Saving…" : "Add to KV"}
        </button>

        {msg ? (
          <div className="rounded-xl bg-black/30 p-3 text-sm text-gray-200 ring-1 ring-white/10">
            {msg}
          </div>
        ) : null}
      </div>
    </div>
  );
}

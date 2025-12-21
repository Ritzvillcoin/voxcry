"use client";

function extractPostId(url: string) {
  const m = (url || "").match(/\/(video|photo)\/(\d+)/);
  return m?.[2] ?? null;
}


export default function TikTokEmbed({ videoUrl }: { videoUrl: string }) {
  const postId = extractPostId(videoUrl);

  if (!postId) {
    return (
      <div className="p-3 text-sm text-gray-300">
        Invalid TikTok video URL. Expected /@handle/video/123...
      </div>
    );
  }

  const src = `https://www.tiktok.com/player/v1/${postId}`;

  return (
    <iframe
      key={postId}
      src={src}
      allow="fullscreen"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      className="w-full rounded-2xl"
      style={{ height: 460, border: 0 }}
      title={`TikTok video ${postId}`}
    />
  );
}



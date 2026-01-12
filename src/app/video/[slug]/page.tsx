import { Metadata } from "next";
import VideoAuditClientPage from "./VideoAuditClientPage";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.voxcry.com";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch for crawlers
  const res = await fetch(`${baseUrl}/api/video/${slug}`, { cache: "no-store" });
  const json = await res.json();
  const data = json.data;

  if (!data) return { title: "Video Audit • VoxCry" };

  const desc = `${data.final_label} • Score ${data.quality_score}/8 • ${(data.summary || "").trim()}`;
  const ogImageUrl = `${baseUrl}/video/${slug}/opengraph-image`;

  return {
    title: `${data.blog_title} • VoxCry`,
    description: desc,
    openGraph: {
      title: `${data.blog_title} • VoxCry`,
      description: desc,
      url: `${baseUrl}/video/${slug}`,
      type: "article",
      siteName: "VoxCry",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.blog_title} • VoxCry`,
      description: desc,
      images: [ogImageUrl],
    },
  };
}

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <VideoAuditClientPage params={params} />;
}



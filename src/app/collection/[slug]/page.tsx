import { Metadata } from "next";
import CollectionClientPage from "./CollectionClientPage"; // We move your UI here

// 1. DYNAMIC METADATA (Server Side)
// This overwrites layout.tsx and triggers the Dynamic OG Image
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  const res = await fetch(`${baseUrl}/api/collection/${slug}`);
  const json = await res.json();
  const collection = json.data;

  if (!collection) return { title: "Pack Not Found" };

  return {
    title: `${collection.title} | VoxCry`,
    description: collection.description,
    openGraph: {
      title: collection.title,
      description: collection.description,
      url: `https://voxcry.com/collection/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: collection.title,
      description: collection.description,
      // The opengraph-image.tsx file handles the image automatically
    },
  };
}

// 2. THE PAGE COMPONENT
export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <CollectionClientPage params={params} />;
}
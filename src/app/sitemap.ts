import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://voxcry.com";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/collections`, lastModified: new Date() },
    // add collection pages if you have slugs:
    // { url: `${base}/collection/5-tiktoks-for-the-left-on-read`, lastModified: new Date() },
  ];
}

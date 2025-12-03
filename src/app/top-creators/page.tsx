/* -----------------------------------------------------
   📄 SERVER COMPONENT — metadata + wrapper ONLY
----------------------------------------------------- */

export const metadata = {
  title: "Top Creators | VoxCry AI-Powered Creator Vetting",
  description:
    "Discover top-performing TikTok creators vetted by VoxCry’s AI-powered analysis. Browse creators with strong engagement, reliable performance, and low risk scores — ideal for brands, agencies, and UGC buyers.",
  keywords: [
    "top TikTok creators",
    "best TikTok creators for brands",
    "TikTok creators vetted by AI",
    "AI creator vetting",
    "TikTok influencer analysis",
    "TikTok creator audit",
    "high-engagement TikTok creators",
    "brand-safe TikTok creators",
    "creator performance analysis",
    "influencer risk score",
    "AI influencer screening",
    "VoxCry creator analysis",
    "VoxCry top creators"
  ],
};

import TopCreatorsClient from "./TopCreatorsClient";

export default function Page() {
  return <TopCreatorsClient />;
}

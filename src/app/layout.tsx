import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Voxcry — Your Brand’s Voice, Automated",
  description:
    "Voxcry fine-tunes LoRA models on your tone and connects a live knowledge base for accurate, on-brand replies and copy.",
  metadataBase: new URL("https://voxcry.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

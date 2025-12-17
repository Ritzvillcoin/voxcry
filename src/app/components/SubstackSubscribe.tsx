// src/components/SubstackSubscribe.tsx
import React from "react";

type Props = {
  publicationUrl?: string; // e.g. "https://voxcry.substack.com"
  heading?: string;
  subheading?: string;
  className?: string;
};

export default function SubstackSubscribe({
  publicationUrl = "https://voxcry.substack.com",
  heading = "Subscribe to VoxCry",
  subheading = "Get new creator shortlists, product updates, and experiments in your inbox.",
  className = "",
}: Props) {
  const base = publicationUrl.replace(/\/+$/, "");
  const embedSrc = `${base}/embed`;
  const subscribeLink = `${base}/subscribe`;

  return (
    <section className={`w-full ${className}`} aria-label="Newsletter signup">
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{heading}</h2>
        <p className="mt-2 text-sm md:text-base text-white/70">{subheading}</p>

        <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <iframe
            title="VoxCry Substack subscribe"
            src={embedSrc}
            width="100%"
            height="320"
            style={{ border: "0", background: "transparent" }}
            scrolling="no"
          />
        </div>

        <p className="mt-3 text-xs text-white/50">
          If the form doesn’t load, subscribe here:{" "}
          <a className="underline" href={subscribeLink} target="_blank" rel="noreferrer">
            {subscribeLink}
          </a>
        </p>
      </div>
    </section>
  );
}

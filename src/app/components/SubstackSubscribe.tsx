import React from "react";

type Props = {
  publicationUrl?: string; // e.g. "https://voxcry.substack.com"
  heading?: string;
  subheading?: string;
  className?: string;
};

export default function SubstackSubscribe({
  publicationUrl = "https://voxcry.substack.com",
  heading = "The Creator Registry: Mission 1M",
  subheading = "Our architecture is designed to help 1,000,000 creators move beyond the default scroll. Subscribe for cognitive curation, signal-to-noise audits, and protocols for intentional digital growth.",
  className = "",
}: Props) {
  const base = publicationUrl.replace(/\/+$/, "");
  const embedSrc = `${base}/embed`;
  const subscribeLink = `${base}/subscribe`;

  return (
    <section className={`w-full ${className}`} aria-label="Newsletter signup">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#ADFF2F]/5 blur-3xl pointer-events-none" />

        {/* System Status / Mission Tracker */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#ADFF2F] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ADFF2F]">
              Registry Active
            </span>
          </div>
          <div className="h-[1px] flex-1 bg-white/10" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Target: 1,000,000 Creators
          </span>
        </div>

        {/* Main Content */}
        <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-white leading-[0.9]">
          {heading}
        </h2>
        
        <p className="mt-6 text-sm md:text-lg font-medium text-zinc-400 leading-relaxed max-w-2xl">
          {subheading}
        </p>

        {/* Substack Embed Container */}
<div className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/30">
  <iframe
    title="VoxCry Substack subscribe"
    /* We add ?minimal=true here to hide the duplicate Substack header */
    src={`${embedSrc}?minimal=true`} 
    width="100%"
    /* We can reduce the height now since the internal heading is gone */
    height="160" 
    style={{ 
      border: "0", 
      background: "transparent",
      filter: "invert(1) hue-rotate(180deg) brightness(1.2) contrast(1.1)" 
    }}
    scrolling="no"
  />
</div>

        {/* Footer Info */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-white/5 pt-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Audit Level</p>
              <p className="text-xs font-bold text-white uppercase">10M Deep</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Frequency</p>
              <p className="text-xs font-bold text-white uppercase">Semi-Weekly</p>
            </div>
          </div>
          
          <p className="text-[10px] text-white/30 font-mono uppercase">
            If form fails:{" "}
            <a 
              className="text-[#ADFF2F] underline underline-offset-4 hover:text-white transition-colors" 
              href={subscribeLink} 
              target="_blank" 
              rel="noreferrer"
            >
              Direct Access
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
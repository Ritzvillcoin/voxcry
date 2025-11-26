"use client";
import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());

      // Send to Next.js API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
    } catch (err) {
      console.error("❌ Error:", err);
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto my-24 max-w-6xl px-4">
      <div className="grid gap-6 md:grid-cols-2">
        {/* === Left column === */}
        <div>
          <h3 className="text-2xl font-semibold">Get Started with VoxCry</h3>
          <p className="mt-2 text-[var(--muted)]">
            Tell us what type of UGC creators you’re looking for. 
            We’ll walk you through how VoxCry screens creators using AI and delivers instant brand-fit reports.
          </p>
          <ul className="mt-4 space-y-2 text-[var(--muted)]">
            <li>• AI-powered UGC creator screening</li>
            <li>• Niche, style & engagement analysis</li>
            <li>• Brand-fit scoring in minutes</li>
            <li>• Simple workflow for teams & agencies</li>
          </ul>
        </div>

        {/* === Right column (form) === */}
        <form onSubmit={onSubmit} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <input
              name="name"
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm">Message</label>
            <textarea
              name="message"
              rows={4}
              placeholder=" "
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2"
            />
          </div>

          <button
            className="button-primary mt-3 w-full"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Send"}
          </button>

          {status === "sent" && (
            <p className="mt-3 text-sm text-green-300">
              ✅ Thanks! We’ll get back to you shortly.
            </p>
          )}
          {status === "error" && (
            <p className="mt-3 text-sm text-red-300">
              ❌ Something went wrong. Try again.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

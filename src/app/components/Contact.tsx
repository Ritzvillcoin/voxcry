"use client";
import { useState } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());
      // TODO: wire to your email/Zapier/Resend backend
      console.log("Contact payload", payload);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto my-24 max-w-6xl px-4">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold">Book a demo</h3>
          <p className="mt-2 text-[var(--muted)]">
            Tell us about your use case (creator, agency, SMB). We’ll reply with next steps and a secure upload link.
          </p>
          <ul className="mt-4 space-y-2 text-[var(--muted)]">
            <li>• Typical training: 24–72 hours</li>
            <li>• Private model hosting on request</li>
            <li>• Optional: downloadable adapter</li>
          </ul>
        </div>
        <form onSubmit={onSubmit} className="card p-6">
          <label className="block text-sm">Name</label>
          <input name="name" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" />
          <label className="mt-4 block text-sm">Email</label>
          <input type="email" name="email" required className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" />
          <label className="mt-4 block text-sm">Message</label>
          <textarea name="message" rows={4} className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2" placeholder="What do you want to train? e.g., hooks, support replies, both" />
          <button className="button-primary mt-5 w-full" disabled={status==="sending"}>
            {status==="sending" ? "Sending..." : "Send"}
          </button>
          {status==="sent" && <p className="mt-3 text-sm text-green-300">Thanks! We’ll get back to you shortly.</p>}
          {status==="error" && <p className="mt-3 text-sm text-red-300">Something went wrong. Try again.</p>}
        </form>
      </div>
    </section>
  );
}

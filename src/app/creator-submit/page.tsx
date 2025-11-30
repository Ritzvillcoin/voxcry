"use client";

import React, { useState } from "react";

export default function CreatorSubmitPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "creator_submit",
          ...payload,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("sent");
    } catch (err) {
      console.error("❌ Error:", err);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 py-28">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Submit Your Creator Profile
        </h1>
        <p className="text-gray-400 mb-10 text-center">
          Get screened by VoxCry’s AI and get discovered by brands.
        </p>

        <form onSubmit={onSubmit} className="space-y-6 bg-black/40 p-8 rounded-xl border border-white/10 backdrop-blur">
          
          <div>
            <label className="block mb-1 text-sm text-gray-200">TikTok Handle</label>
            <input 
              name="handle"
              placeholder="@username"
              required
              className="w-full p-3 rounded bg-black/40 border border-white/20"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Category</label>
            <select name="category" className="w-full p-3 rounded bg-black/40 border border-white/20">
              <option>Beauty</option>
              <option>Fitness</option>
              <option>Lifestyle</option>
              <option>Fashion</option>
              <option>Pets</option>
              <option>Food</option>
              <option>Tech</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Niche Keywords</label>
            <input 
              name="niche"
              placeholder="skincare, dogs, workouts..."
              className="w-full p-3 rounded bg-black/40 border border-white/20"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Region / Country</label>
            <input 
              name="region"
              placeholder="United States, Canada..."
              className="w-full p-3 rounded bg-black/40 border border-white/20"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Email (optional)</label>
            <input 
              type="email"
              name="email"
              className="w-full p-3 rounded bg-black/40 border border-white/20"
            />
          </div>

          <button 
            className="button-primary w-full py-3"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Submitting..." : "Submit Profile"}
          </button>

          {status === "sent" && (
            <p className="text-green-400 mt-3 text-center">
              ✅ Creator profile submitted successfully!
            </p>
          )}

          {status === "error" && (
            <p className="text-red-400 mt-3 text-center">
              ❌ Something went wrong. Try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}



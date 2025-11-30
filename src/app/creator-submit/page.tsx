"use client";

import { useState } from "react";

export default function CreatorSubmitPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/creator-submit", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    setLoading(false);
    if (res.ok) setSuccess(true);
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

        <form 
          onSubmit={handleSubmit} 
          className="space-y-6 bg-black/40 p-8 rounded-xl border border-white/10 backdrop-blur"
        >

          <div>
            <label className="block mb-1 text-sm text-gray-200">TikTok Handle</label>
            <input 
              name="creator_handle" 
              placeholder="@username" 
              className="w-full p-3 rounded bg-black/40 border border-white/20"
              required 
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-200">Category</label>
            <select 
              name="category" 
              className="w-full p-3 rounded bg-black/40 border border-white/20"
            >
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
              name="email" 
              type="email" 
              className="w-full p-3 rounded bg-black/40 border border-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg rounded bg-brand-500 hover:bg-brand-400 transition"
          >
            {loading ? "Submitting..." : "Submit Profile"}
          </button>

          {success && (
            <p className="text-green-400 mt-4 text-center">
              Your profile has been submitted!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}


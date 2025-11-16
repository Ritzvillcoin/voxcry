"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Generator() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setAnswers([]);
    setError(null);

    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }

    setLoading(true);

    try {
      //const prompt = `Q: ${question.trim()}\nA:`;
      const prompt=`[INST] ${question.trim()} [/INST]`;
      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();

      if (Array.isArray(data.answers)) {
        setAnswers([data.answers[0]]);
      } else if (data.generated_text) {
        setAnswers([data.generated_text]);
      } else {
        setAnswers(["No answer generated."]);
      }
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto my-24 max-w-3xl px-4 text-center text-white">
      <h2 className="text-3xl font-bold">Ask a Question</h2>
      <p className="mt-2 text-gray-400">
        Enter a frequently asked question — VoxCry AI will answer clearly and helpfully.
      </p>

      <div className="mt-6 text-left">
        <label className="block text-sm text-gray-400 mb-1">Your Question</label>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. How do I update my business listing on ContentFarm.ca?"
          className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mt-8">
        <button
          onClick={generate}
          disabled={loading}
          className="rounded-lg bg-indigo-500 px-6 py-3 font-medium text-white hover:bg-indigo-400 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Get Answer"}
        </button>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      <AnimatePresence>
        {answers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-10 text-left"
          >
            <h3 className="mb-3 text-xl font-semibold text-indigo-400">Answer</h3>
            <ul className="space-y-3 text-gray-400">
              {answers.map((answer, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className="rounded-lg border border-white/10 bg-white/5 p-3 leading-relaxed shadow-md"
                >
                  {i + 1}. {answer}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}



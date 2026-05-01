"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!idea.trim()) {
      setResult("Write a video idea first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();
      setResult(data.result || "No result generated.");
    } catch {
      setResult("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
  };

  return (
    <main className="min-h-screen bg-black text-white px-5 py-10">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-4 rounded-full border border-gray-800 bg-gray-950 px-4 py-2 text-sm text-gray-300">
          AI Hook & Script Optimizer
        </div>

        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Pilako AI 🚀
        </h1>

        <p className="mb-8 max-w-xl text-gray-400">
          Turn any idea into viral hooks, a short-form video script, viral score,
          and improvement tips in seconds.
        </p>

        <div className="w-full rounded-2xl border border-gray-800 bg-gray-950 p-5 shadow-2xl">
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: fitness tips for beginners, skincare routine, AI tools for students..."
            className="min-h-28 w-full resize-none rounded-xl border border-gray-700 bg-gray-900 p-4 text-white outline-none focus:border-white"
          />

          <button
            onClick={generate}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-white px-6 py-3 font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generating viral content..." : "Generate"}
          </button>
        </div>

        {result && (
          <div className="mt-8 w-full rounded-2xl border border-gray-800 bg-gray-950 p-5 text-left shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">Your Result</h2>
              <button
                onClick={copyResult}
                className="rounded-lg border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800"
              >
                Copy
              </button>
            </div>

            <pre className="whitespace-pre-wrap rounded-xl bg-gray-900 p-4 text-sm leading-7 text-gray-100">
              {result}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}
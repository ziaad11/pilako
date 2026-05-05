"use client";

import { useEffect, useState } from "react";

type Result = {
  hooks: string[];
  script: string;
  score: number;
  score_reason: string;
  improvements: string[];
  remaining?: number;
};

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);

  const examples = [
    "A TikTok ad for handmade candles",
    "A video about losing belly fat naturally",
    "A reel selling an AI logo design service",
  ];

  useEffect(() => {
    setIdea("I sell handmade candles and want a viral TikTok ad");
  }, []);

  const generate = async () => {
    if (!idea.trim()) {
      setError("Write your idea first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
      }
    } catch {
      setError("Error happened. Please try again.");
    }

    setLoading(false);
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const fullResultText = result
    ? `Hooks:\n${result.hooks.map((h, i) => `${i + 1}. ${h}`).join("\n")}

Script:
${result.script}

Score:
${result.score}/100 - ${result.score_reason}

Improvements:
${result.improvements.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
    : "";

  return (
    <main className="min-h-screen overflow-hidden bg-[#05030a] text-white">
      
      {/* Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/30 blur-3xl" />

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-black">Pilako</div>
        <a href="#pricing" className="text-sm text-gray-400 hover:text-white">
          Pricing
        </a>
      </nav>

      <section className="mx-auto max-w-6xl px-6 text-center">

        <h1 className="text-5xl font-black">
          Create Viral Scripts Instantly 🚀
        </h1>

        <p className="mt-4 text-gray-400">
          Hooks, scripts, scores, and improvements in seconds.
        </p>

        {/* INPUT */}
        <div className="mt-10 rounded-3xl bg-white/5 p-4">
          <textarea
            className="w-full min-h-40 rounded-2xl bg-white p-5 text-black"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <button
            onClick={generate}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-4 font-bold"
          >
            {loading ? "Generating..." : "Generate 🚀"}
          </button>

          {/* REMAINING */}
          {remaining !== null && (
            <p className="mt-3 text-sm text-gray-400">
              You have {remaining} free generations left today
            </p>
          )}
        </div>

        {/* LOADER */}
        {loading && (
          <div className="mt-10 animate-pulse text-purple-400">
            AI is thinking...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-500/10 p-6">
            <p>{error}</p>

            <a
              href="https://buy.stripe.com/test"
              target="_blank"
              className="mt-4 inline-block rounded-full bg-purple-500 px-6 py-3 font-bold"
            >
              Upgrade 🚀
            </a>
          </div>
        )}

        {/* RESULT */}
        {result && (
          <div className="mt-10 text-left">
            <button
              onClick={() => copyText(fullResultText)}
              className="mb-4 rounded-full bg-white px-4 py-2 text-black"
            >
              Copy All
            </button>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold">🔥 Hooks</h3>
                {result.hooks.map((h, i) => (
                  <p key={i}>{i + 1}. {h}</p>
                ))}
              </div>

              <div>
                <h3 className="font-bold">🎬 Script</h3>
                <p>{result.script}</p>
              </div>

              <div>
                <h3 className="font-bold">📈 Score</h3>
                <p>{result.score}/100</p>
              </div>

              <div>
                <h3 className="font-bold">✅ Improvements</h3>
                {result.improvements.map((t, i) => (
                  <p key={i}>- {t}</p>
                ))}
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
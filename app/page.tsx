"use client";

import { useEffect, useState } from "react";

type Result = {
  hooks: string[];
  script: string;
  score: number;
  score_reason: string;
  improvements: string[];
};

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <main className="min-h-screen bg-[#05030a] text-white px-6 py-10">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="text-5xl font-black mb-4">
          Pilako AI 🚀
        </h1>

        <p className="text-gray-400 mb-8">
          Turn any idea into a viral TikTok script in seconds.
        </p>

        <textarea
          className="w-full min-h-40 p-5 rounded-2xl bg-white text-black outline-none"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <button
          onClick={generate}
          disabled={loading}
          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 py-4 rounded-2xl font-bold"
        >
          {loading ? "Generating..." : "Generate 🚀"}
        </button>

        {/* ❌ ERROR + UPGRADE */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-200 mb-4">{error}</p>

            <a
              href="https://buy.stripe.com/test"
              target="_blank"
              className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold"
            >
              Upgrade to Pro 🚀
            </a>
          </div>
        )}

        {/* ✅ RESULT */}
        {result && (
          <div className="mt-10 text-left">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Result</h2>
              <button
                onClick={() => copyText(fullResultText)}
                className="bg-white text-black px-4 py-2 rounded-full text-sm"
              >
                Copy All
              </button>
            </div>

            <div className="bg-black/40 p-6 rounded-2xl space-y-6">

              {/* Hooks */}
              <div>
                <h3 className="font-bold mb-2">🔥 Hooks</h3>
                {result.hooks.map((h, i) => (
                  <p key={i}>{i + 1}. {h}</p>
                ))}
              </div>

              {/* Script */}
              <div>
                <h3 className="font-bold mb-2">🎬 Script</h3>
                <p>{result.script}</p>
              </div>

              {/* Score */}
              <div>
                <h3 className="font-bold mb-2">📈 Score</h3>
                <p>{result.score}/100</p>
                <p className="text-gray-400">{result.score_reason}</p>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="font-bold mb-2">✅ Improvements</h3>
                {result.improvements.map((t, i) => (
                  <p key={i}>- {t}</p>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>
    </main>
  );
}
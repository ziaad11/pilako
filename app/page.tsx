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

Viral Score:
${result.score}/100 - ${result.score_reason}

Improvements:
${result.improvements.map((t, i) => `${i + 1}. ${t}`).join("\n")}`
    : "";

  return (
    <main className="min-h-screen overflow-hidden bg-[#05030a] text-white">
      <div className="pointer-events-none fixed left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/30 blur-3xl" />
      <div className="pointer-events-none fixed right-10 top-40 h-72 w-72 rounded-full bg-pink-600/20 blur-3xl" />

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-2xl font-black tracking-tight">Pilako</div>
        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 md:block">
          AI Hook & Script Optimizer
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-12 text-center">
        <div className="mx-auto mb-6 w-fit rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-200">
          ⚡ Built for TikTok, Reels & Shorts creators
        </div>

        <h1 className="mx-auto max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Turn any idea into a{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
            viral video script
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Generate scroll-stopping hooks, a ready-to-record script, a viral
          score, and improvement tips in seconds.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Made for creators, small brands, agencies, and TikTok sellers.
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur">
          <textarea
            className="min-h-40 w-full resize-none rounded-3xl bg-white p-5 text-black outline-none"
            placeholder="Example: I sell handmade candles and want a TikTok ad..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <div className="mt-3 flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setIdea(ex)}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-gray-300 hover:bg-white/10"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="mt-4 w-full rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 py-4 text-lg font-black text-white shadow-lg shadow-pink-500/20 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Generating your viral script..." : "Generate Viral Script 🚀"}
          </button>
        </div>

        {error && (
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="mb-4 text-red-200">{error}</p>

            <a
              href="https://buy.stripe.com/test"
              target="_blank"
              className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white"
            >
              Upgrade to Pro 🚀
            </a>
          </div>
        )}

        {result && (
          <div className="mx-auto mt-12 max-w-5xl text-left">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-3xl font-black">Your viral plan</h2>
              <button
                onClick={() => copyText(fullResultText)}
                className="rounded-full bg-white px-5 py-2 text-sm font-black text-black"
              >
                Copy All
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-black">🔥 Viral Hooks</h3>
                  <button
                    onClick={() => copyText(result.hooks.join("\n"))}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black"
                  >
                    Copy
                  </button>
                </div>

                <div className="space-y-3">
                  {result.hooks.map((hook, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 text-gray-200"
                    >
                      <span className="mr-2 text-purple-300">{index + 1}.</span>
                      {hook}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-black">📈 Viral Score</h3>
                  <button
                    onClick={() =>
                      copyText(`${result.score}/100 - ${result.score_reason}`)
                    }
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black"
                  >
                    Copy
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-6xl font-black text-transparent">
                  {result.score}/100
                </div>

                <p className="mt-4 leading-7 text-gray-300">
                  {result.score_reason}
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-black">🎬 30-Second Script</h3>
                  <button
                    onClick={() => copyText(result.script)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black"
                  >
                    Copy
                  </button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-5 leading-8 text-gray-200">
                  {result.script}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:col-span-2">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-black">✅ Improvements</h3>
                  <button
                    onClick={() => copyText(result.improvements.join("\n"))}
                    className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black"
                  >
                    Copy
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {result.improvements.map((tip, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-white/10 bg-black/30 p-4 leading-7 text-gray-200"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto mt-16 max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-left">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black">Start free.</h2>
              <p className="mt-3 text-gray-400">
                Perfect for creators, small brands, agencies, and TikTok sellers.
              </p>
            </div>

            <div className="rounded-3xl bg-black/40 p-6">
              <p className="text-sm text-gray-400">Coming soon</p>
              <h3 className="mt-2 text-4xl font-black">$9/mo</h3>
              <p className="mt-2 text-gray-400">
                Unlimited hooks, scripts, scores, and creator tools.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-bold"
          >
            Try Another Idea 🚀
          </button>
        </div>
      </section>
    </main>
  );
}
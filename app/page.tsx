"use client";

import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!idea) return;

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
      setResult(data.result);
    } catch (error) {
      setResult("Error generating content");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-white bg-black px-4">
      <h1 className="text-4xl font-bold mb-6">Pilako AI 🚀</h1>

      <input
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Enter your topic..."
        className="w-full max-w-xl p-3 rounded-lg bg-gray-800 text-white border border-gray-700 mb-4 outline-none"
      />

      <button
        onClick={generate}
        className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      <pre className="mt-6 text-left whitespace-pre-wrap bg-gray-900 p-4 rounded-lg border border-gray-700 w-full max-w-xl">
        {result}
      </pre>
    </main>
  );
}
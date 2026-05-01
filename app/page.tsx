"use client";
import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const generate = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-4xl font-bold mb-6">
          Pilako AI 🚀
        </h1>

        <input
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 mb-4 outline-none"
          placeholder="Enter your topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          onClick={generate}
          className="bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          Generate
        </button>

        <pre className="mt-6 text-left whitespace-pre-wrap bg-gray-900 p-4 rounded-lg border border-gray-700">
          {result}
        </pre>
      </div>
    </main>
  );
}
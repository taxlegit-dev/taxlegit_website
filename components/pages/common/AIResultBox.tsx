"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResultVisible, setIsResultVisible] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/generateai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as { text?: string };
      setResult(data.text || "");
      setIsResultVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-white px-6 mt-12">
      <div className="mx-auto max-w-4xl">
        {/* INPUT */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How to register a private limited company?"
            className="w-full sm:w-[420px] px-5 py-3 rounded-xl border
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-7 py-3 rounded-xl bg-purple-600 text-white
                       hover:bg-purple-700 disabled:opacity-60"
          >
            {isLoading ? "Generating..." : "✨ Generate"}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700">
            ❌ {error}
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="mt-6 rounded-xl bg-purple-50 border border-purple-200 p-6 text-purple-700 animate-pulse">
            ✨ Generating structured AI response…
          </div>
        )}

        {/* RESULT (PROPER MARKDOWN) */}
        {result && !isLoading && isResultVisible && (
          <div className="relative mt-8 rounded-2xl bg-white border border-slate-200 p-8 shadow-md">
            <button
              type="button"
              onClick={() => setIsResultVisible(false)}
              aria-label="Close result"
              className="absolute right-3 top-3 rounded-full px-2 py-1 text-sm text-slate-400 hover:text-slate-700"
            >
              X
            </button>
            <h3 className="mb-6 text-xl font-semibold text-slate-900">
              TaxlegitAI Result
            </h3>

            <article className="prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </section>
  );
}

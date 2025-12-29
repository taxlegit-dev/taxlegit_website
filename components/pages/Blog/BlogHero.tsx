"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BlogHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams?.get("q") ?? "");
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    const next = new URLSearchParams(searchParams?.toString() ?? "");
    if (value.trim()) {
      next.set("q", value);
    } else {
      next.delete("q");
    }
    const queryString = next.toString();
    router.replace(queryString ? `/blog?${queryString}` : "/blog", {
      scroll: false,
    });
  };

  return (
    <section className="relative overflow-hidden shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" />

      {/* Dark purple Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/85 to-slate-700/70" />

      {/* Content */}
      <div className="relative z-10 px-4 py-8 sm:px-4 sm:py-4 md:px-8 md:py-16 lg:px-8 lg:py-20 text-center text-white">
        <p className="mb-3 text-xs sm:text-sm uppercase tracking-[0.25em] text-slate-300">
          Blog Insights
        </p>

        <h1 className="mx-auto max-w-3xl text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
          Explore Our Latest Articles and Industry Insights
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-200/90">
          Stay ahead with expert opinions, practical guides, and in-depth
          analysis from the Taxlegit team.
        </p>

        <div className="absolute left-1/2 bottom-6 w-full max-w-md -translate-x-1/2 px-4 sm:max-w-lg">
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="search your blog...."
              aria-label="Search blog"
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white/95 py-3 pl-11 pr-4 text-sm text-slate-800 shadow-lg backdrop-blur-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

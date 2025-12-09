"use client";

import Link from "next/link";
import type { PageHero } from "@prisma/client";

type UsHeroProps = {
  hero: PageHero;
};

interface HeroContent {
  benefits?: string[];
  partnerLogos?: string[];
  announcement?: string;
  highlightedWords?: string[];
  primaryCTA?: {
    text: string;
    href?: string;
  };
  secondaryCTA?: {
    text: string;
    href?: string;
  };
}

export function UsHero({ hero }: UsHeroProps) {
  const content = hero.content as HeroContent;
  const announcement = content?.announcement;
  const headline = hero.title;
  const highlightedWords = content?.highlightedWords || [];
  const description = hero.description || "";
  const primaryCTA = content?.primaryCTA || { text: "Get Started" };
  const secondaryCTA = content?.secondaryCTA;

  // Split headline and highlight words
  const renderHeadline = () => {
    if (!highlightedWords.length) {
      return <span>{headline}</span>;
    }

    let text = headline;
    highlightedWords.forEach((word: string) => {
      text = text.replace(new RegExp(`\\b${word}\\b`, "gi"), `**${word}**`);
    });

    const parts = text.split("**");
    return (
      <>
        {parts.map((part, index) => {
          const isHighlighted = highlightedWords.some(
            (w: string) => w.toLowerCase() === part.toLowerCase()
          );
          return isHighlighted ? (
            <span
              key={index}
              className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </>
    );
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
      {/* Background Blur Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center">
        {/* Announcement Banner */}
        {announcement && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-sm text-white shadow-lg">
            <span className="rounded-full bg-purple-800 px-2 py-0.5 text-xs font-semibold">
              New
            </span>
            <span>{announcement}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          {renderHeadline()}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          {description}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={primaryCTA.href || "#"}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white font-semibold shadow-lg hover:from-purple-700 hover:to-purple-800 transition"
          >
            {primaryCTA.text}
          </Link>
          {secondaryCTA && (
            <Link
              href={secondaryCTA.href || "#"}
              className="rounded-lg border-2 border-purple-300 px-8 py-3 text-purple-600 font-semibold hover:bg-purple-50 transition"
            >
              {secondaryCTA.text}
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

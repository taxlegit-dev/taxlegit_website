"use client";
import type { PageHero } from "@prisma/client";

type UsHeroProps = {
  hero: PageHero;
};

interface HeroContent {
  benefits?: string[];
  partnerLogos?: string[];
  announcement?: string;
}

export function UsHero({ hero }: UsHeroProps) {
  const content = hero.content as HeroContent;
  const announcement = content?.announcement;
  const headline = hero.title;
  const description = hero.description || "";

  return (
    <section className="relative min-h-[5 00px] flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden">
      {/* Background Blur Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center ">
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

        {/* ✅ Headline - YE ADD KARO */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          {headline}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-slate-600  max-w-2xl mx-auto">
          {description}
        </p>
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

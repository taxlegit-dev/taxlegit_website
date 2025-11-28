"use client";

import { useEffect, useRef, useState } from "react";
import type { ServicePageSection } from "@prisma/client";

type ServicePageViewProps = {
  sections: ServicePageSection[];
  region: "INDIA" | "US";
};

export function ServicePageView({ sections, region }: ServicePageViewProps) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tocRef = useRef<HTMLDivElement>(null);

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for sticky header

      sortedSections.forEach((section, index) => {
        const element = sectionRefs.current[index];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sortedSections]);

  const scrollToSection = (index: number) => {
    const element = sectionRefs.current[index];
    if (element) {
      const offset = tocRef.current?.offsetHeight || 0;
      const elementPosition = element.offsetTop - offset - 20;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  const isIndia = region === "INDIA";

  return (
    <div className={`min-h-screen ${isIndia ? "bg-white" : "bg-slate-950"}`}>
      {/* Sticky TOC Bar */}
      <div
        ref={tocRef}
        className={`sticky top-0 z-50 border-b ${
          isIndia ? "bg-white border-slate-200" : "bg-slate-900 border-slate-700"
        }`}
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {sortedSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition ${
                  activeSection === index
                    ? isIndia
                      ? "border-b-2 border-indigo-600 text-indigo-600"
                      : "border-b-2 border-emerald-400 text-emerald-400"
                    : isIndia
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections Content */}
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            id={`section-${section.id}`}
            className="mb-16 scroll-mt-24"
          >
            <h2
              className={`mb-6 text-3xl font-semibold ${
                isIndia ? "text-slate-900" : "text-white"
              }`}
            >
              {section.title}
            </h2>

            {/* Content */}
            <div
              className={`prose prose-lg max-w-none ${
                isIndia
                  ? "prose-slate prose-headings:text-slate-900 prose-p:text-slate-700"
                  : "prose-invert prose-slate prose-headings:text-white prose-p:text-slate-300"
              }`}
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}


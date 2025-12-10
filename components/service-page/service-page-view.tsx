"use client";

import { useEffect, useRef, useState } from "react";
import type { ServicePageSection } from "@prisma/client";
import { EditorJsRenderer } from "@/components/rich-text/editorjs-renderer";
import type { OutputData } from "@editorjs/editorjs";

type ServicePageViewProps = {
  sections: ServicePageSection[];
};

export function ServicePageView({ sections }: ServicePageViewProps) {
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
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky TOC Bar - Below Fixed Navbar */}
      <div
        ref={tocRef}
        className="sticky top-[72px] z-40 border-b bg-white border-slate-200 shadow-sm"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
            {sortedSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`whitespace-nowrap px-5 py-2 text-base font-bold transition-all duration-200 ${
                  activeSection === index
                    ? "border-b-3 border-indigo-600 text-indigo-700 text-lg"
                    : "text-slate-700 hover:text-indigo-600 hover:border-b-2 hover:border-indigo-300"
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
            <h2 className="mb-6 text-3xl font-semibold text-slate-900">
              {section.title}
            </h2>

            {/* Content */}
            {(() => {
              // Try to parse as Editor.js JSON, fallback to HTML
              let editorData: OutputData | null = null;
              try {
                const parsed = JSON.parse(section.content);
                if (
                  parsed &&
                  typeof parsed === "object" &&
                  "blocks" in parsed
                ) {
                  editorData = parsed as OutputData;
                }
              } catch {
                // Not JSON, treat as HTML
              }

              if (editorData) {
                return <EditorJsRenderer data={editorData} theme="light" />;
              } else {
                return (
                  <div
                    className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-700"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                );
              }
            })()}
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

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
      const navbarHeight = 72; // your fixed navbar height
      const tocHeight = tocRef.current?.offsetHeight || 0;
      const extraSpacing = 20; // little padding

      const totalOffset = navbarHeight + tocHeight + extraSpacing;

      const elementPosition = element.offsetTop - totalOffset;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Sticky TOC Bar - Below Fixed Navbar */}
      <div
        ref={tocRef}
        className="sticky top-[88px] z-40 border bg-gradient-to-b from-[#F7F2F7] via-[#EFE4EF] to-white border-slate-200 shadow-sm max-w-6xl mx-auto rounded-xl mt-4"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex lg:gap-8 gap-2 overflow-x-auto scrollbar-hide py-2">
            {sortedSections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(index)}
                className={`whitespace-nowrap px-5 py-2 text-[13px]  transition-all duration-200 ${
                  activeSection === index
                    ? "border-b-1 border-purple-400  text-lg"
                    : "text-slate-700  hover:border-b-2 hover:border-purple-300"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sections Content */}
      <div className="mx-auto w-full max-w-6xl py-8">
        {sortedSections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            id={`section-${section.id}`}
            className="mb-16 scroll-mt-24"
          >
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

"use client";

import { useEffect, useRef, useState } from "react";
// import type { ServicePageSection } from "@prisma/client";
import { EditorJsRenderer } from "@/components/rich-text/editorjs-renderer";
import type { OutputData } from "@editorjs/editorjs";

export type ServicePageSectionView = {
  id: string;
  title: string;
  content: string;
  order: number;
};

type ServicePageViewProps = {
  sections: ServicePageSectionView[];
};

export function ServicePageView({ sections }: ServicePageViewProps) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tocRef = useRef<HTMLDivElement>(null);
  const tocScrollRef = useRef<HTMLDivElement>(null);
  const tocButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  useEffect(() => {
    const scrollContainer = tocScrollRef.current;
    const activeButton = tocButtonRefs.current[activeSection];
    if (!scrollContainer || !activeButton) return;

    const targetLeft =
      activeButton.offsetLeft -
      (scrollContainer.clientWidth - activeButton.clientWidth) / 2;

    scrollContainer.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [activeSection]);

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
    <div className=" ">
      {/* Sticky TOC Bar - Below Fixed Navbar with Blur Effect */}
      <div
        ref={tocRef}
        className="sticky top-[110px] z-40 mt-4 w-fit max-w-full mx-auto rounded-xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm"
      >
        <div
          ref={tocScrollRef}
          className="max-w-full px-4 overflow-x-auto scrollbar-hide"
        >
          <div className="flex w-max items-center gap-2 lg:gap-8 whitespace-nowrap py-2">
            {sortedSections.map((section, index) => (
              <button
                key={section.id}
                ref={(el) => {
                  tocButtonRefs.current[index] = el;
                }}
                onClick={() => scrollToSection(index)}
                className={`whitespace-nowrap px-3 py-1 text-md   transition-all duration-200 ${
                  activeSection === index
                    ? "border-b-2 border-purple-400  text-lg"
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
            className="mb-10 "
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

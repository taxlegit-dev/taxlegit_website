"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import data from "@/data/mediaMentions.json";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MediaRow = {
  no: number;
  media: string;
  media_type: string;
  industry: string;
  potential_audiences: string;
  link: string;
  logo_url: string;
};

export default function MediaMentions() {
  const rows = data.rows as MediaRow[];

  const [screenSize, setScreenSize] = useState<
    "mobile" | "tablet" | "laptop" | "desktop"
  >("desktop");

  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ viewport ref to calculate width
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  // ✅ Detect screen size
  useEffect(() => {
    const updateScreen = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize("mobile");
      else if (width < 1024) setScreenSize("tablet");
      else if (width < 1280) setScreenSize("laptop");
      else setScreenSize("desktop");
    };

    updateScreen();
    window.addEventListener("resize", updateScreen);
    return () => window.removeEventListener("resize", updateScreen);
  }, []);

  // ✅ Cards per view
  const perView = useMemo(() => {
    if (screenSize === "mobile") return 1;
    if (screenSize === "tablet") return 2;
    return 3; // laptop + desktop
  }, [screenSize]);

  // ✅ Gap in px (tailwind gap-6 = 24px, gap-8 = 32px)
  const gap = useMemo(() => {
    return screenSize === "desktop" || screenSize === "laptop" ? 32 : 24;
  }, [screenSize]);

  // ✅ Measure viewport width
  useEffect(() => {
    const measure = () => {
      if (!viewportRef.current) return;
      setViewportWidth(viewportRef.current.offsetWidth);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // ✅ Card width (exact math so 3 cards always fit)
  const cardWidth = useMemo(() => {
    if (!viewportWidth) return 0;
    const totalGap = gap * (perView - 1);
    return (viewportWidth - totalGap) / perView;
  }, [viewportWidth, perView, gap]);

  // ✅ Clamp index
  useEffect(() => {
    const maxIndex = Math.max(0, rows.length - perView);
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [perView, rows.length]);

  const maxIndex = Math.max(0, rows.length - perView);

  // ✅ Next / Prev (slide by 1 card, not 3)
  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // ✅ Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 2500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perView, rows.length, maxIndex]);

  // ✅ TranslateX exact
  const translateX = useMemo(() => {
    return currentIndex * (cardWidth + gap);
  }, [currentIndex, cardWidth, gap]);

  return (
    <section className="w-full bg-white py-8 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto lg:px-0 px-5">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700 mb-4">
            Featured Media Mentions
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            How to lay the foundation of your dream business: choosing between
            private limited, LLP, and OPC
          </p>
        </div>

        {/* ✅ Carousel */}
        <div className="relative">
          <div className="relative overflow-x-hidden overflow-y-visible px-0 md:px-16">
            {/* LEFT ARROW */}
            <button
  onClick={handlePrev}
  className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20
             h-12 w-12 items-center justify-center rounded-full
             bg-white shadow-lg
             text-purple-600
             hover:bg-purple-800 hover:text-white
             transform hover:scale-110 active:scale-95
             transition-all duration-300"
  aria-label="Previous"
>
  <ChevronLeft className="w-6 h-6" />
</button>

{/* RIGHT ARROW */}
<button
  onClick={handleNext}
  className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20
             h-12 w-12 items-center justify-center rounded-full
             bg-white shadow-lg
             text-purple-600
             hover:bg-purple-700 hover:text-white
             transform hover:scale-110 active:scale-95
             transition-all duration-300"
  aria-label="Next"
>
  <ChevronRight className="w-6 h-6" />
</button>


            {/* ✅ VIEWPORT */}
            <div ref={viewportRef}>
              {/* TRACK */}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${translateX}px)`,
                  gap: `${gap}px`,
                }}
              >
                {rows.map((item, index) => (
                  <Link
                    key={`${item.no}-${index}`}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0"
                    style={{ width: `${cardWidth}px` }}
                  >
                    <article className="group bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-purple-100 hover:-translate-y-2 h-full flex flex-col p-6">
                      <div className="flex items-center justify-center h-32 mb-4">
                        <Image
                          src={item.logo_url}
                          alt={item.media}
                          width={180}
                          height={80}
                          className="object-contain transition-all duration-500 group-hover:scale-110 max-h-full w-auto"
                          unoptimized
                        />
                      </div>

                      <div className="mt-auto text-center">
                        <h3 className="text-sm font-semibold text-slate-700 mb-1">
                          {item.media}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.media_type}
                        </p>

                        <div className="flex items-center justify-center gap-1.5 text-xs text-purple-600 font-medium">
                          {item.potential_audiences}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import data from "@/data/mediaMentions.json";

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
  const [showAll, setShowAll] = useState(false);
  const [currentBatch, setCurrentBatch] = useState(0);
  const itemsPerBatch = 8;

  // Calculate total batches
  const totalBatches = Math.ceil(rows.length / itemsPerBatch);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  // Auto-rotate through batches
  useEffect(() => {
    if (showAll) return;

    const interval = setInterval(() => {
      setCurrentBatch((prev) => (prev + 1) % totalBatches);
    }, 9000); // Change every 9 seconds

    return () => clearInterval(interval);
  }, [showAll, totalBatches]);

  // Get items to display
  const displayedItems = showAll
    ? rows
    : rows.slice(
        currentBatch * itemsPerBatch,
        (currentBatch + 1) * itemsPerBatch
      );

  // Helper function to determine animation based on position in row
  const getAnimation = (index: number) => {
    const positionInRow = index % 4;
    // First two items (0, 1) fade-right, last two (2, 3) fade-left
    return positionInRow < 2 ? "fade-right" : "fade-left";
  };

  return (
    <section className="w-full bg-white py-8 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto lg:px-0 px-5">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-[Gilroy] text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700 mb-4">
            Featured Media Mentions
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            How to lay the foundation of your dream business: choosing between
            private limited, LLP, and OPC
          </p>
        </div>

        {/* Logo Grid */}
        <div className="relative">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-500`}
          >
            {displayedItems.map((item, index) => (
              <Link
                key={`${item.no}-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full"
              >
                <article
                  data-aos={getAnimation(index)}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-purple-100 hover:-translate-y-2 h-full flex flex-col p-6"
                >
                  {/* Logo Image */}
                  <div className="flex items-center justify-center h-24 mb-4">
                    <Image
                      src={item.logo_url}
                      alt={item.media}
                      width={160}
                      height={60}
                      className="object-contain transition-all duration-500 group-hover:scale-110 max-h-full"
                      unoptimized
                    />
                  </div>

                  {/* Media Info */}
                  <div className="mt-auto text-center">
                    <h3 className="text-sm font-semibold text-slate-700 mb-1">
                      {item.media}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {item.media_type}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-purple-600 font-medium">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {item.potential_audiences}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination Dots - Only show when not showing all */}
          {!showAll && (
            <div className="flex justify-center gap-2 mb-8 mt-8">
              {Array.from({ length: totalBatches }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBatch(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentBatch
                      ? "w-8 bg-purple-700"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`View batch ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {showAll ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Show Less
              </>
            ) : (
              <>
                <span className="text-base md:text-lg">
                  View All Media Mentions
                </span>
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/20 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                  <svg
                    className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

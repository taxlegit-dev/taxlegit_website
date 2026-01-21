"use client";

import AIGenerator from "../common/AIResultBox";
import { useEffect, useState } from "react";
import AOS from "aos";
// import Script from "next/script";

export default function HeroSection() {
  const fullText = " Directions ";
  const [typedText, setTypedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
    });
  }, []);

  // Typing animation ONLY for "Solution"
  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 120);

      return () => clearTimeout(timer);
    }
  }, [index]);

  return (
    <section className="w-full bg-white pt-16 px-6">
      <div className="mx-auto max-w-6xl text-center">
        <a
          href="https://aarambh.taxlegit.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mb-4 px-4 py-1.5
          rounded-full border border-purple-200 bg-purple-50
          text-sm font-medium text-purple-700
          hover:bg-purple-100 transition"
        >
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-full
            bg-purple-600 text-white text-xs font-semibold"
          >
            ✨ NEW
          </span>
          <span>Register with AI</span>
          <span className="text-purple-600">→</span>
        </a>

        {/* Heading */}
        <h1
          className="flex flex-wrap items-center justify-center 
  text-4xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
          data-aos="zoom-in"
        >
          <span>Decisions</span>
          <span className="text-gray-500">&nbsp;to&nbsp;</span>

          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
          Helping businesses move beyond fragmented services and reactive
          choices. From entity setup, licenses, and compliance to valuation,
          process building and sustainable risk free advisory to businesses,
          Taxlegit Group brings everything together so leaders can see clearly,
          decide confidently, and move decisively.
        </p>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-lg">
          <AIGenerator />
        </div>
      </div>
    </section>
  );
}

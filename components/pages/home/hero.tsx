"use client";

import AIGenerator from "../common/AIResultBox";
import { useEffect, useState } from "react";
import AOS from "aos";

export default function HeroSection() {
  const fullText = "Solution";
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
          className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
          data-aos="zoom-in"
        >
          Tax Worry Business <span className="text-gray-400">Worry</span>
          <br />
          We Are <span className="text-gray-400">The</span>{" "}
          <span className="text-purple-600">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Empower your registration with AI-driven expertise and smart business
          solutions. Committed to excellence, we provide expert-led
          registration, accounting, valuation, ICFR, and subsidy services to
          help your business grow with compliance and confidence.
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

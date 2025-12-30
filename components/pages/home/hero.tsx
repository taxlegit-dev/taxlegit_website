"use client";
import AIGenerator from "../common/AIResultBox";
import { useEffect } from "react";
import AOS from "aos";

export default function HeroSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
    });
  }, []);

  return (
    <>
      <section className="w-full bg-white pt-24 px-6">
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
            {/* NEW badge */}
            <span
              className="flex items-center gap-1 px-2 py-0.5 rounded-full
                   bg-purple-600 text-white text-xs font-semibold"
            >
              ✨ NEW
            </span>

            {/* Text */}
            <span>Register with AI</span>

            {/* Arrow */}
            <span className="text-purple-600">→</span>
          </a>

          {/* Heading */}
          <h1
            className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tight"
            data-aos="zoom-in"
          >
            Tax Worry business <span className="text-gray-400">worry</span>
            <br />
            we are <span className="text-gray-400">the</span>{" "}
            <span className="text-purple-600">Solution</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Commitment to Excellence the Best Services to you. Empower your
            Registration with AI. Start Your Business with free consultation.
          </p>
        </div>
        <div className="w-full max-w-lg item-center">
          <AIGenerator />
        </div>{" "}
      </section>
    </>
  );
}

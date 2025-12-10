"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

const sentences = [
  "Tax Risk Advisory",
  "International Tax Planning",
  "Audit & Assurance Services",
  "Regulatory & Compliance Support",
];

export default function IndiaHero() {
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const words = sentences[sentenceIndex].split(" ");

    const timer = setTimeout(() => {
      if (wordIndex < words.length - 1) {
        setWordIndex(wordIndex + 1);
      } else {
        setTimeout(() => {
          setSentenceIndex((sentenceIndex + 1) % sentences.length);
          setWordIndex(0);
        }, 1000);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [wordIndex, sentenceIndex]);

  const words = sentences[sentenceIndex].split(" ");

  return (
    <div className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-10 md:py-16 overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero2.jpg" // Replace with your image path
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-[10] max-w-4xl mx-auto w-full px-4">
        {/* FLAGS */}
        <div className="flex items-center justify-center mt-4 md:mt-0">
          <span className="text-xs sm:text-sm md:text-base text-black font-medium pl-2">
            Welcome to <strong className="text-blue-600">Taxlegit</strong>.
          </span>
        </div>

        {/* CAPSULE WORD HIGHLIGHT */}
        <div className="min-h-[60px] sm:min-h-[72px] md:min-h-[80px] flex items-center justify-center mt-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight flex gap-2 flex-wrap justify-center font-bold">
            {words.map((w, i) => (
              <span
                key={i}
                className={`px-1 py-1 rounded-md transition-all duration-200 
                ${
                  i === wordIndex ? " bg-blue-500 text-white" : "text-blue-600"
                }`}
              >
                {w}
              </span>
            ))}
          </h2>
        </div>

        {/* MAIN TITLE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
          Taxlegit: Your Trusted Partner
        </h1>

        {/* DESCRIPTION */}
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-4 sm:mt-6 px-2 sm:px-4 md:px-0">
          At Taxlegit, we provide innovative, tech-driven solutions that ensure
          sustainable results for your business needs. Our services include
          audit and assurance, advisory, consulting.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-6 md:mt-8">
          <a
            href="https://wa.me/919711765911"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 text-white hover:bg-blue-700 font-semibold px-6 py-3 sm:px-8 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 min-w-[180px] sm:min-w-[200px] text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            WhatsApp Us
          </a>

          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 sm:px-8 sm:py-3 rounded-lg shadow-sm hover:shadow transition-all duration-300 min-w-[180px] sm:min-w-[200px] text-sm sm:text-base"
          >
            View Our Services
          </a>
        </div>

        {/* TRUST INDICATORS */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-1 sm:p-2 rounded-lg bg-white/60 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
              10+
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Years Experience
            </div>
          </div>

          <div className="text-center p-3 sm:p-4 rounded-lg bg-white/60 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
              500+
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Happy Clients
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 text-center p-3 sm:p-4 rounded-lg bg-white/60 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
              24/7
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}

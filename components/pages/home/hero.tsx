"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function IndiaHero() {
  const sentences = [
    "Tax Risk Advisory",
    "International Tax Planning",
    "Audit & Assurance Services",
    "Regulatory & Compliance Support",
  ];

  const [text, setText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const currentSentence = sentences[sentenceIndex];
    const typingSpeed = isMobile ? 150 : 120; // Slower on mobile for better readability

    const timeout = setTimeout(() => {
      if (charIndex < currentSentence.length) {
        setText(currentSentence.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => {
          setSentenceIndex((sentenceIndex + 1) % sentences.length);
          setCharIndex(0);
          setText("");
        }, 1200);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, sentenceIndex, isMobile]);

  return (
    <div className="relative min-h-[60vh] md:min-h-[80vh] bg-white flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-10 md:py-16 overflow-hidden">
      {/* Responsive Background Circle */}
      <div
        className="absolute inset-x-0 top-0 mx-auto 
             w-full max-w-[1000px] h-[300px] sm:h-[400px] md:h-[520px]
             bg-gray-50
             rounded-b-full"
      ></div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-4 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-blue-50 rounded-full opacity-50 blur-xl"></div>
      <div className="absolute bottom-10 right-4 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-blue-50 rounded-full opacity-50 blur-xl"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-[10] max-w-4xl mx-auto w-full px-4">
        {/* FLAGS */}
        <div className="flex items-center justify-center mt-4 md:mt-0">
          <div className="relative h-5 w-7 sm:h-6 sm:w-9 md:h-7 md:w-10">
            <Image
              src="https://flagcdn.com/w20/in.png"
              alt="Indian Flag"
              fill
              className="rounded shadow object-cover"
              sizes="(max-width: 640px) 28px, (max-width: 768px) 36px, 40px"
            />
          </div>
          <span className="text-xs sm:text-sm md:text-base text-black font-medium pl-2">
            Welcome to <strong className="text-blue-600">Taxlegit</strong>.
          </span>
        </div>

        {/* TYPING TEXT - GRADIENT TEXT */}
        <div className="min-h-[60px] sm:min-h-[72px] md:min-h-[80px] flex items-center justify-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-4
                     bg-gradient-to-r from-blue-800 via-blue-400 to-blue-800
                     bg-clip-text text-transparent leading-tight"
          >
            {text}
            <span className="border-r-2 border-sky-400 ml-1 animate-pulse inline-block h-6 sm:h-8 md:h-10 align-middle"></span>
          </h2>
        </div>

        {/* MAIN TITLE */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mt-1 sm:mt-3 px-2 sm:px-0">
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

        {/* Trust indicators */}
        <div className="mt-4  grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="text-center p-1 sm:p-2 rounded-lg">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
              10+
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Years Experience
            </div>
          </div>
          <div className="text-center p-3 sm:p-4  rounded-lg">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
              500+
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Happy Clients
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 text-center p-3 sm:p-4 rounded-lg">
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

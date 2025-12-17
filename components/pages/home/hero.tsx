"use client";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";

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
    <div className="relative min-h-screen flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-10 md:py-16 overflow-hidden bg-gradient-to-t from-blue-300 via-white to-white">
      {/* BACKGROUND IMAGE */}
      {/* <div className="absolute inset-0 z-0">
        <Image
          src="/hero1.jpg" // Replace with your image path
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Overlay for better text readability */}
      <div className="absolute inset-0 "></div>
      {/* </div> */}

      {/* MAIN CONTENT */}
      <div className="relative z-[10] max-w-4xl mx-auto w-full px-4">
        <div className="flex items-center justify-center mt-4 md:mt-10">
          <span className="text-md sm:text-sm md:text-base text-black font-medium pl-2">
            <strong className="text-blue-600 bg-blue-100 rounded-full px-2 py-1 mr-2">
              Taxlegit{"  "}
            </strong>
            {""} Your Trusted Partner.
          </span>
        </div>

        {/* CAPSULE WORD HIGHLIGHT */}
        <div className="min-h-[60px] sm:min-h-[72px] md:min-h-[80px] flex items-center justify-center mt-3">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight flex gap-2 flex-wrap justify-center font-bold">
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

        {/* DESCRIPTION */}
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mt-4 sm:mt-6 px-2 sm:px-4 md:px-0">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit
          facilis hic officia neque quia, repellat id. eveniet itaque quas
          debitis magnam ratione repellendus.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-6 md:mt-8">
          <a
            href="https://wa.me/919711765911"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-green-500 font-bold"
          >
            <FaWhatsapp className="w-16 h-16" />
          </a>

          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 border-3 border-blue-600 text-blue-600 font-bold px-2 py-1 rounded-lg"
          >
            Schedule a meeting
          </a>
        </div>

        {/* TRUST INDICATORS */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto ">
          <div className="text-center p-1 sm:p-2 rounded-lg bg-blue-50 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
              10+
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Years Experience
            </div>
          </div>

          <div className="text-center p-3 sm:p-4 rounded-lg bg-blue-50 backdrop-blur-sm">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700">
              500+
            </div>
            <div className="text-xs sm:text-sm text-gray-600">
              Happy Clients
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 text-center p-3 sm:p-4 rounded-lg bg-blue-50 backdrop-blur-sm">
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

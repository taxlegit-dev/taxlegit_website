"use client";
import AOS from "aos";
import { useEffect } from "react";
export default function RunningLogoCarousel() {
  // Array of logo image paths - replace these with your actual image paths
  useEffect(() => {
    AOS.init({
      duration: 800,
    });
  }, []);
  const logos = [
    "/brand/1.png",
    "/brand/2.png",
    "/brand/3.png",
    "/brand/4.png",
    "/brand/5.png",
    "/brand/1.png",
    "/brand/2.png",
    "/brand/3.png",
    "/brand/4.png",
    "/brand/5.png",
    "/brand/1.png",
    "/brand/2.png",
    "/brand/3.png",
    "/brand/4.png",
    "/brand/5.png",
    "/brand/1.png",
    "/brand/2.png",
    "/brand/3.png",
    "/brand/4.png",
    "/brand/5.png",
    "/brand/1.png",
    "/brand/2.png",
    "/brand/3.png",
    "/brand/4.png",
    "/brand/5.png",
    "/brand/1.png",
    "/brand/2.png",
    "/brand/3.png",
    "/brand/4.png",
    "/brand/5.png",
  ];

  return (
    <div
      className="w-full bg-gradient-to-r from-purple-600 to-purple-800 py-4 overflow-hidden mt-6 md:mt-0"
      data-aos="fade-up"
    >
      <div className="mx-auto max-w-6xl px-4 text-center text-white">
        <div className="text-xl font-semibold uppercase tracking-[0.2em]">
          Trusted by
        </div>
        <div className="mt-1 text-md text-purple-100">
          Growing businesses across India use TaxLegit
        </div>
      </div>
      <div className="relative">
        <div className="mt-3 flex items-center h-12 animate-scroll">
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <img
                src={logo}
                alt={`Brand ${index + 1}`}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {logos.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="flex-shrink-0 mx-8 flex items-center justify-center"
            >
              <img
                src={logo}
                alt={`Brand ${index + 1}`}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

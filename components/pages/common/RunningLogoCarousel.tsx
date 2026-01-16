"use client";
import AOS from "aos";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
export default function RunningLogoCarousel() {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      mirror: true,
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
  ];

  return (
    <section
      className="relative w-full overflow-hidden py-14 mt-8"
      data-aos="fade-up"
    >
      {/* Soft background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F2F7] via-[#EFE4EF] to-white" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="uppercase tracking-widest text-sm text-purple-600 font-medium">
            Trusted by leading brands
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mt-2">
            Companies that rely on us
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          <div className="flex items-center gap-10 animate-scroll">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white/70 backdrop-blur-md border border-purple-100 rounded-xl px-4 py-3 sm:px-6 sm:py-4 shadow-sm hover:shadow-md transition"
              >
                <Image
                  src={logo}
                  alt="Brand logo"
                  width={96}
                  height={48}
                  className="h-8 sm:h-12 w-auto object-contain transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Be the one next
          </p>
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
          animation: scroll 35s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }

        .sparkle-button {
          overflow: hidden;
        }

        .sparkle-base {
          position: absolute;
          bottom: -12px;
          left: 20%;
          width: 60%;
          height: 18px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.85) 0%,
            rgba(255, 255, 255, 0) 70%
          );
          filter: blur(6px);
          opacity: 0.7;
          animation: sparklePulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes sparklePulse {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}

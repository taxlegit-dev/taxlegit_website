"use client";
import AOS from "aos";
import { useEffect } from "react";
import Image from "next/image";

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
                className="flex-shrink-0 bg-white/70 backdrop-blur-md border border-purple-100 rounded-xl px-6 py-4 shadow-sm hover:shadow-md transition"
              >
                <Image
                  src={logo}
                  alt="Brand logo"
                  width={96}
                  height={48}
                  className="h-12 w-auto object-contain transition"
                />
              </div>
            ))}
          </div>
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
      `}</style>
    </section>
  );
}

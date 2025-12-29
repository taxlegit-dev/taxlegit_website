"use client";

import Image from "next/image";
import { Rocket } from "lucide-react";

export default function CallToActionBanner() {
  return (
    <section className="relative w-full -mt-32 mb-32 z-40 overflow-visible">
      {/* Main Banner Box */}
      <div
        className="
        max-w-6xl mx-auto relative z-10 
        bg-gradient-to-r from-purple-700 to-purple-600 rounded-2xl 
        px-8 md:px-16 py-10 
        flex flex-col md:flex-row items-center justify-between 
        shadow-2xl
        transform hover:scale-[1.02] transition-transform duration-300
      "
      >
        {/* LEFT IMAGE */}
        <div className="flex-shrink-0 mb-6 md:mb-0">
          <Image
            src="/cta-img.png" // change to your image
            alt="Consultation"
            width={260}
            height={260}
            className="object-contain drop-shadow-lg"
            unoptimized
          />
        </div>

        {/* CENTER TEXT */}
        <div className="flex-1 text-center md:text-left text-white px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            Ready to Start Your Journey?
          </h2>
          <p className="text-purple-100 text-lg md:text-xl max-w-xl">
            Get expert guidance and seamless registration for your NGO with our
            professional team
          </p>
        </div>

        {/* RIGHT BUTTON */}
        <div className="mt-6 md:mt-0 flex-shrink-0">
          <button
            className="
            group relative
            bg-white text-purple-700 font-bold 
            px-10 py-4 rounded-xl 
            shadow-lg hover:shadow-2xl 
            transition-all duration-300
            hover:scale-105 active:scale-95
            flex items-center gap-3
          "
          >
            <Rocket className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            <span>TALK TO A SPECIALIST</span>
            <div className="absolute -inset-1 bg-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>

        {/* Rocket Icon (Right Side) */}
        <div
          className="
          absolute -right-6 -top-6 z-20
          hidden lg:block
        "
        >
          <div
            className="
            relative
            w-28 h-28
            bg-gradient-to-br from-cyan-400 to-purple-500
            rounded-full
            flex items-center justify-center
            shadow-2xl
            animate-bounce
          "
          >
            <Rocket className="w-12 h-12 text-white" />

            {/* Glow effect */}
            <div
              className="
              absolute inset-0
              bg-gradient-to-br from-cyan-400 to-purple-500
              rounded-full
              animate-ping
              opacity-30
            "
            ></div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className="
        absolute -left-4 top-1/3 z-0
        hidden md:block
      "
      >
        <div
          className="
          w-24 h-24
          bg-gradient-to-br from-purple-500/20 to-cyan-400/20
          rounded-full
          blur-xl
        "
        ></div>
      </div>

      <div
        className="
        absolute -right-8 bottom-1/4 z-0
        hidden md:block
      "
      >
        <div
          className="
          w-32 h-32
          bg-gradient-to-br from-purple-600/10 to-cyan-500/10
          rounded-full
          blur-2xl
        "
        ></div>
      </div>

      {/* Bottom Shadow for Depth */}
      <div
        className="
        absolute -bottom-4 left-1/2 transform -translate-x-1/2
        w-3/4 h-8
        bg-gradient-to-t from-purple-900/30 to-transparent
        rounded-full
        blur-md
      "
      ></div>
    </section>
  );
}

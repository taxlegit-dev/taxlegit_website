"use client";
import React, { useRef, useEffect, useState } from "react";
import {
  FiBarChart2,
  FiFileText,
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
} from "react-icons/fi";

type Feature = {
  id: number;
  title: string;
  side: "left" | "right";
  x: number;
  y: number;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    id: 1,
    title: "PVT",
    side: "left",
    x: 15,
    y: 18,
    icon: <FiBarChart2 size={20} />,
  },
  {
    id: 2,
    title: "tds rturn",
    side: "left",
    x: 15,
    y: 36,
    icon: <FiFileText size={20} />,
  },
  {
    id: 4,
    title: "section-8",
    side: "right",
    x: 85,
    y: 18,
    icon: <FiDollarSign size={20} />,
  },
  {
    id: 5,
    title: "audit itr",
    side: "right",
    x: 85,
    y: 35,
    icon: <FiTrendingUp size={20} />,
  },
  {
    id: 6,
    title: "llp",
    side: "right",
    x: 85,
    y: 54,
    icon: <FiCreditCard size={20} />,
  },
  {
    id: 3,
    title: "Ngo darpan",
    side: "left",
    x: 15,
    y: 55,
    icon: <FiCreditCard size={20} />,
  },
];

export default function CashManagementDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const getPath = (feature: Feature) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height * 0.35;

    const featureX = (feature.x / 100) * dimensions.width;
    const featureY = (feature.y / 100) * dimensions.height;

    const centerBoxHalfWidth = 65;
    const featureBoxHalfWidth = 88;

    if (feature.side === "left") {
      const startX = centerX - centerBoxHalfWidth;
      const startY = centerY;
      const endX = featureX + featureBoxHalfWidth;
      const endY = featureY;
      const cp1X = startX - 120;
      const cp1Y = startY;
      const cp2X = endX + 120;
      const cp2Y = endY;

      return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    } else {
      const startX = centerX + centerBoxHalfWidth;
      const startY = centerY;
      const endX = featureX - featureBoxHalfWidth;
      const endY = featureY;
      const cp1X = startX + 120;
      const cp1Y = startY;
      const cp2X = endX - 120;
      const cp2Y = endY;

      return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
    }
  };

  return (
    <section className="w-full md:-mb-32 hidden md:block">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dashAnimation {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-dash-line {
          animation: dashAnimation 1.5s ease-in-out forwards;
        }
      `,
        }}
      />
      <div
        ref={containerRef}
        className="relative mx-auto max-w-6xl h-[400px] md:h-[480px] hidden md:block"
      >
        {/* SVG CONNECTORS */}
        {dimensions.width > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            width={dimensions.width}
            height={dimensions.height}
          >
            <defs>
              <linearGradient
                id="lineGradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2={dimensions.width}
                y2="0"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
              </linearGradient>
            </defs>
            {features.map((f) => (
              <g key={f.id}>
                <path
                  d={getPath(f)}
                  stroke="#afbadfff"
                  strokeWidth="2"
                  fill="none"
                  className="transition-all duration-300"
                />
                {isHovered && (
                  <path
                    d={getPath(f)}
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="2000"
                    strokeDashoffset="2000"
                    className="animate-dash-line"
                  />
                )}
              </g>
            ))}
          </svg>
        )}

        {/* CENTER AI BOX */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2
                        w-26 h-20 rounded-2xl bg-purple-600 text-white
                        flex flex-col items-center justify-center
                        shadow-xl z-10 text-center px-1 cursor-pointer
                        transition-all duration-300 hover:scale-110 hover:shadow-2xl"
        >
          <div className="font-semibold text-lg">Popular</div>
          <div className="text-sm opacity-90">service</div>
        </div>

        {/* FEATURE CARDS */}
        {features.map((f) => (
          <div
            key={f.id}
            className="absolute z-10 w-44 rounded-xl bg-white border border-slate-200
                       shadow-md px-4 py-3 text-sm transition-all
                       hover:-translate-y-1 hover:shadow-xl"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <span
                className="
    w-12 h-12
    rounded-xl
    bg-purple-50
    text-purple-600
    flex items-center justify-center
    shrink-0
    border border-purple-200
    shadow-sm
  "
              >
                {f.icon}
              </span>

              <span className="font-semibold">{f.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MOBILE CARDS */}
      {/* <div className="mt-8 md:hidden space-y-4 px-6">
        {features.map((f) => (
          <div
            key={`mobile-${f.id}`}
            className="rounded-xl bg-white border border-slate-200 shadow p-4"
          >
            <div className="flex items-center gap-3 font-medium text-slate-800">
              <span className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-200">
                {f.icon}
              </span>
              <span className="font-semibold">{f.title}</span>
            </div>
          </div>
        ))}
      </div> */}
    </section>
  );
}

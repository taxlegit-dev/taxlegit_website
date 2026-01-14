"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  link?: string;
};

const features: Feature[] = [
  {
    id: 1,
    title: "REGISTRATION",
    side: "left",
    x: 15,
    y: 18,
    icon: <FiBarChart2 size={20} />,
    link: "/services/pvt",
  },
  {
    id: 2,
    title: "LICENSES",
    side: "left",
    x: 15,
    y: 36,
    icon: <FiFileText size={20} />,
    link: "/services/tds-return",
  },
  {
    id: 4,
    title: "SUBSIDY",
    side: "right",
    x: 85,
    y: 18,
    icon: <FiDollarSign size={20} />,
    link: "/services/section-8",
  },
  {
    id: 5,
    title: "VALUATION",
    side: "right",
    x: 85,
    y: 35,
    icon: <FiTrendingUp size={20} />,
    link: "/services/audit-itr",
  },
  {
    id: 6,
    title: "ACCOUNTING",
    side: "right",
    x: 85,
    y: 54,
    icon: <FiCreditCard size={20} />,
    link: "/services/llp",
  },
  {
    id: 3,
    title: "ICFR",
    side: "left",
    x: 15,
    y: 55,
    icon: <FiCreditCard size={20} />,
    link: "/services/ngo-darpan",
  },
];

export default function CashManagementDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoActive, setIsAutoActive] = useState(false);
  const [hoveredFeatureId, setHoveredFeatureId] = useState<number | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAutoActive(true);
      const timeout = setTimeout(() => setIsAutoActive(false), 1600);
      return () => clearTimeout(timeout);
    }, 2000);

    return () => clearInterval(interval);
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

  // const handleCardClick = (feature: Feature) => {
  //   if (!feature.link) return;
  //   if (feature.link.startsWith("http")) {
  //     window.open(feature.link, "_blank", "noopener,noreferrer");
  //   } else {
  //     router.push(feature.link);
  //   }
  // };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    feature: Feature
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      // handleCardClick(feature);
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
        
        @keyframes bullet {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
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
                <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
              </linearGradient>

              <radialGradient id="bulletGradient">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="30%" stopColor="#e9d5ff" stopOpacity="1" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
              </radialGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {features.map((f) => (
              <g key={f.id}>
                {/** highlight line when global hover/auto or card hover */}
                {(() => {
                  const isActive =
                    isHovered || isAutoActive || hoveredFeatureId === f.id;
                  return (
                    <>
                <path
                  d={getPath(f)}
                  stroke="url(#lineGradient)"
                  strokeOpacity="0.75"
                  strokeWidth="2.5"
                  fill="none"
                  className="transition-all duration-300"
                />
                {isActive && (
                  <>
                    <path
                      d={getPath(f)}
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="2000"
                      strokeDashoffset="2000"
                      className="animate-dash-line"
                      filter="url(#glow)"
                    />

                    {/* Bullets moving forward then backward */}
                    {[1, 2, 3].map((bulletNum) => (
                      <circle
                        key={`bullet-${f.id}-${bulletNum}`}
                        r="4"
                        fill="url(#bulletGradient)"
                        filter="url(#glow)"
                      >
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          begin={`${(bulletNum - 1) * 1}s`}
                          keyPoints="0;1;0"
                          keyTimes="0;0.5;1"
                          calcMode="linear"
                        >
                          <mpath href={`#path-${f.id}`} />
                        </animateMotion>
                        <animate
                          attributeName="opacity"
                          values="1;0.5;1"
                          dur="3s"
                          repeatCount="indefinite"
                          begin={`${(bulletNum - 1) * 1}s`}
                        />
                      </circle>
                    ))}

                    <path
                      id={`path-${f.id}`}
                      d={getPath(f)}
                      fill="none"
                      stroke="none"
                    />
                  </>
                )}
                </>
                  );
                })()}
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
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            role={f.link ? "button" : undefined}
            tabIndex={f.link ? 0 : -1}
            // onClick={() => handleCardClick(f)}
            onKeyDown={(event) => handleKeyDown(event, f)}
            onMouseEnter={() => setHoveredFeatureId(f.id)}
            onMouseLeave={() => setHoveredFeatureId(null)}
            onFocus={() => setHoveredFeatureId(f.id)}
            onBlur={() => setHoveredFeatureId(null)}
            className={`absolute z-10 w-44 rounded-xl bg-white border border-slate-200 shadow-md px-4 py-3 text-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
              f.link ? "cursor-pointer" : "cursor-default"
            }`}
            aria-label={f.link ? `Open details for ${f.title}` : undefined}
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
    </section>
  );
}

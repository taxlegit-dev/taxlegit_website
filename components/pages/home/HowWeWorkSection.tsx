"use client";

import Image from "next/image";
import { FileSpreadsheet, Users, FileCheck, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function WorkTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const timelineRef = useRef(null);

  const steps = [
    {
      title: "Step 1 : Fill the Form",
      desc: "Once you submit the form, you qualify for a FREE Expert Consultation. You will receive a call & instant quotation.",
      image: "/step1.png",
      icon: <FileSpreadsheet className="w-8 h-8 text-blue-700" />,
    },
    {
      title: "Step 2 : Evaluation With Our Professionals",
      desc: "We evaluate your startup requirements and identify the most accurate business structure.",
      image: "/step2.png",
      icon: <Users className="w-8 h-8 text-blue-700" />,
    },
    {
      title: "Step 3 : Online Documentation",
      desc: "Our experts collect the required documents online quickly and effortlessly.",
      image: "/step3.png",
      icon: <FileCheck className="w-8 h-8 text-blue-700" />,
    },
    {
      title: "Step 4 : Finalising & Filing of All Forms",
      desc: "After verification, we prepare and file all applications with 100% accuracy for company registration.",
      image: "/step4.png",
      icon: <CheckCircle2 className="w-8 h-8 text-blue-700" />,
    },
  ];

  // Intersection Observer for step animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const stepIndex = parseInt(
            entry.target.getAttribute("data-step-index") || "0"
          );
          setActiveStep(stepIndex);
        }
      });
    }, observerOptions);

    // Observe all step elements
    const stepElements = document.querySelectorAll("[data-step-index]");
    stepElements.forEach((el) => observer.observe(el));

    return () => {
      stepElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Calculate line height based on active step
  const getLineHeight = () => {
    return `${(activeStep / (steps.length - 1)) * 100}%`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-16 px-4 bg-white">
      <h2 className="text-center text-3xl md:text-5xl font-bold mb-12 text-slate-700 font-[Gilroy]">
        How Do We Work?
      </h2>

      <div className="relative" ref={timelineRef}>
        {/* Static Gray Background Line - Hidden on Mobile */}
        <div
          className="hidden md:block absolute left-1/2 top-0 h-full w-[4px] 
          bg-gray-200 transform -translate-x-1/2 rounded-full"
        />

        {/* Animated Blue Line - Hidden on Mobile */}
        <div
          className="hidden md:block absolute left-1/2 top-0 w-[4px] 
          bg-gradient-to-b from-blue-700 via-blue-600 to-sky-500
          transform -translate-x-1/2 rounded-full transition-all duration-700 ease-out"
          style={{ height: getLineHeight() }}
        />

        <div className="flex flex-col gap-20">
          {steps.map((step, i) => (
            <div
              key={i}
              data-step-index={i}
              className={`
                flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10
                ${i % 2 === 1 ? "md:flex-row-reverse" : ""}
                transition-all duration-300
                ${
                  activeStep >= i
                    ? "opacity-100 translate-y-0"
                    : "opacity-40 translate-y-4"
                }
                relative
              `}
            >
              {/* IMAGE BLOCK */}
              <div className="w-full md:w-1/2 flex justify-center order-1 md:order-none">
                <div className="rounded-xl overflow-hidden shadow-lg bg-white w-full max-w-xs md:max-w-none">
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-40 md:h-60"
                  />
                </div>
              </div>

              {/* TIMELINE DOT */}
              <div className="hidden md:block absolute left-1/2 top-8 transform -translate-x-1/2">
                <div
                  className={`
                    w-7 h-7 rounded-full border-[4px] shadow-lg transition-all duration-500
                    ${
                      activeStep >= i
                        ? "bg-white border-blue-700 scale-110"
                        : "bg-gray-100 border-gray-300 scale-100"
                    }
                  `}
                >
                  {/* Inner dot animation */}
                  {activeStep >= i && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* TIMELINE DOT - Mobile */}
              <div className="hidden">
                <div
                  className={`
                    w-6 h-6 rounded-full border-[3px] shadow-lg transition-all duration-500
                    ${
                      activeStep >= i
                        ? "bg-white border-blue-700 scale-100"
                        : "bg-gray-100 border-gray-300 scale-90"
                    }
                  `}
                >
                  {/* Inner dot animation */}
                  {activeStep >= i && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-blue-700 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* CONTENT BLOCK */}
              <div className="w-full md:w-1/2 p-6 rounded-xl bg-white shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-blue-100">
                {/* ICON */}
                <div className={`mb-3 transition-transform duration-300 `}>
                  {step.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

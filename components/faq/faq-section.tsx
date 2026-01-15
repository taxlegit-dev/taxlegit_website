"use client";

import { useState, useEffect } from "react";
import AOS from "aos";

export type ServicePageFAQItem = {
  id: string,
  question: string,
  answer: string,
  order: number
}

type FAQSectionProps = {
  questions: ServicePageFAQItem[];
  region: "INDIA" | "US";
};

export function FAQSection({ questions, region }: FAQSectionProps) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));
  const isIndia = region === "INDIA";

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  if (!questions || questions.length === 0) return null;

  // Equal distribution: split FAQs evenly between left and right
  const midPoint = Math.ceil(questions.length / 2);
  const leftFaqs = questions.slice(0, midPoint);
  const rightFaqs = questions.slice(midPoint);

  const toggleQuestion = (index: number) => {
    setOpenIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const renderFaq = (item: ServicePageFAQItem, index: number) => {
    const isOpen = openIndices.has(index);

    return (
      <div
        key={item.id}
        className={`rounded-2xl border transition-all duration-500 overflow-hidden
          ${isIndia
            ? "bg-white border-purple-200 hover:border-purple-400"
            : "bg-slate-800/50 backdrop-blur-xl border-slate-600 hover:border-purple-500"
          }
          ${isOpen ? "shadow-2xl scale-[1.02] ring-2 ring-purple-500/50" : "shadow-md hover:shadow-xl"}
          transform hover:scale-[1.01]
        `}
        style={{
          animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
        }}
      >
        <button
          onClick={() => toggleQuestion(index)}
          className="w-full flex justify-between items-center py-2 px-4 text-left group"
        >
          <span
            className={`text-lg font-semibold leading-tight transition-colors ${isIndia
                ? "text-slate-900 group-hover:text-purple-600"
                : "text-white group-hover:text-purple-300"
              }`}
          >
            {item.question}
          </span>

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ml-4
              ${isIndia
                ? "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white"
                : "bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-white"
              }
              ${isOpen ? "rotate-180 scale-110" : ""}
            `}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        <div
          className={`transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div
            className={`px-6 pb-5 prose max-w-none ${isIndia
                ? "prose-slate text-slate-700"
                : "prose-invert prose-slate text-slate-300"
              }`}
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 15s ease infinite;
        }
      `}</style>

      <section
        className={`py-16 relative overflow-hidden ${isIndia
            ? "bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 animate-gradient"
            : "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 animate-gradient"
          }`}
        data-aos="fade-left"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 ${isIndia ? "bg-purple-400" : "bg-purple-600"
            }`} style={{ animation: "float 8s ease-in-out infinite" }} />
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 ${isIndia ? "bg-pink-400" : "bg-pink-600"
            }`} style={{ animation: "float 10s ease-in-out infinite reverse" }} />
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            50% { transform: translateY(-20px) translateX(10px); }
          }
        `}</style>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Centered Header Section */}
          <div className="text-center mb-12 space-y-4">
            {/* <span
              className={`text-sm font-medium px-4 py-2 rounded-full inline-block transition-all duration-300 hover:scale-105
                ${isIndia
                  ? "bg-purple-200 text-purple-800"
                  : "bg-slate-700 text-purple-300"
                }`}
              style={{ animation: "fadeInUp 0.6s ease-out" }}
            >
              Frequently Asked Questions
            </span> */}

            <h2
              className={`text-5xl font-extrabold leading-tight whitespace-nowrap ${isIndia ? "text-slate-900" : "text-white"
                }`}
              style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}
            >
              Frequently Asked{" "}
              <span
                className={`${isIndia
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gradient-to-r from-purple-400 to-pink-400"
                  } bg-clip-text text-transparent`}
              >
                Questions
              </span>
            </h2>


            {/* <p
              className={`text-lg ${isIndia ? "text-slate-600" : "text-slate-300"
                } max-w-2xl mx-auto`}
              style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}
            >
              Choose a plan that fits your business needs and budget. No hidden
              fees—just straightforward answers to common questions.
            </p> */}
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {leftFaqs.map((item, idx) => renderFaq(item, idx))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {rightFaqs.map((item, idx) => renderFaq(item, midPoint + idx))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center" style={{ animation: "fadeInUp 0.6s ease-out 0.4s both" }}>
            <p
              className={`text-base ${isIndia ? "text-slate-600" : "text-slate-300"
                }`}
            >
              Still have questions?{" "}
              <a
                href="tel:+918929218091"
                className={`font-bold hover:underline transition-all duration-300 ${isIndia
                    ? "text-purple-600 hover:text-purple-700"
                    : "text-purple-400 hover:text-purple-300"
                  } hover:scale-105 inline-block`}
              >
                Contact us →
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
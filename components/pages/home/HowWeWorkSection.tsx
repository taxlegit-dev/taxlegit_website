"use client";
import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CheckCircle, FileText, Users, FileCheck } from "lucide-react";

const DESCRIPTION_WORD_LIMIT = 5;

function ReadMoreText({
  text,
  wordLimit = DESCRIPTION_WORD_LIMIT,
}: {
  text: string;
  wordLimit?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const words = text ? text.split(/\s+/) : [];
  const isLong = words.length > wordLimit;
  const preview = isLong ? `${words.slice(0, wordLimit).join(" ")}...` : text;

  return (
    <p className="text-gray-600 leading-relaxed">
      <span>{expanded || !isLong ? text : preview}</span>
      {isLong && (
        <button
          type="button"
          className="ml-2 text-sm text-purple-600 hover:text-purple-700"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </p>
  );
}

const HowWeWork: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  const steps = [
    {
      number: "01",
      title: "Fill the Registration Form",
      description:
        "Once you submit the Registration form, you qualify for a FREE Expert Consultation. You will receive a call & instant quotation.",
      icon: <FileText className="w-8 h-8" />,
      aos: "fade-up",
    },
    {
      number: "02",
      title: "Evaluation With Our Professionals",
      description:
        "We evaluate your startup requirements and identify the most accurate business structure.",
      icon: <Users className="w-8 h-8" />,
      aos: "fade-up",
    },
    {
      number: "03",
      title: "Documentation Registration",
      description:
        "Our experts collect the required documents online quickly and effortlessly.",
      icon: <FileCheck className="w-8 h-8" />,
      aos: "fade-up",
    },
    {
      number: "04",
      title: "Finalising & Filing of All Forms",
      description:
        "After verification, we prepare and file all applications with 100% accuracy for company registration.",
      icon: <CheckCircle className="w-8 h-8" />,
      aos: "fade-up",
    },
  ];

  return (
    <div className="bg-white py-16 ">
      <div className="max-w-6xl mx-auto lg:px-0 px-5">
        {/* Header Section */}
        <div className="text-center mb-16" data-aos="fade-down">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How Do We <span className="text-purple-600">Work?</span>
          </h2>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos={step.aos}
              data-aos-delay={index * 100}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 z-10">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white font-bold text-xl rounded-full shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Step Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 pt-12 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 h-full">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-purple-50 rounded-full mb-6 mx-auto">
                  <div className="text-purple-600">{step.icon}</div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {step.title}
                </h3>
                <p>{step.description}</p>

                {/* Purple Accent Line */}
                {/* <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="w-12 h-1 bg-purple-600 rounded-full mx-auto"></div>
                </div> */}
              </div>

              {/* Connector Line for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-purple-600 z-0">
                  <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-purple-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowWeWork;

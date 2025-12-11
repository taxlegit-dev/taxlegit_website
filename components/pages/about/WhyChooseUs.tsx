import React from 'react';
import GreenCheckIcon from '@/components/icons/RightIcon';

export default function WhyChooseUsSection() {
  const reasons = [
    "Dedicated CA/CS-backed support for all registrations and compliance.",
    "Fast turnaround time with fully digital, paperless processes.",
    "Transparent pricing with no hidden fees — ever.",
    "AI-assisted workflows for accuracy, speed, and better efficiency.",
    "Trusted by 5,000+ entrepreneurs, SMEs, and NGOs across India.",
    "Complete end-to-end support from incorporation to annual filings."
  ];

  return (
    <section className="w-full bg-gradient-to-b from-white to-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pl-2 mb-12 md:mb-16">
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-slate-700 mb-4">
            Why Choose Us
          </h2>
        </div>

        {/* Reasons List */}
        <div className="max-w-4xl">

          <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4">
            Entrepreneurs trust Taxlegit because we simplify compliance, speed up registrations,
            and provide expert-backed support throughout your business journey.
          </p>

          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex items-start gap-4 py-2 transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <GreenCheckIcon size={28} color="#16A34A" />
              </div>
              <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-semibold">
                {reason}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

import React from 'react';
import { Shield } from 'lucide-react';

export default function AboutHeroSection() {
  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Wave Background */}
      <div className="relative h-40 overflow-hidden">
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#0a2540"
            fillOpacity="1"
            d="M0,0 L1440,0 L1440,120 C1200,180 960,200 720,180 C480,160 240,120 0,240 Z"
          />
        </svg>

        {/* Circular decorative element */}
        <div className="absolute top-8 right-32 w-64 h-64 rounded-full border-2 border-blue-400 opacity-20"></div>
        <div className="absolute top-16 right-40 w-48 h-48 rounded-full border-2 border-blue-300 opacity-30"></div>
      </div>

      {/* Content Section */}
      <div className="relative px-6 md:px-12 lg:px-24 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Testimonial Card */}
            <div className="flex justify-center lg:justify-start ml-4 -mt-6">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-sky-50 rounded-full blur-3xl opacity-50 scale-110"></div>
                <div className="relative bg-white rounded-full w-full h-full p-12 shadow-lg flex flex-col items-center justify-center">
                  {/* Shield Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full border-2 border-sky-600 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-sky-600" />
                    </div>
                  </div>

                  {/* Mission Statement */}
                  <p className="text-center text-gray-700 text-sm leading-relaxed mb-6 px-4">
                    &ldquo;Your trusted partner in navigating the complexities of business registration, taxation, and legal compliance. We simplify the process so you can focus on what matters most - growing your business.&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-0.5 bg-sky-600"></div>
                  </div>

                  {/* Brand Name */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-sky-700 tracking-wide">
                      TaxLegit
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">Compliance Made Simple</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Text Content */}
            <div className="flex flex-col justify-center space-y-5 mt-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-sky-700 leading-tight">
                Simplifying Business Compliance for India&apos;s Entrepreneurs
              </h2>

              <p className="text-gray-700 text-sm leading-relaxed">
                In today&apos;s complex regulatory landscape, staying compliant shouldn&apos;t be a burden.
                TaxLegit is dedicated to making company registration, tax filing, and legal compliance
                accessible and stress-free for businesses of all sizes across India.
              </p>

              <p className="text-gray-700 text-sm leading-relaxed">
                We believe every entrepreneur deserves expert guidance without the complexity. Our
                comprehensive services from ITR filing to GST registration, company incorporation to
                annual compliance help you focus on growing your business while we handle the
                legal intricacies. Your success is our mission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

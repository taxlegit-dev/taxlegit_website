import React from 'react';
import GreenCheckIcon from '@/components/icons/RightIcon';


export default function OurServicesSection() {
  const services = [
    "Company Registration (Private Limited, LLP, OPC, Section 8, Sole Proprietorship).",
    "GST Registration & Filing Services.",
    "Government Registrations (MSME, Startup India, FSSAI, ISO, Import-Export Code).",
    "Trademark & Intellectual Property Protection.",
    "Annual Compliance & ROC Filings.",
    "Accounting, Bookkeeping & Tax Advisory."
  ];
  
  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="pl-2 mb-12 md:mb-16">
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-slate-700 mb-4">
            Our Services
          </h2>
        </div>

        {/* Services List */}
        <div className="max-w-4xl">
            
          <p className="text-base md:text-lg text-gray-600 leading-relaxed px-4">
            Our platform enables access to comprehensive business solutions for Indian entrepreneurs.
          </p>
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 py-2 transition-all duration-200"
            >
              <div className="flex-shrink-0">
                <GreenCheckIcon size={28} color="#16A34A" />
              </div>
              <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-semibold">
                {service}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
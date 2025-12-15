'use client'
import React, { useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';

interface SectionItem {
  id: number;
  title: string;
  content: React.ReactNode;
  expandable?: boolean;
}

interface StaticSection {
  id: number;
  title: string;
  content: string;
}

interface ContactInfo {
  title: string;
  description: string;
  items: {
    title: string;
    value: string;
    href?: string;
  }[];
  note?: string;
}

interface LegalPageProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badgeText: string;
  introduction?: React.ReactNode;
  sections: SectionItem[];
  staticSections?: StaticSection[];
  contactInfo?: ContactInfo;
  isClient?: boolean;
}

export default function LegalPage({
  title,
  subtitle,
  icon,
  badgeText,
  introduction,
  sections,
  staticSections = [],
  contactInfo,
  isClient = true
}: LegalPageProps) {
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});

  const toggleSection = (id: number) => {
    if (!isClient) return;
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-6 border-b-4 border-blue-500 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Icon and Title Section */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-6 gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl">
                  {icon}
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed text-center mb-8">
              {subtitle}
            </p>
          </div>

          {/* Compliance Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-6 py-3.5 rounded-xl border border-white/10 shadow-lg hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-sm md:text-base">
                {badgeText}
              </span>
              <CheckCircle className="w-5 h-5 text-green-400" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      {introduction && (
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-blue-50 rounded-xl p-8 mb-12 border border-blue-100">
            {introduction}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {section.expandable && isClient ? (
                <>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-5 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-4 font-semibold">
                        {section.id}
                      </span>
                      <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        expandedSections[section.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      expandedSections[section.id]
                        ? 'max-h-[5000px] opacity-100'
                        : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                      {section.content}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-4 font-semibold">
                      {section.id}
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  <div className="pl-12">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Static Sections */}
          {staticSections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center mr-4 font-semibold">
                  {section.id}
                </span>
                <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-700 leading-relaxed pl-12">{section.content}</p>
            </div>
          ))}

          {/* Contact Section */}
          {contactInfo && (
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{contactInfo.title}</h2>
              <p className="text-center text-gray-700 mb-8">
                {contactInfo.description}
              </p>
              <div className={`grid ${contactInfo.items.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                {contactInfo.items.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-6 text-center border border-gray-200 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-blue-600 hover:text-blue-800 transition-colors break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-700">{item.value}</p>
                    )}
                  </div>
                ))}
              </div>
              {contactInfo.note && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-center text-gray-700">
                    <span className="font-semibold text-blue-600">Note:</span> {contactInfo.note}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

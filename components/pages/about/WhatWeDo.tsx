import React from 'react';
import { CheckCircle, Users, FileText } from 'lucide-react';

export default function WhatWeDo() {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What We Do</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            TaxLegit is your comprehensive platform for business registration, compliance management, and regulatory support—designed specifically for Indian entrepreneurs and enterprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Business Registration</h3>
            <p className="text-slate-600 leading-relaxed">
              Fast-track your company registration with our streamlined online process. From sole proprietorships to private limited companies, we make incorporation effortless and affordable.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Compliance Management</h3>
            <p className="text-slate-600 leading-relaxed">
              Stay compliant with GST filings, annual returns, tax planning, and regulatory requirements. We handle the paperwork while you focus on building your business.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-slate-200">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Consultation</h3>
            <p className="text-slate-600 leading-relaxed">
              Get personalized guidance from experienced professionals who understand your business needs. Clear answers, practical solutions, and ongoing support—whenever you need it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

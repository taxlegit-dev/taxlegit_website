"use client";

import React from "react";

const services = [
  "TDS Return Filing Online",
  "GST Returns Filing Online",
  "Income Tax Returns",
  "Vendor Reconciliation",
  "Due Diligence",
  "Public Limited Company Registration",
  "Section 8 Company Registration",
  "Sole Proprietorship Registration",
  "Trademark Renewal",
  "PF Registration",
  "LEI Registration",
  "Shop and Establishment Registration",
  "Legal Metrology Registration",
];

export default function ContactForm() {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 relative pb-1 text-center">
        Start Your Business with free consultation
        <span className="absolute bottom-0 left-48 w-16 h-0.5 bg-blue-800"></span>
      </h2>

      <form className="space-y-4 mt-4">
        {/* Row 1 - Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-zinc-200 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              className="w-full rounded-lg border border-zinc-200 px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your phone"
            />
          </div>
        </div>

        {/* Row 2 - Email */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-lg border border-zinc-200 px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your email"
          />
        </div>

        {/* Row 3 - Service */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Service
          </label>
          <select
            className="w-full rounded-lg border border-zinc-200 px-4 py-2
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option>---Select Service---</option>
            {services.map((service, idx) => (
              <option key={idx}>{service}</option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-zinc-900 text-white rounded-lg px-4 py-3 font-semibold 
          hover:bg-zinc-800 transition"
        >
          Book Free Consultation
        </button>
      </form>
    </div>
  );
}

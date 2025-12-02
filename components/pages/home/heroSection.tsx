'use client'
import React, { useState } from 'react';
import { Phone, MessageCircle, Star, Check, TrendingUp, Shield, Users } from 'lucide-react';

export default function IndiaHeroSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: ''
  });

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you soon.');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ✨ Zoho Finance Authorized Partner
                </span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                <span className="text-rose-400">Tax Worries?</span>
                <br />
                <span className="text-rose-400">Business Worries?</span>
                <br />
                <span className="text-slate-800">We are the </span>
                <span className="text-slate-900 relative">
                  SOLUTION
                  <svg className="absolute -right-12 top-0 w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/>
                  </svg>
                </span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed">
                Expert tax consultation and business solutions tailored for your success. 
                Navigate complex tax regulations with confidence and maximize your savings.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg shadow-green-200">
                <MessageCircle size={20} />
                Connect On WhatsApp
              </button>
              <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-800 px-6 py-3 rounded-lg font-semibold border-2 border-slate-200 transition">
                <Phone size={20} />
                Call Us Now
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-bold text-slate-900">1470+ Google Reviews</div>
                <div className="text-gray-600">Trusted by thousands</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-blue-600">5000+</div>
                <div className="text-sm text-gray-600">Clients Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Start Your Business
              </h2>
              <p className="text-xl text-blue-600 font-semibold">
                with free consultation
              </p>
              <div className="w-16 h-1 bg-blue-600 mx-auto mt-4"></div>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition bg-white"
                >
                  <option value="">---Select Service---</option>
                  <option value="tax-filing">Tax Filing & Returns</option>
                  <option value="gst">GST Registration & Filing</option>
                  <option value="business-registration">Business Registration</option>
                  <option value="accounting">Accounting Services</option>
                  <option value="consultation">Tax Consultation</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-lg font-semibold text-lg transition shadow-lg"
              >
                Book Free Consultation
              </button>
            </div>

            <div className="mt-6 text-center">
              <div className="flex justify-center items-center gap-1 text-amber-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-600 font-medium">1470 Google Reviews</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
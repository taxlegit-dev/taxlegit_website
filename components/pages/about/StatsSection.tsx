import React from 'react';

export default function StatsSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">10,000+</div>
            <div className="text-blue-100">Businesses Served</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
            <div className="text-blue-100">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
            <div className="text-blue-100">Expert Consultants</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
            <div className="text-blue-100">Support Available</div>
          </div>
        </div>
      </div>
    </section>
  );
}

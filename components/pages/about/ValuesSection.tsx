import React from "react";
import { Shield, Target, Users } from "lucide-react";

export default function ValuesSection() {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Core Values
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Integrity</h3>
            <p className="text-slate-600">
              We operate with transparency and honesty, building trust through
              every interaction.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Excellence
            </h3>
            <p className="text-slate-600">
              We pursue the highest standards in service delivery and client
              satisfaction.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Partnership
            </h3>
            <p className="text-slate-600">
              We invest in long-term relationships, growing alongside our
              clients every step of the way.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

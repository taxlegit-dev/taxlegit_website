"use client";

import { Users, Eye, Briefcase, Clock } from "lucide-react";

export default function WhyChooseTaxlegit() {
  const features = [
    {
      title: "Experienced Professionals",
      desc: "Our qualified experts bring years of industry experience and practical knowledge.",
      icon: <Users className="w-6 h-6 text-white" />,
    },
    {
      title: "Transparency",
      desc: "Clear communication, no hidden fees, and complete process transparency.",
      icon: <Eye className="w-6 h-6 text-white" />,
    },
    {
      title: "Strong Clientele Base",
      desc: "Trusted by startups, SMEs, corporates, and global clients across industries.",
      icon: <Briefcase className="w-6 h-6 text-white" />,
    },
    {
      title: "Punctuality",
      desc: "We value your time — every project is delivered on schedule.",
      icon: <Clock className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <div className="relative w-full bg-slate-50 py-8 md:py-16 px-4 md:px-6 overflow-hidden">
      {/* CURVED DARK PANEL - Hidden on Mobile */}
      <div
        className="
        hidden md:block absolute right-0 top-0 h-full w-[55%]
        bg-gradient-to-br from-blue-100 to-blue-300
        shadow-2xl
        "
        style={{
          clipPath: "path('M0,0 C50,250 220,450 0,700 L1000,700 L1000,1 Z')",
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
        {/* LEFT SIDE TEXT */}
        <div className="">
          <span className="text-xs md:text-sm font-medium px-3 py-1 rounded-full inline-block bg-blue-200 text-indigo-700">
            Start Your Business
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight font-[Gilroy] mt-3">
            Why Choose Taxlegit?
          </h2>

          <p className="mt-4 text-base md:text-lg text-slate-700">
            Let&apos;s do great work together
          </p>
        </div>

        {/* RIGHT SIDE LIST */}
        <div className="z-10 flex flex-col gap-2 md:gap-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="
    flex items-start md:items-center gap-3 md:gap-4 p-1 md:p-2 rounded-xl
    bg-blue-600/90 md:bg-white/10 md:backdrop-blur-xl
    border border-white/20 shadow-xl
    text-white
  "
            >
              <div
                className="
      w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center
      bg-gradient-to-br from-blue-700 to-blue-500
      shadow-xl flex-shrink-0
    "
              >
                {item.icon}
              </div>

              <div>
                <h3 className="text-blue-600 text-base md:text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="text-slate-600 text-xs md:text-sm mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

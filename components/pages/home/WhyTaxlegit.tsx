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
    <div className="relative w-full bg-white py-8  overflow-hidden">
      {/* CURVED DARK PANEL - Hidden on Mobile */}
      <div
        className="
        hidden md:block absolute right-0 top-0 h-full w-[55%]
bg-gradient-to-b from-[#F7F2F7] via-[#EFE4EF] to-white        shadow-2xl
        "
        style={{
          clipPath: "path('M0,0 C50,250 220,450 0,700 L1000,700 L1000,1 Z')",
        }}
      ></div>

      <div className="relative max-w-6xl mx-auto lg:px-0 px-5 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center">
        {/* LEFT SIDE TEXT */}
        <div className="">
          <span className="text-xs md:text-sm font-medium px-3 py-1 rounded-full inline-block bg-purple-200 text-indigo-700">
            Start Your Business
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight  mt-3">
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
    bg-purple-200 
    border border-white/20 shadow-xl
    text-white
  "
            >
              <div
                className="
      w-12 md:w-14 h-12 md:h-14 rounded-full flex items-center justify-center
      shadow-xl flex-shrink-0 bg-purple-500
    "
              >
                {item.icon}
              </div>

              <div>
                <h3 className="text-purple-600 text-base md:text-lg font-semibold">
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

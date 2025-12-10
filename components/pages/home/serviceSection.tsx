"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  User,
  Building,
  HeartHandshake,
  Briefcase,
  Factory,
  Store,
  Apple,
  FileText,
  PieChart,
  ClipboardCheck,
  BookOpen,
  ShoppingCart,
  Star,
  Tag,
  Copyright,
} from "lucide-react";

export default function ScrollTabs() {
  interface ServiceItem {
    icon: React.ReactNode;
    title: string;
    desc: string;
  }

  const tabs = [
    "Company Registration",
    "Government Registration",
    "Tax Filing",
    "Compliance",
    "Compliance and Licensing",
    "Intellectual Properties",
  ];

  const [activeTab, setActiveTab] = useState(0);

  const contentData: Record<string, ServiceItem[]> = {
    "Company Registration": [
      {
        icon: <Building2 className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Private Limited Company Registration",
        desc: "For Indian entrepreneurs, starting a private limited company is a common pick due to the benefits it offers.",
      },
      {
        icon: <Users className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Limited Liability Partnership Registration",
        desc: "A Limited Liability Partnership (LLP) is ideal for small and medium-sized businesses.",
      },
      {
        icon: <User className="w-6 h-6 md:w-7 md:h-7" />,
        title: "One Person Company Registration",
        desc: "A One Person Company (OPC) is a unique structure introduced under the Companies Act, 2013.",
      },
      {
        icon: <Building className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Public Limited Company Registration",
        desc: "A Public Limited Company is a popular structure that allows entrepreneurs to raise funds.",
      },
      {
        icon: <HeartHandshake className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Section 8 Company Registration",
        desc: "Section 8 Company is designed for non-profit organizations (NGOs).",
      },
      {
        icon: <Briefcase className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Sole Proprietorship Registration",
        desc: "A sole proprietorship is a simple business structure owned and run by one individual.",
      },
    ],

    "Government Registration": [
      {
        icon: <Factory className="w-6 h-6 md:w-7 md:h-7" />,
        title: "MSME Registration",
        desc: "Micro, Small & Medium Enterprise registration benefits.",
      },
      {
        icon: <Store className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Shop Act License",
        desc: "Legal license to run a physical shop or establishment.",
      },
      {
        icon: <Apple className="w-6 h-6 md:w-7 md:h-7" />,
        title: "FSSAI Registration",
        desc: "Food business operators need FSSAI license to operate legally.",
      },
    ],

    "Tax Filing": [
      {
        icon: <FileText className="w-6 h-6 md:w-7 md:h-7" />,
        title: "ITR Filing",
        desc: "Income tax return filing for individuals & businesses.",
      },
      {
        icon: <PieChart className="w-6 h-6 md:w-7 md:h-7" />,
        title: "GST Filing",
        desc: "Monthly / Quarterly GST returns filing.",
      },
    ],

    Compliance: [
      {
        icon: <ClipboardCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Annual ROC Filing",
        desc: "Mandatory annual compliance for companies.",
      },
      {
        icon: <BookOpen className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Accounting & Bookkeeping",
        desc: "Professional accounting service for businesses.",
      },
    ],

    "Compliance and Licensing": [
      {
        icon: <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Trade License",
        desc: "Required for businesses operating in commercial space.",
      },
      {
        icon: <Star className="w-6 h-6 md:w-7 md:h-7" />,
        title: "ISO Certification",
        desc: "International quality certification for companies.",
      },
    ],

    "Intellectual Properties": [
      {
        icon: <Tag className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Trademark Registration",
        desc: "Protect your brand by registering your trademark.",
      },
      {
        icon: <Copyright className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Copyright Registration",
        desc: "Protect your content, software, and creative work.",
      },
    ],
  };

  useEffect(() => {
    const checkMobile = () => {
      // Mobile detection logic for responsive UI
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scrollLeft = () => {
    if (activeTab > 0) setActiveTab(activeTab - 1);
  };

  const scrollRight = () => {
    if (activeTab < tabs.length - 1) setActiveTab(activeTab + 1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10 md:px-6 lg:px-8">
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="font-[Gilroy] text-3xl md:text-4xl lg:text-5xl font-bold text-slate-600 mb-3 md:mb-4">
          Business Solutions
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl md:max-w-3xl mx-auto px-4">
          Comprehensive suite of professional services designed to help your
          business thrive.
        </p>
      </div>

      {/* Tabs Navigation - Desktop */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <button
          onClick={scrollLeft}
          disabled={activeTab === 0}
          className={`
            p-3 rounded-full border transition-all duration-300
            ${
              activeTab === 0
                ? "text-blue-300 border-blue-200 cursor-not-allowed"
                : "text-blue-700 border-blue-800 hover:bg-blue-200 hover:shadow-md"
            }
          `}
          aria-label="Previous tab"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="px-8 py-5">
          <div className="flex items-center justify-center">
            <h2 className="text-4xl text-blue-500 text-center font-bold">
              {tabs[activeTab]}
            </h2>
          </div>
        </div>

        <button
          onClick={scrollRight}
          disabled={activeTab === tabs.length - 1}
          className={`
            p-3 rounded-full border transition-all duration-300
            ${
              activeTab === tabs.length - 1
                ? "text-blue-300 border-blue-200 cursor-not-allowed"
                : "text-blue-700 border-blue-800 hover:bg-blue-200 hover:shadow-md"
            }
          `}
          aria-label="Next tab"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Mobile Tab Selection */}
      <div className="md:hidden mb-3">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(Number(e.target.value))}
            className="w-full p-4 rounded-xl bg-white border-2 border-blue-100 text-gray-800 font-semibold text-lg appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {tabs.map((tab, index) => (
              <option key={index} value={index}>
                {tab}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ChevronRight className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-1.5 md:gap-2 mb-6 md:mb-8">
        {tabs.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`transition-all duration-300 ${
              activeTab === index
                ? "w-8 h-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400"
            }`}
            aria-label={`Go to tab ${index + 1}`}
          />
        ))}
      </div>

      {/* CONTENT SECTION - MOBILE: ALWAYS EXTENDED, DESKTOP: HOVER TO EXPAND */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-8 px-2">
        {contentData[tabs[activeTab]].map((item, i) => (
          <div
            key={i}
            className="
              group relative overflow-hidden
              rounded-xl border border-gray-200 shadow-md
              transition-all duration-500
              w-full md:w-[calc(33.333%-1rem)]
              md:min-w-[260px] md:max-w-[300px]
              md:hover:flex-[2] md:hover:min-w-[550px] md:hover:max-w-[650px]
              h-[280px] md:h-[240px]
              bg-white
            "
          >
            {/* IMAGE - Always visible on mobile, only on hover for desktop */}
            <div
              className="
                absolute inset-0 bg-cover bg-center
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transition-all duration-500
                scale-100 md:scale-110 md:group-hover:scale-100
              "
              style={{ backgroundImage: "url('/service.jpg')" }}
            />

            {/* DARK GRADIENT - Always visible on mobile, only on hover for desktop */}
            <div
              className="
                absolute bottom-0 left-0 right-0 h-1/2
                bg-gradient-to-t from-black/70 to-transparent
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transition-all duration-500
              "
            />

            {/* NORMAL STATE CONTENT - Hidden on mobile, visible on desktop until hover */}
            <div
              className="
                absolute inset-0 
                flex flex-col items-center justify-center
                opacity-0 md:opacity-100 md:group-hover:opacity-0
                transition-all duration-300 z-10
                bg-gradient-to-br from-blue-100 via-blue-100/20 to-blue-50/30
                rounded-xl
              "
            >
              <div
                className="
                  flex items-center justify-center
                  w-14 h-14 rounded-2xl
                  bg-blue-100 text-blue-600
                  mb-3
                  transform translate-y-6
                "
              >
                {item.icon}
              </div>

              <h3
                className="
                  text-base font-semibold text-slate-600
                  text-center px-3 leading-snug
                  transform translate-y-6
                "
              >
                {item.title}
              </h3>
            </div>

            {/* EXPANDED STATE CONTENT - Always visible on mobile, only on hover for desktop */}
            <div
              className="
                absolute bottom-0 left-0 p-5 z-20
                w-full
                opacity-100 md:opacity-0 md:group-hover:opacity-100
                transition-all duration-500
              "
            >
              <div
                className="
                  w-12 h-12 flex items-center justify-center
                  rounded-xl bg-blue-200 backdrop-blur text-white mb-2
                "
              >
                {item.icon}
              </div>

              <h3 className="text-white text-lg font-semibold mb-1">
                {item.title}
              </h3>

              <p className="text-gray-200 text-sm mb-3">{item.desc}</p>

              <button
                className="
                  px-4 py-2 bg-gradient-to-r from-blue-700 to-sky-400 text-white rounded-lg text-sm shadow-md
                "
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

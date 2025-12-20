"use client";

import { useState, useEffect, useRef } from "react";
import {
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
  ChevronRight,
  Shield,
  ArrowRight,
  Globe,
  Scale,
  FileCheck,
  Award,
  Target,
  BarChart3,
  Calculator,
  FileBarChart,
  BookCheck,
  Gem,
  Palette,
  ClipboardCheck,
  ShoppingCart,
  Tag,
  Copyright,
} from "lucide-react";

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href?: string;
  lottieUrl?: string;
}

export default function ServiceSection() {
  const lottieUrl =
    "https://lottie.host/embed/c2bbeb89-df08-495c-bf26-04c184040bb5/OSeMYRRc8p.lottie";
  const truncateWords = (text: string, wordLimit: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text.trim();
    return `${words.slice(0, wordLimit).join(" ")}...`;
  };
  const tabs = [
    "Company Registration",
    "Government Registration",
    "Tax Filing",
    "Compliance",
    "Business Licensing",
    "Intellectual Property",
  ];

  const contentData: Record<string, ServiceItem[]> = {
    "Company Registration": [
      {
        icon: <Building2 className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Private Limited Company Registration",
        desc: "Establish your business as a legally recognized private limited company with limited liability protection, separate legal entity status, and enhanced credibility",
        href: "/private-limited-company-registration",
        lottieUrl,
      },
      {
        icon: <Users className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Limited Liability Partnership Registration",
        desc: "Combine the flexibility of partnership with the benefits of limited liability protection. Ideal for professional services firms seeking operational flexibility while maintaining limited liability for partners .",
        href: "/limited-liability-partnership-registration",
        lottieUrl,
      },
      {
        icon: <User className="w-6 h-6 md:w-7 md:h-7" />,
        title: "One Person Company Registration",
        desc: "Perfect for solo entrepreneurs wanting corporate benefits with single ownership. OPC provides limited liability protection, separate legal identity, and easier access to funding while maintaining complete control.",
        href: "/one-person-company-registration",
        lottieUrl,
      },
      {
        icon: <Building className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Public Limited Company Registration",
        desc: "For businesses planning to raise capital from public markets. We facilitate complete registration including SEBI compliance, prospectus filing, and stock exchange listing requirements.",
        href: "/public-limited-company-registration",
        lottieUrl,
      },
      {
        icon: <HeartHandshake className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Section 8 Company Registration",
        desc: "For non-profit organizations, charitable trusts, and NGOs seeking tax exemptions and government benefits. We handle license application, MOA & AOA drafting, and ensure compliance with NITI Aayog.",
        href: "/section-8-company-registration",
        lottieUrl,
      },
      {
        icon: <Briefcase className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Sole Proprietorship Registration",
        desc: "Quickest way to start your individual business with minimal compliance. We assist with MSME registration, GST enrollment, current account opening, and necessary trade licenses for hassle-free business commencement.",
        href: "/sole-proprietorship-registration",
        lottieUrl,
      },
    ],

    "Government Registration": [
      {
        icon: <Factory className="w-6 h-6 md:w-7 md:h-7" />,
        title: "MSME Registration",
        desc: "Register as Micro, Small, or Medium Enterprise to access government subsidies, priority sector lending, tax benefits, and preference in government tenders. Includes Udyam certificate, subsidy scheme enrollment, and compliance advisory.",
        href: "/msme-registration",
        lottieUrl,
      },
      {
        icon: <Store className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Shop & Establishment License",
        desc: "Mandatory for all commercial establishments under state-specific regulations. We handle complete documentation, local authority liaison, and ensure compliance with working hour regulations, employee welfare provisions, and safety standards.",
        href: "/shop-establishment-license",
        lottieUrl,
      },
      {
        icon: <Apple className="w-6 h-6 md:w-7 md:h-7" />,
        title: "FSSAI License & Registration",
        desc: "Essential for all food businesses from manufacturing to retail. We determine correct license category (Basic/State/Central), manage documentation, label compliance, and provide ongoing advisory for FSSAI regulations and audits.",
        href: "/fssai-license-registration",
        lottieUrl,
      },
      {
        icon: <Target className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Import Export Code Registration",
        desc: "Mandatory for international trade operations. We facilitate IEC registration with DGFT, AD code bank linkage, and provide guidance on export promotion schemes, duty drawbacks, and customs compliance.",
        href: "/import-export-code-registration",
        lottieUrl,
      },
    ],

    "Tax Filing": [
      {
        icon: <FileBarChart className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Income Tax Return Filing",
        desc: "Comprehensive ITR filing services for individuals, HUF, companies, and partnerships. Includes tax planning, deduction optimization, capital gains computation, and representation before tax authorities.",
        href: "/income-tax-return-filing",
        lottieUrl,
      },
      {
        icon: <BarChart3 className="w-6 h-6 md:w-7 md:h-7" />,
        title: "GST Return Filing",
        desc: "End-to-end GST compliance including monthly/quarterly returns, annual reconciliation, ITC optimization, and GST audit support. We handle GSTR-1, GSTR-3B, GSTR-9, and manage department notices effectively.",
        href: "/gst-return-filing",
        lottieUrl,
      },
      {
        icon: <Calculator className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Tax Audit & Assessment",
        desc: "Professional representation during tax audits, assessment proceedings, and appeals. We prepare detailed submissions, maintain proper documentation, and ensure compliance with transfer pricing regulations for multinational corporations.",
        href: "/tax-audit-assessment",
        lottieUrl,
      },
    ],

    Compliance: [
      {
        icon: <ClipboardCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Annual ROC Compliance",
        desc: "Complete MCA compliance including AOC-4, MGT-7 filings, director KYC, and board meeting management. We ensure timely submissions, maintain statutory registers, and handle director resignation/appointment formalities.",
        href: "/annual-roc-compliance",
        lottieUrl,
      },
      {
        icon: <BookCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Accounting & Financial Reporting",
        desc: "Professional bookkeeping, financial statement preparation, management reporting, and MIS. We implement accounting systems, manage payroll processing, and ensure compliance with accounting standards (IND AS/AS).",
        href: "/accounting-financial-reporting",
        lottieUrl,
      },
      {
        icon: <FileCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Secretarial Compliance",
        desc: "Corporate secretarial services including board meetings, shareholder meetings, share transfer management, and SEBI compliance for listed companies. We ensure adherence to Companies Act 2013 and secretarial standards.",
        href: "/secretarial-compliance",
        lottieUrl,
      },
    ],

    "Business Licensing": [
      {
        icon: <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Trade License Registration",
        desc: "Essential for conducting business in municipal limits. We handle application with local authorities, fire NOC, pollution consent, and ensure compliance with zoning regulations and commercial activity permissions.",
        href: "/trade-license-registration",
        lottieUrl,
      },
      {
        icon: <Award className="w-6 h-6 md:w-7 md:h-7" />,
        title: "ISO Certification",
        desc: "International quality certification (ISO 9001, 14001, 27001, etc.) to enhance credibility and operational efficiency. We assist with gap analysis, documentation, audit preparation, and certification maintenance.",
        href: "/iso-certification",
        lottieUrl,
      },
      {
        icon: <Globe className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Startup India Registration",
        desc: "Get recognized as an innovative startup to access tax holidays, funding opportunities, patent fee rebates, and easier compliance. Includes DPIIT recognition, incubator linkage, and government scheme benefits.",
        href: "/startup-india-registration",
        lottieUrl,
      },
    ],

    "Intellectual Property": [
      {
        icon: <Tag className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Trademark Registration",
        desc: "Comprehensive brand protection including trademark search, application filing, opposition handling, and renewal management. We protect your logos, slogans, and business names across multiple classes internationally.",
        href: "/trademark-registration",
        lottieUrl,
      },
      {
        icon: <Copyright className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Copyright Protection",
        desc: "Secure your creative works, software code, literary content, and artistic creations. We handle copyright registration, infringement monitoring, licensing agreements, and DMCA takedown notices for digital content.",
        href: "/copyright-protection",
        lottieUrl,
      },
      {
        icon: <Gem className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Patent Registration",
        desc: "Protect your inventions and innovations with strong patent protection. We conduct prior art searches, draft detailed specifications, manage examination process, and handle international filings under PCT.",
        href: "/patent-registration",
        lottieUrl,
      },
      {
        icon: <Palette className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Design Registration",
        desc: "Protect the unique appearance and aesthetic of your products. We handle design application, novelty assessment, and provide strategic advice on design portfolio management for consumer products.",
        href: "/design-registration",
        lottieUrl,
      },
    ],
  };

  const [activeTab, setActiveTab] = useState(0);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(
    contentData[tabs[0]] && contentData[tabs[0]].length > 0
      ? contentData[tabs[0]][0]
      : null
  );

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [contentKey, setContentKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const services = contentData[tabs[index]];
    if (services && services.length > 0) {
      setSelectedService(services[0]);
      setContentKey((prev) => prev + 1);
    }
  };

  const handleServiceChange = (service: ServiceItem) => {
    setSelectedService(service);
    setContentKey((prev) => prev + 1);
  };

  const currentServices = contentData[tabs[activeTab]] || [];

  return (
    <div
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-slate-50 to-white overflow-hidden "
    >
      <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 md:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-2 md:mb-4">
          <div className="overflow-hidden">
            <h1
              className={` text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 md:mb-8 leading-tight transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span>Navigating Legal </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700">
                With Precision{" "}
              </span>
            </h1>
          </div>
        </div>

        {/* Category Navigation - Grid Layout */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 border-b border-slate-200">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <button
                  onClick={() => handleTabChange(index)}
                  className={`px-1 py-3 md:py-4  text-base md:text-lg transition-all duration-300 relative whitespace-nowrap cursor-pointer ${
                    activeTab === index
                      ? "text-purple-600"
                      : "text-slate-700 hover:text-purple-800"
                  }`}
                >
                  {tab}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 ${
                      activeTab === index
                        ? "bg-gradient-to-r from-purple-600 to-purple-800"
                        : "bg-transparent"
                    }`}
                  ></div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="relative min-h-[500px]">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-30"></div>

          <div
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 h-full transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* Services Sidebar - No Icons */}
            <div className="lg:col-span-4 self-start">
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/30 to-white"></div>
                <div className="relative flex flex-col">
                  <div className="bg-gradient-to-r from-purple-600 via-purple-800 to-purple-800 px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Scale className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {tabs[activeTab]}
                      </h3>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <div className="p-6 max-h-[330px] overflow-y-auto">
                      <nav className="space-y-2">
                        {currentServices.map((service, index) => (
                          <div
                            key={index}
                            className={`transition-all duration-500 ${
                              isVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-8"
                            }`}
                            style={{ transitionDelay: `${700 + index * 50}ms` }}
                          >
                            <button
                              onClick={() => handleServiceChange(service)}
                              className={`w-full group text-left p-4 rounded-xl transition-all duration-300 flex items-center justify-between backdrop-blur-sm ${
                                selectedService?.title === service.title
                                  ? "bg-gradient-to-r from-purple-50 to-purple-50 border-2 border-purple-200 shadow-md shadow-purple-100/50"
                                  : "bg-white/50 hover:bg-purple-50/30 border border-slate-100 hover:border-purple-200"
                              }`}
                            >
                              <span
                                className={`text-sm md:text-base leading-snug transition-colors duration-300 ${
                                  selectedService?.title === service.title
                                    ? "text-purple-600"
                                    : "text-slate-700 group-hover:text-slate-900"
                                }`}
                              >
                                {service.title}
                              </span>
                              <ChevronRight
                                className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${
                                  selectedService?.title === service.title
                                    ? "text-purple-600 translate-x-2 scale-110"
                                    : "text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Panel - Slide in from Right */}
            <div className="lg:col-span-8 h-full">
              <div
                key={contentKey}
                className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden h-full backdrop-blur-sm animate-slide-in-right"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/20 to-white"></div>

                {selectedService ? (
                  <div className="relative p-8 md:px-12 lg:px-14 h-full overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-stretch">
                      <div className="lg:col-span-2">
                        {/* Icon + Title Row */}
                        <div className="flex items-center gap-4">
                          {/* Icon with Animation */}
                          <div className="inline-flex items-center justify-center animate-icon-bounce">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl blur-lg opacity-30 animate-pulse"></div>
                              <div className="relative w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-purple-50 to-purple-50 rounded-md flex items-center justify-center shadow-sm shadow-purple-200/40">
                                <div className="text-purple-600 text-sm md:text-base">
                                  {selectedService.icon}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Title with Animation */}
                          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight animate-slide-in-text">
                            {selectedService.title}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-col h-full">
                        {/* Description with Fade Animation */}
                        <div className="overflow-hidden">
                          <p className="text-base md:text-lg text-slate-600 mb-4 leading-relaxed animate-fade-in-delayed">
                            {truncateWords(selectedService.desc, 18)}
                          </p>
                        </div>

                        {/* CTA Button */}
                        {selectedService.href && (
                          <div className="animate-fade-in-delayed-2 mt-auto pt-0">
                            <a
                              href={selectedService.href}
                              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-purple-600 via-purple-800 to-purple-800 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <span className="relative z-10 tracking-wide">
                                Explore Detailed
                              </span>
                              <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
                              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="hidden lg:flex items-center justify-center">
                        <div className="w-full max-w-sm aspect-[4/3]">
                          <iframe
                            title="Service animation"
                            className="w-full h-full rounded-2xl border border-slate-200 bg-white shadow-sm"
                            src={selectedService.lottieUrl}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative p-12 text-center flex flex-col items-center justify-center h-full overflow-y-auto">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full mb-8">
                      <FileText className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      Select a Service Category
                    </h3>
                    <p className="text-slate-500 max-w-md mx-auto text-lg">
                      Choose from our comprehensive range of legal and
                      compliance services to view detailed information
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInText {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDelayed {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes iconBounce {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          60% {
            transform: scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-slide-in-text {
          animation: slideInText 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s
            forwards;
          opacity: 0;
        }

        .animate-fade-in-delayed {
          animation: fadeInDelayed 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s
            forwards;
          opacity: 0;
        }

        .animate-fade-in-delayed-2 {
          animation: fadeInDelayed 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s
            forwards;
          opacity: 0;
        }

        .animate-icon-bounce {
          animation: iconBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

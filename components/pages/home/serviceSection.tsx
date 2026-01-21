"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Factory,
  Store,
  FileText,
  ChevronRight,
  ArrowRight,
  Scale,
  FileCheck,
  ClipboardCheck,
  Landmark,
  TrendingUp,
  Building,
  Users,
  Building2,
  User,
  HeartHandshake,
  UtensilsCrossed,
  Ship,
  BadgeCheck,
  Rocket,
  ShieldAlert,
  Layers,
  Target,
  SearchCheck,
  Briefcase,
  // Tax Filing
  Receipt,
  Calculator,

  // Incentives
  Award,
  Compass,
  AlertTriangle,
  Settings,
  ShieldCheck,
  UsersRound,
  // Compliance
  RefreshCcw,
  KeyRound,
  ShoppingBag,
  Fingerprint,

  // Company Registration
  MapPin,
  Handshake,
  GitBranch,
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
    "Licenses",
    "Compliance",
    "Advisory",
    "Incentives",
    "Valuation",
    "Tax Filing",
  ];

  const contentData: Record<string, ServiceItem[]> = {
    "Company Registration": [
      {
        icon: <Building className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Company Registration in India",
        desc: "End-to-end company incorporation services across all entity types in India.",
        href: "/company-registration",
        lottieUrl,
      },
      {
        icon: <Building2 className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Private Limited Company Registration",
        desc: "Incorporation of private limited companies with MCA, PAN, TAN, and statutory setup.",
        href: "/private-limited-company-registration",
        lottieUrl,
      },
      {
        icon: <Users className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Limited Liability Partnership Registration",
        desc: "LLP registration for professionals and businesses seeking flexibility with limited liability.",
        href: "/llp-registration",
        lottieUrl,
      },
      {
        icon: <User className="w-6 h-6 md:w-7 md:h-7" />,
        title: "One Person Company Registration",
        desc: "OPC incorporation for solo founders with corporate benefits.",
        href: "/one-person-company-registration",
        lottieUrl,
      },
      {
        icon: <HeartHandshake className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Section 8 Company Registration",
        desc: "Non-profit Section 8 company registration for NGOs and charitable institutions.",
        href: "/section-8-company-registration",
        lottieUrl,
      },
      {
        icon: <Briefcase className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Sole Proprietorship Registration",
        desc: "Quick and simple business registration for individual entrepreneurs.",
        href: "/sole-proprietorship-registration",
        lottieUrl,
      },
      {
        icon: <Landmark className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Public Limited Company Registration",
        desc: "Registration support for public limited companies planning capital raising.",
        href: "/public-limited-company-registration",
        lottieUrl,
      },
      {
        icon: <MapPin className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Project Office",
        desc: "Project office setup in India for foreign companies undertaking specific projects.",
        href: "/project-office-registration",
        lottieUrl,
      },
      {
        icon: <Handshake className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Liaison Office",
        desc: "Liaison office registration in India for foreign parent companies.",
        href: "/liaison-office-registration",
        lottieUrl,
      },
      {
        icon: <GitBranch className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Branch Office",
        desc: "Branch office registration for foreign entities conducting business in India.",
        href: "/branch-office-registration",
        lottieUrl,
      },
    ],

    Licenses: [
      {
        icon: <Receipt className="w-6 h-6 md:w-7 md:h-7" />,
        title: "GST Registration",
        desc: "GST registration, amendment, and advisory services for businesses across India.",
        href: "/gst-registration",
        lottieUrl,
      },
      {
        icon: <Factory className="w-6 h-6 md:w-7 md:h-7" />,
        title: "MSME Registration",
        desc: "Udyam MSME registration to avail government benefits, subsidies, and priority lending.",
        href: "/msme-registration",
        lottieUrl,
      },
      {
        icon: <Ship className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Import Export Code Registration",
        desc: "IEC registration with DGFT for businesses engaged in import and export activities.",
        href: "/import-export-code-registration",
        lottieUrl,
      },
      {
        icon: <Rocket className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Startup India Registration",
        desc: "DPIIT Startup India recognition for tax benefits, funding access, and compliance relaxations.",
        href: "/startupindia-registration",
        lottieUrl,
      },
      {
        icon: <FileCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "ISP License Registration",
        desc: "ISP licensing support including DoT approvals and regulatory compliance.",
        href: "/isp-license-registration",
        lottieUrl,
      },
      {
        icon: <UtensilsCrossed className="w-6 h-6 md:w-7 md:h-7" />,
        title: "FSSAI Registration",
        desc: "FSSAI registration and licensing for food manufacturers, restaurants, and traders.",
        href: "/fssai-registration",
        lottieUrl,
      },
      {
        icon: <BadgeCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "ISO Registration",
        desc: "ISO certification support to improve quality systems and business credibility.",
        href: "/iso-registration",
        lottieUrl,
      },
    ],

    Compliance: [
      {
        icon: <SearchCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Due Diligence",
        desc: "Financial, tax, and compliance due diligence services for investments, acquisitions, funding rounds, and strategic transactions.",
        href: "/due-diligence",
        lottieUrl,
      },
      {
        icon: <RefreshCcw className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Vendor Reconciliation",
        desc: "Vendor ledger reconciliation, mismatch identification, duplicate payment checks, and payable accuracy verification.",
        href: "/vendor-reconciliation",
        lottieUrl,
      },
      {
        icon: <Store className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Shop & Establishment Registration",
        desc: "Registration and compliance support under state-specific Shop & Establishment laws for offices and commercial units.",
        href: "/shop-and-establishment-registration",
        lottieUrl,
      },
      {
        icon: <FileText className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Detailed Project Report (DPR)",
        desc: "Bankable detailed project reports for loans, subsidies, funding proposals, and government approvals.",
        href: "/detail-project-report",
        lottieUrl,
      },
      {
        icon: <KeyRound className="w-6 h-6 md:w-7 md:h-7" />,
        title: "DSC Registration",
        desc: "Class 3 Digital Signature Certificate issuance for directors, professionals, and authorized signatories.",
        href: "/dsc-registration",
        lottieUrl,
      },
      {
        icon: <Scale className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Legal Metrology Registration",
        desc: "Mandatory registration for manufacturers, packers, and importers under Legal Metrology regulations.",
        href: "/legal-metrology-registration",
        lottieUrl,
      },
      {
        icon: <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />,
        title: "GeM Registration",
        desc: "Government e-Marketplace seller registration, product listing, and compliance support.",
        href: "/gem-registration",
        lottieUrl,
      },
      {
        icon: <Fingerprint className="w-6 h-6 md:w-7 md:h-7" />,
        title: "LEI Registration",
        desc: "Legal Entity Identifier registration for entities involved in financial and banking transactions.",
        href: "/lei-registration",
        lottieUrl,
      },
      {
        icon: <UsersRound className="w-6 h-6 md:w-7 md:h-7" />,
        title: "PF Registration",
        desc: "Provident Fund registration and compliance for employers including filings and statutory support.",
        href: "/pf-registration",
        lottieUrl,
      },
    ],
    Advisory: [
      {
        icon: <ShieldAlert className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Risk Management & Compliance Monitoring",
        desc: "Enterprise risk identification, compliance tracking, and monitoring systems to prevent financial and regulatory failures.",
        href: "/risk-management-compliance-monitoring",
        lottieUrl,
      },
      {
        icon: <ClipboardCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "ICFR – Setup Services",
        desc: "Internal Financial Controls over Financial Reporting (ICFR) setup aligned with audit and Companies Act requirements.",
        href: "/icfr-setup-services",
        lottieUrl,
      },
      {
        icon: <Layers className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Combo Package for Medium Enterprises",
        desc: "Integrated SOP, ICFR, internal audit, and risk management package for mid-sized companies.",
        href: "/sop-icfr-internal-audit-combo-package",
        lottieUrl,
      },
      {
        icon: <FileCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "SOP Drafting & Process",
        desc: "Standard Operating Procedure drafting and process documentation to improve governance and control discipline.",
        href: "/sop-drafting-process",
        lottieUrl,
      },
      {
        icon: <AlertTriangle className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Audit System & Risk Assessment",
        desc: "Audit framework design and risk assessment to strengthen internal controls and audit preparedness.",
        href: "/internal-audit-and-risk-assessment",
        lottieUrl,
      },
      {
        icon: <Settings className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Policy & Process Standardization",
        desc: "Design and standardization of finance, compliance, and operational policies across organizations.",
        href: "/policy-process-standardization-services",
        lottieUrl,
      },
      {
        icon: <ShieldCheck className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Internal Financial Control",
        desc: "Design, implementation, and testing of internal financial controls for audit readiness and governance.",
        href: "/internal-financial-control-setup",
        lottieUrl,
      },
    ],
    Valuation: [
      {
        icon: <Scale className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Business Valuation",
        desc: "Independent business valuation for startups, SMEs, and private companies for funding, compliance, and strategy.",
        href: "/business-valuation",
        lottieUrl,
      },
      {
        icon: <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />,
        title: "CCPS & OCPS Valuation",
        desc: "Specialised valuation of CCPS and OCPS including conversion scenarios and regulatory compliance.",
        href: "/ccps-and-ocps-valuation",
        lottieUrl,
      },
    ],
    Incentives: [
      {
        icon: <Target className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Sector-Specific Subsidy",
        desc: "Identification and advisory of sector-specific subsidies for manufacturing, EV, renewable, IT, and service industries.",
        href: "/sector-specific-subsidy",
        lottieUrl,
      },
      {
        icon: <Factory className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Turnkey Business",
        desc: "Turnkey business setup including entity formation, licenses, incentives, and compliance structuring.",
        href: "/turnkey-business",
        lottieUrl,
      },
      {
        icon: <TrendingUp className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Subsidy Advisory",
        desc: "End-to-end subsidy advisory including eligibility assessment, application filing, and disbursement tracking.",
        href: "/subsidy-advisory",
        lottieUrl,
      },
      {
        icon: <Award className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Incentive Advisory",
        desc: "Strategic advisory to maximize central and state government incentives for new and expansion projects.",
        href: "/incentive-advisory",
        lottieUrl,
      },
      {
        icon: <Landmark className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Government Subsidy",
        desc: "Consulting for central and state government subsidies with policy interpretation and compliance support.",
        href: "/government-subsidy",
        lottieUrl,
      },
      {
        icon: <Compass className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Strategic Advisory",
        desc: "Strategic business and policy advisory for expansion, cost optimization, and long-term growth planning.",
        href: "/strategic-advisory",
        lottieUrl,
      },
      {
        icon: <Building className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Business Setup",
        desc: "Business setup services covering incorporation, licensing, compliance, and operational readiness.",
        href: "/business-setup",
        lottieUrl,
      },
    ],

    "Tax Filing": [
      {
        icon: <FileText className="w-6 h-6 md:w-7 md:h-7" />,
        title: "Income Tax Returns",
        desc: "Income tax return filing for individuals, professionals, companies, and firms with tax optimization and compliance support.",
        href: "/income-tax-returns",
        lottieUrl,
      },
      {
        icon: <Receipt className="w-6 h-6 md:w-7 md:h-7" />,
        title: "TDS Return Filing Online",
        desc: "Online filing of TDS returns including challan reconciliation, Form 26Q/24Q/27Q, and compliance support.",
        href: "/tds-return-filing-online",
        lottieUrl,
      },
      {
        icon: <Calculator className="w-6 h-6 md:w-7 md:h-7" />,
        title: "GST Returns Filing Online",
        desc: "GST return filing services covering GSTR-1, GSTR-3B, GSTR-9, reconciliations, and notices handling.",
        href: "/gst-returns-filing-online",
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
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
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
      <div className="max-w-6xl mx-auto pt-8 md:pt-16 lg:px-0 px-5">
        {/* Header Section */}
        <div className="text-center mb-2 md:mb-4">
          <div className="overflow-hidden">
            <h2
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
            </h2>
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
                  <div className="bg-[#E6D3E6] px-8 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Scale className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-purple-700 tracking-tight">
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
                            <div className="flex flex-nowrap items-center gap-4">
                              {/* Purple CTA – Explore More */}
                              <Link
                                href={selectedService.href}
                                className="group relative inline-flex items-center justify-center gap-3 text-center
        px-5 lg:px-10 lg:py-4 py-2
        bg-gradient-to-r from-purple-600 via-purple-800 to-purple-800
        text-white rounded-2xl font-bold shadow-xl
        hover:shadow-2xl transition-all duration-300
        hover:scale-105 overflow-hidden whitespace-nowrap"
                              >
                                <div className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <span className="relative z-10 tracking-wide lg:text-md text-sm">
                                  Explore more
                                </span>
                                <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-2" />
                                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                              </Link>

                              {/* White CTA – Get Quotation */}
                              <Link
                                href="/calculateQuote"
                                className="group relative inline-flex items-center justify-center gap-3 text-center
        px-5 lg:px-10 lg:py-4 py-2
        bg-white text-purple-700 border-2 border-purple-700
        rounded-2xl font-bold shadow-xl
        hover:shadow-2xl transition-all duration-300
        hover:scale-105 overflow-hidden whitespace-nowrap"
                              >
                                <span className="relative z-10 tracking-wide lg:text-md text-sm">
                                  Get Quotation
                                </span>
                                <ArrowRight className="w-5 h-5 relative z-10 text-purple-700 transition-transform duration-300 group-hover:translate-x-2" />
                                <div className="absolute inset-0 bg-purple-600/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                              </Link>
                            </div>
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

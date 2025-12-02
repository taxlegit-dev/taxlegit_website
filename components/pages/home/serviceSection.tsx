import { 
  HiShieldCheck, 
  HiCurrencyDollar, 
  HiDocumentText, 
  HiUserGroup, 
  HiOfficeBuilding, 
  HiUser 
} from 'react-icons/hi';

const ServicesSection = () => {
  const services = [
    {
      icon: HiShieldCheck,
      title: "Private Limited Company Registration",
      description: "For Indian entrepreneurs, starting a private limited company is a common pick, due to the benefits it offers for growth and credibility.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: HiCurrencyDollar,
      title: "Limited Liability Partnership Registration",
      description: "A Limited Liability Partnership (LLP) Registration is an ideal business structure for small and medium-sized enterprises.",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: HiUser,
      title: "One Person Company Registration",
      description: "A One Person Company (OPC) is a unique business structure introduced in the Companies Act, 2013, aimed at solo entrepreneurs.",
      color: "from-cyan-500 to-blue-600"
    },
    {
      icon: HiOfficeBuilding,
      title: "Public Limited Company Registration",
      description: "A Public Limited Company (PLC) is a popular business structure in India that many entrepreneurs and investors prefer.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: HiDocumentText,
      title: "Section 8 Company Registration",
      description: "Section 8 Company involved in the legal process of establishing a non-profit organization (NGO) under the Companies Act.",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: HiUserGroup,
      title: "Sole Proprietorship Registration",
      description: "A sole proprietorship is a type of business structure where the entire enterprise is owned and run by one individual.",
      color: "from-teal-500 to-cyan-600"
    }
  ];

  const tabs = [
    "Company Registration",
    "Government Registration",
    "Tax Filing",
    "Compliance",
    "Compliance and Licensing",
    "Intellectual Properties"
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Commitment To Excellence
          </h2>
          <p className="text-2xl text-gray-600">
            The <span className="font-bold text-gray-900">Best Services</span> To You
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {tabs.map((tab, index) => (
            <button
              key={index}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                index === 0
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/30'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <service.icon className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Button */}
                <button className={`relative px-6 py-2.5 rounded-lg font-semibold text-gray-700 border-2 border-gray-200 hover:border-transparent hover:text-white overflow-hidden group/btn transition-all duration-300`}>
                  <span className={`absolute inset-0 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left`}></span>
                  <span className="relative flex items-center gap-2">
                    Know More
                    <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              </div>

              {/* Decorative Element */}
              <div className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${service.color} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
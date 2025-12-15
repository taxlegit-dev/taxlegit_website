import React from 'react';
import { Shield, Lock, CheckCircle } from 'lucide-react';

export const privacyPolicyData = {
  title: "Privacy Policy",
  subtitle: "Welcome to Taxlegit, India's most trusted partner for tax solutions and business compliance. At TaxLegit, managing your business set-up while maintaining privacy is our top priority.",
  icon: <Shield className="w-12 h-12" strokeWidth={2} />,
  badgeText: "GDPR, CCPA & Indian Data Protection Compliant",
  introduction: (
    <>
      <p className="text-gray-800 leading-relaxed mb-4">
        We know that when you choose us, you're putting your trust in our hands. That's why we're committed to protecting your personal information with zero compromises. This Privacy Policy explains, in straightforward language, exactly how we collect, use, and keep your data safe whenever you use our website or services.
      </p>
      <p className="text-gray-800 leading-relaxed">
        You can feel confident knowing we strictly adhere to the latest industry regulations—like GDPR, CCPA, and all applicable Indian Data Protection Laws—to give your information the highest level of security and transparency. With TaxLegit, your privacy truly is our promise.
      </p>
    </>
  ),
  sections: [
    {
      id: 1,
      title: "Information We Collect",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            We collect information necessary to deliver seamless tax and compliance services. This includes:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Name, email address, phone number, and postal address</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Business details (firm name, GST number, PAN, registration data)</span>
                </li>
              </ul>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Transaction Information</h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Payment and billing details (processed securely)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Invoices, service requests, and order history</span>
                </li>
              </ul>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Technical & Usage Data</h4>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>IP address, device identifiers, browser type</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Pages accessed, session duration, geolocation data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Cookies and tracking technology data</span>
                </li>
              </ul>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Communications</h4>
              <p className="text-gray-700">Interactions via email, chat, or support forms—enabling us to serve you better</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "How We Use Your Data",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            At TaxLegit, we use your information thoughtfully and responsibly to serve you better, every step of the way.
          </p>
          <div className="space-y-4">
            {[
              { title: "Constantly Improving", desc: "We use your information to ensure TaxLegit runs smoothly and evolves with your needs, making your experience better every time you visit." },
              { title: "Personalized Journey", desc: "By understanding your business profile, we offer smart, relevant recommendations that truly add value for you and your business." },
              { title: "Quick & Expert Assistance", desc: "Your details help our support team respond quickly and accurately, so you always get expert help and answers without the wait." },
              { title: "Transparent & Seamless Payment", desc: "We use your data for smooth, safe, and transparent transactions, keeping you informed every step of the way." },
              { title: "Safe & Trustworthy Service", desc: "We take proactive steps to protect your account, strengthen our security, and prevent fraud—because your peace of mind is our priority." }
            ].map((item, idx) => (
              <div key={idx} className="border-l-3 border-blue-500 pl-4 py-2">
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 p-5 rounded-lg">
            <p className="text-gray-900">
              <span className="font-semibold text-blue-600">Important:</span> TaxLegit never sells your information. Your trust is the foundation of our service.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Who We Share Your Data With",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            We safeguard your data by only sharing it when necessary with:
          </p>
          <div className="space-y-4">
            <div className="p-5 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Trusted Third-Party Service Partners</h4>
              <p className="text-gray-700">Cloud hosting, analytics, and secure payment gateways under strict confidentiality agreements</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Regulatory and Law Enforcement Authorities</h4>
              <p className="text-gray-700">Only when legally required (e.g., government requests, fraud prevention)</p>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Professional Advisors</h4>
              <p className="text-gray-700">Auditors and legal consultants for compliance purposes</p>
            </div>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <p className="text-gray-700 font-medium">
              We do not sell or lease your data to third parties.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Cookies & Tracking Technologies",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            To enhance user experience and site security, TaxLegit uses:
          </p>
          <div className="space-y-4">
            <div className="p-5 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-green-600 font-bold mr-3">✓</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Essential Cookies</h4>
                  <p className="text-gray-700">Required for site functionality</p>
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-blue-600 font-bold mr-3">📊</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                  <p className="text-gray-700">Google Analytics and similar tools to analyze traffic and improve content</p>
                </div>
              </div>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-purple-600 font-bold mr-3">⚙️</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Preference Cookies</h4>
                  <p className="text-gray-700">Remember your settings and login preferences</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
            <p className="text-gray-900">
              <span className="font-semibold">Cookie Control:</span> You can disable cookies in your browser anytime, though some features of our site may not function optimally.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Data Security & Industry Best Practices",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            We employ robust, up-to-date security measures, including:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">End-to-End Encryption</h4>
              <p className="text-gray-700">All personal and transaction data encrypted</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">ISO</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">ISO Certified Servers</h4>
              <p className="text-gray-700">ISO/IEC 27001 certified data centers</p>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">RBAC</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Access Control</h4>
              <p className="text-gray-700">Role-based access & multi-factor authentication</p>
            </div>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <p className="text-gray-700 italic">
              Despite our stringent safeguards, no online system is fully immune to threats. We are committed to continually upgrading our defenses as per the latest cybersecurity trends.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Your Data Protection Rights",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Under global and Indian privacy laws, you have the right to:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Access your data and request a copy",
              "Correct or update inaccurate information",
              "Delete your information from our systems (subject to legal compliance)",
              "Object to or restrict certain types of data processing",
              "Opt-out of non-essential emails (unsubscribe anytime)",
              "Know how your data is used, stored, and shared"
            ].map((right, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-gray-700 pt-0.5">{right}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-lg">
            <p className="text-gray-900">
              To exercise these rights, contact our privacy officer at{' '}
              <a href="mailto:121@taxlegit.com" className="text-blue-600 font-semibold hover:underline">
                121@taxlegit.com
              </a>
            </p>
          </div>
        </div>
      )
    }
  ],
  staticSections: [
    {
      id: 7,
      title: "Third-Party Links & Integrations",
      content: "Our website may offer links to third-party resources (e.g., government portals, payment processors, partner websites). These sites maintain their privacy policies. We advise reviewing their terms before providing any information."
    },
    {
      id: 8,
      title: "Policy Updates",
      content: "We update our Privacy Policy to stay aligned with evolving privacy laws and best practices. All policy changes are posted here with the revised date. Please check this page periodically for the latest updates."
    },
    {
      id: 9,
      title: "Your Consent",
      content: "By using TaxLegit, you agree to this Privacy Policy and the collection, processing, and use of your data as described above. If you disagree with these terms, please refrain from using our services."
    }
  ],
  contactInfo: {
    title: "Contact Us",
    description: "Have questions about our privacy practices or data handling? Connect with us for prompt, transparent assistance.",
    items: [
      { title: "Website", value: "taxlegit.com", href: "https://taxlegit.com" },
      { title: "Email", value: "121@taxlegit.com", href: "mailto:121@taxlegit.com" },
      { title: "Phone", value: "+91-8929218091", href: "tel:+918929218091" }
    ]
  }
};

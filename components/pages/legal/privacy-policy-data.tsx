import React from "react";
import { Shield } from "lucide-react";

export const privacyPolicyData = {
  title: "Privacy Policy",
  subtitle:
    "Welcome to Taxlegit, India&apos;s most trusted partner for tax solutions and business compliance. At TaxLegit, managing your business set-up while maintaining privacy is our top priority.",
  icon: <Shield className="w-12 h-12" strokeWidth={2} />,
  badgeText: "GDPR, CCPA & Indian Data Protection Compliant",

  introduction: (
    <>
      <p className="text-gray-800 leading-relaxed mb-4">
        We know that when you choose us, you&apos;re putting your trust in our
        hands. That&apos;s why we&apos;re committed to protecting your personal
        information with zero compromises. This Privacy Policy explains, in
        straightforward language, exactly how we collect, use, and keep your
        data safe whenever you use our website or services.
      </p>
      <p className="text-gray-800 leading-relaxed">
        You can feel confident knowing we strictly adhere to the latest industry
        regulations—like GDPR, CCPA, and all applicable Indian Data Protection
        Laws—to give your information the highest level of security and
        transparency. With TaxLegit, your privacy truly is our promise.
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
          <p className="text-gray-700">
            We collect information necessary to deliver seamless tax and
            compliance services. This includes:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border rounded-lg">
              <h4 className="font-semibold mb-3">Personal Information</h4>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>Name, email address, phone number, and postal address</li>
                <li>
                  Business details (firm name, GST number, PAN, registration
                  data)
                </li>
              </ul>
            </div>

            <div className="p-5 border rounded-lg">
              <h4 className="font-semibold mb-3">Transaction Information</h4>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>Payment and billing details (securely processed)</li>
                <li>Invoices, service requests, and order history</li>
              </ul>
            </div>

            <div className="p-5 border rounded-lg">
              <h4 className="font-semibold mb-3">Technical & Usage Data</h4>
              <ul className="space-y-2 text-gray-700 list-disc pl-5">
                <li>IP address, browser type, and device identifiers</li>
                <li>Session duration, pages visited, and location data</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </div>

            <div className="p-5 border rounded-lg">
              <h4 className="font-semibold mb-3">Communications</h4>
              <p className="text-gray-700">
                Emails, chats, and support inquiries to help us assist you
                better.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 2,
      title: "How We Use Your Data",
      expandable: true,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We use your data responsibly to enhance your experience and ensure
            service excellence.
          </p>

          <ul className="space-y-3 list-disc pl-6 text-gray-700">
            <li>Improve platform performance and usability</li>
            <li>Deliver personalized recommendations</li>
            <li>Provide fast and accurate customer support</li>
            <li>Process secure payments and transactions</li>
            <li>Prevent fraud and strengthen system security</li>
          </ul>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-900 font-semibold">
              Important: We never sell your personal information.
            </p>
          </div>
        </div>
      ),
    },

    {
      id: 3,
      title: "Who We Share Your Data With",
      expandable: true,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>Your data is shared only when necessary with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Trusted technology and payment partners</li>
            <li>Government or regulatory authorities when legally required</li>
            <li>Auditors and legal advisors for compliance purposes</li>
          </ul>
          <p className="font-medium">
            We do not sell or lease your data to third parties.
          </p>
        </div>
      ),
    },

    {
      id: 4,
      title: "Cookies & Tracking Technologies",
      expandable: true,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            We use cookies to improve site functionality, analytics, and user
            preferences.
          </p>
          <p>
            You may disable cookies via browser settings, though some features
            may be limited.
          </p>
        </div>
      ),
    },

    {
      id: 5,
      title: "Data Security & Best Practices",
      expandable: true,
      content: (
        <div className="space-y-4 text-gray-700">
          <p>
            We implement industry-standard safeguards including encryption,
            access controls, and secure infrastructure.
          </p>
          <p className="italic">
            While no system is completely immune, we continuously improve our
            defenses.
          </p>
        </div>
      ),
    },

    {
      id: 6,
      title: "Your Data Protection Rights",
      expandable: true,
      content: (
        <div className="space-y-4 text-gray-700">
          <ul className="list-disc pl-6 space-y-2">
            <li>Access and review your personal data</li>
            <li>Request corrections or updates</li>
            <li>Request deletion (subject to legal obligations)</li>
            <li>Opt out of non-essential communications</li>
          </ul>

          <p>
            Contact us at{" "}
            <a
              href="mailto:121@taxlegit.com"
              className="text-purple-600 underline"
            >
              121@taxlegit.com
            </a>{" "}
            to exercise your rights.
          </p>
        </div>
      ),
    },
  ],

  staticSections: [
    {
      id: 7,
      title: "Third-Party Links",
      content:
        "Our website may include links to external sites. We are not responsible for their privacy practices.",
    },
    {
      id: 8,
      title: "Policy Updates",
      content:
        "We may update this policy periodically. Changes will be reflected on this page.",
    },
    {
      id: 9,
      title: "Your Consent",
      content:
        "By using our services, you consent to the collection and use of data as described.",
    },
  ],

  contactInfo: {
    title: "Contact Us",
    description:
      "For questions regarding privacy or data protection, reach out to us.",
    items: [
      {
        title: "Email",
        value: "121@taxlegit.com",
        href: "mailto:121@taxlegit.com",
      },
      { title: "Phone", value: "+91-8929218091", href: "tel:+918929218091" },
      { title: "Website", value: "taxlegit.com", href: "https://taxlegit.com" },
    ],
  },
};

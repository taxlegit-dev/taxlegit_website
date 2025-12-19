import React from "react";
import Link from "next/link";
import {
  FileText,
  Shield,
  AlertTriangle,
  Scale,
  Users,
  Clock,
  Lock,
} from "lucide-react";

export const termsAndConditionsData = {
  title: "Terms & Conditions",
  subtitle:
    "By visiting our website and accessing the information, resources, services, and products we provide, you understand and agree to accept and adhere to the following terms and conditions.",
  icon: <FileText className="w-12 h-12" strokeWidth={2} />,
  badgeText: "Clear, Transparent & Fair Terms",
  introduction: (
    <>
      <p className="text-gray-800 leading-relaxed mb-4">
        At Taxlegit, we&apos;re committed to simplifying business setup and
        compliance for entrepreneurs. Since we are operating online, it is
        important to outline our terms and conditions clearly and upfront.
      </p>
      <p className="text-gray-800 leading-relaxed mb-4">
        This agreement outlines our scope of services, client responsibilities,
        and how we keep things transparent and ethical. As a client availing
        Taxlegit services, you agree to the following terms and conditions.
      </p>
      <p className="text-gray-800 leading-relaxed font-medium">
        If you have any issues related to our services, please reach out to us
        by visiting our website taxlegit.com and talk to an expert.
      </p>
    </>
  ),
  sections: [
    {
      id: 1,
      title: "About Our Services",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Welcome to Taxlegit! This website is owned and operated by Taxlegit
            Consulting Private Limited, 1117, Supertech Astralis, Sec-94, Noida,
            Uttar Pradesh-201301, India.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-gray-900">
                  Information Requirement
                </h4>
              </div>
              <p className="text-gray-700">
                To access our resources, you may be required to provide certain
                information about yourself (such as identification, email, phone
                number, contact details, etc.) and ensure that all the
                information you provide is accurate and up to date.
              </p>
            </div>
            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
              <div className="flex items-center mb-3">
                <Scale className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-gray-900">
                  Scope of Services
                </h4>
              </div>
              <p className="text-gray-700">
                We do not provide legal advice; our role is to assist and guide
                you through legal procedures and complete regulatory and
                compliance-related work.
              </p>
            </div>
          </div>
          <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-gray-800">
                <span className="font-semibold">Important:</span> Clients are
                advised to consult professionals if they need specialized
                guidance.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Users Guidelines",
      expandable: true,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
              <div className="flex items-center mb-3">
                <Users className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Eligibility</h4>
              </div>
              <p className="text-gray-700">
                To access Taxlegit&apos;s resources and services, you must be at
                least 18 years old and capable of entering into binding
                contracts.
              </p>
            </div>
            <div className="p-5 border border-red-100 rounded-lg bg-red-50">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-gray-900">
                  Prohibited Activities
                </h4>
              </div>
              <ul className="text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>
                    Use of our services for illegal or fraudulent acts is
                    strictly prohibited
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>
                    Offensive comments about any particular race or group
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Spreading misleading information</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <p className="text-gray-700 font-medium">
              Violation of these guidelines may result in termination of access
              without prior notice.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Payment and Refund Policy",
      expandable: true,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              {
                icon: "💰",
                title: "Refund Request Limit",
                desc: "Refund requests are limited to one user, to prevent abuse.",
              },
              {
                icon: "⏱️",
                title: "Refund Timeframe",
                desc: "If a user raises a refund request within 30 days of purchasing a service, Taxlegit will refund the amount within 7-10 business days.",
              },
              {
                icon: "🔍",
                title: "Verification Process",
                desc: "Refunds shall only be processed after verification based on clearly visible proofs provided by the user.",
              },
            ].map((item, idx) => (
              <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-red-50 p-5 rounded-lg border border-red-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              Non-Refundable Scenarios
            </h4>
            <div className="space-y-2">
              <div className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <p className="text-gray-700">Change of mind after payment</p>
              </div>
              <div className="flex items-start">
                <span className="text-red-600 mr-2">✗</span>
                <p className="text-gray-700">
                  Refund requests after 30 days of purchase
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Service Timelines and Delays",
      expandable: true,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center p-6 border border-purple-100 rounded-lg bg-purple-50">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Prompt Processing
              </h4>
              <p className="text-gray-700">
                Taxlegit aims to process returns and provide updates promptly.
              </p>
            </div>
            <div className="text-center p-6 border border-yellow-100 rounded-lg bg-yellow-50">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Third-Party Dependencies
              </h4>
              <p className="text-gray-700">
                Since we depend on third-party service providers, we cannot
                guarantee completion within estimated time.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "Client Responsibilities",
      expandable: true,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Timely Responses",
                desc: "Clients must ensure they respond to any queries regarding their application promptly.",
                icon: "📝",
              },
              {
                title: "Accurate Information",
                desc: "Any document errors or incorrect information may lead to service rejection, extra costs, or penalties.",
                icon: "✅",
              },
              {
                title: "Data Accuracy",
                desc: "Clients are responsible for providing correct and complete information for all applications.",
                icon: "📋",
              },
              {
                title: "Consequences",
                desc: "Taxlegit cannot be held responsible for losses or issues due to faulty data provided by the client.",
                icon: "⚠️",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-3">{item.icon}</span>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                </div>
                <p className="text-gray-700 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Users Limitations",
      expandable: true,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="p-5 border border-yellow-100 rounded-lg bg-yellow-50">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <h4 className="font-semibold text-gray-900">
                  No Approval Guarantee
                </h4>
              </div>
              <p className="text-gray-700">
                We do not guarantee that applications will always be approved,
                as this depends on government verification and approval.
              </p>
            </div>
            <div className="p-5 border border-red-100 rounded-lg bg-red-50">
              <div className="flex items-center mb-2">
                <span className="text-red-600 font-bold mr-2">⚠️</span>
                <h4 className="font-semibold text-gray-900">User Liability</h4>
              </div>
              <p className="text-gray-700">
                Users are solely responsible for any penalties, rejections, or
                legal consequences due to incorrect filings of data.
              </p>
            </div>
            <div className="p-5 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center mb-2">
                <span className="text-gray-600 font-bold mr-2">⛔</span>
                <h4 className="font-semibold text-gray-900">
                  No Financial Compensation
                </h4>
              </div>
              <p className="text-gray-700">
                We do not provide financial compensation for any losses caused
                due to delays in regulatory approvals.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "Privacy and Data Security",
      expandable: true,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
              <div className="flex items-center mb-3">
                <Lock className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-gray-900">Data Protection</h4>
              </div>
              <p className="text-gray-700">
                Any personal or business data you share with us is protected and
                confidential. We use this data only to provide services, not
                sell or misuse.
              </p>
            </div>
            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-purple-600 mr-2" />
                <h4 className="font-semibold text-gray-900">
                  Account Security
                </h4>
              </div>
              <p className="text-gray-700">
                Clients are responsible for keeping their login credentials
                secure and should not share their account details with anyone.
              </p>
            </div>
          </div>
          <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
            <p className="text-gray-900">
              For more details, please read our{" "}
              <Link
                href="/privacy-policy"
                className="text-purple-600 font-semibold hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      ),
    },
  ],
  staticSections: [
    {
      id: 8,
      title: "Rules and Violations",
      content:
        "Users must not misuse the platform or bypass security measures. Prohibited conduct includes: Providing false data, Unauthorized sharing of account credentials, Uploading malicious code. Violations may result in suspension or termination of services, without refund.",
    },
    {
      id: 9,
      title: "Breaching and Infringement",
      content:
        "We strictly adhere to the regulations of intellectual property rights while maintaining a DMCA-compliant policy. Restrictions: Clients cannot copy, reuse, or distribute our content, including text, images, logos, and service descriptions, without permission. Action Taken: We will promptly act to remove infringing content, thereby suspending the particular user's account.",
    },
    {
      id: 10,
      title: "Use of Third-Party Services",
      content:
        "Our services may involve external platforms, payment gateways, or government portals. Third-Party Dependencies: If a third-party service provider changes their policies, increases fees, or experiences downtime, Taxlegit cannot be held responsible for any inconvenience caused to the client. Client Responsibility: Clients must comply with the terms and conditions of these third-party service providers when using their platforms.",
    },
    {
      id: 11,
      title: "Policy Updates and Modifications",
      content:
        "Important Note: Taxlegit reserves the right to update, modify, suspend, or discontinue any of these terms at any time, with or without notice. Notification: If changes in policy are crucial, we will attempt to notify users 30 days in advance via email or WhatsApp notifications.",
    },
  ],
  contactInfo: {
    title: "Need Help Understanding Our Terms?",
    description:
      "Our support team is here to help you understand our terms and conditions better.",
    items: [
      { title: "Website", value: "taxlegit.com", href: "https://taxlegit.com" },
      {
        title: "Email",
        value: "121@taxlegit.com",
        href: "mailto:121@taxlegit.com",
      },
      { title: "Phone", value: "+91-8929218091", href: "tel:+918929218091" },
    ],
    note: "Address: Taxlegit Consulting Private Limited, 1117, Supertech Astralis, Sec-94, Noida, Uttar Pradesh-201301, India",
  },
};

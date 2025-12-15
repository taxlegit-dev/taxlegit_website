import React from 'react';
import { RefreshCw } from 'lucide-react';

export const refundPolicyData = {
  title: "Refund Policy",
  subtitle: "At Taxlegit, we understand that dealing with the legal compliance of business set-up and tax can be challenging. Our mission is to provide clear, reliable tax and compliance services that make your business journey hassle-free.",
  icon: <RefreshCw className="w-12 h-12" strokeWidth={2} />,
  badgeText: "Simple, Transparent & Hassle-Free Refunds",
  introduction: (
    <>
      <p className="text-gray-800 leading-relaxed mb-4">
        If things don't go as planned, you're protected by a straightforward, hassle-free refund policy, because we stand by our promise of putting you first.
      </p>
      <p className="text-gray-800 leading-relaxed">
        You can feel confident knowing our refund process is designed with your convenience in mind—clear timelines, easy procedures, and transparent terms. With TaxLegit, your satisfaction is guaranteed.
      </p>
    </>
  ),
  sections: [
    {
      id: 1,
      title: "When Can You Request a Refund?",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            We know that life and businesses both are unpredictable. That's why we make refunds simple and fair. Here's when you can ask for one:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center mb-3">
                <span className="text-blue-600 mr-2">⏰</span>
                <h4 className="font-semibold text-gray-900">Time Frame</h4>
              </div>
              <p className="text-gray-700">
                You need to request a refund within <span className="font-semibold">14 days</span> of your purchase. After that, we won't be able to process it.
              </p>
            </div>
            <div className="p-5 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center mb-3">
                <span className="text-blue-600 mr-2">📋</span>
                <h4 className="font-semibold text-gray-900">Service Status</h4>
              </div>
              <p className="text-gray-700">
                If we haven't fully completed the service you paid for, you're eligible for a refund. Once all services are done, refunds aren't available.
              </p>
            </div>
            <div className="p-5 border border-blue-100 rounded-lg bg-blue-50 md:col-span-2">
              <div className="flex items-center mb-3">
                <span className="text-blue-600 mr-2">🛡️</span>
                <h4 className="font-semibold text-gray-900">Required Information</h4>
              </div>
              <p className="text-gray-700">
                Please provide all necessary details, such as your proof of purchase and any other documents we might need to process your refund.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "What's Not Refundable?",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            To keep our policy transparent, here's what can't be refunded:
          </p>
          <div className="space-y-4">
            {[
              {
                title: "Consultation Fees",
                desc: "If you've already had a consultation with us, those fees can't be refunded.",
                icon: "💼"
              },
              {
                title: "Government Fees",
                desc: "Any payments made directly to government agencies for registrations or licenses aren't refundable. These are third-party costs beyond our control.",
                icon: "🏛️"
              },
              {
                title: "Customized Services",
                desc: "If we've tailored our services specifically for your business and started working on them, those fees can't be refunded.",
                icon: "⚙️"
              }
            ].map((item, idx) => (
              <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{item.icon}</span>
                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                </div>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "How to Request a Refund",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Need a refund? It's easy! We make the refund process as easy as possible:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                step: "1",
                title: "Reach Out to Us",
                desc: "Contact our friendly support team within 14 days of your purchase.",
                details: "Email: 121@taxlegit.com | Phone: +91 89292 18091"
              },
              {
                step: "2",
                title: "Share Your Details",
                desc: "Let us know your order number, purchase date, and why you're requesting a refund."
              },
              {
                step: "3",
                title: "Provide Documentation",
                desc: "Attach any necessary documents, like receipts or invoices, to support your request."
              },
              {
                step: "4",
                title: "Wait for Response",
                desc: "We'll review your request and get back to you within 5-7 business days."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-5 border border-gray-200 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mb-3 font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-700 text-sm">{item.desc}</p>
                {item.details && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                    {item.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "How Refunds are Processed?",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Once we approve your refund, here's what happens next:
          </p>
          <div className="space-y-4">
            <div className="p-5 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">🔄</span>
                <h4 className="font-semibold text-gray-900">Payment Method</h4>
              </div>
              <p className="text-gray-700">
                We'll refund the money using the same method you used to pay.
              </p>
            </div>
            <div className="p-5 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">⏰</span>
                <h4 className="font-semibold text-gray-900">Time Frame</h4>
              </div>
              <p className="text-gray-700">
                It might take up to <span className="font-semibold">6-7 business days</span> for the refund to show up in your account, depending on your bank or payment provider.
              </p>
            </div>
            <div className="p-5 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">↕️</span>
                <h4 className="font-semibold text-gray-900">Partial Refunds</h4>
              </div>
              <p className="text-gray-700">
                If we've already done part of the service, you might receive a partial refund based on what's left.
              </p>
            </div>
            <div className="p-5 border border-blue-100 rounded-lg bg-blue-50">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 mr-2">✅</span>
                <h4 className="font-semibold text-gray-900">Confirmation</h4>
              </div>
              <p className="text-gray-700">
                You'll receive an email letting you know your refund has been processed.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Canceling Our Services",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            If you decide to cancel our services, just follow these simple steps:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-blue-100 rounded-lg bg-blue-50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">🔄</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Before We Start</h4>
              <p className="text-gray-700 text-sm">
                If you cancel before we begin working on your registration or licensing, you can get a full refund minus any non-refundable fees.
              </p>
            </div>
            <div className="text-center p-6 border border-blue-100 rounded-lg bg-blue-50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">⏳</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">While We're Working</h4>
              <p className="text-gray-700 text-sm">
                If you cancel while we're in the middle of providing the service, you might get a partial refund based on work completed.
              </p>
            </div>
            <div className="text-center p-6 border border-blue-100 rounded-lg bg-blue-50">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">✅</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">After Completion</h4>
              <p className="text-gray-700 text-sm">
                Once we've finished all the services, we can't offer a refund.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "When We Can't Grant a Refund",
      expandable: true,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Sometimes, we can't issue a refund. This happens if:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "You request a refund after 14 days.",
              "We've already completed the services you paid for.",
              "You don't provide enough information or documentation.",
              "You ask for a refund on non-refundable services like consultations or government fees."
            ].map((reason, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 border border-red-100 rounded-lg bg-red-50">
                <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  <span className="text-xs">⚠️</span>
                </div>
                <p className="text-gray-700 pt-0.5">{reason}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              If your refund is denied, we'll explain why and discuss other ways we can help.
            </p>
          </div>
        </div>
      )
    }
  ],
  staticSections: [
    {
      id: 7,
      title: "Changing Your Services",
      content: "Need something different? Let us know! Depending on what you need, there might be extra fees. If the changes mean we won't use some of the services you paid for, you could be eligible for a refund for those unused parts. Talk to our support team to understand how changes affect your refund. We'll always explain your options so you can make informed decisions."
    },
    {
      id: 8,
      title: "Resolving Disputes",
      content: "Disagree with our decision? We want to make sure you're happy. Contact our support team with all the details of your concern. Provide any extra documents or explanations to support your case. If needed, escalate to speak with someone higher up in our company for further review."
    },
    {
      id: 9,
      title: "Keeping You Informed",
      content: "We regularly review and update our Refund Policy to stay ahead of legal standards and customer feedback. Any updates will be posted here, so you're always in the know. TaxLegit puts your satisfaction and trust above everything else. Our easy refund policy is just one more way we deliver peace of mind for every entrepreneur, every step of the way."
    }
  ],
  contactInfo: {
    title: "Need Help with a Refund?",
    description: "Our support team is here to help you with any refund requests or questions you might have.",
    items: [
      { title: "Email", value: "121@taxlegit.com", href: "mailto:121@taxlegit.com" },
      { title: "Phone", value: "+91-8929218091", href: "tel:+918929218091" },
      { title: "Working Hours", value: "Mon-Sat: 9AM-7PM\nResponse within 24 hours" }
    ],
    note: "Please have your order number and purchase details ready when contacting us for faster service."
  }
};

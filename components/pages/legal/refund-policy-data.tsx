import React from "react";
import { RefreshCw } from "lucide-react";

export const refundPolicyData = {
  title: "Refund Policy",
  subtitle:
    "At Taxlegit, we understand that dealing with the legal compliance of business set-up and tax can be challenging. Our mission is to provide clear, reliable tax and compliance services that make your business journey hassle-free.",
  icon: <RefreshCw className="w-12 h-12" strokeWidth={2} />,
  badgeText: "Simple, Transparent & Hassle-Free Refunds",

  introduction: (
    <>
      <p className="text-gray-800 leading-relaxed mb-4">
        If things don&apos;t go as planned, you&apos;re protected by a
        straightforward, hassle-free refund policy, because we stand by our
        promise of putting you first.
      </p>
      <p className="text-gray-800 leading-relaxed">
        You can feel confident knowing our refund process is designed with your
        convenience in mind—clear timelines, easy procedures, and transparent
        terms. With TaxLegit, your satisfaction is guaranteed.
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
            We know that life and businesses both are unpredictable. That&apos;s
            why we make refunds simple and fair. Here&apos;s when you can ask
            for one:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
              <h4 className="font-semibold text-gray-900 mb-2">
                ⏰ Time Frame
              </h4>
              <p className="text-gray-700">
                You need to request a refund within{" "}
                <span className="font-semibold">14 days</span> of your purchase.
                After that, we won&apos;t be able to process it.
              </p>
            </div>

            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50">
              <h4 className="font-semibold text-gray-900 mb-2">
                📋 Service Status
              </h4>
              <p className="text-gray-700">
                If we haven&apos;t fully completed the service you paid for,
                you&apos;re eligible for a refund. Once all services are done,
                refunds aren&apos;t available.
              </p>
            </div>

            <div className="p-5 border border-purple-100 rounded-lg bg-purple-50 md:col-span-2">
              <h4 className="font-semibold text-gray-900 mb-2">
                🛡️ Required Information
              </h4>
              <p className="text-gray-700">
                Please provide all necessary details, such as your proof of
                purchase and any other documents we might need to process your
                refund.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 2,
      title: "What&apos;s Not Refundable?",
      expandable: true,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            To keep our policy transparent, here&apos;s what can&apos;t be
            refunded:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Consultation fees once the consultation has already taken place.
            </li>
            <li>
              Government fees paid to authorities for registrations or licenses.
            </li>
            <li>Customized services once work has already begun.</li>
          </ul>
        </div>
      ),
    },

    {
      id: 3,
      title: "How to Request a Refund",
      expandable: true,
      content: (
        <div className="space-y-4">
          <ol className="list-decimal pl-6 space-y-3 text-gray-700">
            <li>Contact our support team within 14 days of your purchase.</li>
            <li>
              Share your order number, purchase date, and reason for the refund
              request.
            </li>
            <li>Attach any required documents such as invoices or receipts.</li>
            <li>
              We&apos;ll review your request and respond within 5–7 business
              days.
            </li>
          </ol>

          <p className="text-gray-700">
            Email:{" "}
            <a
              href="mailto:121@taxlegit.com"
              className="text-purple-600 underline"
            >
              121@taxlegit.com
            </a>{" "}
            | Phone:{" "}
            <a href="tel:+918929218091" className="text-purple-600 underline">
              +91 89292 18091
            </a>
          </p>
        </div>
      ),
    },

    {
      id: 4,
      title: "How Refunds Are Processed",
      expandable: true,
      content: (
        <div className="space-y-3 text-gray-700">
          <p>
            Once approved, refunds are processed using the same payment method
            you originally used.
          </p>
          <p>
            It may take up to{" "}
            <span className="font-semibold">6–7 business days</span> for the
            amount to reflect in your account.
          </p>
          <p>
            If only part of the service has been completed, a partial refund may
            be issued.
          </p>
          <p>
            You&apos;ll receive an email confirmation once the refund is
            processed.
          </p>
        </div>
      ),
    },

    {
      id: 5,
      title: "Canceling Our Services",
      expandable: true,
      content: (
        <div className="space-y-3 text-gray-700">
          <p>
            You may cancel services at any time by contacting our support team.
          </p>
          <p>
            If canceled before work begins, a full refund may be issued minus
            non-refundable fees.
          </p>
          <p>
            If canceled during service delivery, a partial refund may apply.
          </p>
          <p>No refunds are available once services are fully completed.</p>
        </div>
      ),
    },

    {
      id: 6,
      title: "When We Can&apos;t Grant a Refund",
      expandable: true,
      content: (
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Refund requests made after 14 days.</li>
          <li>Services already completed.</li>
          <li>Missing or insufficient documentation.</li>
          <li>
            Non-refundable services such as consultations or government fees.
          </li>
        </ul>
      ),
    },
  ],

  staticSections: [
    {
      id: 7,
      title: "Changing Your Services",
      content:
        "If you need to modify your services, contact our team. Additional fees may apply, and unused portions may be eligible for a refund depending on the work completed.",
    },
    {
      id: 8,
      title: "Resolving Disputes",
      content:
        "If you disagree with a refund decision, reach out to our support team with relevant details. Escalation options are available if required.",
    },
    {
      id: 9,
      title: "Keeping You Informed",
      content:
        "We periodically update this policy to reflect legal and operational changes. Any updates will be published here for transparency.",
    },
  ],

  contactInfo: {
    title: "Need Help with a Refund?",
    description:
      "Our support team is here to help you with any refund-related questions.",
    items: [
      {
        title: "Email",
        value: "121@taxlegit.com",
        href: "mailto:121@taxlegit.com",
      },
      {
        title: "Phone",
        value: "+91-8929218091",
        href: "tel:+918929218091",
      },
      {
        title: "Working Hours",
        value: "Mon–Sat: 9AM–7PM | Response within 24 hours",
      },
    ],
    note: "Please keep your order number and purchase details ready for faster assistance.",
  },
};

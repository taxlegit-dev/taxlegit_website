import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/pages/common/contactForm";
import { Phone, MapPin, Mail } from "lucide-react";
import Footer from "@/components/footer";

export default function AboutCompanyHero() {
  return (
    <>
      <section className="relative h-[400px] w-full overflow-hidden mt-[89px]">
        {/* Background Image */}
        <Image
          src="/about/hero2.png" // 👉 replace with your image path
          alt="About Company"
          fill
          priority
          className="object-cover"
          unoptimized
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        {/* Dotted Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-xl text-white">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-300">
              <Link href="/" className="text-purple-700 hover:underline">
                Home
              </Link>
              <span className="mx-2">››</span>
              <span className="text-white">Contact Us</span>
            </nav>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Contact Company
            </h1>
          </div>
        </div>
      </section>
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-14 lg:grid-cols-2 items-center">
            {/* LEFT CONTENT */}
            <div>
              <span className="inline-block rounded-full bg-purple-100 px-4 py-1 text-sm font-medium text-purple-600">
                Contact Us
              </span>

              <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
                Make Requests For Further <br />
                Information, Contact Us
              </h2>

              <p className="mt-4 max-w-md text-gray-600">
                At Taxlegit, we provide reliable, transparent, and
                growth-focused compliance & legal solutions for businesses
                across India.
              </p>

              {/* CONTACT INFO */}
              <div className="mt-10 space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Call Us</p>
                    <p className="font-semibold text-gray-900">
                      +91 8929218091
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Our Location</p>
                    <p className="font-semibold text-gray-900">
                      New Delhi, India
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mail Us</p>
                    <p className="font-semibold text-gray-900">
                      121@taxlegit.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT – FORM (IMPORTED) */}
            <div className="rounded-2xl bg-purple-50 p-8 shadow-xl">
              {/* Imported Form */}
              <ContactForm />

              {/* Submit Button (if button is outside form) */}
              {/* Otherwise remove this */}
              {/* 
            <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-purple-600 px-8 py-3 text-white font-semibold hover:bg-purple-700 transition">
              Send Your Message
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-purple-600">
                →
              </span>
            </button> 
            */}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

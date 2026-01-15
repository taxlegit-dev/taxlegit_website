"use client";
import {
  FaInstagram,
  FaTwitter,
  FaFacebookF,
  FaYoutube,
  FaLinkedinIn,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaChevronRight,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import Image from "next/image";

const Footer = () => {
  const popularRegistration = [
    { name: "Private Limited Company", href: "#pvt-ltd" },
    { name: "GST Registration", href: "#gst" },
    { name: "Public Limited Company", href: "#public-ltd" },
    { name: "One Person Company", href: "#opc" },
    { name: "FSSAI Registration", href: "#fssai" },
  ];

  const popularLicenses = [
    { name: "Trademark Registration", href: "#trademark" },
    { name: "ISO Certification", href: "#iso" },
    { name: "LLP Registration", href: "#llp" },
    { name: "GEM Registration", href: "#gem" },
    { name: "Digital Signature", href: "#dsc" },
  ];

  const companyLinks = [
    { name: "About Us", href: "about" },
    { name: "Blog", href: "blog" },
    { name: "Contact Us", href: "contact-us" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "privacy-policy" },
    { name: "Terms of Service", href: "terms-and-conditions" },
    { name: "Refund Policy", href: "refund-policy" },
  ];

  const socialLinks = [
    {
      icon: <FaInstagram />,
      href: "#",
      label: "Instagram",
      color: "hover:bg-purple-600",
    },
    {
      icon: <FaTwitter />,
      href: "https://x.com/taxlegit",
      label: "Twitter",
      color: "hover:bg-purple-500",
    },
    {
      icon: <FaFacebookF />,
      href: "https://www.facebook.com/Taxlegitt/",
      label: "Facebook",
      color: "hover:bg-purple-700",
    },
    {
      icon: <FaLinkedinIn />,
      href: "https://www.linkedin.com/company/taxlegitt/",
      label: "LinkedIn",
      color: "hover:bg-purple-800",
    },
    {
      icon: <FaYoutube />,
      href: "https://www.youtube.com/channel/UC4s7kcn1qt7np_Ccce5hmHA",
      label: "YouTube",
      color: "hover:bg-red-600",
    },
  ];

  return (
    <>
      {/* Main Container with Overlap */}
      <div className="relative mt-32">
        {/* Call to Action Banner (Will overlap on footer) */}
        <div className="relative sm:absolute sm:-top-16 w-full z-40 mb-8 sm:mb-0">
          <section className="relative w-full">
            {/* Main Banner Box */}
            <div
              className="
        max-w-6xl mx-auto relative z-10 
        bg-[#E6D3E6] rounded-2xl 
        px-8 md:px-16 py-6 sm:py-0
        flex flex-col md:flex-row items-center justify-between 
        shadow-2xl
        transform hover:scale-[1.02] transition-transform duration-300
      "
            >
              {/* LEFT IMAGE — POP OUT */}
              <div className="flex-shrink-0 mb-6 md:mb-0 relative">
                <Image
                  src="/cta-img.png"
                  alt="Consultation"
                  width={260}
                  height={260}
                  unoptimized
                  className="
      object-contain drop-shadow-2xl
      -mt-6 sm:-mt-12 md:-mt-20
      z-20 relative

      /* 🔥 RESPONSIVE SIZE CONTROL */
      w-[140px] 
      sm:w-[180px] 
      md:w-[220px] 
      lg:w-[260px]

      h-auto
    "
                />
              </div>

              {/* CENTER TEXT */}
              <div className="flex-1 text-center md:text-left text-slate-800 px-4 lg:px-8">
                <h2 className=" lg:text-4xl text-xl font-bold leading-tight mb-3">
                  Ready to Start Your Journey?
                </h2>
              </div>

              {/* RIGHT BUTTON */}
              <div className="mt-6 md:mt-0 flex-shrink-0 w-full md:w-auto px-4 md:px-0">
                <a
                  href="https://wa.me/918929218091"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full md:w-auto
    bg-white text-purple-700 font-bold
    px-4 lg:px-8 py-2 lg:py-4 rounded-lg md:rounded-xl
    shadow-lg hover:shadow-2xl
    transition-all duration-300
    hover:scale-105 active:scale-95
    flex items-center justify-center gap-2
    text-sm lg:text-base"
                >
                  {/* Text */}
                  <span>TALK TO A SPECIALIST</span>
                </a>
              </div>
            </div>

            {/* Bottom Shadow */}
            <div
              className="
        absolute -bottom-4 left-1/2 transform -translate-x-1/2
        w-3/4 h-8
        bg-gradient-to-t from-purple-900/30 to-transparent
        rounded-full
        blur-md
      "
            />
          </section>
        </div>

        {/* Footer (Will have 25% overlap) */}
        <footer className="relative z-30 bg-gray-900 pt-10 sm:pt-24 pb-8">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 pt-6 sm:pt-12 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Company Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Tax<span className="text-purple-400">legit</span>
                  </h2>
                  <p className="text-gray-400 leading-relaxed max-w-md">
                    Your trusted partner for business registrations, compliance,
                    and legal services. Simplifying entrepreneurship since 2015.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <a
                      href="tel:+918929218091"
                      className="flex items-center gap-3 text-white hover:text-purple-400 transition-colors"
                    >
                      <FaPhoneAlt className="text-purple-400" />
                      <span>+91 89292 18091</span>
                    </a>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=121@taxlegit.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white hover:text-purple-400 transition-colors"
                    >
                      <FaEnvelope className="text-purple-400" />
                      <span>121@taxlegit.com</span>
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-white">
                        Registered Office
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supertech Astralis, Sector-94,
                        <br />
                        Noida, Uttar Pradesh - 201301
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <p className="font-medium text-white mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1 ${social.color}`}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Popular Registration */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white border-l-4 border-purple-500 pl-3">
                  Popular Registration
                </h3>
                <ul className="space-y-3">
                  {popularRegistration.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        <FaChevronRight className="mr-2 text-purple-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Licenses */}
              <div className="space-y-6 ">
                <h3 className="text-lg font-semibold text-white border-l-4 border-cyan-500 pl-3">
                  Popular Licenses
                </h3>
                <ul className="space-y-3">
                  {popularLicenses.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        <FaChevronRight className="mr-2 text-cyan-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-white border-l-4 border-purple-400 pl-3">
                    Company
                  </h3>
                  <ul className="space-y-3 mt-4">
                    {companyLinks.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.href}
                          className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          <FaChevronRight className="mr-2 text-purple-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white border-l-4 border-gray-500 pl-3">
                    Legal
                  </h3>
                  <ul className="space-y-3 mt-4">
                    {legalLinks.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.href}
                          className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          <FaChevronRight className="mr-2 text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span>{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 mt-8 mb-4"></div>

            <div>
              <p className="text-gray-400 text-sm text-center">
                <span className="text-gray-500 font-medium">Disclaimer:</span>{" "}
                Our portal provides consultancy services for business
                registrations and compliance. We are not affiliated with any
                government authority.
              </p>
            </div>

            <div className="border-t border-gray-800 my-4"></div>

            {/* Bottom Bar */}
            <div className="flex flex-col items-center justify-center py-2">
              <p className="text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} Taxlegit. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Floating Action Buttons */}
        <div className="fixed left-6 bottom-6 z-50 flex flex-col gap-4">
          {/* WhatsApp */}
          <a
            href="https://wa.me/918929218091"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 bg-green-500 rounded-full text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="text-2xl" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
              Chat on WhatsApp
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </span>
          </a>

          {/* Phone Call */}
          <a
            href="tel:+918929218091"
            className="group relative flex items-center justify-center w-10 h-10 lg:w-14 lg:h-14 bg-blue-500 rounded-full text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300"
            aria-label="Call Us"
          >
            <MdPhone className="text-2xl" />
            <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
              Call Now
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;

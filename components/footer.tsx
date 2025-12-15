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
} from "react-icons/fa";
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
    { name: "About Us", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact Us", href: "#contact" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "privacy-policy" },
    { name: "Terms of Service", href: "terms-and-conditions" },
    { name: "Refund Policy", href: "refund-policy" },
    { name: "Disclaimer", href: "#disclaimer" },
  ];

  const socialLinks = [
    {
      icon: <FaInstagram />,
      href: "#",
      label: "Instagram",
      color: "hover:bg-blue-600",
    },
    {
      icon: <FaTwitter />,
      href: "#",
      label: "Twitter",
      color: "hover:bg-blue-500",
    },
    {
      icon: <FaFacebookF />,
      href: "#",
      label: "Facebook",
      color: "hover:bg-blue-700",
    },
    {
      icon: <FaLinkedinIn />,
      href: "#",
      label: "LinkedIn",
      color: "hover:bg-blue-800",
    },
    {
      icon: <FaYoutube />,
      href: "#",
      label: "YouTube",
      color: "hover:bg-red-600",
    },
  ];

  return (
    <>
      {/* Main Container with Overlap */}
      <div className="relative mt-32">
        {/* Call to Action Banner (Will overlap on footer) */}
        <div className="absolute -top-16 w-full z-40">
          <section className="relative w-full">
            {/* Main Banner Box */}
            <div
              className="
        max-w-6xl mx-auto relative z-10 
        bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl 
        px-8 md:px-16 py-0
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
                  className="
            object-contain drop-shadow-2xl 
            -mt-20 md:-mt-24   /* 💥 THIS MAKES IMAGE FLOAT ABOVE */
            z-20 relative
          "
                />
              </div>

              {/* CENTER TEXT */}
              <div className="flex-1 text-center md:text-left text-white px-4 md:px-8">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                  Ready to Start Your Journey?
                </h2>
              </div>

              {/* RIGHT BUTTON */}
              <div className="mt-6 md:mt-0 flex-shrink-0 w-full md:w-auto px-4 md:px-0">
                <button
                  className="
            group relative w-full md:w-auto
            bg-white text-blue-700 font-bold 
            px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl 
            shadow-lg hover:shadow-2xl 
            transition-all duration-300
            hover:scale-105 active:scale-95
            flex items-center justify-center md:justify-start gap-2 md:gap-3
            text-sm md:text-base
          "
                >
                  <span>TALK TO A SPECIALIST</span>
                  <div className="absolute -inset-1 bg-white/20 rounded-lg md:rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </button>
              </div>
            </div>

            {/* Bottom Shadow */}
            <div
              className="
        absolute -bottom-4 left-1/2 transform -translate-x-1/2
        w-3/4 h-8
        bg-gradient-to-t from-blue-900/30 to-transparent
        rounded-full
        blur-md
      "
            />
          </section>
        </div>

        {/* Footer (Will have 25% overlap) */}
        <footer className="relative z-30 bg-gray-900 pt-24 pb-8">
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 pt-12 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Company Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Tax<span className="text-blue-400">legit</span>
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
                      className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors"
                    >
                      <FaPhoneAlt className="text-blue-400" />
                      <span>+91 89292 18091</span>
                    </a>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=info@taxlegit.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors"
                    >
                      <FaEnvelope className="text-blue-400" />
                      <span>info@taxlegit.com</span>
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
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
                <h3 className="text-lg font-semibold text-white border-l-4 border-blue-500 pl-3">
                  Popular Registration
                </h3>
                <ul className="space-y-3">
                  {popularRegistration.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        <FaChevronRight className="mr-2 text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Licenses */}
              <div className="space-y-6">
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
                  <h3 className="text-lg font-semibold text-white border-l-4 border-blue-400 pl-3">
                    Company
                  </h3>
                  <ul className="space-y-3 mt-4">
                    {companyLinks.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.href}
                          className="group flex items-center text-gray-400 hover:text-white transition-colors duration-300"
                        >
                          <FaChevronRight className="mr-2 text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
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
      </div>
    </>
  );
};

export default Footer;

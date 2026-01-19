"use client";

import React from "react";
import { Mail, Phone, Facebook, Linkedin, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const TopNavbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] w-full bg-purple-800 text-white text-md">
      <div className="max-w-7xl mx-auto flex h-10 items-center justify-end sm:justify-between px-4 lg:px-0">
        {/* left Side - Social Media */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="https://www.facebook.com/Taxlegitt/"
            className="hover:text-blue-400 transition"
            aria-label="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>

          <a
            href="https://www.linkedin.com/company/taxlegitt/"
            className="hover:text-blue-300 transition"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>

          <a
            href="https://www.youtube.com/channel/UC4s7kcn1qt7np_Ccce5hmHA"
            className="hover:text-red-500 transition"
            aria-label="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>
        {/* right Side - Contact Info */}
        <div className="flex items-center gap-4 sm:ml-auto">
          {/* <a
            href="https://wa.me/918929218091"
            target="_blank"
            className="flex items-center gap-1 hover:text-green-400 transition"
          >
            <FaWhatsapp className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a> */}

          <a
            href="mailto:121@taxlegit.com"
            className="flex items-center gap-1 hover:text-yellow-500 transition"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">121@taxlegit.com</span>
          </a>

          <a
            href="tel:+918929218091"
            className="flex items-center gap-1 hover:text-gray-100 transition"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">+91 8929218091</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;

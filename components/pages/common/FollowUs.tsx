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
import Link from "next/link";

const socials = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/Taxlegitt/",
    icon: FaFacebookF,
  },
  {
    name: "Twitter",
    href: "https://x.com/taxlegit",
    icon: FaTwitter,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/taxlegit_/",
    icon: FaInstagram,
  },
  {
    name: "LinkedIn",
    href: "https://pinterest.com",
    icon: FaLinkedinIn,
  },
  {
    name: "Youtube",
    href: "https://www.youtube.com/channel/UC4s7kcn1qt7np_Ccce5hmHA",
    icon: FaYoutube,
  },
];

export default function FollowUs() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-900">
        Follow Taxlegit on
      </h3>

      <ul className="divide-y divide-slate-100">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <li key={social.name}>
              <Link
                href={social.href}
                target="_blank"
                className="flex items-center justify-between py-3 text-sm text-slate-700 hover:text-indigo-600 transition"
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {social.name}
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Follow
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

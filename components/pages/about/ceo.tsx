import Image from "next/image";
import { FaLinkedinIn, FaTwitter } from "react-icons/fa";

export default function LeadershipTeam() {
  return (
    <section className="bg-purple-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="mt-4 text-4xl font-extrabold text-gray-900">
            Heart Behind Taxlegit
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            At Taxlegit, our leadership drives innovation, transparency, and
            customer-first solutions for businesses across India.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-10 md:grid-cols-2">
          {/* Ashutosh Aggarwal */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="flex gap-6">
              <Image
                src="/team/ashutosh.jpg"
                alt="Ashutosh Aggarwal"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />

              <div className="flex-1">
                <span className="text-sm font-medium text-purple-600">
                  Co-Founder & CEO
                </span>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  Ashutosh Aggarwal
                </h3>

                <hr className="my-4" />

                <p className="text-sm text-gray-600">
                  Ashutosh leads Taxlegit with a strong vision to simplify
                  compliance, registrations, and legal processes for startups
                  and growing businesses.
                </p>

                {/* Socials */}
                <div className="mt-4 flex gap-3">
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border text-purple-600 transition hover:bg-purple-600 hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn size={16} />
                  </a>

                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border text-purple-600 transition hover:bg-purple-600 hover:text-white"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Vipul Sharma */}
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="flex gap-6">
              <Image
                src="/team/vipul.jpg"
                alt="Vipul Sharma"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />

              <div className="flex-1">
                <span className="text-sm font-medium text-purple-600">
                  Co-Founder & CEO
                </span>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  Vipul Sharma
                </h3>

                <hr className="my-4" />

                <p className="text-sm text-gray-600">
                  Vipul focuses on operational excellence and technology-driven
                  solutions to deliver seamless experiences for Taxlegit
                  clients.
                </p>

                {/* Socials */}
                <div className="mt-4 flex gap-3">
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border text-purple-600 transition hover:bg-purple-600 hover:text-white"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn size={16} />
                  </a>

                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full border text-purple-600 transition hover:bg-purple-600 hover:text-white"
                    aria-label="Twitter"
                  >
                    <FaTwitter size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

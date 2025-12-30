import { Target, Eye, Heart } from "lucide-react";

export default function MissionVisionValues() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 items-center">
          {/* LEFT – CARDS */}
          <div className="space-y-6">
            {/* Mission */}
            <div className="flex items-start gap-5 rounded-xl bg-gradient-to-b from-[#F7F2F8] to-[#EFE4EF]  p-6 text-black shadow-lg">
              <div className="rounded-lg bg-white/20 p-3">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Our Mission</h3>
                <p className="mt-1 text-sm text-gray-800">
                  To simplify legal, tax, and compliance services for startups
                  and businesses with transparency and speed.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="flex items-start gap-5 rounded-xl bg-gradient-to-b from-[#F7F2F7] to-[#EFE4EF]  p-6 text-black shadow-lg">
              <div className="rounded-lg bg-white/20 p-3">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Our Vision</h3>
                <p className="mt-1 text-sm text-gray-800">
                  To become India’s most trusted digital platform for business
                  registrations and compliance solutions.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="flex items-start gap-5 rounded-xl bg-gradient-to-b from-[#F7F2F7] to-[#EFE4EF] p-6 text-black shadow-lg">
              <div className="rounded-lg bg-white/20 p-3">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Our Values</h3>
                <p className="mt-1 text-sm text-gray-800">
                  Integrity, customer-first approach, accountability, and
                  continuous innovation.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT – CONTENT */}
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">
              Mission, Vision <br />
              <span className="text-purple-700">& Values</span>
            </h2>

            <p className="mt-4 max-w-md text-gray-600">
              These principles define who we are, guide how we work, and shape
              every decision we make for our clients and partners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

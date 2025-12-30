import Image from "next/image";

export default function AboutUsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-purple-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* LEFT – IMAGE STACK */}
          <div className="relative">
            <div className="relative z-10 w-full overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/step4.png" // replace with your image
                alt="TaxLegit Team"
                width={600}
                height={500}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>

            {/* Floating Image */}
            <div className="absolute -bottom-12 -left-12 z-20 hidden w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg lg:block">
              <Image
                src="/business.gif" // replace with your image
                alt="Client Support"
                width={260}
                height={200}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>

            {/* Badge */}
            <div className="absolute right-1 -top-16 z-20 rounded-2xl bg-purple-600 px-6 py-4 text-center text-white shadow-lg">
              <p className="text-sm font-medium">Trusted by</p>
              <p className="text-xl font-bold">10,000+</p>
              <p className="text-sm">Businesses</p>
            </div>
          </div>

          {/* RIGHT – CONTENT */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-600">
              About Us
            </p>

            <h2 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900">
              Committed Towards Building a Robust Future – Empowering
              Entrepreneurs
            </h2>

            <p className="mb-6 text-slate-700">
              At <strong>TaxLegit</strong>, we believe that dealing with legal
              compliance and paperwork can be overwhelming — so we’re here to
              make things easier. Our mission is simple: to help you launch,
              grow, and manage your business hassle-free.
            </p>

            {/* KEY SERVICES */}
            <div className="mb-8 space-y-4">
              <ServiceItem
                title="Simple Business Setup"
                description="Register your business online quickly and affordably."
              />
              <ServiceItem
                title="Effortless Compliance"
                description="From GST to annual returns — we handle the paperwork."
              />
              <ServiceItem
                title="Expert Guidance"
                description="Friendly experts providing clear answers and real solutions."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- */
/* Reusable Service Item Component */
/* ---------------------------------- */
function ServiceItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-white">
        ✓
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="text-slate-700">{description}</p>
      </div>
    </div>
  );
}

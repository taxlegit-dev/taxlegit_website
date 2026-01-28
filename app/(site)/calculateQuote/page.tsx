import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";
export default function HeroPage() {
  return (
    <div className="bg-white">
      <section className="relative h-[400px] w-full overflow-hidden">
        {/* Background Image */}
        <Image
          src="/about/hero3.png" // 👉 replace with your image path
          alt="Calculate Quote"
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
              <span className="text-white">Calculate Quote</span>
            </nav>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Calculate Quote
            </h1>
          </div>
        </div>
      </section>
      <section className="relative min-h-screen w-full">
  <iframe
    src="https://taxlegit-calculator.vercel.app/"
    className="w-full min-h-screen border-0"
  />
</section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

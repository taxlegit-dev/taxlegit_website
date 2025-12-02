import Link from "next/link";
import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { RegionSwitcher } from "@/components/navigation/region-switcher";
import { toSupportedRegion } from "@/lib/regions";
import Image from "next/image";

type NavbarProps = {
  region: Region;
};

export async function Navbar({ region }: NavbarProps) {
  const navItems = await prisma.navbarItem.findMany({
    where: { region, isActive: true },
    orderBy: { order: "asc" },
  });

  const mappedRegion = toSupportedRegion(region);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6">
        {/* Logo */}
        <Link
          href={region === Region.US ? "/us" : "/"}
          className="flex items-center gap-2.5"
        >
          <svg
            className="h-[42px] w-[42px]"
            viewBox="0 0 50 50"
            fill="none"
          >
            <rect x="10" y="4" width="30" height="3.5" fill="#DC2626" rx="1" />
            <circle cx="15" cy="18" r="5.5" stroke="#DC2626" strokeWidth="2" fill="none" />
            <circle cx="35" cy="18" r="5.5" stroke="#DC2626" strokeWidth="2" fill="none" />
            <rect x="23.5" y="13" width="3" height="10" fill="#DC2626" />
            <path d="M10 32 L25 26 L40 32" stroke="#DC2626" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
          <span className="text-[26px] font-bold leading-none tracking-tight text-[#1a1a1a]">
            <Image
              src="./logo/taxlegitlogo.webp"
              alt="My Logo"
              width={200}
              height={200}
            />
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-[42px] lg:flex">
          <Link
            href="/start-business"
            className="text-[15px] font-medium tracking-normal text-[#333333] transition-colors hover:text-black"
          >
            Start A Business
          </Link>
          <Link
            href="/grow-business"
            className="text-[15px] font-medium tracking-normal text-[#333333] transition-colors hover:text-black"
          >
            Grow Your Business
          </Link>
          <Link
            href="/blog"
            className="text-[15px] font-medium tracking-normal text-[#333333] transition-colors hover:text-black"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-[15px] font-medium tracking-normal text-[#333333] transition-colors hover:text-black"
          >
            About Us
          </Link>
        </nav>

        {/* Right Section - Country Selector & Phone */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <RegionSwitcher currentRegion={mappedRegion} />
          </div>

          <Link
            href="tel:+918929218091"
            className="flex h-[44px] items-center gap-2.5 rounded-[6px] bg-[#EF4444] px-5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#DC2626]"
          >
            <svg
              className="h-[18px] w-[18px]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="whitespace-nowrap">+91-8929218091</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
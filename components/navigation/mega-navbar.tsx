"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Region } from "@prisma/client";
import { RegionSwitcher } from "@/components/navigation/region-switcher";
import { toSupportedRegion } from "@/lib/regions";
import Image from "next/image";

type NavbarItem = {
  id: string;
  label: string;
  href: string | null;
  type: string;
  isLoginLink: boolean;
  order: number;
  groups: Array<{
    label: string | null;
    items: Array<{
      id: string;
      label: string;
      href: string | null;
      order: number;
    }>;
  }>;
};

type MegaNavbarProps = {
  region: Region;
  initialItems: NavbarItem[];
};

export function MegaNavbar({ region, initialItems }: MegaNavbarProps) {
  const pathname = usePathname();

  return (
    <MegaNavbarContent
      key={pathname}
      region={region}
      items={initialItems}
    />
  );
}

function MegaNavbarContent({
  region,
  items,
}: {
  region: Region;
  items: NavbarItem[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const mappedRegion = toSupportedRegion(region);
  const regionPrefix = region === Region.US ? "/us" : "";

  const displayItems =
    region === Region.INDIA
      ? [
          ...items,
          {
            id: "static-other",
            label: "Other",
            href: null,
            type: "DROPDOWN",
            isLoginLink: false,
            order: 999,
            groups: [
              {
                label: "Other",
                items: [
                  { id: "other-calculate-quote", label: "Calculate Quote", href: "/calculateQuote", order: 1 },
                  { id: "other-namecheck", label: "Namecheck", href: "/nameCheck", order: 5 },
                  { id: "other-contact", label: "Contact", href: "/contact-us", order: 2 },
                  { id: "other-about", label: "About", href: "/about", order: 3 },
                  { id: "other-blog", label: "Blog", href: "/blog", order: 4 },
                ],
              },
            ],
          },
        ]
      : items;

  const toggleMobileItem = (itemId: string) => {
    setOpenMobileItem(openMobileItem === itemId ? null : itemId);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-b from-[#E6D3E6] to-white">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6">
        {/* Logo */}
        <Link href={region === Region.US ? "/us" : "/"} className="flex items-center gap-2.5">
          <Image
            src="/logo/taxlegitlogo.webp"
            alt="My Logo"
            width={70}
            height={70}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-[42px] lg:flex">
          {displayItems.map((item) =>
            item.type === "DROPDOWN" ? (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button className="flex items-center gap-x-1.5 py-2 text-lg font-medium text-[#333333] hover:text-black">
                  {item.label}
                  <svg
                    className={`h-3.5 w-3.5 transition-transform ${
                      hoveredItem === item.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {hoveredItem === item.id && (
                  <div
                    className={`absolute top-full z-[100] rounded-xl border border-zinc-100 bg-white/95 backdrop-blur-sm shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8 ${
                      item.id === "static-other"
                        ? "left-0 w-max min-w-[220px]"
                        : "left-4 right-4 lg:left-1/2 lg:w-[900px] lg:-translate-x-1/2"
                    }`}
                  >
                    <div
                      className={
                        item.id === "static-other"
                          ? "grid grid-cols-1 gap-3"
                          : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
                      }
                    >
                      {item.groups.map((group, i) => (
                        <div key={i} className="space-y-2">
                          {group.label && (
                            <h3 className="border-b border-zinc-100 pb-2 text-[14px] font-semibold uppercase tracking-wider text-zinc-500">
                              {group.label}
                            </h3>
                          )}
                          <ul>
                            {group.items.map((subItem) => (
                              <li key={subItem.id}>
                                <Link
                                  href={`${regionPrefix}${subItem.href}`}
                                  className="block rounded-lg px-3 py-1 text-[14px] font-medium text-zinc-700 transition hover:bg-[#E6D3E6] hover:text-black"
                                >
                                  {subItem.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.id}
                href={`${regionPrefix}${item.href}`}
                className="text-[18px] font-medium text-[#333333] hover:text-black"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Link
            href="tel:+918929218091"
            className="hidden h-[44px] items-center gap-2.5 rounded-[6px] bg-purple-600 px-5 text-[15px] font-semibold text-white shadow-sm hover:bg-purple-700 lg:flex"
          >
            Schedule a call
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 lg:hidden"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <div className="mx-auto max-w-[1400px] space-y-2 px-6 py-4">
            {displayItems.map((item) =>
              item.type === "DROPDOWN" ? (
                <div key={item.id}>
                  <button
                    onClick={() => toggleMobileItem(item.id)}
                    className="flex w-full justify-between px-4 py-3 text-[15px] font-medium"
                  >
                    {item.label}
                  </button>
                  {openMobileItem === item.id &&
                    item.groups.map((group, i) => (
                      <ul key={i} className="px-4">
                        {group.items.map((sub) => (
                          <li key={sub.id}>
                            <Link
                              href={`${regionPrefix}${sub.href}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block py-2 text-[14px]"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ))}
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={`${regionPrefix}${item.href}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[15px]"
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Mobile Region Switcher & Phone */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <RegionSwitcher currentRegion={mappedRegion} />
              <Link
                href="tel:+918929218091"
                className="flex h-[44px] w-full items-center justify-center gap-2.5 rounded-[6px] bg-purple-600 px-5 text-[15px] font-semibold text-white shadow-sm hover:bg-[#DC2626]"
              >
                Schedule a call
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

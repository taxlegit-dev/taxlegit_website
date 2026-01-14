"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
    <MegaNavbarContent key={pathname} region={region} items={initialItems} />
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

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // ✅ close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setHoveredItem(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ close dropdown on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHoveredItem(null);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ✅ close mobile menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
        setOpenMobileItem(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                {
                  id: "other-calculate-quote",
                  label: "Calculate Quote",
                  href: "/calculateQuote",
                  order: 1,
                },
                {
                  id: "other-namecheck",
                  label: "Namecheck",
                  href: "/nameCheck",
                  order: 5,
                },
                {
                  id: "other-contact",
                  label: "Contact",
                  href: "/contact-us",
                  order: 2,
                },
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
    <header className="fixed top-10 left-0 right-0 z-50 w-full bg-gradient-to-b from-[#E6D3E6] to-white">
      <div ref={wrapperRef} className="relative">
        <div className="mx-auto flex h-[70px] max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          {/* Logo */}
          <Link
            href={region === Region.US ? "/us" : "/"}
            className="flex shrink-0 items-center gap-2.5"
          >
            <Image
              src="/logo/taxlegitlogo.webp"
              alt="Taxlegit Logo"
              width={70}
              height={70}
              priority
            />
          </Link>

          {/* ✅ DESKTOP NAV ONLY */}
          <nav className="hidden items-center gap-8 lg:flex">
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
                      className={`h-3.5 w-3.5 transition-transform ${hoveredItem === item.id ? "rotate-180" : ""
                        }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
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
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="tel:+918929218091"
              className="hidden h-[44px] items-center gap-2.5 rounded-[6px] bg-purple-600 px-5 text-[15px] font-semibold text-white shadow-sm hover:bg-purple-700 lg:flex"
            >
              Schedule a call
            </Link>

            {/* ✅ MOBILE HAMBURGER ONLY */}
            <button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className="lg:hidden rounded-md border border-purple-200 bg-white/80 px-3 py-2 text-[20px] font-bold text-purple-800 shadow-sm backdrop-blur hover:bg-white"
  aria-label="Toggle menu"
>
  {isMobileMenuOpen ? "✕" : "☰"}
</button>


          </div>
        </div>

        {/* ✅ DESKTOP DROPDOWN PANEL ONLY */}
        <div className="hidden lg:block">
          {hoveredItem &&
            displayItems
              .filter((it) => it.type === "DROPDOWN" && it.id === hoveredItem)
              .map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="fixed left-1/2 top-[120px] z-[999] w-[95vw] max-w-[900px] -translate-x-1/2 rounded-xl border border-zinc-100 bg-white/95 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:p-8"
                  style={{
                    maxHeight: "calc(100vh - 150px)",
                    overflowY: "auto",
                  }}
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
                                className="block rounded-lg px-3 py-2 text-[14px] font-medium text-zinc-700 transition hover:bg-[#E6D3E6] hover:text-black"
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
              ))}
        </div>

        {/* ✅ MOBILE MENU DRAWER */}
{isMobileMenuOpen && (
  <>
    {/* Backdrop */}
    <div
      className="fixed inset-0 z-[998]  lg:hidden"
      onClick={() => setIsMobileMenuOpen(false)}
    />

    {/* Drawer */}
    <div className="fixed right-0 top-[110px] z-[999] h-[calc(100vh-110px)] w-full overflow-hidden bg-gradient-to-b from-[#E6D3E6] to-white lg:hidden">
      {/* Scroll area */}
      <div className="h-full overflow-y-auto overscroll-contain px-4 py-4">
        <div className="mx-auto max-w-[500px] space-y-2">
          {displayItems.map((item) =>
            item.type === "DROPDOWN" ? (
              <div key={item.id} className="rounded-xl bg-white/85 shadow-sm">
                <button
                  onClick={() => toggleMobileItem(item.id)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-[14px] font-semibold text-zinc-900"
                >
                  {item.label}
                  <span
                    className={`text-[14px] transition-transform ${
                      openMobileItem === item.id ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {openMobileItem === item.id &&
                  item.groups.map((group, i) => (
                    <div key={i} className="space-y-1 px-4 pb-3">
                      {group.label && (
                        <div className="pt-1 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                          {group.label}
                        </div>
                      )}

                      <ul className="list-none space-y-1">
                        {group.items.map((sub) => (
                          <li key={sub.id} className="list-none">
                            <Link
                              href={`${regionPrefix}${sub.href}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block rounded-lg px-3 py-2 text-[13px] font-medium text-zinc-800 hover:bg-[#E6D3E6]"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ) : (
              <Link
                key={item.id}
                href={`${regionPrefix}${item.href}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-xl bg-white/85 px-4 py-2.5 text-[14px] font-semibold text-zinc-900 shadow-sm"
              >
                {item.label}
              </Link>
            )
          )}

          {/* bottom section */}
          <div className="space-y-3 border-t border-purple-200 pt-4">
            <RegionSwitcher currentRegion={mappedRegion} />
            <Link
              href="tel:+918929218091"
              className="flex h-[42px] w-full items-center justify-center rounded-xl bg-purple-600 text-[14px] font-semibold text-white shadow-sm hover:bg-purple-700"
            >
              Schedule a call
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
)}


      </div>
    </header>
  );
}

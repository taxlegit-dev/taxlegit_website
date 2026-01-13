"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ZohoChat() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) {
      // hide widget if already loaded
      const zohoWidget = document.getElementById("zsiq_float");
      if (zohoWidget) zohoWidget.style.display = "none";

      return;
    }

    // if coming back from admin to normal routes, re-show widget
    const zohoWidget = document.getElementById("zsiq_float");
    if (zohoWidget) zohoWidget.style.display = "block";
  }, [isAdminRoute, pathname, searchParams]);

  // don't load scripts at all in admin
  if (isAdminRoute) return null;

  return (
    <>
      <Script id="zoho-init" strategy="afterInteractive">
        {`
          window.$zoho = window.$zoho || {};
          $zoho.salesiq = $zoho.salesiq || { ready: function(){} };
        `}
      </Script>

      <Script
        id="zoho-salesiq"
        src="https://salesiq.zohopublic.com/widget?wc=siq0e51e73d307d4571c5cde2ed5c2d585af9a0b468d06b8658f9486e3b3d6ff665"
        strategy="afterInteractive"
      />
    </>
  );
}

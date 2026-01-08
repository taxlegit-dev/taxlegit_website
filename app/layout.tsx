import type { Metadata } from "next";
import "./globals.css";
import { ProviderTree } from "@/components/providers/provider-tree";
import "aos/dist/aos.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Taxlegit | Compliance and Registration",
  description:
    "Region-aware legal, tax and compliance workflows for India and the United States.",
  metadataBase: new URL("https://taxlegit.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black antialiased">
        <ProviderTree>
          {children}
        </ProviderTree>
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
      </body>
    </html>
  );
}

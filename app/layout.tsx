import type { Metadata } from "next";
import "./globals.css";
import { ProviderTree } from "@/components/providers/provider-tree";
import "aos/dist/aos.css";
import ZohoChat from "@/components/zoho/ZohoChat";
import { Suspense } from "react";

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
        <Suspense fallback={null}>
          <ZohoChat />
        </Suspense>
      </body>
    </html>
  );
}

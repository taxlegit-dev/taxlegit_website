import { Region } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProviderTree } from "@/components/providers/provider-tree";
import { NavbarServer } from "@/components/navigation/navbar-server";
import Footer from "@/components/footer";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taxlegit | Compliance and Registration",
  description: "Region-aware legal, tax and compliance workflows for India and the United States.",
  metadataBase: new URL("https://taxlegit.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const region = Region.INDIA;

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-white text-black antialiased">
        <ProviderTree>
          <NavbarServer region={region} />
          {children}

          <Footer />
        </ProviderTree>
      </body>
    </html>
  );
}

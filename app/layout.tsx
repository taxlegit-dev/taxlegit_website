import type { Metadata } from "next";
import { Geist, Geist_Mono, PT_Serif, Tagesschrift } from "next/font/google";
import "./globals.css";
import { ProviderTree } from "@/components/providers/provider-tree";
import "aos/dist/aos.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
});
const tagesschrift = Tagesschrift({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-tagesschrift",
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ptSerif.variable}${tagesschrift.variable}`}
    >
      <body className="min-h-screen bg-white text-black antialiased">
        <ProviderTree>{children}</ProviderTree>
      </body>
    </html>
  );
}

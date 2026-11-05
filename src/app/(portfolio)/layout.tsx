import type { Metadata } from "next";
import { Source_Sans_3, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/portfolio";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  alternates: { canonical: "/portfolio" },
  title: "Kodjo Mathias Akah | Network & Systems Portfolio",
  description:
    "The technical portfolio of Kodjo Mathias Akah and project showcase of Neoxix Inc., focused on practical networking, systems, security, and automation.",
  keywords: [
    "Kodjo Mathias Akah",
    "Neoxix",
    "network technician",
    "systems administration",
    "infrastructure",
    "homelab",
  ],
  authors: [{ name: "Kodjo Mathias Akah" }],
  creator: "Kodjo Mathias Akah",
  openGraph: {
    title: "Kodjo Mathias Akah | Network & Systems Portfolio",
    description:
      "Practical networking, systems, security, and automation projects.",
    type: "website",
    locale: "en_CA",
    siteName: "Neoxix",
    url: "/portfolio",
  },
  twitter: {
    card: "summary",
    title: "Kodjo Mathias Akah | Network & Systems Portfolio",
    description:
      "Practical networking, systems, security, and automation projects.",
  },
  robots: { index: true, follow: true },
  category: "technology",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${spaceGrotesk.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

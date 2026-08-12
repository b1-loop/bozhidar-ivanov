import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Bozhidar Ivanov — Fullstack Developer",
  description:
    "Fullstack Developer i Göteborg. C#/.NET, React, Blazor. En resa från fabriksgolvet till kod — driven av disciplin och detalj.",
  metadataBase: new URL("https://bozhidar-ivanov.vercel.app"),
  openGraph: {
    title: "Bozhidar Ivanov — Fullstack Developer",
    description:
      "En resa från fabriksgolvet till kod. Fullstack Developer med fokus på C#/.NET och Clean Architecture.",
    type: "website",
    locale: "sv_SE",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}

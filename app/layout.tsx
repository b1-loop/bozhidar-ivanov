import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ScrollProgress } from "@/components/scroll-progress";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";
import { LocaleProvider } from "@/lib/i18n";

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
    "Fullstack Developer in Gothenburg. C#/.NET, React, Blazor. A journey from the factory floor to code — driven by discipline and detail.",
  metadataBase: new URL("https://bozhidar-ivanov.vercel.app"),
  openGraph: {
    title: "Bozhidar Ivanov — Fullstack Developer",
    description:
      "A journey from the factory floor to code. Fullstack Developer focused on C#/.NET and Clean Architecture.",
    type: "website",
    locale: "en_US",
    siteName: "Bozhidar Ivanov",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bozhidar Ivanov — Fullstack Developer",
    description:
      "A journey from the factory floor to code. Fullstack Developer focused on C#/.NET and Clean Architecture.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <body>
        <LocaleProvider>
          <ScrollProgress />
          <SmoothScroll>{children}</SmoothScroll>
          <KeyboardShortcuts />
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { MotionConfig } from "framer-motion";
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
  title: "Bozhidar Ivanov — Fullstack .NET Developer · AI-Driven Platforms",
  description:
    "Fullstack .NET developer and software engineer in Gothenburg, building AI-driven platforms. C#/.NET, React, Next.js, plus LLM agents with tool calling, local models and voice. A journey from the factory floor to code — driven by discipline and detail.",
  metadataBase: new URL("https://bozhidar-ivanov.vercel.app"),
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Bozhidar Ivanov — Fullstack .NET Developer · AI-Driven Platforms",
    description:
      "A journey from the factory floor to code. Fullstack .NET developer and software engineer building AI-driven platforms.",
    type: "website",
    locale: "en_US",
    siteName: "Bozhidar Ivanov",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bozhidar Ivanov — Fullstack .NET Developer · AI-Driven Platforms",
    description:
      "A journey from the factory floor to code. Fullstack .NET developer and software engineer building AI-driven platforms.",
  },
};

export const viewport: Viewport = {
  themeColor: "#06060a",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Skip the boot intro before first paint for reduced-motion visitors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="skip"}catch(e){}`,
          }}
        />
        <noscript>
          <style>{`.boot-intro{display:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <MotionConfig reducedMotion="user">
          <LocaleProvider>
            <ScrollProgress />
            <SmoothScroll>{children}</SmoothScroll>
            <KeyboardShortcuts />
          </LocaleProvider>
        </MotionConfig>
        <Analytics />
      </body>
    </html>
  );
}

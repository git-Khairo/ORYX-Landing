import type { Metadata, Viewport } from "next";
import {
  Geist,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";

/* Display voice. One weight, plus italic for emphasis inside a
   headline: emphasis stays in the same family, it never switches to a
   second typeface. */
const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500"],
});

// Loaded now so Arabic can be switched on without a type migration.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-plex-arabic",
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oryx.nl"),
  title: {
    default: "ORYX. Always Ready.",
    template: "%s. ORYX",
  },
  description:
    "Transportation, cleaning and facility management, managed as one reliable operational partnership for businesses in the Netherlands.",
  keywords: [
    "facility management Netherlands",
    "commercial cleaning Netherlands",
    "B2B transportation and delivery",
    "operational services partner",
  ],
  openGraph: {
    title: "ORYX. Always Ready.",
    description:
      "We take care of your operations, so you can focus on your business.",
    type: "website",
    locale: "en_NL",
    siteName: "ORYX",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1c1c1a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${instrument.variable} ${geist.variable} ${geistMono.variable} ${plexArabic.variable}`}
    >
      <body data-tone="cream">
        <a
          href="#main"
          className="control sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[200] focus:bg-charcoal focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>
        {children}
        <noscript>
          <p className="noscript-note">
            This experience uses motion to explain how ORYX works. The full
            content is available with JavaScript enabled. Reach us directly at
            hello@oryx.nl.
          </p>
        </noscript>
      </body>
    </html>
  );
}

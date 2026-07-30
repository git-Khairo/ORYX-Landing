import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

/**
 * One family, three jobs.
 *
 * Instrument Serif plus Geist plus Geist Mono was three typefaces
 * doing the work of one, and that particular stack is a very legible
 * design-agency signature, which is part of what read as corporate.
 *
 * Archivo is variable on both weight (100-900) and width (62-125).
 * The width axis is what makes it a system rather than a font:
 * expanded carries display, normal carries reading, condensed carries
 * operational labels and numerals. That last one replaces the
 * monospace without wearing a monospace costume.
 *
 * `wght` is variable by default; `wdth` has to be asked for.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

/* IBM Plex Sans Arabic was being downloaded on every page load and
   rendered nowhere. It comes back when Arabic actually ships. */

export const metadata: Metadata = {
  metadataBase: new URL("https://oryx.nl"),
  title: {
    default: "ORYX. Always Ready.",
    template: "%s. ORYX",
  },
  description:
    "One operational partner for transportation, cleaning and facility management: people, operations and reporting, run as one agreement for businesses in the Netherlands.",
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
  icons: {
    icon: "/brand/logo.jpg",
    shortcut: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#f2f1ef",
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
    /* data-palette selects one of the three candidate palettes in
       tokens.css. It is deliberately server-rendered rather than set
       by script, so the first paint is already the right colour and
       there is no flash. Swapping this one attribute restyles the DOM
       and recolours the 3D in the same frame. */
    /* suppressHydrationWarning is required, not lazy.
       The script below deliberately rewrites data-palette before React
       hydrates, so the server markup and the live DOM genuinely differ
       on that one attribute. This is the standard escape hatch for a
       pre-paint theme script, and it is scoped to this element only:
       mismatches anywhere inside still warn normally. */
    <html
      lang="en"
      dir="ltr"
      data-palette="sand"
      className={archivo.variable}
      suppressHydrationWarning
    >
      <head>
        {/*
          Palette override from the URL, for the review gate.
          ?palette=sand | steel | paper

          Inline and blocking on purpose. Doing this in an effect would
          paint the default palette first and then snap, which is
          exactly the wrong impression to give someone who is being
          asked to choose between three. It runs before first paint,
          so each link simply opens in its own colour.

          It only ever writes one of three known values onto an
          attribute, so there is nothing here a URL can inject.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=new URLSearchParams(location.search).get('palette');if(p==='sand'||p==='steel'||p==='paper'){document.documentElement.setAttribute('data-palette',p);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="control sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[200] focus:bg-[color:var(--accent)] focus:px-5 focus:py-3 focus:text-sm focus:text-[color:var(--accent-ink)]"
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

import type { Metadata } from "next";
import localFont from "next/font/local";
import { Antic_Didone } from "next/font/google";
import { CaptureMode } from "@/components/capture-mode";
import { LangProvider } from "@/lib/i18n";
import "./globals.css";

const neueMontreal = localFont({
  src: "../../public/fonts/NeueMontreal-Bold.woff2",
  variable: "--font-sans",
  weight: "700",
  display: "swap",
});

// Antic Didone (Google Fonts, SIL OFL) — modern Didone serif with
// high stroke contrast. Drives --font-display: all headlines,
// narrative-* classes, eyebrows, hero tagline, CTA labels, etc.
const anticDidone = Antic_Didone({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const imperialScript = localFont({
  src: "../../public/fonts/ImperialScript-Regular.woff2",
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

const cambrineStitched = localFont({
  src: "../../public/fonts/CambrineStitched-Regular.woff2",
  variable: "--font-wordmark",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nototeka — The Resonance Edition",
  description:
    "Digital Archive of Sounds of Traditional Albanian Instruments. Ten ancient lineages, distilled into fifty distinct auditory shadows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${neueMontreal.variable} ${anticDidone.variable} ${imperialScript.variable} ${cambrineStitched.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-g1 text-g7">
        <CaptureMode />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}

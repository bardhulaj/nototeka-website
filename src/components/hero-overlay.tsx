"use client";

import Image from "next/image";
import { useLang } from "@/lib/i18n";

/**
 * Hero wordmark, tagline and CTAs, rendered as a ROOT-LEVEL fixed overlay
 * (a sibling of <main>, alongside <SiteHeader> and <OkarinaPlayer>) instead of
 * inside the hero <section>.
 *
 * Why: a full-bleed hero background <video> gets promoted to Safari's hardware
 * "media overlay" compositing plane, which paints above any sibling content in
 * the same subtree regardless of z-index. In-section hero text was therefore
 * invisible in Safari (it rendered fine in Chrome). The header (z-50) and the
 * okarina player (z-30) are root-level fixed layers and sit above the video
 * correctly — this overlay uses the same approach so the text/CTAs do too.
 *
 * It fades out as the user scrolls via the --hero-content-opacity custom
 * property set by <Hero>. The whole layer is pointer-events-none so the
 * (placeholder, non-functional) CTAs never block scrolling or clicks beneath it.
 */
export function HeroOverlay() {
  const { t } = useLang();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-20 flex items-center"
      style={{
        opacity: "var(--hero-content-opacity, 1)",
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: "transform, opacity",
      }}
    >
      {/* ── Mobile layout: stacked, centered ── */}
      <div className="flex w-full flex-col items-center gap-6 px-6 text-center sm:px-10 md:hidden">
        <h1 className="leading-none">
          <Image
            src="/icons/nototeka-logo.svg"
            alt="Nototeka"
            unoptimized
            priority
            width={300}
            height={56}
            style={{ height: "clamp(2.5rem, 12vw, 3.5rem)", width: "auto", maxWidth: "80vw" }}
          />
        </h1>
        <p
          className="narrative-3 opacity-80 max-w-[28ch]"
          style={{ fontSize: "clamp(1rem, 4.5vw, 1.375rem)", lineHeight: "1.15" }}
        >
          {t.tagline}
        </p>
        <div className="flex justify-center gap-2">
          {/* Download CTA */}
          <span
            role="button"
            aria-label={t.download}
            aria-disabled="true"
            className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2"
            style={{
              background: "linear-gradient(180deg, rgba(255,252,248,0.55) 0%, rgba(255,246,236,0.28) 100%)",
              backdropFilter: "blur(24px) saturate(150%)",
              WebkitBackdropFilter: "blur(24px) saturate(150%)",
              color: "#171717",
            }}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v9" /><path d="M4 7l4 4 4-4" /><path d="M2 14h12" />
            </svg>
            <span className="font-display" style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>{t.download}</span>
          </span>
          {/* Listen CTA */}
          <span
            role="button"
            aria-label={t.listen}
            aria-disabled="true"
            className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2"
            style={{
              background: "linear-gradient(180deg, rgba(255,252,248,0.4) 0%, rgba(255,246,236,0.15) 100%)",
              backdropFilter: "blur(24px) saturate(150%)",
              WebkitBackdropFilter: "blur(24px) saturate(150%)",
              color: "#171717",
            }}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3" fill="currentColor">
              <path d="M4 2.5v11l9-5.5L4 2.5z" />
            </svg>
            <span className="font-display" style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>{t.listen}</span>
          </span>
        </div>
      </div>

      {/* ── Desktop layout: 3-column grid ── */}
      <div className="hidden w-full px-6 sm:px-10 md:block lg:px-16">
        {/* Constrain width so the three hero elements sit closer together */}
        <div className="mx-auto w-[78%]">
          {/* Row 1: Logo | (okarina space) | Tagline */}
          <div
            className="grid w-full items-center"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            <div className="flex items-center justify-center">
              <h1 className="leading-none">
                <Image
                  src="/icons/nototeka-logo.svg"
                  alt="Nototeka"
                  unoptimized
                  priority
                  width={400}
                  height={83}
                  style={{ height: "clamp(3.25rem, 9.1vw, 5.2rem)", width: "auto", maxWidth: "100%" }}
                />
              </h1>
            </div>
            <div />
            <div className="flex items-center justify-center text-center">
              <p
                className="narrative-3 opacity-80"
                style={{ fontSize: "1.625rem", lineHeight: "1.1" }}
              >
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Row 2: CTAs under the tagline */}
          <div
            className="mt-8 grid w-full"
            style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
          >
            <div /><div />
            <div className="flex justify-center gap-2">
              <span
                role="button"
                aria-label={t.download}
                aria-disabled="true"
                className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2"
                style={{
                  background: "linear-gradient(180deg, rgba(255,252,248,0.55) 0%, rgba(255,246,236,0.28) 100%)",
                  backdropFilter: "blur(24px) saturate(150%)",
                  WebkitBackdropFilter: "blur(24px) saturate(150%)",
                  color: "#171717",
                }}
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 2v9" /><path d="M4 7l4 4 4-4" /><path d="M2 14h12" />
                </svg>
                <span className="font-display" style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>{t.download}</span>
              </span>
              <span
                role="button"
                aria-label={t.listen}
                aria-disabled="true"
                className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2"
                style={{
                  background: "linear-gradient(180deg, rgba(255,252,248,0.4) 0%, rgba(255,246,236,0.15) 100%)",
                  backdropFilter: "blur(24px) saturate(150%)",
                  WebkitBackdropFilter: "blur(24px) saturate(150%)",
                  color: "#171717",
                }}
              >
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3" fill="currentColor">
                  <path d="M4 2.5v11l9-5.5L4 2.5z" />
                </svg>
                <span className="font-display" style={{ fontSize: "0.9375rem", letterSpacing: "-0.01em" }}>{t.listen}</span>
              </span>
            </div>
          </div>
        </div>{/* end mx-auto w-[78%] */}
      </div>
    </div>
  );
}

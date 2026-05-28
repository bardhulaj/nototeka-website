"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLang } from "@/lib/i18n";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLang();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    const update = () => {
      const p = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));
      section.style.setProperty("--hero-p", String(p));
      document.documentElement.style.setProperty("--hero-p", String(p));
    };
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Hero"
      className="relative isolate overflow-hidden bg-g1 text-g7"
      style={{ height: "100svh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden bg-g1">
        {/* Subtle top gradient for navbar contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.12) 60%, transparent)" }}
        />

        {/* Hero background video */}
        <video
          src="/videos/hero-bg.mp4"
          autoPlay muted loop playsInline preload="metadata"
          poster="/images/hero/hero-desktop.jpg"
          aria-hidden="true"
          disablePictureInPicture disableRemotePlayback
          className="absolute inset-0 size-full object-cover"
        />

        {/* ── Mobile layout: stacked, centered ── */}
        <div
          className="relative z-10 flex w-full flex-col items-center gap-6 px-6 text-center sm:px-10 md:hidden"
          style={{ opacity: "max(0, calc(1 - var(--hero-p, 0) * 1.4))" }}
        >
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
            <a
              href="#"
              role="button"
              aria-label={t.download}
              aria-disabled="true"
              tabIndex={0}
              className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 no-underline transition-transform duration-300 hover:scale-[1.03]"
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
            </a>
            {/* Listen CTA */}
            <a
              href="#"
              role="button"
              aria-label={t.listen}
              aria-disabled="true"
              tabIndex={0}
              className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 no-underline transition-transform duration-300 hover:scale-[1.03]"
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
            </a>
          </div>
        </div>

        {/* ── Desktop layout: 3-column grid ── */}
        <div
          className="relative z-10 hidden w-full px-6 sm:px-10 md:block lg:px-16"
          style={{
            opacity: "max(0, calc(1 - var(--hero-p, 0) * 1.4))",
            transform: "translateZ(0)",  /* force GPU layer above Safari's HW video */
          }}
        >
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
              <a
                href="#"
                role="button"
                aria-label={t.download}
                aria-disabled="true"
                tabIndex={0}
                className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 no-underline transition-transform duration-300 hover:scale-[1.03]"
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
              </a>
              <a
                href="#"
                role="button"
                aria-label={t.listen}
                aria-disabled="true"
                tabIndex={0}
                className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 no-underline transition-transform duration-300 hover:scale-[1.03]"
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
              </a>
            </div>
          </div>

          </div>{/* end mx-auto w-[78%] */}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    const update = () => {
      const p = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));
      section.style.setProperty("--hero-p", String(p));
      document.documentElement.style.setProperty("--hero-p", String(p));
      // Compute opacity in JS — Safari does not support max() in inline opacity
      const opacity = Math.max(0, 1 - p * 1.4);
      document.documentElement.style.setProperty("--hero-content-opacity", String(opacity));
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
          autoPlay muted loop playsInline preload="auto"
          aria-hidden="true"
          disablePictureInPicture disableRemotePlayback
          className="absolute inset-0 size-full object-cover"
        />
      </div>

      {/* The hero wordmark, tagline and CTAs are NOT rendered here — they live
          in <HeroOverlay>, a root-level fixed layer alongside the header and
          okarina player. A full-bleed hero <video> is promoted to Safari's
          hardware "media overlay" compositing plane, which paints above any
          sibling content in the same subtree regardless of z-index, so
          in-section content was invisible in Safari (fine in Chrome). The
          header (z-50) and okarina (z-30) are root-level fixed overlays and
          render above the video correctly; HeroOverlay uses the same approach.
          This <Hero> still owns the scroll math that drives --hero-p and
          --hero-content-opacity, which HeroOverlay and the okarina consume. */}
    </section>
  );
}

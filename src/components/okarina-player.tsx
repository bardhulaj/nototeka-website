"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating okarina that:
 *   - Autoplays in slow motion (loop)
 *   - Sits centered in the viewport while in the hero
 *   - Shrinks + translates to the bottom-right corner as the user scrolls
 *     past the hero, driven by `--hero-p`
 *   - Hides while the footer is in view (intersection observer)
 *
 * The white background of the video is removed via an SVG feColorMatrix
 * filter that drops alpha to 0 for near-white pixels — true transparency,
 * works on any background color behind the video.
 */
export function OkarinaPlayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [footerIn, setFooterIn] = useState(false);
  // iOS Safari hardware decoder doesn't support HEVC alpha.
  // Fix: remove will-change (which isolates the compositing layer) and
  // apply mix-blend-mode:multiply on the wrapper so white pixels
  // blend away against whatever is painted beneath.
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!wrapper || !video) return;

    const SLOW_RATE = 0.3;
    const setRate = () => {
      video.playbackRate = SLOW_RATE;
    };
    if (video.readyState >= 1) setRate();
    else video.addEventListener("loadedmetadata", setRate, { once: true });
    video.play().catch(() => {});

    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && "ontouchend" in document) {
      setIsIOS(true);
    }

    const CARD_W = 320;
    const HERO_SIZE_FACTOR = 1.62; // 432 × 1.2 = +20% desktop
    const VISIBLE_OVERLAP = 60;
    const MOBILE_BP = 640;

    let rafId = 0;
    let idleFrames = 0;
    const IDLE_THRESHOLD = 3;
    let lastP = -1;

    const update = () => {
      rafId = 0; // mark as not scheduled
      const pStr = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--hero-p");
      const p = Math.max(0, Math.min(1, parseFloat(pStr) || 0));
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < MOBILE_BP;

      const maxSize = isMobile
        ? Math.min(vw * 0.5, vh * 0.4)
        : Math.min(CARD_W * HERO_SIZE_FACTOR, vh * 0.68);
      const minSize = isMobile ? 153 : 184; // desktop corner +20%
      const size = maxSize + (minSize - maxSize) * p;

      // Okarina centred in the middle column of the 3-column hero layout.
      // On mobile: sits at the bottom of the hero viewport so it's visible
      // on arrival, then slides to the bottom-right corner as user scrolls.
      const RIGHT_MARGIN = 24;
      const targetX = vw / 2 - size / 2;
      const maxX = vw - size - RIGHT_MARGIN;
      const heroX = isMobile ? vw / 2 - size / 2 : Math.min(targetX, maxX);
      const heroY = isMobile ? vh - size - 40 : vh / 2 - size / 2;

      const margin = 24;
      const cornerX = vw - size - margin;
      const cornerY = vh - size - margin;

      const x = heroX + (cornerX - heroX) * p;
      const y = heroY + (cornerY - heroY) * p;

      wrapper.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      wrapper.style.width = `${size}px`;
      wrapper.style.height = `${size}px`;

      // Throttle: only keep the loop alive when p is actively changing.
      if (p === lastP) {
        idleFrames++;
      } else {
        idleFrames = 0;
        lastP = p;
      }

      if (idleFrames < IDLE_THRESHOLD) {
        rafId = requestAnimationFrame(update);
      }
      // Otherwise we stop; the scroll/resize listeners re-arm it as needed.
    };

    const scheduleUpdate = () => {
      idleFrames = 0; // reset idle counter on new scroll/resize
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    // Kick off the first render
    rafId = requestAnimationFrame(update);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      video.removeEventListener("loadedmetadata", setRate);
    };
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setFooterIn(e.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Alpha is baked into the video files — no runtime keying needed.
          - HEVC alpha MP4: Safari 13+ (preferred — Safari is the only modern
            browser that doesn't support VP9 alpha in WebM)
          - VP9 alpha WebM: Chrome, Firefox, Edge
          See docs/figma-import.md for the ffmpeg encode commands. */}
      <div
        ref={wrapperRef}
        id="okarina-player"
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 overflow-hidden"
        style={{
          width: 0,
          height: 0,
          // On iOS: drop will-change so the wrapper isn't promoted to an
          // isolated GPU layer — that isolation breaks mix-blend-mode.
          willChange: isIOS ? "auto" : "transform, width, height",
          mixBlendMode: isIOS ? "multiply" : "normal",
          opacity: footerIn ? 0 : 1,
          transition: "opacity 400ms ease",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          className="absolute inset-0 size-full object-cover"
        >
          <source src="/videos/okarina-360-alpha.mp4" type='video/mp4; codecs="hvc1"' />
          <source src="/videos/okarina-360.webm" type='video/webm; codecs="vp9"' />
        </video>
      </div>
    </>
  );
}

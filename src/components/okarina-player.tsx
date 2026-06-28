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
 * Transparency is done in a <canvas>, identically on every browser. The source
 * is a single "stacked" video (public/videos/okarina-360-stacked.mp4): the TOP
 * half is the okarina color, the BOTTOM half is its alpha matte (white =
 * opaque). Each decoded frame we draw the color half to the canvas and set each
 * pixel's alpha from the matte half, producing a real per-pixel-alpha bitmap.
 *
 * Why not native alpha video? It works on desktop Safari + Chrome/Firefox/Edge,
 * but iOS Safari does NOT composite HEVC `<video>` alpha (it plays the okarina
 * opaque on a white field) and also drops the CSS workarounds (mix-blend-mode
 * and SVG `filter: url()` are both ignored on iOS's composited video layer —
 * WebKit #184601 / #261806). The canvas keyer is the only approach that is
 * independent of GPU compositing, so it behaves the same everywhere — and a
 * matte (vs. a luminance/white key) is required because the okarina's bright
 * metallic studs are lighter than the background and a brightness key would
 * punch holes in them.
 */
export function OkarinaPlayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [footerIn, setFooterIn] = useState(false);

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

  // Composite the stacked video (color + matte) into the canvas every frame.
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const matteCanvas = document.createElement("canvas");
    const mctx = matteCanvas.getContext("2d", { willReadFrequently: true });
    if (!mctx) return;

    const MAX_SIDE = 720; // cap bitmap res (okarina displays <=~520px)
    let stopped = false;
    let handle = 0;
    const useRVFC = typeof video.requestVideoFrameCallback === "function";

    const draw = () => {
      if (stopped) return;
      const vw = video.videoWidth;
      const vh = video.videoHeight; // stacked: full frame is 2 halves tall
      if (vw && vh) {
        const half = vh / 2;
        const s = Math.min(1, MAX_SIDE / Math.max(vw, half));
        const cw = Math.max(1, Math.round(vw * s));
        const ch = Math.max(1, Math.round(half * s));
        if (canvas.width !== cw || canvas.height !== ch) {
          canvas.width = cw;
          canvas.height = ch;
          matteCanvas.width = cw;
          matteCanvas.height = ch;
        }
        // top half = color, bottom half = alpha matte (grayscale)
        ctx.drawImage(video, 0, 0, vw, half, 0, 0, cw, ch);
        mctx.drawImage(video, 0, half, vw, half, 0, 0, cw, ch);
        try {
          const img = ctx.getImageData(0, 0, cw, ch);
          const matte = mctx.getImageData(0, 0, cw, ch).data;
          const d = img.data;
          for (let i = 0; i < d.length; i += 4) d[i + 3] = matte[i];
          ctx.putImageData(img, 0, 0);
        } catch {
          // getImageData only throws on a cross-origin taint; the video is
          // same-origin (/videos/...), so this should never fire.
        }
      }
      schedule();
    };

    const schedule = () => {
      if (stopped) return;
      handle = useRVFC
        ? video.requestVideoFrameCallback(draw)
        : requestAnimationFrame(draw);
    };

    video.play().catch(() => {});
    schedule();

    return () => {
      stopped = true;
      if (useRVFC) video.cancelVideoFrameCallback?.(handle);
      else cancelAnimationFrame(handle);
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
    <div
      ref={wrapperRef}
      id="okarina-player"
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 overflow-hidden"
      style={{
        width: 0,
        height: 0,
        willChange: "transform, width, height",
        opacity: footerIn ? 0 : 1,
        transition: "opacity 400ms ease",
      }}
    >
      {/* Decoding source for the canvas only — never shown. The stacked video
          (color over matte) is composited to real alpha in <canvas>. */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        src="/videos/okarina-360-stacked.mp4"
        className="absolute inset-0 size-full"
        style={{ opacity: 0, pointerEvents: "none" }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 size-full"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

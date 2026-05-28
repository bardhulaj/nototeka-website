"use client";

import { useEffect } from "react";

export function CaptureMode() {
  // Completely disabled in production — no event listeners, no DOM classes.
  if (process.env.NODE_ENV === "production") return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("capture")) return;
    document.documentElement.classList.add("capture");

    let ticks = 0;
    const id = setInterval(() => {
      document.querySelectorAll("video").forEach((v) => v.pause());
      if (++ticks > 20) clearInterval(id);
    }, 100);

    return () => clearInterval(id);
  }, []);

  return null;
}

"use client";

import Image from "next/image";
import { play, useCurrentToken, TEASER_TOKEN, TEASER_URL } from "@/lib/audio";
import { useLang } from "@/lib/i18n";

export function SiteHeader() {
  const activeToken = useCurrentToken();
  const teaserPlaying = activeToken === TEASER_TOKEN;
  const { t, lang, setLang } = useLang();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Liquid-glass background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 252, 248, 0.55) 0%, rgba(255, 246, 236, 0.28) 100%)",
          backdropFilter: "blur(24px) saturate(150%)",
          WebkitBackdropFilter: "blur(24px) saturate(150%)",
        }}
      />
      {/* The hero and every section below sit on a light (g1) background behind
          a light liquid-glass nav, so header content is always dark for
          contrast. (A previous color-mix evaluated to white at the hero top —
          invisible on the light hero in Safari, which renders the calc() that
          Chrome silently dropped, so it only "worked" in Chrome.) */}
      <nav
        className="mx-auto flex h-16 max-w-[1680px] items-center gap-5 px-5 sm:h-20 sm:px-10 lg:px-16"
        style={{ color: "#171717" }}
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <a
          href="#top"
          aria-label="Nototeka home"
          className="relative block shrink-0 no-underline"
          style={{ height: "1.5rem" }}
        >
          <Image
            src="/icons/nototeka-logo.svg"
            alt="Nototeka"
            unoptimized
            width={120}
            height={24}
            className="block h-5 w-auto sm:h-6"
          />
        </a>

        {/* Right-side controls */}
        <ul className="ml-auto flex items-center gap-4 sm:gap-5">
          {/* Download — hidden on mobile to keep nav clean */}
          <li className="hidden sm:block">
            <a
              href="#"
              aria-label={t.download}
              aria-hidden="true"
              tabIndex={-1}
              className="inline-flex items-center justify-center transition-opacity hover:opacity-60"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 2v9" />
                <path d="M4 7l4 4 4-4" />
                <path d="M2 14h12" />
              </svg>
            </a>
          </li>

          {/* Play / Pause teaser */}
          <li>
            <button
              type="button"
              onClick={() => play(TEASER_TOKEN, TEASER_URL)}
              aria-label={teaserPlaying ? t.pauseTeaser : t.playTeaser}
              aria-pressed={teaserPlaying}
              className="inline-flex items-center justify-center transition-opacity hover:opacity-60"
            >
              {teaserPlaying ? (
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-[9px]" fill="currentColor">
                  <rect x="3" y="2.5" width="3.5" height="11" />
                  <rect x="9.5" y="2.5" width="3.5" height="11" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 16 16" className="size-[9px]" fill="currentColor">
                  <path d="M4 2.5v11l9-5.5L4 2.5z" />
                </svg>
              )}
            </button>
          </li>

          {/* Language toggle */}
          <li>
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "sq" : "en")}
              aria-label={t.langLabel}
              className="inline-flex items-center justify-center transition-opacity hover:opacity-60 font-display tracking-wide"
              style={{ fontSize: "0.6875rem", letterSpacing: "0.08em" }}
            >
              {t.langToggle}
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

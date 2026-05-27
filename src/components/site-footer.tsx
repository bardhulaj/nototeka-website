"use client";

import { useLang } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useLang();
  return (
    <footer className="bg-g1 text-g7">
      <div className="mx-auto max-w-[1680px] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-xl text-center">
          <img src="/icons/supported-by.svg" alt="Supported by" className="mx-auto mb-8 h-32 w-auto opacity-80" />
          <p className="narrative-2">{t.footerTagline}</p>
        </div>
        <div className="mt-16 border-t border-g7/15 pt-8 text-center eyebrow-sm opacity-60">
          <span>{t.copyright}</span>
        </div>
      </div>
    </footer>
  );
}

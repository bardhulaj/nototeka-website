"use client";

import { Section } from "@/components/section";
import { useLang } from "@/lib/i18n";

export function Incantation() {
  const { t } = useLang();
  return (
    <Section id="incantation" tone="light" innerClassName="pb-10 sm:pb-12 md:pb-14 lg:pb-16">
      <div className="grid grid-cols-1 gap-10 border-b border-g7/15 pt-8 pb-12 md:grid-cols-12 md:gap-16 md:pt-8 md:pb-16">
        <div className="md:col-span-5">
          <h1 className="narrative-1" style={{ whiteSpace: "pre-line" }}>{t.archiveTitle}</h1>
        </div>
        <div className="md:col-span-7 md:col-start-6 md:pt-1">
          <p className="narrative-3 opacity-70">{t.archiveDescription}</p>
        </div>
      </div>
    </Section>
  );
}

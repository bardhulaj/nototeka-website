"use client";

import { Section } from "@/components/section";
import { useLang } from "@/lib/i18n";

const CUSTODIANS = [
  { name: "Hysen Kurtaj",   instrumentsEn: "Lahuta",                          instrumentsSq: "Lahuta" },
  { name: "Fatmir Makolli", instrumentsEn: "Çifteli · Bagpipe · Flute",       instrumentsSq: "Çiftelia · Gajde · Fyelli" },
  { name: "Sokol Plakolli", instrumentsEn: "Flute (150-year-old)",             instrumentsSq: "Fyelli (150-year-old)" },
  { name: "Vesel Nikçi",   instrumentsEn: "Leaf",                             instrumentsSq: "Gjethe" },
  { name: "Sherif Zabelaj", instrumentsEn: "Okarina · Shawm · Ndrrojse",      instrumentsSq: "Okarina · Surla · Ndrrojse" },
];

export function Bloodline() {
  const { t, lang } = useLang();
  return (
    <Section id="bloodline" tone="light">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-8">
          <h2 className="narrative-1 max-w-[24ch]">{t.bloodlineHeading}</h2>
        </div>
        <div className="md:col-span-4 md:pt-2">
          <p className="narrative-3 opacity-70">{t.bloodlineDescription}</p>
        </div>
      </div>
      <ol className="mt-16 divide-y divide-g7/15 border-y border-g7/15">
        {CUSTODIANS.map((c) => (
          <li key={c.name}>
            <article className="grid grid-cols-12 items-baseline gap-x-6 gap-y-2 py-7 md:py-8">
              <h3 className="col-span-12 narrative-2 sm:col-span-6">{c.name}</h3>
              <p className="col-span-12 narrative-3 opacity-70 sm:col-span-6 sm:text-right">
                {lang === "sq" ? c.instrumentsSq : c.instrumentsEn}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

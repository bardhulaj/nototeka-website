"use client";

import { Section } from "@/components/section";
import { useLang } from "@/lib/i18n";

const CUSTODIANS = [
  { name: "Hysen Kurtaj", instruments: "Lahuta" },
  { name: "Fatmir Makolli", instruments: "Çifteli · Bagpipe · Flute" },
  { name: "Sokol Plakolli", instruments: "Flute (150-year-old)" },
  { name: "Vesel Nikci", instruments: "Leaf" },
  { name: "Sherif Zabelaj", instruments: "Okarina · Shawm · Ndrrojse" },
];

export function Bloodline() {
  const { t } = useLang();
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
                {c.instruments}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

"use client";

import Image from "next/image";
import { Section } from "@/components/section";
import { useLang } from "@/lib/i18n";

export function Covenant() {
  const { t } = useLang();
  return (
    <Section id="covenant" tone="light" innerClassName="pt-12 sm:pt-14 md:pt-16 lg:pt-20">
      <div className="mx-auto w-[70%]">
        <Image src="/icons/bottom-piece-mobile.svg" alt="Held in the grace of those who carry it forward." unoptimized width={800} height={400} className="w-full md:hidden" />
        <Image src="/icons/bottom-piece.svg" alt="Held in the grace of those who carry it forward." unoptimized width={1200} height={600} className="hidden w-full md:block" />
      </div>
      <div className="mt-40 grid grid-cols-1 gap-16 md:mt-52 md:grid-cols-2 lg:mt-60">
        <div className="text-center md:text-left">
          <p className="eyebrow opacity-60">{t.createdBy}</p>
          <p className="narrative-1 mt-3">Gent Gjonbalaj</p>
        </div>
        <div className="text-center md:text-right">
          <p className="eyebrow opacity-60">{t.supportedBy}</p>
          <p className="narrative-1 mt-3">{t.ministry}</p>
        </div>
      </div>
    </Section>
  );
}

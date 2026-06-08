"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "sq";

type Translation = {
  // Navbar
  langToggle: string;
  langLabel: string;
  download: string;
  listen: string;
  pauseTeaser: string;
  playTeaser: string;
  // Hero
  tagline: string;
  // Incantation
  archiveTitle: string;
  archiveDescription: string;
  // Sonic Relics
  sonicRelicsDescription: string;
  teaserLabel: string;
  noteLabel: string;
  chordLabel: string;
  sampleLabel: string;
  categoryNotes: (n: number) => string;
  categoryChords: (n: number) => string;
  categorySamples: (n: number) => string;
  // Bloodline
  bloodlineHeading: string;
  bloodlineDescription: string;
  // Covenant
  createdBy: string;
  supportedBy: string;
  ministry: string;
  // Footer
  footerTagline: string;
  copyright: string;
};

export const TRANSLATIONS: Record<Lang, Translation> = {
  en: {
    langToggle: "SQ",
    langLabel: "Switch to Albanian",
    download: "Download",
    listen: "Listen",
    pauseTeaser: "Pause Nototeka Teaser",
    playTeaser: "Play Nototeka Teaser",
    tagline: "Digital Archive of Sounds of Traditional Albanian Instruments",
    archiveTitle: "Digital Archive of Sounds\nof Traditional Albanian Instruments",
    archiveDescription:
      "Nototeka captures and preserves the sounds of traditional Albanian instruments in a professional digital archive built for those who create, study, and carry this musical heritage forward.",
    sonicRelicsDescription:
      "Sounds that have shaped Albanian culture for centuries, documented professionally for the first time as high-fidelity one-shots, chords and samples.",
    teaserLabel: "Nototeka Teaser",
    noteLabel: "Note",
    chordLabel: "Chord",
    sampleLabel: "Sample",
    categoryNotes: (n) => `${n} single notes`,
    categoryChords: (n) => `${n} chords`,
    categorySamples: (n) => `${n} samples`,
    bloodlineHeading: "The carriers who held a tradition together.",
    bloodlineDescription:
      "Five masters of traditional Albanian instruments, each carrying a lifetime of practice.",
    createdBy: "Created by",
    supportedBy: "Supported by",
    ministry: "Ministry of Culture, Youth and Sports of Kosova",
    footerTagline:
      "Nototeka — Digital Archive of Sounds of Traditional Albanian Instruments.",
    copyright: "© MMXXVI Nototeka · Prishtina, Kosova",
  },
  sq: {
    langToggle: "EN",
    langLabel: "Kalon në anglisht",
    download: "Shkarko",
    listen: "Dëgjo",
    pauseTeaser: "Ndaloni Nototeka Teaser",
    playTeaser: "Luani Nototeka Teaser",
    tagline: "Arkiva Digjitale e Tingujve të Instrumenteve Tradicionale Shqiptare",
    archiveTitle: "Arkiva Digjitale e Tingujve\ntë Instrumenteve Tradicionale Shqiptare",
    archiveDescription:
      "Nototeka dokumenton dhe ruan tingujt e instrumenteve tradicionale shqiptare në një arkivë profesionale digjitale, ndërtuar për ata që krijojnë, studiojnë dhe mbajnë gjallë këtë trashëgimi muzikore.",
    sonicRelicsDescription:
      "Tinguj që kanë formësuar kulturën shqiptare për shekuj, të dokumentuar profesionalisht për herë të parë si one-shots, akorde dhe samples me cilësi të lartë.",
    teaserLabel: "Nototeka Teaser",
    noteLabel: "Nota",
    chordLabel: "Akorde",
    sampleLabel: "Samples",
    categoryNotes: (n) => `${n} nota të veçanta`,
    categoryChords: (n) => `${n} akorde`,
    categorySamples: (n) => `${n} fraza`,
    bloodlineHeading: "Bartësit që mbajtën bashkë një traditë.",
    bloodlineDescription:
      "Pesë mjeshtër të instrumenteve tradicionale shqiptare, secili me shumë përvojë në shërbim të traditës.",
    createdBy: "Krijuar nga",
    supportedBy: "Mbështetur nga",
    ministry: "Ministria e Kulturës, Rinisë dhe Sportit të Kosovës",
    footerTagline:
      "Nototeka — Arkiva Digjitale e Tingujve të Instrumenteve Tradicionale Shqiptare.",
    copyright: "© MMXXVI Nototeka · Prishtinë, Kosovë",
  },
};

type LangCtxValue = { lang: Lang; setLang: (l: Lang) => void; t: Translation };

const LangCtx = createContext<LangCtxValue>({
  lang: "sq",
  setLang: () => {},
  t: TRANSLATIONS.sq,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sq");

  useEffect(() => {
    const stored = localStorage.getItem("nototeka-lang") as Lang | null;
    if (stored === "en" || stored === "sq") setLangState(stored);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("nototeka-lang", l);
    document.documentElement.lang = l;
  }

  return (
    <LangCtx.Provider value={{ lang, setLang, t: TRANSLATIONS[lang] }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  return useContext(LangCtx);
}

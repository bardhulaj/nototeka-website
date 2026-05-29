"use client";

import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/section";
import {
  play,
  useCurrentToken,
  audioSingleton,
  subscribers,
  TEASER_TOKEN,
  TEASER_URL,
} from "@/lib/audio";
import { useLang } from "@/lib/i18n";

type Category = {
  id: string;
  label: string;
  singular: string;
  /** filename slug inside /public/audio (e.g. "note", "chord", "sample") */
  slug: string;
  count: number;
};

type Instrument = {
  id: string;
  name: string;
  /** filename prefix inside /public/audio (e.g. "CIFTELI-CHR") */
  prefix: string;
  categories: Category[];
};

// Counts + prefixes mirror the on-disk archive folder
// "Nototeka – Digital Archive of Sounds of Traditional Albanian Instruments".
// Files live at /public/audio/{prefix}_{slug}_{NN}.mp3 (converted from WAV).
const INSTRUMENTS: Instrument[] = [
  {
    id: "cifteli-chromatic",
    name: "Çifteli (Chromatic Scale)",
    prefix: "CIFTELI-CHR",
    categories: [
      { id: "notes", label: "23 single notes", singular: "Note", slug: "note", count: 23 },
      { id: "chords", label: "23 chords", singular: "Chord", slug: "chord", count: 23 },
      { id: "samples", label: "5 phrase samples", singular: "Sample", slug: "sample", count: 5 },
    ],
  },
  {
    id: "cifteli-original",
    name: "Çifteli (Original Scale)",
    prefix: "CIFTELI-ORIG",
    categories: [
      { id: "notes", label: "13 single notes", singular: "Note", slug: "note", count: 13 },
      { id: "chords", label: "14 chords", singular: "Chord", slug: "chord", count: 14 },
      { id: "samples", label: "11 phrase samples", singular: "Sample", slug: "sample", count: 11 },
    ],
  },
  {
    id: "fyell",
    name: "Flute",
    prefix: "FYELL",
    categories: [
      { id: "notes", label: "8 single notes", singular: "Note", slug: "note", count: 8 },
      { id: "samples", label: "6 phrase samples", singular: "Sample", slug: "sample", count: 6 },
    ],
  },
  {
    id: "fyell-150",
    name: "Flute (150-year-old)",
    prefix: "FYELL-150",
    categories: [
      { id: "notes", label: "4 single notes", singular: "Note", slug: "note", count: 4 },
      { id: "samples", label: "3 phrase samples", singular: "Sample", slug: "sample", count: 3 },
    ],
  },
  {
    id: "gajde",
    name: "Bagpipe",
    prefix: "GAJDE",
    categories: [
      { id: "notes", label: "5 single notes", singular: "Note", slug: "note", count: 5 },
      { id: "samples", label: "4 phrase samples", singular: "Sample", slug: "sample", count: 4 },
    ],
  },
  {
    id: "gjethe",
    name: "Leaf",
    prefix: "GJETHE",
    categories: [
      { id: "notes", label: "8 single notes", singular: "Note", slug: "note", count: 8 },
      { id: "samples", label: "5 phrase samples", singular: "Sample", slug: "sample", count: 5 },
    ],
  },
  {
    id: "lahuta",
    name: "Lahuta",
    prefix: "LAHUTA",
    categories: [
      { id: "notes", label: "5 single notes", singular: "Note", slug: "note", count: 5 },
      { id: "samples", label: "6 phrase samples", singular: "Sample", slug: "sample", count: 6 },
    ],
  },
  {
    id: "ndrrojse",
    name: "Ndrrojse",
    prefix: "NDRROJSE",
    categories: [
      { id: "notes", label: "5 single notes", singular: "Note", slug: "note", count: 5 },
      { id: "samples", label: "3 phrase samples", singular: "Sample", slug: "sample", count: 3 },
    ],
  },
  {
    id: "okarina",
    name: "Okarina",
    prefix: "OKARINA",
    categories: [
      { id: "notes", label: "5 single notes", singular: "Note", slug: "note", count: 5 },
      { id: "samples", label: "4 phrase samples", singular: "Sample", slug: "sample", count: 4 },
    ],
  },
  {
    id: "surla",
    name: "Shawm",
    prefix: "SURLA",
    categories: [
      { id: "notes", label: "7 single notes", singular: "Note", slug: "note", count: 7 },
      { id: "samples", label: "3 phrase samples", singular: "Sample", slug: "sample", count: 3 },
    ],
  },
];


function TeaserPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const activeToken = useCurrentToken();
  const { t } = useLang();

  // Another clip started — pause the teaser
  useEffect(() => {
    if (activeToken !== TEASER_TOKEN && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setPlaying(false);
    }
  }, [activeToken]);

  useEffect(() => {
    const audio = new Audio(TEASER_URL);
    audioRef.current = audio;
    const onMeta = () => setDuration(audio.duration);
    const onTime = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
      if (audioSingleton.token === TEASER_TOKEN) {
        audioSingleton.audio = null;
        audioSingleton.token = null;
        subscribers.forEach((cb) => cb(null));
      }
    };
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      if (audioSingleton.token === TEASER_TOKEN) {
        audioSingleton.audio = null;
        audioSingleton.token = null;
        subscribers.forEach((cb) => cb(null));
      }
    } else {
      if (audioSingleton.audio) {
        audioSingleton.audio.pause();
        audioSingleton.audio.currentTime = 0;
      }
      audio.play().catch(() => {});
      audioSingleton.audio = audio;
      audioSingleton.token = TEASER_TOKEN;
      subscribers.forEach((cb) => cb(TEASER_TOKEN));
      setPlaying(true);
    }
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setProgress(ratio);
  }

  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t.pauseTeaser : t.playTeaser}
          aria-pressed={playing}
          className="inline-flex size-7 shrink-0 items-center justify-center opacity-70 transition-opacity hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
        >
          {playing ? (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <rect x="3" y="2.5" width="3.5" height="11" />
              <rect x="9.5" y="2.5" width="3.5" height="11" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
              <path d="M4 2.5v11l9-5.5L4 2.5z" />
            </svg>
          )}
        </button>

        {/* Seekable track */}
        <div
          className="relative h-px flex-1 cursor-pointer bg-g7/20"
          onClick={seek}
          role="presentation"
        >
          <div
            className="absolute inset-y-0 left-0 bg-current opacity-60"
            style={{ width: `${progress * 100}%` }}
          />
          <div
            aria-hidden="true"
            className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current opacity-80"
            style={{ left: `${progress * 100}%` }}
          />
        </div>

        <span
          className="narrative-3 tabular-nums opacity-40"
          style={{ fontSize: "0.75rem" }}
        >
          {duration ? fmt(duration) : "—:——"}
        </span>
      </div>

      <p className="narrative-3 opacity-40" style={{ fontSize: "0.8125rem" }}>
        {t.teaserLabel}
      </p>
    </div>
  );
}

export function SonicRelics() {
  const { t } = useLang();
  return (
    <Section id="sonic-relics" tone="light" innerClassName="pt-10 sm:pt-12 md:pt-14 lg:pt-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center md:gap-16">
        <div className="md:col-span-5">
          <TeaserPlayer />
        </div>
        <p className="narrative-3 opacity-70 md:col-span-7 md:col-start-6">
          {t.sonicRelicsDescription}
        </p>
      </div>

      <div className="mt-24 flex flex-col gap-24 md:mt-32 md:gap-32">
        {INSTRUMENTS.map((inst) => (
          <InstrumentBlock key={inst.id} instrument={inst} />
        ))}
      </div>
    </Section>
  );
}

function InstrumentBlock({ instrument }: { instrument: Instrument }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeToken = useCurrentToken();
  const { t } = useLang();

  return (
    <article
      id={instrument.id}
      className="scroll-mt-20 border-t border-g7/15 pt-12 md:pt-16"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <h3 className="narrative-1">
            {(() => {
              const i = instrument.name.indexOf("(");
              if (i === -1) return instrument.name;
              return (
                <>
                  {instrument.name.slice(0, i).trimEnd()}
                  <span className="mt-1 block narrative-3 opacity-70">
                    {instrument.name.slice(i)}
                  </span>
                </>
              );
            })()}
          </h3>
        </div>

        <div className="md:col-span-7">
          <ol className="divide-y divide-g7/15 border-y border-g7/15">
            {instrument.categories.map((cat) => {
              const isOpen = openId === cat.id;
              const catLabel = cat.slug === "note" ? t.categoryNotes(cat.count)
                : cat.slug === "chord" ? t.categoryChords(cat.count)
                : t.categorySamples(cat.count);
              const catSingular = cat.slug === "note" ? t.noteLabel
                : cat.slug === "chord" ? t.chordLabel
                : t.sampleLabel;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : cat.id)}
                    className="group flex w-full items-center justify-between py-3 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`${instrument.id}-${cat.id}`}
                  >
                    <span className="narrative-3 opacity-85 transition-opacity group-hover:opacity-100">
                      {catLabel}
                    </span>
                    {isOpen ? (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 109.87 45.49"
                        className="ml-4 size-2.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-80"
                        fill="currentColor"
                      >
                        <path d="M105.8.64c1.14-.86,2.29-.86,3.43,0,.86,1.15.86,2.15,0,3l-6.44,6.01,3.86,3.86c.86-.57,1.72-.57,2.58,0,.57.86.57,1.72,0,2.58.57,1.15.57,2.15,0,3-.86.58-1.72.58-2.58,0l-3.86,3.43,3.86,3.86c.86-.57,1.72-.57,2.58,0,.57.86.57,1.72,0,2.58.57,1.15.57,2.15,0,3-.86.58-1.72.58-2.58,0l-3.86,3.43,6.44,6.01c.86,1.15.86,2.29,0,3.43-1.15.86-2.29.86-3.43,0l-6.01-6.44-3.43,3.86c.57.86.57,1.72,0,2.58-.86.58-1.72.58-2.58,0-1.15.58-2.15.58-3,0-.58-.86-.72-1.72-.43-2.58h.43l-3.86-3.86-3.43,3.86c.57.86.57,1.72,0,2.58-.86.58-1.72.58-2.58,0-1.15.58-2.15.58-3,0-.58-.86-.72-1.72-.43-2.58h.43l-3.86-3.86-3.43,3.86c.57.86.57,1.72,0,2.58-.86.58-1.72.58-2.57,0-1.15.58-2.15.58-3,0-.58-.86-.72-1.72-.43-2.58h.43l-3.86-3.86-3.43,3.86c.57.86.57,1.72,0,2.58-.86.58-1.72.58-2.57,0-1.15.58-2.15.58-3,0-.58-.86-.72-1.72-.43-2.58h.43l-3.86-3.86-3.43,3.86c.57.86.57,1.72,0,2.58-.86.58-1.72.58-2.58,0-1.15.58-2.15.58-3,0-.58-.86-.72-1.72-.43-2.58h.43l-3.86-3.86-3.43,3.86c.57.86.57,1.72,0,2.58-.86.58-1.72.58-2.58,0-1.15.58-2.15.58-3,0-.58-.86-.72-1.72-.43-2.58h.43l-3.86-3.86-3.43,3.86c.57.86.57,1.72,0,2.58-.86.58-1.72.58-2.58,0-1.15.58-2.15.58-3,0-.58-.86-.72-1.72-.43-2.58h.43l-3.86-3.86-6.01,6.44c-.86.86-1.86.86-3,0-.86-1.14-.86-2.29,0-3.43l6.01-6.01-3.43-3.43c-.86.58-1.72.58-2.58,0-.58-.86-.72-1.72-.43-2.58h.43c-.58-1.14-.58-2.15,0-3,.86-.57,1.72-.57,2.58,0l3.43-3.86-3.43-3.43c-.86.58-1.72.58-2.58,0-.58-.86-.72-1.72-.43-2.58h.43c-.58-1.14-.58-2.15,0-3,.86-.57,1.72-.57,2.58,0l3.43-3.86L.64,3.65C-.21,2.79-.21,1.79.64.64,1.78-.21,2.79-.21,3.65.64l6.01,6.01,3.86-3.43c-.58-.86-.58-1.72,0-2.58.86-.57,1.72-.57,2.58,0,1.14-.57,2.15-.57,3,0,.57.86.57,1.72,0,2.58l3.43,3.43,3.86-3.43c-.58-.86-.58-1.72,0-2.58.86-.57,1.72-.57,2.57,0,1.14-.57,2.15-.57,3,0,.57.86.57,1.72,0,2.58l3.43,3.43,3.86-3.43c-.58-.86-.58-1.72,0-2.58.86-.57,1.72-.57,2.57,0,1.14-.57,2.15-.57,3,0,.57.86.57,1.72,0,2.58l3.43,3.43,3.86-3.43c-.58-.86-.58-1.72,0-2.58.86-.57,1.72-.57,2.57,0,1.14-.57,2.15-.57,3,0,.57.86.57,1.72,0,2.58l3.43,3.43,3.86-3.43c-.58-.86-.58-1.72,0-2.58.86-.57,1.72-.57,2.58,0,1.14-.57,2.15-.57,3,0,.57.86.57,1.72,0,2.58l3.43,3.43,3.86-3.43c-.58-.86-.58-1.72,0-2.58.86-.57,1.72-.57,2.58,0,1.14-.57,2.15-.57,3,0,.57.86.57,1.72,0,2.58l3.43,3.43,3.86-3.43c-.58-.86-.58-1.72,0-2.58.86-.57,1.72-.57,2.57,0,1.14-.57,2.15-.57,3,0,.57.86.57,1.72,0,2.58l3.43,3.43,6.01-6.01ZM9.66,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM9.66,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM12.66,9.66l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM12.66,22.53l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM12.66,35.41l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM22.53,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM22.53,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM25.54,9.66l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM25.54,22.53l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM25.54,35.41l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM35.41,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM35.41,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM38.41,9.66l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM38.41,22.53l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM38.41,35.41l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM48.28,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM48.28,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM51.29,9.66l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM51.29,22.53l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM51.29,35.41l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM61.16,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM61.16,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM64.16,9.66l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM64.16,22.53l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM64.16,35.41l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM74.04,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM74.04,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM77.04,9.66l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM77.04,22.53l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM77.04,35.41l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM86.91,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM86.91,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM89.92,9.66l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM89.92,22.53l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM89.92,35.41l3.43,3.43,3.43-3.43-3.43-3.43-3.43,3.43ZM99.79,12.66l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43ZM99.79,25.54l-3.43,3.43,3.43,3.43,3.43-3.43-3.43-3.43Z" />
                      </svg>
                    ) : (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 109.87 109.87"
                        className="ml-4 size-2.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-80"
                        fill="currentColor"
                      >
                        <path d="M102.79,67.6l3.86-3.43c.86.58,1.72.58,2.58,0,.57-.86.57-1.86,0-3,.57-.86.57-1.72,0-2.57-.86-.57-1.72-.57-2.58,0l-3.86-3.86,3.86-3.43c.86.58,1.72.58,2.58,0,.57-.86.57-1.86,0-3,.57-.86.57-1.72,0-2.57-.86-.57-1.72-.57-2.58,0l-3.86-3.86,6.44-6.01c.86-.86.86-1.86,0-3-1.15-.86-2.29-.86-3.43,0l-6.01,6.01-3.43-3.43c.57-.86.57-1.72,0-2.58-.86-.57-1.86-.57-3,0-.86-.57-1.72-.57-2.57,0-.58.86-.58,1.72,0,2.58l-3.86,3.43-3.43-3.43c.57-.86.57-1.72,0-2.58-.86-.57-1.86-.57-3,0-.86-.57-1.72-.57-2.58,0-.58.86-.58,1.72,0,2.58l-3.84,3.41-3.03-3.41,3.43-3.43c.86.57,1.72.57,2.57,0,.57-.86.57-1.86,0-3,.57-.86.57-1.72,0-2.58-.86-.58-1.72-.58-2.57,0l-3.43-3.86,3.43-3.43c.86.57,1.72.57,2.57,0,.57-.86.57-1.86,0-3,.57-.86.57-1.72,0-2.58-.86-.58-1.72-.58-2.57,0l-3.43-3.86,6.01-6.01c.86-.86.86-1.86,0-3-1.15-.86-2.15-.86-3,0l-6.01,6.01-3.86-3.43c.57-.86.57-1.72,0-2.58-.86-.58-1.86-.58-3,0V.21c-.86-.29-1.72-.15-2.58.43-.58.86-.58,1.72,0,2.58l-3.43,3.43-3.86-3.43c.57-.86.57-1.72,0-2.58-.86-.58-1.86-.58-3,0V.21c-.86-.29-1.72-.15-2.58.43-.58.86-.58,1.72,0,2.58l-3.43,3.43-6.01-6.01c-1.15-.86-2.29-.86-3.43,0-.86,1.14-.86,2.15,0,3l6.44,6.01-3.86,3.86v-.43c-.86-.29-1.72-.15-2.58.43-.58.86-.58,1.86,0,3-.58.86-.58,1.72,0,2.58.86.57,1.72.57,2.58,0l3.86,3.43-3.86,3.86v-.43c-.86-.29-1.72-.15-2.58.43-.58.86-.58,1.86,0,3-.58.86-.58,1.72,0,2.58.86.57,1.72.57,2.58,0l3.86,3.43-3.86,3.43-3.43-3.43c.57-.86.57-1.72,0-2.58-.86-.57-1.86-.57-3,0-.86-.57-1.72-.57-2.57,0-.58.86-.58,1.72,0,2.58l-3.86,3.43-3.43-3.43c.57-.86.57-1.72,0-2.58-.86-.57-1.86-.57-3,0-.86-.57-1.72-.57-2.58,0-.58.86-.58,1.72,0,2.58l-3.86,3.43-6.01-6.01c-.86-.86-1.86-.86-3,0-.86,1.15-.86,2.15,0,3l6.01,6.01-3.43,3.86c-.86-.57-1.72-.57-2.58,0-.58.86-.58,1.86,0,3H.21c-.29.86-.15,1.72.43,2.58.86.58,1.72.58,2.58,0l3.43,3.43-3.43,3.86c-.86-.57-1.72-.57-2.58,0-.58.86-.58,1.86,0,3H.21c-.29.86-.15,1.72.43,2.58.86.58,1.72.58,2.58,0l3.43,3.43-6.01,6.01c-.86,1.15-.86,2.29,0,3.43,1.14.86,2.15.86,3,0l6.01-6.44,3.86,3.86h-.43c-.29.86-.15,1.72.43,2.58.86.58,1.86.58,3,0,.86.58,1.72.58,2.58,0,.57-.86.57-1.72,0-2.58l3.43-3.86,3.86,3.86h-.43c-.29.86-.15,1.72.43,2.58.86.58,1.86.58,3,0,.86.58,1.72.58,2.58,0,.57-.86.57-1.72,0-2.58l3.43-3.86,3.65,3.65-.21.21h0l-3.43,3.43v-.43c-.86-.29-1.72-.15-2.58.43-.58.86-.58,1.86,0,3-.58.86-.58,1.72,0,2.58.86.57,1.72.57,2.58,0l3.86,3.43-3.86,3.86v-.43c-.86-.29-1.72-.15-2.58.43-.58.86-.58,1.86,0,3-.58.86-.58,1.72,0,2.58.86.57,1.72.57,2.58,0l3.86,3.43-6.44,6.01c-.86,1.14-.86,2.29,0,3.43,1.14.86,2.29.86,3.43,0l6.01-6.44,3.43,3.86c-.58.86-.58,1.72,0,2.58.86.57,1.86.57,3,0,.86.57,1.72.57,2.58,0,.57-.86.57-1.72,0-2.58l3.86-3.86,3.43,3.86c-.58.86-.58,1.72,0,2.58.86.57,1.86.57,3,0,.86.57,1.72.57,2.58,0,.57-.86.57-1.72,0-2.58l3.86-3.86,6.01,6.44c.86.86,1.86.86,3,0,.86-1.15.86-2.29,0-3.43l-6.01-6.01,3.43-3.43c.86.57,1.72.57,2.57,0,.57-.86.57-1.86,0-3,.57-.86.57-1.72,0-2.57-.86-.58-1.72-.58-2.57,0l-3.43-3.86,3.43-3.43c.86.57,1.72.57,2.57,0,.57-.86.57-1.86,0-3,.57-.86.57-1.72,0-2.58-.86-.58-1.72-.58-2.57,0l-3.43-3.86,3.22-3.22,3.65,3.65h-.43c-.29.86-.15,1.72.43,2.58.86.58,1.86.58,3,0,.86.58,1.72.58,2.58,0,.57-.86.57-1.72,0-2.58l3.43-3.86,3.86,3.86h-.43c-.29.86-.15,1.72.43,2.58.86.58,1.86.58,3,0,.86.58,1.72.58,2.58,0,.57-.86.57-1.72,0-2.58l3.43-3.86,6.01,6.44c1.14.86,2.29.86,3.43,0,.86-1.14.86-2.29,0-3.43l-6.44-6.01ZM103.22,48.28l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM96.78,54.72l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM93.35,38.41l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM90.35,48.28l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM74.06,64.57l-3.03-3.41,3.22-3.22,3.22,3.22-3.41,3.41ZM35.41,44.85s0,0,0,0h0s3.43,3.43,3.43,3.43l-3.43,3.43-3.43-3.43,3.43-3.43ZM77.47,48.28l-3.41,3.41-3.03-3.41,3.22-3.22,3.22,3.22ZM67.81,70.82l-3.22-3.22,3.22-3.22,3.22,3.22-3.22,3.22ZM61.59,77.47l-3.43-3.43,3.22-3.22,3.43,3.43-3.22,3.22ZM64.59,48.28l-3.22,3.22-3.22-3.22,3.22-3.22,3.22,3.22ZM51.72,54.72l3.22-3.22,3.22,3.22-3.22,3.22-3.22-3.22ZM58.16,41.85l-3.22,3.22-3.22-3.22,3.22-3.22,3.22,3.22ZM51.72,67.6l3.22-3.22,3.22,3.22-3.22,3.22-3.22-3.22ZM58.16,61.16l3.22-3.22,3.22,3.22-3.22,3.22-3.22-3.22ZM64.59,54.72l3.22-3.22,3.22,3.22-3.22,3.22-3.22-3.22ZM71.03,41.85l-3.22,3.22-3.22-3.22,3.22-3.22,3.22,3.22ZM65.02,35.41l-3.64,3.23-3.23-3.23,3.43-3.43,3.43,3.43h0ZM51.72,48.28l-3.22,3.22-3.22-3.22,3.22-3.22,3.22,3.22ZM38.84,54.72l3.22-3.22,3.22,3.22-3.22,3.22-3.22-3.22ZM45.28,41.85l-3.22,3.22-3.22-3.22,3.22-3.22,3.22,3.22ZM42.06,64.38l3.22,3.22-3.22,3.22-3.22-3.22,3.22-3.22ZM45.28,61.16l3.22-3.22,3.22,3.22-3.22,3.22-3.22-3.22ZM61.59,25.97l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM58.59,28.97l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM48.71,25.97l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM52.15,35.41l-3.64,3.23-3.23-3.23,3.43-3.43,3.43,3.43ZM32.4,54.72l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM35.41,57.73l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM48.5,70.82l3.43,3.43-3.22,3.22-3.43-3.43,3.22-3.22ZM52.15,86.91l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM51.72,80.47l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM61.59,83.48l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM77.04,54.72l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM80.47,38.41l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM71.46,28.97l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM71.46,16.1l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM61.59,6.22l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM58.59,16.1l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM48.71,6.22l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM38.84,16.1l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM42.28,25.54l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM28.97,38.41l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM25.97,48.28l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM19.53,54.72l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM16.1,38.41l3.43,3.43-3.43,3.43-3.43-3.43,3.43-3.43ZM6.22,48.28l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM6.22,61.16l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM16.1,71.03l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM19.1,61.16l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM28.97,71.03l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM38.84,80.47l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM38.84,93.35l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM48.71,103.22l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM51.72,93.35l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM61.59,103.22l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM71.46,93.35l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM71.46,80.47l-3.43,3.43-3.43-3.43,3.43-3.43,3.43,3.43ZM80.47,71.03l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM83.48,61.16l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43ZM93.35,71.03l-3.43-3.43,3.43-3.43,3.43,3.43-3.43,3.43ZM96.35,61.16l3.43-3.43,3.43,3.43-3.43,3.43-3.43-3.43Z" />
                      </svg>
                    )}
                  </button>
                  {isOpen ? (
                    <ul
                      id={`${instrument.id}-${cat.id}`}
                      aria-label={`${catLabel} — ${instrument.name}`}
                      className="mb-4 mt-1 grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1"
                    >
                      {Array.from({ length: cat.count }, (_, i) => {
                        const num = String(i + 1).padStart(2, "0");
                        const label = `${catSingular} ${num}`;
                        const token = `${instrument.prefix}_${cat.slug}_${num}`;
                        const url = `/audio/${token}.mp3`;
                        const playing = activeToken === token;
                        return (
                          <li key={token}>
                            <button
                              type="button"
                              onClick={() => play(token, url)}
                              aria-label={`${playing ? "Pause" : "Play"} ${label}`}
                              aria-pressed={playing}
                              className={`flex w-full items-center justify-center gap-1.5 rounded py-1.5 narrative-3 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current ${
                                playing
                                  ? "opacity-100 bg-g7/10"
                                  : "opacity-50 hover:opacity-85 hover:bg-g7/5"
                              }`}
                              style={{ fontSize: "0.8125rem" }}
                            >
                              <span
                                aria-hidden="true"
                                className="inline-flex size-2.5 shrink-0 items-center justify-center"
                              >
                                {playing ? (
                                  <svg
                                    viewBox="0 0 16 16"
                                    className="size-2.5"
                                    fill="currentColor"
                                  >
                                    <rect x="3" y="2.5" width="3.5" height="11" />
                                    <rect x="9.5" y="2.5" width="3.5" height="11" />
                                  </svg>
                                ) : (
                                  <svg
                                    viewBox="0 0 16 16"
                                    className="size-2.5"
                                    fill="currentColor"
                                  >
                                    <path d="M4 2.5v11l9-5.5L4 2.5z" />
                                  </svg>
                                )}
                              </span>
                              <span>{num}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </article>
  );
}

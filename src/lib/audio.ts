"use client";

import { useEffect, useState } from "react";

export const TEASER_TOKEN = "nototeka-teaser";
export const TEASER_URL = "/audio/nototeka-teaser.mp3";

// Shared mutable state — one audio element plays at a time, anywhere on the page.
export const audioSingleton: {
  audio: HTMLAudioElement | null;
  token: string | null;
} = { audio: null, token: null };

export const subscribers = new Set<(token: string | null) => void>();

export function play(token: string, url: string) {
  if (audioSingleton.audio) {
    audioSingleton.audio.pause();
    audioSingleton.audio.currentTime = 0;
  }
  if (audioSingleton.token === token) {
    // Same item clicked again → toggle off.
    audioSingleton.audio = null;
    audioSingleton.token = null;
    subscribers.forEach((cb) => cb(null));
    return;
  }
  const audio = new Audio(url);
  audio.addEventListener("ended", () => {
    if (audioSingleton.token === token) {
      audioSingleton.audio = null;
      audioSingleton.token = null;
      subscribers.forEach((cb) => cb(null));
    }
  });
  audio.play().catch(() => {});
  audioSingleton.audio = audio;
  audioSingleton.token = token;
  subscribers.forEach((cb) => cb(token));
}

export function useCurrentToken() {
  const [token, setToken] = useState<string | null>(audioSingleton.token);
  useEffect(() => {
    subscribers.add(setToken);
    return () => {
      subscribers.delete(setToken);
    };
  }, []);
  return token;
}

# Importing the site into Figma

The dev server has a `?capture` mode that pauses videos, kills CSS transitions, and adds stable IDs and `aria-label`s on every section so an importer reads sensible layer names instead of `div_3a4f`.

## Capture URL

```
http://localhost:3000/?capture
```

What `?capture` changes (everything else is identical to normal browsing):

- `<html>` gets a `capture` class → all `transition` / `animation` durations forced to 0
- All `<video>` elements paused on a 100 ms tick for the first 2 s, so the okarina and hero background stop on a deterministic frame
- Scroll behavior switches from smooth to instant

## Recommended viewport

- **Desktop frame**: 1440 × 900
- **Mobile frame**: 375 × 812

The hero is `100svh` so both viewports render a one-screen hero followed by the scrolled content sections. Capture each section separately by scrolling, or capture the full page in one pass.

## Layer naming hooks

Importers that respect `aria-label` will pick these up automatically. All section landmarks have one:

| Element | id | aria-label |
|---|---|---|
| Hero | `top` | `Hero` |
| Incantation | `incantation` | `Incantation` |
| Sonic Relics | `sonic-relics` | `Sonic Relics` |
| Bloodline | `bloodline` | `Bloodline` |
| Covenant | `covenant` | `Covenant` |
| Hero card | `hero-card` | — |
| Floating okarina | `okarina-player` | — |
| Sticky instruments list | — | `Instruments` |

Per-instrument blocks inside Sonic Relics use the instrument slug as their `id` (`#cifteli`, `#flutes`, `#bagpipe`, `#leaf`, `#lahuta`, `#jaw-harp`, `#okarina`, `#shawm`).

## Recommended importers

- **html.to.design** — Chrome extension. Open the capture URL, click the extension icon, select "Capture full page". Honors `aria-label`s.
- **Builder.io Visual Copilot** — Has a "Import from URL" mode. Point at the capture URL with a public tunnel (ngrok/cloudflared) since it runs server-side.
- **Figma Dev Mode (paid)** — If you have a Figma plan with Dev Mode, the "Inspect URL" feature can also ingest the running site.

## Capture procedure

1. Open `http://localhost:3000/?capture` in a Chromium-based browser.
2. Resize the window to **1440 × 900** (or use DevTools device toolbar).
3. Scroll to top — confirm the okarina + hero card are both visible side-by-side.
4. Run the importer over the full page (most tools capture all of `document.body` regardless of scroll position).
5. After import: rename top-level frames in Figma to match the section landmarks (Hero, Incantation, Sonic Relics, Bloodline, Covenant) if the importer didn't.

## Fonts

Four custom WOFF2 fonts are served from `/public/fonts/`. Importers that fetch CSS will pick them up; ones that only screenshot will rasterize the text. The font CSS variables are:

- `--font-sans` — Neue Montreal Bold
- `--font-display` — HW Cigars Regular (editorial serif used for headlines)
- `--font-script` — Imperial Script
- `--font-wordmark` — Cambrine Stitched (used only for the "Nototeka" wordmark)

## Color tokens

Defined in `src/app/globals.css` under `@theme inline`:

```
g1 = #ffffff   g2 = #f4f4f4   g3 = #ececec
g4 = #c9c9c9   g5 = #8c8c8c   g6 = #2a2a2a   g7 = #000000
```

Recreate these as variables in Figma if rebuilding the design system there.

# Nototeka — Figma Builder Plugin

A local Figma plugin that programmatically rebuilds the Nototeka site as a 1440px-wide Figma frame. Includes Header, Hero, Incantation, Sonic Relics (with all 8 instrument blocks), Bloodline, Covenant, and Footer.

## Install (one-time)

1. Open **Figma Desktop** (not the browser version — local plugin import requires the desktop app).
2. Create or open the Figma file you want the design to land in.
3. Top menu → **Plugins → Development → Import plugin from manifest...**
4. Select `figma-plugin/manifest.json` from this repo.

The plugin "Nototeka — Build Site" now appears under **Plugins → Development**.

## Run

1. **Plugins → Development → Nototeka — Build Site**
2. Wait a few seconds — the plugin loads fonts, then constructs the page.
3. The Figma viewport auto-zooms onto the new frame, which is named `Nototeka`.

Re-running the plugin creates another copy 200px to the right of any existing content, so you can safely run it multiple times.

## What you get

- Top-level frame `Nototeka` (1440×~8000px, vertical auto-layout)
  - `SiteHeader` — wordmark + nav
  - `Hero` — okarina placeholder (gray oval) overlapping the dark frosted card with the 8-instrument grid
  - `Incantation` — heading + 5-line list
  - `SonicRelics` — heading + 8 instrument blocks, each with samples list
  - `Bloodline` — 5 custodian rows
  - `Covenant` — closing heading + two credits
  - `SiteFooter` — tagline, link row, copyright

Every section uses Figma auto-layout, so resizing the parent reflows the children correctly.

## Fonts used

The site uses four licensed local fonts. The plugin substitutes Google Fonts that ship with Figma so it always runs:

| Site CSS variable | Source font | Plugin substitute |
|---|---|---|
| `--font-sans` | Neue Montreal Bold | Inter Bold |
| `--font-display` | HW Cigars | Cormorant Garamond |
| `--font-script` | Imperial Script | Tangerine |
| `--font-wordmark` | Cambrine Stitched | Pirata One |

To match the exact site typography after import: select each text node → assign the licensed font in Figma. If you've added the WOFF2 files to your Figma org, Figma will pick them up automatically.

## Limitations vs. the live site

- **Okarina + hero background**: rendered as a static gray oval placeholder. The site's video filter chain (luma key + multiply blend) can't be reproduced in Figma. Drag a still frame of `public/videos/okarina-360.mp4` onto the `Okarina` frame after import to replace it.
- **Hover/scroll states**: Figma is static. The hero crossfade / okarina migration / instruments rail reveal are all single-state snapshots.
- **Backdrop blur on the hero card**: rendered as a flat dark fill. Add a `Background blur` effect manually if you want the frosted look.

## Customizing the build

The data structures (`HERO_INSTRUMENTS`, `FEATURES`, `INSTRUMENTS`, `CUSTODIANS`, etc.) live at the top of `code.js`. Edit them and re-run the plugin to regenerate with different content. Constants like `PAGE_W` and the `C` (color) / `FONTS` maps are also top-of-file.

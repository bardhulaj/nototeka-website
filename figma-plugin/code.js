// Nototeka — Figma builder plugin
// Builds the full 1440px desktop page (Header, Hero, Incantation,
// Sonic Relics, Bloodline, Covenant, Footer) on the current Figma page.
// Fonts are substituted to Google Fonts that ship with Figma.

const PAGE_W = 1440;

const C = {
  g1: { r: 1, g: 1, b: 1 },
  g2: { r: 0.957, g: 0.957, b: 0.957 },
  g3: { r: 0.925, g: 0.925, b: 0.925 },
  g4: { r: 0.788, g: 0.788, b: 0.788 },
  g5: { r: 0.549, g: 0.549, b: 0.549 },
  g6: { r: 0.165, g: 0.165, b: 0.165 },
  g7: { r: 0, g: 0, b: 0 },
};

const FONTS = {
  sans: { family: "Inter", style: "Bold" },
  sansReg: { family: "Inter", style: "Regular" },
  display: { family: "Cormorant Garamond", style: "Regular" },
  displayMd: { family: "Cormorant Garamond", style: "Medium" },
  displayItalic: { family: "Cormorant Garamond", style: "Italic" },
  script: { family: "Tangerine", style: "Regular" },
  wordmark: { family: "Pirata One", style: "Regular" },
};

async function loadFonts() {
  const families = Object.values(FONTS);
  for (const f of families) {
    try {
      await figma.loadFontAsync(f);
    } catch (e) {
      // Fall back to Inter Regular if a font isn't available
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    }
  }
}

function solid(color, opacity) {
  return { type: "SOLID", color, opacity: opacity == null ? 1 : opacity };
}

function makeText(content, font, size, color, opts) {
  const t = figma.createText();
  t.fontName = font;
  t.fontSize = size;
  t.characters = content;
  t.fills = [solid(color, opts && opts.opacity)];
  if (opts && opts.lineHeight) {
    t.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
  }
  if (opts && opts.letterSpacing) {
    t.letterSpacing = { value: opts.letterSpacing, unit: "PERCENT" };
  }
  if (opts && opts.uppercase) {
    t.textCase = "UPPER";
  }
  if (opts && opts.textAlign) {
    t.textAlignHorizontal = opts.textAlign;
  }
  if (opts && opts.width) {
    t.resize(opts.width, t.height);
    t.textAutoResize = "HEIGHT";
  }
  if (opts && opts.name) t.name = opts.name;
  return t;
}

function autoLayout(name, direction, opts) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.fills = [];
  if (opts) {
    if (opts.paddingX != null) {
      f.paddingLeft = opts.paddingX;
      f.paddingRight = opts.paddingX;
    }
    if (opts.paddingY != null) {
      f.paddingTop = opts.paddingY;
      f.paddingBottom = opts.paddingY;
    }
    if (opts.padding != null) {
      f.paddingLeft = f.paddingRight = f.paddingTop = f.paddingBottom = opts.padding;
    }
    if (opts.gap != null) f.itemSpacing = opts.gap;
    if (opts.fill) f.fills = [solid(opts.fill)];
    if (opts.align) {
      f.primaryAxisAlignItems = opts.align;
    }
    if (opts.crossAlign) {
      f.counterAxisAlignItems = opts.crossAlign;
    }
    if (opts.width != null) {
      f.primaryAxisSizingMode = direction === "HORIZONTAL" ? "FIXED" : "AUTO";
      f.counterAxisSizingMode = direction === "VERTICAL" ? "FIXED" : "AUTO";
      f.resize(opts.width, f.height);
    }
    if (opts.height != null) {
      f.resize(f.width, opts.height);
    }
    if (opts.cornerRadius != null) f.cornerRadius = opts.cornerRadius;
    if (opts.strokeColor) {
      f.strokes = [solid(opts.strokeColor, opts.strokeOpacity)];
      f.strokeWeight = opts.strokeWeight || 1;
    }
  }
  return f;
}

// ─── Data ────────────────────────────────────────────────────────────────

const HEADER_NAV = ["Editions", "The Archive"];

const HERO_INSTRUMENTS = [
  "Çifteli", "Flutes",
  "Bagpipe", "Leaf",
  "Lahuta", "Jaw Harp",
  "Okarina", "Shawm",
];

const FEATURES = [
  "Nototeka",
  "Gent Gjonbalaj",
  "Prishtina, Kosovo",
  "A digital sanctuary for the ancestral echoes of Albania.",
  "To capture, preserve, and release the spirits of vanishing instruments — offering their voices to the modern seeker, the sonic researcher, and the keepers of global memory.",
];

const INSTRUMENTS = [
  { name: "Çifteli", tagline: "Two-string lute", description: "Captured in both the chromatic scale and its primordial tuning — the plucked voice of the highlands, equal parts melody and oath.", samples: [["Chromatic single note","0:02"],["Primordial tuning, sustained","0:08"],["Strummed chord","0:03"],["Rhythmic phrase loop","0:12"]] },
  { name: "Flutes", tagline: "Wooden breath instruments", description: "A trio of carved flutes, one of them a hundred and fifty years old — captured in the breath that has outlived every voice that ever played it.", samples: [["Single breath, low register","0:04"],["Held note · 150-year flute","0:09"],["Ornamented phrase","0:06"],["Trill, ascending","0:03"]] },
  { name: "Bagpipe", tagline: "Wind of the highlands", description: "The wind of the highlands, summoned through hollow reed. A drone that anchors the dance and carries it forward.", samples: [["Drone loop","0:16"],["Melodic phrase over drone","0:11"],["Sustained reed note","0:07"]] },
  { name: "Leaf", tagline: "Nature's own reed", description: "Melody drawn from a living blade — the most fragile resonance in the archive, captured between breath and silence.", samples: [["Soft trill","0:03"],["Whistled note, sustained","0:05"],["Tremolo phrase","0:04"]] },
  { name: "Lahuta", tagline: "Epic string of the mountains", description: "Single-stringed and bowed — the voice of the rhapsode, the instrument that carries the long epic of the land.", samples: [["Bowed single string","0:06"],["Sustained drone, low","0:14"],["Epic phrase fragment","0:10"]] },
  { name: "Jaw Harp", tagline: "Primal resonance", description: "Tongue, breath, and bone. The oldest mouth-resonator on the page — captured rhythmic, sustained, and modulated.", samples: [["Single twang","0:01"],["Rhythmic loop","0:08"],["Modulated bend","0:04"]] },
  { name: "Okarina", tagline: "Earthen vessel", description: "Clay whistled into ancient memory. The okarina sits at the intersection of breath and earth — round, hollow, ceremonial.", samples: [["Single tone, mid register","0:03"],["Phrase, melodic","0:07"],["Held note, vibrato","0:09"]] },
  { name: "Shawm", tagline: "Double-reed call", description: "Courtly, ceremonial, eternal. The double-reed call that opens processions and closes them — a sound made to carry across distance.", samples: [["Single reed call","0:04"],["Sustained note","0:08"],["Phrase, ascending","0:06"]] },
];

const CUSTODIANS = [
  { name: "Hysen Kurtaj", role: "Master of the Lahuta", note: "The epic string of the mountains lives in the cup of his hand." },
  { name: "Fatmir Makolli", role: "Keeper of the Çifteli, Bagpipe, and Flute", note: "Three winds, three woods, one lineage — held in steady breath." },
  { name: "Sokol Plakolli", role: "Guardian of the 150-year-old Flute", note: "Custodian of a single instrument older than every voice that ever played it." },
  { name: "Vesel Nikci", role: "Summoner of the Leaf", note: "Coaxes melody from a living blade — the most fragile resonance of all." },
  { name: "Sherif Zabelaj", role: "Voice of the Okarina, Shawm, and Jaw Harp", note: "Holds the primal resonance: clay, reed, and the body itself." },
];

// ─── Section builders ────────────────────────────────────────────────────

function buildHeader() {
  const h = autoLayout("SiteHeader", "HORIZONTAL", {
    width: PAGE_W, height: 56, paddingX: 64, gap: 24,
    crossAlign: "CENTER", align: "SPACE_BETWEEN", fill: C.g1,
  });
  h.counterAxisSizingMode = "FIXED";

  const logo = makeText("Nototeka", FONTS.wordmark, 24, C.g7, { name: "Wordmark" });
  h.appendChild(logo);

  const nav = autoLayout("Nav", "HORIZONTAL", { gap: 24, crossAlign: "CENTER" });
  for (const item of HEADER_NAV) {
    nav.appendChild(makeText(item, FONTS.sans, 14, C.g7, { name: item }));
  }
  h.appendChild(nav);
  return h;
}

function buildHeroCard() {
  const card = autoLayout("HeroCard", "VERTICAL", {
    width: 320, gap: 0, fill: C.g6, cornerRadius: 16,
  });
  card.clipsContent = true;

  const head = autoLayout("CardHead", "VERTICAL", {
    paddingX: 20, paddingY: 40, gap: 20, crossAlign: "CENTER",
  });
  head.layoutSizingHorizontal = head.parent ? head.layoutSizingHorizontal : undefined;

  const title = makeText("Nototeka", FONTS.wordmark, 52, C.g1, {
    name: "Title", textAlign: "CENTER",
  });
  const tag1 = makeText("A digital sanctuary for the", FONTS.display, 20, C.g1, {
    textAlign: "CENTER", opacity: 0.95,
  });
  const tag2 = makeText("ancestral echoes of Albania.", FONTS.display, 20, C.g1, {
    textAlign: "CENTER", opacity: 0.95,
  });
  head.appendChild(title);
  head.appendChild(tag1);
  head.appendChild(tag2);
  card.appendChild(head);

  const grid = autoLayout("Instruments", "VERTICAL", { gap: 0 });
  for (let row = 0; row < 4; row++) {
    const r = autoLayout("Row", "HORIZONTAL", { gap: 0 });
    for (let col = 0; col < 2; col++) {
      const i = row * 2 + col;
      const cell = autoLayout(HERO_INSTRUMENTS[i], "HORIZONTAL", {
        paddingX: 16, paddingY: 12, gap: 12, align: "SPACE_BETWEEN", crossAlign: "CENTER",
      });
      cell.counterAxisSizingMode = "FIXED";
      cell.primaryAxisSizingMode = "FIXED";
      cell.resize(160, 44);
      cell.strokes = [solid(C.g1, 0.2)];
      cell.strokeWeight = 1;
      cell.strokeAlign = "INSIDE";
      const name = makeText(HERO_INSTRUMENTS[i], FONTS.display, 18, C.g1, {});
      const tri = figma.createPolygon();
      tri.pointCount = 3;
      tri.resize(8, 8);
      tri.fills = [];
      tri.strokes = [solid(C.g1, 0.7)];
      tri.strokeWeight = 1;
      tri.rotation = -90;
      cell.appendChild(name);
      cell.appendChild(tri);
      r.appendChild(cell);
    }
    grid.appendChild(r);
  }
  card.appendChild(grid);
  return card;
}

function buildHero() {
  const hero = autoLayout("Hero", "HORIZONTAL", {
    width: PAGE_W, height: 900, fill: C.g1, align: "CENTER", crossAlign: "CENTER", gap: 0,
  });
  hero.counterAxisSizingMode = "FIXED";

  // Stage centers the okarina+card group horizontally
  const stage = autoLayout("Group", "HORIZONTAL", {
    gap: -60, crossAlign: "CENTER",
  });

  // Okarina placeholder — a 480×480 frame with stone-ish gray and
  // an oval silhouette. Replace with your own image after import.
  const okPlaceholder = figma.createFrame();
  okPlaceholder.name = "Okarina";
  okPlaceholder.resize(480, 480);
  okPlaceholder.fills = [];
  const oval = figma.createEllipse();
  oval.name = "Silhouette";
  oval.resize(340, 460);
  oval.x = 70;
  oval.y = 10;
  oval.fills = [solid(C.g5)];
  okPlaceholder.appendChild(oval);
  stage.appendChild(okPlaceholder);

  stage.appendChild(buildHeroCard());
  hero.appendChild(stage);
  return hero;
}

function buildSectionShell(name, w) {
  const s = autoLayout(name, "VERTICAL", {
    width: w, paddingX: 64, paddingY: 128, gap: 64, fill: C.g1,
  });
  s.counterAxisSizingMode = "FIXED";
  return s;
}

function buildSectionHeading(headline, blurb, ratio) {
  const row = autoLayout("Heading", "HORIZONTAL", { gap: 64, crossAlign: "MIN" });
  row.layoutSizingHorizontal = "FILL";
  const h = makeText(headline, FONTS.display, 56, C.g7, { width: 560 });
  h.layoutSizingHorizontal = "FIXED";
  row.appendChild(h);
  const p = makeText(blurb, FONTS.display, 20, C.g7, { width: 360, opacity: 0.7 });
  p.layoutSizingHorizontal = "FIXED";
  row.appendChild(p);
  return row;
}

function dividerRow(items) {
  const row = autoLayout("Row", "HORIZONTAL", {
    gap: 16, paddingY: 32, align: "SPACE_BETWEEN", crossAlign: "CENTER",
  });
  row.layoutSizingHorizontal = "FILL";
  row.strokes = [solid(C.g7, 0.15)];
  row.strokeTopWeight = 1;
  row.strokeBottomWeight = 0;
  row.strokeLeftWeight = 0;
  row.strokeRightWeight = 0;
  for (const it of items) row.appendChild(it);
  return row;
}

function buildIncantation() {
  const s = buildSectionShell("Incantation", PAGE_W);
  s.appendChild(buildSectionHeading(
    "The incantation that binds the archive.",
    "Five lines — a foundation carved in light upon the gold leaf of an illuminated page.",
  ));
  const list = autoLayout("Features", "VERTICAL", { gap: 0 });
  list.layoutSizingHorizontal = "FILL";
  for (const f of FEATURES) {
    list.appendChild(dividerRow([
      makeText(f, FONTS.display, 28, C.g7, { width: 1100 }),
    ]));
  }
  s.appendChild(list);
  return s;
}

function buildInstrumentBlock(inst, idx) {
  const block = autoLayout("Instrument: " + inst.name, "HORIZONTAL", {
    gap: 64, paddingY: 48, crossAlign: "MIN",
  });
  block.layoutSizingHorizontal = "FILL";
  block.strokes = [solid(C.g7, 0.15)];
  block.strokeTopWeight = 1;
  block.strokeBottomWeight = 0;
  block.strokeLeftWeight = 0;
  block.strokeRightWeight = 0;

  const left = autoLayout("Meta", "VERTICAL", { gap: 12, width: 480 });
  left.layoutSizingHorizontal = "FIXED";
  const num = makeText(String(idx + 1).padStart(2, "0") + " / 08", FONTS.sansReg, 11, C.g7, {
    uppercase: true, letterSpacing: 16, opacity: 0.5,
  });
  const name = makeText(inst.name, FONTS.display, 48, C.g7, {});
  const tag = makeText(inst.tagline, FONTS.display, 12, C.g7, { uppercase: true, letterSpacing: 12, opacity: 0.6 });
  const desc = makeText(inst.description, FONTS.display, 20, C.g7, { width: 440, opacity: 0.75 });
  left.appendChild(num);
  left.appendChild(name);
  left.appendChild(tag);
  left.appendChild(desc);
  block.appendChild(left);

  const right = autoLayout("Samples", "VERTICAL", { gap: 0 });
  right.layoutSizingHorizontal = "FILL";
  for (let i = 0; i < inst.samples.length; i++) {
    const [sname, dur] = inst.samples[i];
    const r = autoLayout("Row", "HORIZONTAL", {
      gap: 16, paddingY: 12, align: "SPACE_BETWEEN", crossAlign: "CENTER",
    });
    r.layoutSizingHorizontal = "FILL";
    r.strokes = [solid(C.g7, 0.15)];
    r.strokeTopWeight = i === 0 ? 1 : 1;
    r.strokeBottomWeight = i === inst.samples.length - 1 ? 1 : 0;
    r.strokeLeftWeight = 0;
    r.strokeRightWeight = 0;
    const idxStr = makeText(String(i + 1).padStart(2, "0"), FONTS.sansReg, 11, C.g7, {
      uppercase: true, opacity: 0.5,
    });
    idxStr.resize(32, idxStr.height);
    const lbl = makeText(sname, FONTS.display, 20, C.g7, { opacity: 0.85 });
    lbl.layoutGrow = 1;
    const time = makeText(dur, FONTS.display, 12, C.g7, { opacity: 0.5 });
    const play = figma.createPolygon();
    play.pointCount = 3;
    play.resize(16, 16);
    play.rotation = -90;
    play.fills = [];
    play.strokes = [solid(C.g7, 0.7)];
    play.strokeWeight = 1;
    r.appendChild(idxStr);
    r.appendChild(lbl);
    r.appendChild(time);
    r.appendChild(play);
    right.appendChild(r);
  }
  block.appendChild(right);
  return block;
}

function buildSonicRelics() {
  const s = buildSectionShell("SonicRelics", PAGE_W);
  s.appendChild(buildSectionHeading(
    "Ten ancient lineages, distilled into fifty distinct auditory shadows.",
    "High-fidelity one-shots and rhythmic loops, rendered in MP3, WAV, and FLAC. The breath of a vanishing world, offered to the makers of the next.",
  ));
  const list = autoLayout("Instruments", "VERTICAL", { gap: 96 });
  list.layoutSizingHorizontal = "FILL";
  INSTRUMENTS.forEach((inst, i) => list.appendChild(buildInstrumentBlock(inst, i)));
  s.appendChild(list);
  return s;
}

function buildBloodline() {
  const s = buildSectionShell("Bloodline", PAGE_W);
  s.appendChild(buildSectionHeading(
    "The custodians who hold the breath of a vanishing world.",
    "Five masters. A bloodline of voices, each one carrying an instrument the way the soil carries a seed.",
  ));
  const list = autoLayout("Custodians", "VERTICAL", { gap: 0 });
  list.layoutSizingHorizontal = "FILL";
  for (const c of CUSTODIANS) {
    const row = autoLayout("Custodian", "HORIZONTAL", {
      gap: 64, paddingY: 32, crossAlign: "MIN",
    });
    row.layoutSizingHorizontal = "FILL";
    row.strokes = [solid(C.g7, 0.15)];
    row.strokeTopWeight = 1;
    row.strokeBottomWeight = 0;
    row.strokeLeftWeight = 0;
    row.strokeRightWeight = 0;
    const left = autoLayout("Person", "VERTICAL", { gap: 8, width: 540 });
    left.layoutSizingHorizontal = "FIXED";
    left.appendChild(makeText(c.name, FONTS.display, 28, C.g7, {}));
    left.appendChild(makeText(c.role, FONTS.sansReg, 11, C.g7, { uppercase: true, letterSpacing: 16, opacity: 0.6 }));
    row.appendChild(left);
    const note = makeText(c.note, FONTS.displayItalic, 20, C.g7, { opacity: 0.7 });
    note.layoutGrow = 1;
    row.appendChild(note);
    list.appendChild(row);
  }
  // Bottom border on the last row's container
  list.strokes = [solid(C.g7, 0.15)];
  list.strokeBottomWeight = 1;
  list.strokeTopWeight = 0;
  list.strokeLeftWeight = 0;
  list.strokeRightWeight = 0;
  s.appendChild(list);
  return s;
}

function buildCovenant() {
  const s = buildSectionShell("Covenant", PAGE_W);
  const heading = makeText(
    "Held in the grace of those who carry it forward.",
    FONTS.display, 64, C.g7, { width: 900, textAlign: "CENTER" },
  );
  const headWrap = autoLayout("HeadingWrap", "HORIZONTAL", { align: "CENTER", crossAlign: "CENTER" });
  headWrap.layoutSizingHorizontal = "FILL";
  headWrap.appendChild(heading);
  s.appendChild(headWrap);

  const credits = autoLayout("Credits", "HORIZONTAL", { gap: 96, paddingY: 64, align: "SPACE_BETWEEN" });
  credits.layoutSizingHorizontal = "FILL";

  const c1 = autoLayout("ArchitectCredit", "VERTICAL", { gap: 24, width: 480 });
  c1.layoutSizingHorizontal = "FIXED";
  c1.appendChild(makeText("Gent Gjonbalaj", FONTS.display, 28, C.g7, {}));
  c1.appendChild(makeText(
    "Architect of the sanctuary, summoning what was nearly lost into a form that endures.",
    FONTS.display, 20, C.g7, { width: 360, opacity: 0.7 },
  ));
  credits.appendChild(c1);

  const c2 = autoLayout("PatronCredit", "VERTICAL", { gap: 24, width: 480 });
  c2.layoutSizingHorizontal = "FIXED";
  c2.appendChild(makeText("The Ministry of Culture, Youth and Sports of Kosovo", FONTS.display, 28, C.g7, { width: 460 }));
  c2.appendChild(makeText(
    "Held in grace and support — that the breath of these instruments may travel to the generations yet to be born.",
    FONTS.display, 20, C.g7, { width: 460, opacity: 0.7 },
  ));
  credits.appendChild(c2);
  s.appendChild(credits);
  return s;
}

function buildFooter() {
  const f = autoLayout("SiteFooter", "VERTICAL", {
    width: PAGE_W, paddingX: 64, paddingY: 64, gap: 64, fill: C.g1,
  });
  f.counterAxisSizingMode = "FIXED";

  const top = autoLayout("FooterTop", "HORIZONTAL", { gap: 64, align: "SPACE_BETWEEN", crossAlign: "MAX" });
  top.layoutSizingHorizontal = "FILL";
  const tag = makeText(
    "Nototeka — a digital sanctuary for the ancestral echoes of Albania.",
    FONTS.display, 28, C.g7, { width: 560 },
  );
  top.appendChild(tag);
  const links = autoLayout("Links", "HORIZONTAL", { gap: 40 });
  for (const item of ["The Archive", "Licensing", "Contact"]) {
    links.appendChild(makeText(item, FONTS.display, 20, C.g7, { opacity: 0.7 }));
  }
  top.appendChild(links);
  f.appendChild(top);

  const bottom = autoLayout("FooterBottom", "HORIZONTAL", {
    gap: 32, paddingY: 32, align: "SPACE_BETWEEN", crossAlign: "CENTER",
  });
  bottom.layoutSizingHorizontal = "FILL";
  bottom.strokes = [solid(C.g7, 0.15)];
  bottom.strokeTopWeight = 1;
  bottom.strokeBottomWeight = 0;
  bottom.strokeLeftWeight = 0;
  bottom.strokeRightWeight = 0;
  bottom.appendChild(makeText("© MMXXVI Nototeka · Prishtina, Kosovo", FONTS.sansReg, 11, C.g7, { uppercase: true, letterSpacing: 16, opacity: 0.6 }));
  bottom.appendChild(makeText("Held in patronage of the Ministry of Culture, Youth and Sports of Kosovo", FONTS.sansReg, 11, C.g7, { uppercase: true, letterSpacing: 16, opacity: 0.6 }));
  f.appendChild(bottom);
  return f;
}

// ─── Entry point ─────────────────────────────────────────────────────────

async function main() {
  await loadFonts();

  // Pick a free spot on the page
  let maxX = 0;
  for (const child of figma.currentPage.children) {
    maxX = Math.max(maxX, child.x + child.width);
  }

  const root = autoLayout("Nototeka", "VERTICAL", {
    width: PAGE_W, gap: 0, fill: C.g1,
  });
  root.x = maxX + 200;
  root.y = 0;

  root.appendChild(buildHeader());
  root.appendChild(buildHero());
  root.appendChild(buildIncantation());
  root.appendChild(buildSonicRelics());
  root.appendChild(buildBloodline());
  root.appendChild(buildCovenant());
  root.appendChild(buildFooter());

  figma.currentPage.appendChild(root);
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("Nototeka built ✓");
  figma.closePlugin();
}

main().catch((e) => {
  console.error(e);
  figma.notify("Build failed: " + (e && e.message ? e.message : e), { error: true });
  figma.closePlugin();
});

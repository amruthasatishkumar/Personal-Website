// One-time generator for the "From P to F" blog images.
// Run with: node scripts/make-p-to-f-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slug = "from-p-to-f-migrating-power-bi-premium-to-fabric-capacity";
const outDir = join(__dirname, "..", "public", "images", "blog", slug);
mkdirSync(outDir, { recursive: true });

const defs = `
  <defs>
    <linearGradient id="text" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="45%" stop-color="#7c5cff"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow1" cx="18%" cy="18%" r="55%">
      <stop offset="0%" stop-color="#7c5cff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#7c5cff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="88%" cy="92%" r="55%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#4f7cff"/>
    </marker>
  </defs>`;

const cover = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="1200" height="630" fill="#07080f"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <g font-family="Segoe UI, Arial, sans-serif">
    <text x="80" y="120" fill="#22d3ee" font-size="24" font-weight="700" letter-spacing="6">BUILD WITH AMRUTHA</text>
    <text x="76" y="300" fill="url(#text)" font-size="128" font-weight="800" letter-spacing="-3">From P to F</text>
    <text x="80" y="372" fill="#e8eaf3" font-size="38" font-weight="600">Migrating Power BI Premium to Fabric capacity</text>
    <text x="80" y="426" fill="#9aa3bd" font-size="26" font-weight="400">P SKUs retire  .  F SKUs take over  .  what changes and how to move</text>
    <rect x="80" y="520" width="56" height="6" rx="3" fill="url(#text)"/>
    <text x="80" y="566" fill="#6b7392" font-size="26" font-weight="600">buildwithamrutha.com</text>
  </g>
</svg>`;

const pCard = (x, y, w, h, label) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0e1018" stroke="#c084fc" stroke-opacity="0.55" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="#c084fc"/>
    <text x="${x + w / 2 + 3}" y="${y + h / 2 + 12}" fill="#e8eaf3" font-size="34" font-weight="800" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${label}</text>
  </g>`;

const fCard = (x, y, w, h, label) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0e1018" stroke="#22d3ee" stroke-opacity="0.6" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="#22d3ee"/>
    <text x="${x + w / 2 + 3}" y="${y + h / 2 + 12}" fill="#e8eaf3" font-size="34" font-weight="800" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${label}</text>
  </g>`;

const rowArrow = (x1, x2, y) => `
  <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#4f7cff" stroke-width="2.5" marker-end="url(#arrowhead)"/>`;

const meta = (x, y, txt) => `
  <text x="${x}" y="${y}" fill="#9aa3bd" font-size="18" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${txt}</text>`;

const rows = [
  { p: "P1", f: "F64", cu: "64 CU  .  8 v-cores" },
  { p: "P2", f: "F128", cu: "128 CU  .  16 v-cores" },
  { p: "P3", f: "F256", cu: "256 CU  .  32 v-cores" },
  { p: "P4", f: "F512", cu: "512 CU  .  64 v-cores" },
  { p: "P5", f: "F1024", cu: "1024 CU  .  128 v-cores" },
];

const pX = 150, fX = 720, cardW = 230, cardH = 78, gap = 34;
const startY = 210;

const rowsSvg = rows
  .map((r, i) => {
    const y = startY + i * (cardH + gap);
    const cy = y + cardH / 2;
    return `
    ${pCard(pX, y, cardW, cardH, r.p)}
    ${rowArrow(pX + cardW + 40, fX - 40, cy)}
    ${meta((pX + cardW + fX) / 2 + 3, cy - 14, r.cu)}
    ${fCard(fX, y, cardW, cardH, r.f)}`;
  })
  .join("\n");

const diagram = `
<svg width="1100" height="812" viewBox="0 0 1100 812" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="1100" height="812" fill="#07080f"/>
  <rect width="1100" height="812" fill="url(#glow1)"/>
  <rect width="1100" height="812" fill="url(#glow2)"/>
  <text x="80" y="86" fill="#e8eaf3" font-size="30" font-weight="700" font-family="Segoe UI, Arial, sans-serif">The P to F capacity map</text>
  <text x="80" y="126" fill="#9aa3bd" font-size="18" font-family="Segoe UI, Arial, sans-serif">Each Power BI Premium P SKU maps to a Fabric F SKU with the same compute.</text>
  <text x="${pX + cardW / 2 + 3}" y="180" fill="#c084fc" font-size="18" font-weight="700" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Power BI Premium (retiring)</text>
  <text x="${fX + cardW / 2 + 3}" y="180" fill="#22d3ee" font-size="18" font-weight="700" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Microsoft Fabric</text>
  ${rowsSvg}
  <text x="80" y="792" fill="#6b7392" font-size="16" font-family="Segoe UI, Arial, sans-serif">F64 is the threshold where free users with a viewer role can read Power BI content.</text>
</svg>`;

await sharp(Buffer.from(cover)).png().toFile(join(outDir, "cover.png"));
await sharp(Buffer.from(diagram)).png().toFile(join(outDir, "skumap.png"));
console.log("Wrote cover.png and skumap.png to", outDir);

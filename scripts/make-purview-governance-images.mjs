// One-time generator for the "Data Governance with Microsoft Purview" blog images.
// Run with: node scripts/make-purview-governance-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slug = "data-governance-with-microsoft-purview";
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
    <text x="76" y="288" fill="url(#text)" font-size="104" font-weight="800" letter-spacing="-2">Data Governance</text>
    <text x="80" y="360" fill="#e8eaf3" font-size="42" font-weight="600">with Microsoft Purview</text>
    <text x="80" y="416" fill="#9aa3bd" font-size="26" font-weight="400">Governance domains  .  data products  .  quality  .  self-service access</text>
    <rect x="80" y="510" width="56" height="6" rx="3" fill="url(#text)"/>
    <text x="80" y="556" fill="#6b7392" font-size="26" font-weight="600">buildwithamrutha.com</text>
  </g>
</svg>`;

const productCard = (x, y, w, h, title, sub) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#0e1018" stroke="#4f7cff" stroke-opacity="0.6" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="#4f7cff"/>
    <text x="${x + 22}" y="${y + 44}" fill="#e8eaf3" font-size="21" font-weight="700" font-family="Segoe UI, Arial, sans-serif">${title}</text>
    <text x="${x + 22}" y="${y + 74}" fill="#9aa3bd" font-size="14" font-family="Segoe UI, Arial, sans-serif">${sub}</text>
  </g>`;

const chip = (x, y, w, label, accent) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="40" rx="20" fill="#0e1018" stroke="${accent}" stroke-opacity="0.6" stroke-width="1.5"/>
    <text x="${x + w / 2}" y="${y + 26}" fill="#cdd3e6" font-size="15" font-weight="600" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${label}</text>
  </g>`;

const band = (x, y, w, h, accent, title, sub) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#0e1018" stroke="${accent}" stroke-opacity="0.6" stroke-width="1.5"/>
    <text x="${x + w / 2}" y="${y + 40}" fill="#e8eaf3" font-size="22" font-weight="700" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${title}</text>
    <text x="${x + w / 2}" y="${y + 68}" fill="#9aa3bd" font-size="15" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${sub}</text>
  </g>`;

const diagram = `
<svg width="1100" height="720" viewBox="0 0 1100 720" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="1100" height="720" fill="#07080f"/>
  <rect width="1100" height="720" fill="url(#glow1)"/>
  <rect width="1100" height="720" fill="url(#glow2)"/>
  <text x="80" y="72" fill="#e8eaf3" font-size="29" font-weight="700" font-family="Segoe UI, Arial, sans-serif">Inside a Purview governance domain</text>
  <text x="80" y="106" fill="#9aa3bd" font-size="17" font-family="Segoe UI, Arial, sans-serif">Federated governance: central standards, distributed ownership.</text>

  <!-- Governance domain container -->
  <rect x="80" y="132" width="940" height="270" rx="20" fill="#0e1018" fill-opacity="0.4" stroke="#7c5cff" stroke-opacity="0.7" stroke-width="2"/>
  <rect x="80" y="132" width="6" height="270" rx="3" fill="#7c5cff"/>
  <text x="104" y="170" fill="#c9b8ff" font-size="18" font-weight="700" font-family="Segoe UI, Arial, sans-serif">Governance domain</text>
  <text x="270" y="170" fill="#9aa3bd" font-size="15" font-family="Segoe UI, Arial, sans-serif">e.g. Finance, Marketing (a mini catalog inside the catalog)</text>

  ${productCard(104, 188, 282, 100, "Data product: Revenue", "grouped tables, files, reports")}
  ${productCard(409, 188, 282, 100, "Data product: Customers", "grouped tables, files, reports")}
  ${productCard(714, 188, 282, 100, "Data product: Forecasts", "grouped tables, files, reports")}

  ${chip(104, 320, 300, "Glossary terms (policy-bearing)", "#c084fc")}
  ${chip(420, 320, 300, "Critical data elements", "#c084fc")}
  ${chip(736, 320, 260, "Access policies", "#c084fc")}

  <line x1="550" y1="402" x2="550" y2="440" stroke="#4f7cff" stroke-width="2.5" marker-end="url(#arrowhead)"/>
  ${band(80, 448, 940, 92, "#22d3ee", "Data quality + health", "Scores at asset, data product, and domain levels  .  health controls and actions")}

  <line x1="550" y1="540" x2="550" y2="578" stroke="#4f7cff" stroke-width="2.5" marker-end="url(#arrowhead)"/>
  ${band(80, 586, 940, 92, "#4f7cff", "Consumers", "Search and browse  .  self-service access requests, governed by policy")}
</svg>`;

await sharp(Buffer.from(cover)).png().toFile(join(outDir, "cover.png"));
await sharp(Buffer.from(diagram)).png().toFile(join(outDir, "purview-governance.png"));
console.log("Wrote cover.png and purview-governance.png to", outDir);

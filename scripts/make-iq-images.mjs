// One-time generator for the Microsoft IQ blog images.
// Run with: node scripts/make-iq-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slug = "microsoft-iq-the-intelligence-layer-behind-enterprise-agents";
const outDir = join(__dirname, "..", "public", "images", "blog", slug);
mkdirSync(outDir, { recursive: true });

const msLogo = (x, y, s) => {
  const g = s * 0.06;
  const c = (s - g) / 2;
  return `
    <g>
      <rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#F25022"/>
      <rect x="${x + c + g}" y="${y}" width="${c}" height="${c}" fill="#7FBA00"/>
      <rect x="${x}" y="${y + c + g}" width="${c}" height="${c}" fill="#00A4EF"/>
      <rect x="${x + c + g}" y="${y + c + g}" width="${c}" height="${c}" fill="#FFB900"/>
    </g>`;
};

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
  </defs>`;

const cover = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="1200" height="630" fill="#07080f"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <g font-family="Segoe UI, Arial, sans-serif">
    <text x="80" y="120" fill="#22d3ee" font-size="24" font-weight="700" letter-spacing="6">BUILD WITH AMRUTHA</text>
    ${msLogo(80, 168, 56)}
    <text x="152" y="212" fill="#e8eaf3" font-size="34" font-weight="600">Microsoft</text>
    <text x="76" y="360" fill="url(#text)" font-size="140" font-weight="800" letter-spacing="-3">Microsoft IQ</text>
    <text x="80" y="432" fill="#e8eaf3" font-size="38" font-weight="600">The intelligence layer behind enterprise agents</text>
    <text x="80" y="486" fill="#9aa3bd" font-size="26" font-weight="400">Work IQ  .  Fabric IQ  .  Foundry IQ  .  Web IQ</text>
    <rect x="80" y="540" width="56" height="6" rx="3" fill="url(#text)"/>
    <text x="80" y="586" fill="#6b7392" font-size="26" font-weight="600">buildwithamrutha.com</text>
  </g>
</svg>`;

const card = (x, y, w, h, title, sub, accent) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#0e1018" stroke="${accent}" stroke-opacity="0.5" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${accent}"/>
    <text x="${x + 24}" y="${y + 42}" fill="#e8eaf3" font-size="23" font-weight="700" font-family="Segoe UI, Arial, sans-serif">${title}</text>
    <text x="${x + 24}" y="${y + 74}" fill="#9aa3bd" font-size="14" font-weight="400" font-family="Segoe UI, Arial, sans-serif">${sub}</text>
  </g>`;

const arrow = (x1, y1, x2, y2) => `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#4f7cff" stroke-width="2" marker-end="url(#arrowhead)"/>`;

const diagram = `
<svg width="1200" height="760" viewBox="0 0 1200 760" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
    <path d="M0,0 L8,3 L0,6 Z" fill="#4f7cff"/>
  </marker>
  <rect width="1200" height="760" fill="#07080f"/>
  <rect width="1200" height="760" fill="url(#glow1)"/>
  <rect width="1200" height="760" fill="url(#glow2)"/>
  <text x="80" y="88" fill="#e8eaf3" font-size="30" font-weight="700" font-family="Segoe UI, Arial, sans-serif">The Microsoft IQ family</text>
  <text x="80" y="128" fill="#9aa3bd" font-size="18" font-family="Segoe UI, Arial, sans-serif">Knowledge sources feed a unified layer that grounds every agent.</text>
  ${card(80, 170, 245, 112, "Work IQ", "Emails, meetings, files, Teams", "#7c5cff")}
  ${card(345, 170, 245, 112, "Fabric IQ", "Ontology + data agents", "#4f7cff")}
  ${card(610, 170, 245, 112, "Web IQ", "Grounded web retrieval", "#22d3ee")}
  ${card(875, 170, 245, 112, "Files, SQL, MCP", "Other connected sources", "#c084fc")}
  ${arrow(202, 288, 560, 386)}
  ${arrow(467, 288, 582, 386)}
  ${arrow(732, 288, 618, 386)}
  ${arrow(997, 288, 640, 386)}
  <rect x="300" y="392" width="600" height="120" rx="20" fill="#0e1018" stroke="#7c5cff" stroke-opacity="0.7" stroke-width="2"/>
  <text x="600" y="440" fill="url(#text)" font-size="30" font-weight="800" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Foundry IQ</text>
  <text x="600" y="476" fill="#cdd3e6" font-size="17" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Unified knowledge base  .  agentic retrieval  .  permission aware</text>
  <text x="600" y="500" fill="#9aa3bd" font-size="15" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Exposed to any agent through the Foundry IQ MCP server</text>
  ${arrow(600, 518, 600, 588)}
  <rect x="300" y="596" width="600" height="100" rx="20" fill="#0e1018" stroke="#22d3ee" stroke-opacity="0.6" stroke-width="1.5"/>
  <text x="600" y="640" fill="#e8eaf3" font-size="24" font-weight="700" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Your agents</text>
  <text x="600" y="672" fill="#9aa3bd" font-size="16" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Microsoft 365 Copilot, custom agents, and MCP compatible hosts</text>
</svg>`;

await sharp(Buffer.from(cover)).png().toFile(join(outDir, "cover.png"));
await sharp(Buffer.from(diagram)).png().toFile(join(outDir, "iq-family.png"));
console.log("Wrote cover.png and iq-family.png to", outDir);

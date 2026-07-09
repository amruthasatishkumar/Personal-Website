// One-time generator for the "Ontologies vs Semantic Models" blog images.
// Run with: node scripts/make-ontology-semantic-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slug = "ontologies-vs-semantic-models-what-they-mean-for-data-agents-and-power-bi";
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
    <marker id="up" markerWidth="12" markerHeight="12" refX="3" refY="3" orient="auto">
      <path d="M0,6 L3,0 L6,6 Z" fill="#4f7cff"/>
    </marker>
    <marker id="right" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6 Z" fill="#9aa3bd"/>
    </marker>
  </defs>`;

const cover = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="1200" height="630" fill="#07080f"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>
  <g font-family="Segoe UI, Arial, sans-serif">
    <text x="80" y="118" fill="#22d3ee" font-size="24" font-weight="700" letter-spacing="6">BUILD WITH AMRUTHA</text>
    <text x="76" y="252" fill="url(#text)" font-size="86" font-weight="800" letter-spacing="-2">Ontologies vs</text>
    <text x="76" y="342" fill="url(#text)" font-size="86" font-weight="800" letter-spacing="-2">Semantic Models</text>
    <text x="80" y="404" fill="#e8eaf3" font-size="32" font-weight="600">What they mean for data agents and Power BI</text>
    <rect x="80" y="470" width="56" height="6" rx="3" fill="url(#text)"/>
    <text x="80" y="516" fill="#6b7392" font-size="26" font-weight="600">buildwithamrutha.com</text>
  </g>
</svg>`;

const card = (x, y, w, h, accent, title, l1, l2) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0e1018" stroke="${accent}" stroke-opacity="0.6" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${accent}"/>
    <text x="${x + 24}" y="${y + 44}" fill="#e8eaf3" font-size="22" font-weight="700" font-family="Segoe UI, Arial, sans-serif">${title}</text>
    <text x="${x + 24}" y="${y + 76}" fill="#cdd3e6" font-size="15" font-family="Segoe UI, Arial, sans-serif">${l1}</text>
    ${l2 ? `<text x="${x + 24}" y="${y + 100}" fill="#9aa3bd" font-size="14" font-family="Segoe UI, Arial, sans-serif">${l2}</text>` : ""}
  </g>`;

const band = (x, y, w, h, accent, title, sub) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0e1018" stroke="${accent}" stroke-opacity="0.6" stroke-width="1.5"/>
    <text x="${x + w / 2}" y="${y + 40}" fill="#e8eaf3" font-size="22" font-weight="700" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${title}</text>
    <text x="${x + w / 2}" y="${y + 68}" fill="#9aa3bd" font-size="15" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">${sub}</text>
  </g>`;

const upArrow = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#4f7cff" stroke-width="2.5" marker-end="url(#up)"/>`;

const diagram = `
<svg width="1100" height="720" viewBox="0 0 1100 720" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="1100" height="720" fill="#07080f"/>
  <rect width="1100" height="720" fill="url(#glow1)"/>
  <rect width="1100" height="720" fill="url(#glow2)"/>
  <text x="80" y="70" fill="#e8eaf3" font-size="28" font-weight="700" font-family="Segoe UI, Arial, sans-serif">Two layers, one foundation</text>
  <text x="80" y="103" fill="#9aa3bd" font-size="17" font-family="Segoe UI, Arial, sans-serif">Numbers you can trust, meaning agents can act on.</text>

  <!-- Consumers -->
  ${card(80, 132, 460, 104, "#7c5cff", "Power BI reports", "trusted KPIs,", "interactive visuals")}
  ${card(560, 132, 460, 104, "#22d3ee", "Data agents &amp; Copilot", "reason across concepts,", "take governed actions")}

  ${upArrow(300, 300, 240)}
  ${upArrow(800, 300, 240)}

  <!-- Models -->
  ${card(80, 300, 405, 150, "#7c5cff", "Power BI semantic model", "measures, hierarchies, KPIs", "the analytics layer, answers about numbers")}
  ${card(615, 300, 405, 150, "#22d3ee", "Ontology (preview)", "entities, relationships, rules, actions", "the meaning layer, cross-domain reasoning")}

  <line x1="485" y1="375" x2="613" y2="375" stroke="#9aa3bd" stroke-width="2" marker-end="url(#right)"/>
  <text x="549" y="362" fill="#9aa3bd" font-size="13" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">generate / align</text>

  ${upArrow(300, 560, 454)}
  ${upArrow(800, 560, 454)}

  <!-- Foundation -->
  ${band(80, 560, 940, 96, "#c084fc", "OneLake", "one unified, governed data foundation")}
</svg>`;

await sharp(Buffer.from(cover)).png().toFile(join(outDir, "cover.png"));
await sharp(Buffer.from(diagram)).png().toFile(join(outDir, "ontology-vs-semantic.png"));
console.log("Wrote cover.png and ontology-vs-semantic.png to", outDir);

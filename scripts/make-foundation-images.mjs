import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slug = "the-foundation-beneath-every-power-bi-report";
const outDir = join(__dirname, "..", "public", "images", "blog", slug);
mkdirSync(outDir, { recursive: true });

const defs = `
  <defs>
    <radialGradient id="glow1" cx="18%" cy="18%" r="55%">
      <stop offset="0%" stop-color="#7c5cff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7c5cff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="88%" cy="92%" r="55%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <marker id="up" markerWidth="12" markerHeight="12" refX="3" refY="3" orient="auto">
      <path d="M0,6 L3,0 L6,6 Z" fill="#4f7cff"/>
    </marker>
  </defs>`;

const card = (x, y, w, h, accent, title, sub) => `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#0e1018" stroke="${accent}" stroke-opacity="0.6" stroke-width="1.5"/>
    <rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${accent}"/>
    <text x="${x + 24}" y="${y + 44}" fill="#e8eaf3" font-size="22" font-weight="700" font-family="Segoe UI, Arial, sans-serif">${title}</text>
    <text x="${x + 24}" y="${y + 72}" fill="#9aa3bd" font-size="15" font-family="Segoe UI, Arial, sans-serif">${sub}</text>
  </g>`;

const up = (x, y1, y2) => `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#4f7cff" stroke-width="2.5" marker-end="url(#up)"/>`;

const diagram = `
<svg width="1100" height="620" viewBox="0 0 1100 620" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="1100" height="620" fill="#07080f"/>
  <rect width="1100" height="620" fill="url(#glow1)"/>
  <rect width="1100" height="620" fill="url(#glow2)"/>
  <text x="80" y="62" fill="#e8eaf3" font-size="28" font-weight="700" font-family="Segoe UI, Arial, sans-serif">The foundation beneath every report</text>
  <text x="80" y="96" fill="#9aa3bd" font-size="17" font-family="Segoe UI, Arial, sans-serif">Clean layers up, trusted meaning out.</text>

  ${card(300, 132, 500, 84, "#22d3ee", "Reports and dashboards", "trusted, consistent metrics")}
  ${up(550, 288, 222)}
  ${card(300, 290, 500, 92, "#7c5cff", "Power BI semantic model", "relationships, measures, business logic, security")}
  ${up(550, 452, 386)}

  ${card(110, 454, 280, 104, "#cd7f4f", "Bronze", "raw ingested data")}
  ${card(410, 454, 280, 104, "#9aa3bd", "Silver", "cleaned, standardized")}
  ${card(710, 454, 280, 104, "#e0b34a", "Gold", "curated, business-ready")}
  <text x="550" y="592" fill="#6b7392" font-size="15" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif">Medallion architecture: the semantic model sits on the Gold layer</text>
</svg>`;

await sharp(Buffer.from(diagram)).png().toFile(join(outDir, "medallion-semantic.png"));
console.log("Wrote medallion-semantic.png (cover untouched)");

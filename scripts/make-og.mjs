// One-time generator for the default Open Graph image (public/og-default.png).
// Run with: node scripts/make-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "og-default.png");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
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
  </defs>

  <rect width="1200" height="630" fill="#07080f"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <g font-family="Segoe UI, Arial, sans-serif">
    <text x="80" y="150" fill="#22d3ee" font-size="26" font-weight="700" letter-spacing="6">BUILD WITH AMRUTHA</text>

    <text x="76" y="300" fill="url(#text)" font-size="104" font-weight="800" letter-spacing="-2">Amrutha Satishkumar</text>

    <text x="80" y="372" fill="#e8eaf3" font-size="40" font-weight="600">Data &amp; AI Solution Engineer at Microsoft</text>

    <text x="80" y="438" fill="#9aa3bd" font-size="28" font-weight="400">AI-ready data platforms, agentic AI, and governance.</text>

    <rect x="80" y="520" width="56" height="6" rx="3" fill="url(#text)"/>
    <text x="80" y="566" fill="#6b7392" font-size="28" font-weight="600">buildwithamrutha.com</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("Wrote", out);

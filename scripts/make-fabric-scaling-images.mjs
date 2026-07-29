// One-time generator for the "Automating Fabric capacity scaling" blog diagrams.
// Run with: node scripts/make-fabric-scaling-images.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const slug = "automating-microsoft-fabric-capacity-scaling";
const outDir = join(__dirname, "..", "public", "images", "blog", slug);
mkdirSync(outDir, { recursive: true });

const W = 1000;
const NODE_W = 660;
const NODE_X = (W - NODE_W) / 2;
const NODE_H = 88;
const GAP = 56;
const TOP = 178;
const FONT = "Segoe UI, Arial, sans-serif";

const defs = `
  <defs>
    <linearGradient id="text" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="45%" stop-color="#7c5cff"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow1" cx="16%" cy="14%" r="55%">
      <stop offset="0%" stop-color="#7c5cff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#7c5cff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="86%" cy="94%" r="55%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <marker id="arrow" markerWidth="12" markerHeight="12" refX="6" refY="5" orient="auto">
      <path d="M0,0 L10,5 L0,10 Z" fill="#4f7cff"/>
    </marker>
  </defs>`;

const nodeTop = (i) => TOP + i * (NODE_H + GAP);

const card = (top, { title, sub, color }) => `
  <g>
    <rect x="${NODE_X}" y="${top}" width="${NODE_W}" height="${NODE_H}" rx="16" fill="#0e1018" stroke="${color}" stroke-opacity="0.55" stroke-width="1.5"/>
    <rect x="${NODE_X}" y="${top}" width="6" height="${NODE_H}" rx="3" fill="${color}"/>
    <text x="${W / 2}" y="${top + 37}" fill="#e8eaf3" font-size="25" font-weight="700" text-anchor="middle" font-family="${FONT}">${title}</text>
    <text x="${W / 2}" y="${top + 66}" fill="#9aa3bd" font-size="15" text-anchor="middle" font-family="${FONT}">${sub}</text>
  </g>`;

const connector = (i) => {
  const y1 = nodeTop(i) + NODE_H + 6;
  const y2 = nodeTop(i + 1) - 6;
  return `<line x1="${W / 2}" y1="${y1}" x2="${W / 2}" y2="${y2}" stroke="#4f7cff" stroke-width="2.5" marker-end="url(#arrow)"/>`;
};

const render = async (filename, title, subtitle, nodes, caption) => {
  const n = nodes.length;
  const lastBottom = nodeTop(n - 1) + NODE_H;
  const H = lastBottom + 74;
  const cardsSvg = nodes.map((node, i) => card(nodeTop(i), node)).join("\n");
  const connSvg = nodes.slice(0, -1).map((_, i) => connector(i)).join("\n");
  const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  ${defs}
  <rect width="${W}" height="${H}" fill="#07080f"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <text x="${NODE_X}" y="84" fill="url(#text)" font-size="30" font-weight="800" font-family="${FONT}">${title}</text>
  <text x="${NODE_X}" y="122" fill="#9aa3bd" font-size="18" font-family="${FONT}">${subtitle}</text>
  ${cardsSvg}
  ${connSvg}
  <text x="${NODE_X}" y="${H - 28}" fill="#6b7392" font-size="16" font-family="${FONT}">${caption}</text>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(outDir, filename));
  console.log("Wrote", filename, `(${W}x${H})`);
};

const cyan = "#22d3ee";
const violet = "#7c5cff";
const indigo = "#4f7cff";
const purple = "#c084fc";

await render(
  "approach-1-logic-app.png",
  "Approach 1  .  Logic App on a schedule",
  "A no-code timer that scales the capacity up and down by the clock.",
  [
    { title: "Recurrence trigger", sub: "Timer: scale up at 8am, down at 8pm", color: cyan },
    { title: "Azure Logic App", sub: "No-code workflow", color: violet },
    { title: "Azure REST API", sub: "PATCH sku to resize, or suspend and resume", color: indigo },
    { title: "Fabric capacity", sub: "Resized or paused on schedule", color: purple },
  ],
  "Best for predictable, clock-based patterns like business hours."
);

await render(
  "approach-2-runbook.png",
  "Approach 2  .  Azure Automation runbook",
  "The same idea in PowerShell, for teams that live in Azure Automation.",
  [
    { title: "Automation schedule", sub: "Recurring run, hourly or daily", color: cyan },
    { title: "Runbook (PowerShell)", sub: "Fabric module from the gallery", color: violet },
    { title: "Azure REST API", sub: "resize, suspend, or resume", color: indigo },
    { title: "Fabric capacity", sub: "Resized or paused", color: purple },
  ],
  "Best when your operations already run on Azure Automation."
);

await render(
  "approach-3-metric.png",
  "Approach 3  .  Metric-driven with Azure Monitor",
  "React to real load instead of a fixed clock.",
  [
    { title: "Fabric capacity metrics", sub: "Utilization signal", color: cyan },
    { title: "Azure Monitor alert", sub: "Threshold rule on the metric", color: violet },
    { title: "Action group", sub: "Runs a Logic App or Function", color: indigo },
    { title: "Azure REST API", sub: "Scale up, then back down", color: violet },
    { title: "Fabric capacity", sub: "Reacts to real load", color: purple },
  ],
  "Best when load is spiky and you want reaction, not a schedule."
);

await render(
  "approach-4-activator.png",
  "Approach 4  .  Fabric-native with Activator",
  "Detect and act without leaving Fabric.",
  [
    { title: "Capacity Metrics model or SQL query", sub: "Utilization signal, inside Fabric", color: cyan },
    { title: "Activator rule", sub: "Detects the threshold crossing", color: violet },
    { title: "Notebook, Pipeline, or UDF", sub: "The hands that call the API", color: indigo },
    { title: "Azure REST API", sub: "resize, suspend, or resume", color: violet },
    { title: "Fabric capacity", sub: "Scaled without leaving Fabric", color: purple },
  ],
  "Signal is refresh or schedule based, so it suits sustained load more than instant spikes."
);

console.log("Done. Images in", outDir);

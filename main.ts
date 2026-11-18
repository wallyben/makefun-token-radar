/**
 * Token Radar offline dashboard renderer.
 * This scaffold consumes genuine board.json generated using the official kit.
 * It deliberately refuses to fabricate the sealed protocol snapshot.
 * Node.js 22.18+.
 */
import { readFile, mkdir, writeFile, copyFile } from "node:fs/promises";
import { join } from "node:path";

type Entry = Record<string, unknown>;
const output = join(process.cwd(), "dashboard");
const escapeHtml = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
} as Record<string, string>)[c]);
function field(r: Entry, ...keys: string[]): string {
  for (const k of keys) if (r[k] !== undefined && r[k] !== null) return String(r[k]);
  return "";
}
function plan(r: Entry): string {
  const p = r.farmPlan ?? r.farm_plan ?? r.farm;
  if (Array.isArray(p)) return p.map(String).join(" • ");
  if (typeof p === "object" && p !== null) return JSON.stringify(p);
  return String(p ?? "");
}
function normalize(raw: unknown): Entry[] {
  if (Array.isArray(raw)) return raw.filter((x): x is Entry => !!x && typeof x === "object");
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const k of ["rows", "protocols", "watchlist", "board"]) {
      if (Array.isArray(obj[k])) return normalize(obj[k]);
    }
  }
  throw new Error("board.json must contain an array of protocol rows");
}
const raw = JSON.parse(await readFile("board.json", "utf8"));
const rows = normalize(raw);
if (rows.length < 100) throw new Error(`Need at least 100 genuine board rows; found ${rows.length}`);
for (const [i, row] of rows.entries()) {
  if (!field(row, "name", "protocol", "protocolName")) throw new Error(`Row ${i + 1} has no protocol name`);
  if (!field(row, "impliedValue", "implied_value", "impliedFdv", "implied_fdv", "valuation")) throw new Error(`Row ${i + 1} lacks implied value`);
  if (!plan(row)) throw new Error(`Row ${i + 1} lacks a farm plan`);
}
await mkdir(output, { recursive: true });
await copyFile("board.json", join(output, "board.json"));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Token Radar — Launch Intelligence</title>
<link rel="stylesheet" href="./style.css"></head><body>
<header><div class="brand"><span class="pulse"></span> TOKEN RADAR <small>PRE-LAUNCH INTELLIGENCE</small></div><div class="status">OFFLINE SNAPSHOT · ${rows.length} PROTOCOLS</div></header>
<main><section class="hero"><div class="eyebrow">THE PRE-TOKEN WATCHLIST</div>
<h1>See the launch <em>before</em> the ticker.</h1>
<p>Research-driven protocol intelligence, transparent implied valuations and actionable participation plans.</p>
<div class="stats"><div><strong>${rows.length}</strong><span>WATCHLIST PROTOCOLS</span></div><div><strong>100%</strong><span>OFFLINE EXPLORATION</span></div><div><strong>0</strong><span>LIVE API DEPENDENCIES</span></div></div>
</section><section class="workspace"><div class="toolbar"><div><h2>Launch watchlist</h2><p>Search, filter and inspect each candidate</p></div>
<label class="search"><span class="sr-only">Search protocols</span><input id="search" type="search" placeholder="Search protocols, chains, categories…"></label>
<select id="chain" aria-label="Filter by chain"><option value="">All chains</option></select>
<select id="sort" aria-label="Sort protocols"><option value="rank">Snapshot order</option><option value="value">Implied value: high to low</option><option value="name">Name: A to Z</option></select></div>
<div id="count" class="result-count" aria-live="polite"></div>
<div class="table-wrap"><table><thead><tr><th>#</th><th>Protocol</th><th>Chain</th><th>Category</th><th>Implied value</th><th>Research</th></tr></thead><tbody id="rows"></tbody></table></div></section>
</main><dialog id="detail"><div id="detail-content"></div><button id="close" class="close" aria-label="Close details">×</button></dialog>
<footer>Research snapshot · Estimates are uncertain, not investment advice · Data must be verified against official sealed snapshot</footer>
<script src="./app.js"></script></body></html>`;
await writeFile(join(output, "index.html"), html);
console.log(`Offline dashboard generated for ${rows.length} rows at ${output}`);

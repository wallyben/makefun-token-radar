/**
 * Deterministic valuation and data-quality helpers.
 * All monetary inputs must be genuine values from the official sealed snapshot.
 * Missing information is represented as null, never fabricated.
 */
export function numberOrNull(input) {
  if (input === null || input === undefined || input === "") return null;
  if (typeof input === "number") return Number.isFinite(input) && input >= 0 ? input : null;
  if (typeof input !== "string") return null;
  const s = input.trim().replace(/[$,\s]/g, "");
  const match = /^([0-9]+(?:\.[0-9]+)?)([kmbt])?$/i.exec(s);
  if (!match) return null;
  const multiplier = {k:1e3,m:1e6,b:1e9,t:1e12}[match[2]?.toLowerCase()] ?? 1;
  const result = Number(match[1]) * multiplier;
  return Number.isFinite(result) ? result : null;
}
export function money(value) {
  if (!Number.isFinite(value) || value < 0) return "N/A";
  if (value >= 1e12) return "$" + (value / 1e12).toFixed(2) + "T";
  if (value >= 1e9) return "$" + (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return "$" + (value / 1e6).toFixed(1) + "M";
  if (value >= 1e3) return "$" + (value / 1e3).toFixed(0) + "K";
  return "$" + value.toFixed(0);
}
/**
 * Calculates a transparent implied valuation from snapshot-derived peer data.
 * Requires peer FDV and peer TVL (both positive). The target must have positive
 * snapshot TVL. A median peer FDV/TVL multiple mitigates outlier distortion.
 * This is an estimate, not a price prediction or promise of a token launch.
 */
export function estimateByPeers({tvl, peers, minPeers=3}) {
  const target = numberOrNull(tvl);
  if (target === null || target <= 0) return {value:null, reason:"Missing or zero protocol TVL", peersUsed:0};
  const multiples = (peers ?? []).map(p => {
    const fdv=numberOrNull(p.fdv), peerTvl=numberOrNull(p.tvl);
    return fdv !== null && peerTvl !== null && peerTvl > 0 ? fdv / peerTvl : null;
  }).filter(x => x !== null && Number.isFinite(x) && x > 0).sort((a,b)=>a-b);
  if (multiples.length < minPeers) return {value:null, reason:"Insufficient verified peers", peersUsed:multiples.length};
  const mid=Math.floor(multiples.length/2);
  const median=multiples.length%2 ? multiples[mid] : (multiples[mid-1]+multiples[mid])/2;
  return {value:target*median, multiple:median, peersUsed:multiples.length, method:"median-peer-fdv-to-tvl", reason:null};
}
export function classifyEligibility(row) {
  if (!row || typeof row !== "object") return {eligible:false,reason:"Invalid protocol"};
  if (row.hasToken === true || row.has_token === true) return {eligible:false,reason:"Existing token"};
  if (row.isWrapped === true || row.is_wrapped === true || row.isStakedDerivative === true || row.is_staked_derivative === true) return {eligible:false,reason:"Wrapped/staked derivative"};
  const status=row.hasToken ?? row.has_token;
  if (status !== false) return {eligible:null,reason:"Token status not verified"};
  return {eligible:true,reason:null};
}

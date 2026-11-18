# Token Radar — make.fun competition entry

[Official bounty](https://make.fun/bounty/token-radar-01) · Deadline **14 December 2026, 10:00 UTC**

**Status: initial implementation scaffold — not submission ready.**

The official kit's sealed protocol snapshot and `vendor/makefun-board.ts` are not yet installed. No genuine `board.json`, `dossier.json`, screenshots or agent transcript bundle has been produced.

## Architecture
- `main.ts`: Node 22 entrypoint validating a genuine `board.json` and building an offline dashboard.
- `dashboard/`: network-independent board, search, chain filters, sorting and protocol details.
- `board.json` and `dossier.json`: must be generated from the official sealed snapshot, never synthetic.
- `screenshots/`: actual browser captures of board, detail and filtered view.

## Competition requirements
100+ rows covering the complete watchlist, implied value and farm plan per row, static offline UI, three screenshots, source and authentic agent transcripts.

## Provenance warning
Files committed through the GitHub connector may **not** count as agent-authored under the official transcript checker. The eventual entry must be built or correctly reproduced through qualifying recorded agent sessions and pass the official kit's preflight. Do not submit this scaffold.

## Next steps
1. Obtain the official kit and inspect `make.fun/skill.md`, `vendor/makefun-board.ts` and the sealed data format.
2. Implement the exact adapter and valuation methodology against real snapshot fields.
3. Generate and validate all outputs, run actual browser tests and capture three screenshots.
4. Run official eligibility checker, fix all failures, and submit only with approval.

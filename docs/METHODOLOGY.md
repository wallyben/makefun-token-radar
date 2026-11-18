# Research and implied-valuation methodology

## Scope
This is a token-launch research dashboard, **not** an investment recommendation or forecast of an actual launch. The official competition requires a sealed DefiLlama snapshot, exclusion of already-tokenized protocols and wrapped/staked products, and an implied value and farming plan for each eligible watchlist entry.

## Deterministic valuation approach
For a protocol with verifiable snapshot TVL, estimate implied FDV using the **median FDV/TVL multiple of at least three verified, comparable, already-tokenized peers** from the same broad business model. Use `lib/valuation.mjs` and retain each peer's source, snapshot timestamp and comparability rationale.

No verified peer set or no valid target TVL means **no supported estimate**. Do not silently substitute arbitrary numbers. Additional valuation methods for zero-TVL protocols require separate, documented evidence and uncertainty bands.

## Eligibility gate
- Confirm no native token exists at snapshot time.
- Exclude wrappers, liquid-staking derivatives and staked products of existing tokens.
- Mark unresolved token status as **UNKNOWN**; do not infer absence merely from an empty ticker.
- Use snapshot identifiers to avoid duplicates and distinguish similarly named protocols.

## Farming plans
Each plan should specify the protocol's official access path, actual available actions, capital/fee requirements, geographic or eligibility restrictions where known, risk and a verifiable source. Never imply a guaranteed airdrop or return. No plan should direct users to transfer funds to unverified addresses.

## Quality assurance
- Full official watchlist coverage, with exclusions documented.
- Every displayed valuation has method, peers, date and uncertainty.
- Check responsive views, keyboard navigation, XSS-safe text rendering, zero external requests and actual browser screenshots.
- Preserve authentic agent transcripts and run the official eligibility check before any submission.

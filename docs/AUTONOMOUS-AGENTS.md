# Autonomous agent deployment plan

## Current state
GitHub Actions runs deterministic tests and six-hour readiness audits. **AI coding agents are NOT activated** because no supported coding-agent credential has been configured or authorized. A scheduled CI job does not equal a working autonomous coding agent.

## Architecture for eventual agent operation
- Separate competition repository for each bounty.
- Independent branch and pull request per agent task.
- Scheduled coordinator checks deadlines, open issues and quality gates.
- A model-backed coding runner takes one bounded issue, changes files and runs tests.
- Human review before merge or submission; cap concurrent jobs and spending.
- Preserve authentic development transcripts, tool metadata and official provenance checks.

## Required external setup
1. Select a supported agent provider (GitHub Copilot CLI, Gemini CLI, Codex API or Claude Code).
2. Confirm pricing, quota, acceptable use and compatibility with make.fun transcript checker.
3. Add the provider's credential through repository Actions secrets. Never commit it.
4. Compile agentic workflows using the official `gh aw` extension; commit the generated lock workflow.
5. Run one controlled issue through the official agent, test, review and eligibility checker.
6. Only then enable scheduled code-writing runs and replicate per competition.

No paid model use is authorized. Do not auto-merge, auto-submit, invent transcripts or claim eligibility before verification.

## Operational constraints
GitHub-hosted public-repo standard runners can be free, but model inference and agent subscriptions are separate costs. Scheduled workflows can be delayed or disabled by GitHub. Agents must not use untrusted issue or webpage text as privileged instructions.

# Mira for DeepSeek Harness

> Working title · local proof of concept · **not an official DeepSeek plugin**.

Mira's read-only engineering-context integration for **DeepSeek Harness (DSH)**.
The long-term goal is to connect GitHub Issue contracts, Super Agent workers,
independent review, and maintainer decisions without creating a second task ledger.

## Available in v0.2.0

| Interface | Purpose |
| --- | --- |
| `mira_issue_contract` | Fetch current Mira Organization `AGENTS.md`, repo policy and Issue contract |
| `mira_pr_evidence` | Fetch current PR SHA, CI checks and submitted reviews |
| `mira_task` | Find cross-referenced PRs and recommend the safe next action |
| `mira-task inspect` | Expose the same task analysis to shell-based DSH sessions |

Only `uichat-mira/*` GitHub repositories are supported in this early prototype.
An existing Draft PR does **not** authorize duplicate implementation. All tools
are read-only; no code changes, autonomous task dispatch, merges, Issue closures,
releases, or project-state mutations are performed.

## Development

Requirements: DSH 0.2.1-rc.5, Node.js 22.19+, pnpm, and an authenticated
`gh` CLI with read access to the relevant GitHub repositories.

```bash
pnpm install --frozen-lockfile
pnpm run check
node bin/mira-task.js inspect uichat-mira/folio 124 --branch dev
```

Install into a **separate test profile** (do not interrupt running sessions):

```bash
dsh plugin --profile mira-lab add "link:$PWD"
dsh --profile mira-lab --dump-config
```

For the Electron Desktop app, use its own Plugin Manager; do not directly edit
its application-managed Desktop Profile.

## Super Agent integration

The upstream Super Agent prototype restricts worker tool exposure via an explicit
allowlist. Installing this bundle into an ordinary profile does **not** make
`mira_task` available inside its worker sessions. The read-only
`node /path/to/plugin/bin/mira-task.js inspect ...` command can instead be
used through its existing shell tool, subject to the worker's policy.

**Automated worker dispatch and crash recovery are not implemented here.**
The upstream Super Agent workers use broad OS-level permissions. Run autonomous
workers only with a dedicated, isolated account and separate credentials.

## Source of truth and safety

- Organization rules: fetch `uichat-mira/.github@main/AGENTS.md` live.
- Repository rules: read from the requested branch.
- Work contract: GitHub Issue; execution evidence: PR, CI and Review.
- Project Status is **not** inferred from Issue activity or PR presence.
- CI success and review comments are not maintainer acceptance.
- Unavailable or incomplete evidence produces an explicit warning.
- Usernames, API keys and private credentials must not be committed.

The upstream DSH APIs are pre-release and should be revalidated on upgrades.

## Status

v0.2.0 is an early, read-only POC (14 automated tests and real GitHub read
smokes). Publication and an OSS license are pending the naming decision.

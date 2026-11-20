<!-- Copyright (c) 2026 2q9e. See LICENSE for terms. -->

# Backend Plugin

Backend Plugin gives Codex a set of workflows for reviewing server-side code, deployment posture, database and privacy practices, and performance. Its local MCP server queries OSV for public advisories against an exact package version.

It is a review and development assistant, not a hosted scanner or continuous monitoring service. It works with the project files and tools available in the current Codex session, states what it inspected, and reports uncertainty. It does not claim to discover undisclosed vulnerabilities or guarantee security, performance, legal compliance, or complete coverage.

## MCP tool

The local stdio MCP server exposes one tool: `query_package_advisories`. It sends an exact ecosystem, public package name, and resolved version to OSV's public [version query API](https://google.github.io/osv.dev/api/). Do not submit private package identifiers, secrets, or personal data.

The tool returns only OSV identifiers, source-record URLs, publication/update/withdrawal timestamps, affected-range events for the queried package, fixed-version metadata, and the check time. It omits advisory prose, details, and reference lists. Treat results as an aggregator signal: confirm applicability and any proposed fix with the package maintainer or vendor. A failed or unusable source response is marked `not_checked`; it does not mean the package is safe or has no advisory.

The server requires Node.js 20 or later and the exact runtime dependencies declared in the root `package.json`. This repository change does not install dependencies, launch the server, or install the plugin in a Codex host. The stdio configuration requires local execution and is intended for local use; no hosted service or public endpoint is provided.

## Skills

| Skill | Use it for |
|---|---|
| `backend-review` | Route broad requests, set review scope, and combine focused workflows into one evidence-based plan. |
| `vps-security` | Review host hardening, access, network exposure, updates, backups, and operational controls. |
| `backend-app-security` | Review server-side trust boundaries, authentication, authorization, input handling, secrets, and API behavior. |
| `frontend-security` | Review browser-facing code for XSS, CSRF, unsafe rendering, token exposure, and client/server trust mistakes. |
| `database-data-security` | Review schemas, queries, privileges, transport, backups, encryption, keys, and password storage. |
| `privacy-data-management` | Map data flows and retention, and draft Terms or Privacy Policy text from verified practices. |
| `code-quality` | Reduce complexity and maintenance risk using observable code issues rather than guessing whether code is AI-written. |
| `performance-optimization` | Measure CPU, memory, latency, cache, and database behavior before proposing changes. |
| `vulnerability-intelligence` | Check current public advisories and propose scoped, reviewable remediation. |

## Operating principles

- Start with repository instructions, scope, framework, deployment context, and available tools.
- Separate static code review, configuration review, dependency intelligence, and live testing. State which kinds of evidence were actually checked.
- Report current advisory status only when current sources were actually retrieved; if search or feed access is unavailable, say that status was not checked.
- Tie findings to exact files, settings, packages, or advisory records; include impact, confidence, evidence, and a verification step.
- When a user requests a local repository fix, make a focused change, inspect the diff, and report only the verification performed. A local-fix request does not authorize package scripts, dependency installs/upgrades, migrations, restores, or active checks against running targets. Active checks need explicit authorization for the exact target and scope plus impact, rate, and time limits.
- Require representative measurements before proposing a performance change. Without a baseline, give a measurement plan only. Do not optimize by intuition or report an unmeasured change as a performance improvement.
- Never test, validate, or attempt to use discovered credentials. Require separate explicit authorization for the exact action and applicable target/environment before package-manager scripts, dependency installs/upgrades, migrations, restores, infrastructure changes, external-account writes, or third-party disclosure.
- Use established cryptography and password-hashing libraries. Keep keys under a separate access boundary from encrypted data; never expose secrets in findings or logs.
- Draft factual privacy and Terms language from verified data practices. Make jurisdiction-specific legal claims only when the relevant jurisdictions are known; use explicit placeholders for missing facts and mark them for qualified review. Do not invent legal obligations or promise legal sufficiency.
- For vulnerability reports, distinguish disclosure, upstream fix availability, project-version status, credible proof-of-concept reporting, and confirmed exploitation. Cite code-free credible reporting of PoC existence without linking to, retrieving, copying, or reproducing exploit or PoC code. “No public match” is not proof of safety or zero-day detection.

## Package layout

```text
plugin.json
mcp.json                    # Local stdio MCP server configuration
package.json                # Pinned local MCP runtime dependencies
server/index.mjs            # Read-only OSV lookup tool
README.md
research/                   # Research notes and source catalog
references/                 # Shared finding and action contracts
skills/<workflow>/SKILL.md
evaluations/scenarios.md     # Planned manual evaluation; not yet run
prompts/                     # Build prompt and goal for future model handoff
```

## Model handoff

- [Main build prompt](prompts/BUILD_PLUGIN_PROMPT.md)
- [Goal](prompts/GOAL.md)

The package source is committed in this GitHub repository. It has not been installed into a Codex host, its MCP dependencies have not been installed, and it has not been published. The local MCP server needs Node.js 20+ and the dependencies declared in `package.json` before a Codex host can launch it. This repository uses the source-available view-only terms in [LICENSE](LICENSE) (SAVL-1.0); it is not an open-source license.

The manual routing, MCP, and safety scenarios are listed in [`evaluations/scenarios.md`](evaluations/scenarios.md). They have not been run; package-format and static checks are recorded in `research/RESEARCH_TRACKER.md`. Installed-host behavior remains unevaluated.

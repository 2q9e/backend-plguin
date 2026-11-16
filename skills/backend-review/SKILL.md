---
name: backend-review
description: Use when the user asks for a broad backend development, security, database, privacy, VPS, maintainability, or performance review, or when a request spans several of those areas.
---
<!-- Copyright (c) 2026 2q9e. See ../../LICENSE for terms. -->

# Backend review router

Coordinate the focused workflows in this plugin for backend development and review. This skill provides guidance; it does not install scanners, create access to production systems, or monitor for new advisories continuously.

## Establish the scope

1. Read the target repository’s applicable instructions and identify the requested outcome, codebase, deployment context, database, and relevant runtime constraints.
2. Inspect available tools and evidence sources. Separate repository code/configuration, dependency records, live-system observations, external advisories, and user-provided facts.
3. Choose the narrowest workflow or set of workflows below. For a broad request, summarize intended coverage before making changes.
4. Read the [Codex plugin workflow research](../../research/CODEX_PLUGIN_FLOW.md), [reference-project research](../../research/REFERENCE_PROJECTS.md), the [shared finding/action contract](../../references/finding-contract.md), and the relevant domain research linked by the selected specialist skill. Research notes are sources and design evidence, not proof that a particular project is configured safely.

## Route to a focused workflow

| Request area | Skill |
|---|---|
| VPS or host hardening | `vps-security` |
| Server-side code, authentication, authorization, APIs | `backend-app-security` |
| Defensive review of browser-facing vulnerabilities or client/server trust boundaries | `frontend-security` |
| Database code, access controls, encryption, passwords, backups | `database-data-security` |
| Data inventory, retention, deletion, Terms or Privacy Policy | `privacy-data-management` |
| Maintainability, organization, or concrete code-quality defects | `code-quality` |
| CPU, memory, cache, latency, or database performance | `performance-optimization` |
| Current public advisories or vulnerability remediation | `vulnerability-intelligence` |

Use multiple focused skills where findings cross boundaries, such as a frontend authorization issue that must be enforced by the API, or database encryption that depends on key storage and backup recovery.

## Work sequence

1. Establish a bounded scope and gather direct evidence before asserting a finding.
2. Distinguish confirmed facts from assumptions and environment-dependent questions. Record what was inspected and what was not.
3. When the user requests a local repository fix, preserve project conventions, make a focused change, inspect the diff, and report only verification actually performed. Keep package-manager scripts, live-system changes, migrations, infrastructure operations, and external writes behind the shared action contract.
4. For performance work, require a representative baseline and compare correctness, latency, errors, CPU, memory, cache behavior, and database load after the change.
5. For current vulnerability claims, inspect current primary advisories or vendor guidance and record the check date. Distinguish disclosure, unpatched status, credible reporting of a public proof of concept, and confirmed exploitation. Cite code-free credible reporting without linking to, retrieving, copying, or reproducing exploit or PoC code.
6. Present findings with affected target, impact and conditions, evidence, confidence, recommended action, and verification. Separate required environment evidence from code changes.

## Boundaries

- Do not claim comprehensive security, privacy, legal, or performance assurance from a partial review.
- Do not infer that code was AI-generated. Describe specific defects, unnecessary complexity, missing tests, or convention violations instead.
- Do not promise discovery of undisclosed vulnerabilities or ongoing monitoring in this skills-only package.
- Require explicit user authorization for active checks against any running target, with exact target/scope and impact, rate, and time limits. Never test discovered credentials, write/adapt/retrieve/link to/copy/reproduce/execute exploit or PoC code, or provide weaponized steps. Keep migrations, infrastructure changes, package scripts, and external writes within the shared action contract.
- Draft factual policy text from verified product behavior. Make jurisdiction-specific legal claims only when the relevant jurisdictions are known; mark other missing facts as placeholders for qualified review and do not claim legal sufficiency.

---
name: backend-app-security
description: "Review backend services and APIs for application security issues in source code, configuration, and dependencies."
---

# Backend application security review

Use this skill for repository reviews of backend services, APIs, authentication and authorization flows, server-side configuration, and dependency alerts. Keep source-code evidence separate from deployment and runtime evidence.

## Procedure

1. **Scope the review.** Record the repository or directory, revision, service/API surface, languages and frameworks in view, and any user-provided environment details. If these are incomplete, review what is available and disclose the gaps; do not infer production configuration from repository defaults.
2. **Choose applicable requirements.** Use OWASP ASVS 5.0.0 requirements as traceable checks where the application supports them. Use the OWASP Top 10 and API Security Top 10 as risk prompts, not as a complete application-specific checklist or a pass/fail score.
3. **Trace security-sensitive flows.** Review applicable code and configuration for:
   - object- and function-level authorization, including tenant boundaries, on sensitive operations;
   - authentication, sessions, password reset, token handling, and error paths that could expose secrets, personal data, stack traces, or internal paths;
   - validation of untrusted values, parameterized database values, and allowlists for dynamic identifiers or sort directions;
   - request size, pagination, timeouts, concurrency, and rate limits suited to the workflow;
   - SSRF, security misconfiguration, API inventory, sensitive business flows, and trust in third-party API responses;
   - secret-source references and access boundaries using presence-only or redacted evidence, plus dependency versions, build and deployment inputs, and production configuration when evidence is available.
4. **Use scanners and advisory data as separate evidence.** If SAST is used, record the tool, version, languages, paths, and rule or query coverage; validate matches in context. If reviewing a package advisory, record the package identity, resolved version, direct or transitive relationship, advisory source and timestamps, fixed range, and any available runtime or deployment evidence. A package match does not by itself prove vulnerable code is reachable or deployed. If current public intelligence was not checked, say so. Absence from a feed does not establish safety.
5. **Keep active tests scoped.** Before DAST or other active requests against any running target—including local, development, staging, production, public, or isolated targets—require explicit user authorization for the exact target and scope, plus impact, rate, and time limits. Establish the environment and approved scan plan. This does not permit exploit or proof-of-concept code execution, exploit reproduction, or credential testing; follow the unconditional prohibitions in the shared action contract.
6. **Keep remediation reviewable.** When the user requests a local repository fix, apply the smallest supported focused patch, inspect the diff using secret-safe/redacted output, and report only verification actually performed. Never print a deleted raw credential or key value. Otherwise present a recommendation and proposed change. A local patch request alone does not authorize package-manager installs, scripts, migrations, or other effectful commands; obtain separate explicit authorization for the exact command. Keep patch proposal, application, and verification as distinct results.

## Output

- State the repository revision, services and paths reviewed, tools and advisory sources used, and what was not checked.
- Report each issue using [the shared finding contract](../../references/finding-contract.md), with file and line or exact package/version, minimum redacted evidence, impact conditions, confidence, remediation, and verification.
- Separate source findings, scanner results, known-advisory matches, and runtime/deployment observations. Do not turn them into one unsupported risk score or claim that a clean scan proves the application secure.
- List languages, rule packs, dependencies, endpoints, environments, or checks outside coverage. For current advisory claims, preserve the source URL and checked time.

## Research references

- [Security and vulnerability research](../../research/SECURITY_AND_VULNERABILITY_RESEARCH.md) — backend/API review questions, ASVS and Top 10 roles, scanner limits, advisory evidence, and DAST boundaries.
- [Reference projects](../../research/REFERENCE_PROJECTS.md) — Semgrep, CodeQL, ZAP, Trivy, OSV-Scanner, Dependabot, Renovate, and vulnerability-intelligence caveats.
- [Codex plugin workflow](../../research/CODEX_PLUGIN_FLOW.md) — scoped evidence, coverage limits, and separate patch/review/application/verification steps.
- [Finding and action contract](../../references/finding-contract.md) — finding fields, live-action boundaries, and evidence language.

## Boundaries

Repository-only evidence does not establish deployed reachability, provider firewall settings, or production behavior. Use the VPS workflow for host configuration and the frontend workflow for browser-side sinks and policies; correlate evidence when a finding crosses those boundaries. Do not claim ASVS compliance from a source scan or treat OWASP awareness lists as exhaustive requirements.

---
name: vps-security
description: "Review or plan security improvements for a VPS, including host access, exposed services, patching, privilege, backups, and recovery."
---
<!-- Copyright (c) 2026 2q9e. See ../../LICENSE for terms. -->

# VPS security review

Use this skill for a security review or hardening plan for a virtual private server. Keep host and provider configuration separate from application-code findings.

## Procedure

1. **Set the target and evidence boundary.** Record the provider, operating system and release, whether the target is one host or a cluster, public services, administrative path, deployment model, and recovery needs when known. Identify whether evidence comes from repository/configuration files, user-provided provider-console details, or an authorized live-host inspection. If a detail is unavailable, continue with the available read-only evidence and mark it as not observed.
2. **Review only the applicable host surfaces.** Check available evidence for:
   - administrator accounts, SSH exposure and authentication, root-login policy, key handling, MFA or an access gateway where available, and access logs;
   - listening services, provider firewall or security-group rules, host firewall rules, public database or administration ports, TLS termination, and trusted proxy paths;
   - operating-system support, package update status, exposed service and runtime versions, and automatic update behavior;
   - unnecessary services, service-account privileges, writable paths, presence/source/permission metadata for secrets in files or environment (without retrieving raw values), container privileges, and root execution;
   - backups, encryption and access, restore evidence, monitoring and alert routes, logs, and recovery or rotation procedures.
   Do not infer actual provider-side rules, running services, external reachability, or successful restore from source files alone.
3. **Match baselines to the host.** Tie any benchmark recommendation to the observed operating-system version and host role. Treat Lynis-style results as a point-in-time audit. Do not imply an ongoing monitoring agent such as Wazuh exists unless its deployment is in evidence.
4. **Gate live checks.** Before any active check against a running host—including local, development, staging, production, public, or isolated hosts—require explicit user authorization for the exact host and scope, plus impact, rate, and time limits. Do not test, validate, or attempt to use discovered credentials from any source or environment. Report checks that could not be run and why.
5. **Propose changes separately.** Give a reviewable configuration or command plan, likely service or access impact, a host-specific rollback plan, and a verification step. Do not change firewall rules, SSH settings, users, services, packages, or keys without explicit approval for that host and change.

## Output

- State the host scope, operating-system version, evidence sources, and inspection time.
- Report findings using [the shared finding contract](../../references/finding-contract.md). Use precise host/configuration evidence, state the conditions and confidence, and distinguish a finding from an environment fact that still needs confirmation.
- Summarize which host surfaces were reviewed, not observed, or out of scope. A clean point-in-time review is not proof that the host is safe or continuously monitored.
- Keep recommendations limited to the inspected host and its stated role. Include a rollback and verification plan for proposed live changes.

## Research references

- [Security and vulnerability research](../../research/SECURITY_AND_VULNERABILITY_RESEARCH.md) — VPS review surfaces, version-matched baselines, and live-change boundaries.
- [Reference projects](../../research/REFERENCE_PROJECTS.md) — Lynis and Wazuh capabilities and limits.
- [Codex plugin workflow](../../research/CODEX_PLUGIN_FLOW.md) — scope, evidence, reviewable actions, and coverage disclosure.
- [Finding and action contract](../../references/finding-contract.md) — required finding evidence and action boundaries.

## Boundaries

This review does not establish provider-console settings or live host state unless those were actually inspected. Do not apply a generic hardening benchmark unattended. For application or browser code issues, keep the evidence scoped to the code reviewed and use the backend or frontend security workflow as applicable.

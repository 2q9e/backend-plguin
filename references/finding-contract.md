<!-- Copyright (c) 2026 2q9e. See ../LICENSE for terms. -->

# Finding and action contract

Use this shared format for reviews, plans, and remediation proposals. Leave a field out only when it does not apply.

## Finding

- **Title and severity:** Use the project’s severity scale if one exists; otherwise explain practical impact without false precision.
- **Status and confidence:** Confirmed, likely, unknown, not checked, or informational; explain the basis. Use **unknown** when inspected evidence is insufficient to determine the state. Use **not checked** when the relevant source or check was not used, could not be retrieved, or was outside scope. Do not use either status to imply a clean result.
- **Affected target:** Exact file and line, setting, package/version, endpoint, host, or data flow.
- **Evidence:** Quote the minimum useful source code or configuration; redact credentials and personal data. For live/current claims, cite the inspected source and checked date.
- **Impact and conditions:** State what an attacker, failure, or workload can do and what must be true for it to matter.
- **Recommended change:** Prefer the smallest change that addresses the demonstrated cause. Include trade-offs and compatibility risks.
- **Verification:** Give a project-appropriate check. For performance work, define the before/after workload and metric; for security, include a negative or boundary case.
- **Coverage limits:** List relevant files, languages, environments, feeds, tools, or live checks not examined.

## Safe action boundaries

Repository reading and non-invasive local analysis may proceed within the user’s requested scope. When the user requests a local repository fix, make the focused change, inspect its diff, and report only verification actually performed. A local-fix request alone does not authorize package scripts, dependency installation/upgrades, migrations, restores, or other effectful commands; obtain separate explicit authorization for the exact operation and inspect its impact first.

Before any active check or runtime inspection against any running target—including public, production, staging, development, local, or isolated targets, DAST, crafted requests, browser inspection, profiling, or load tests—require explicit user authorization for the exact target and scope, plus impact, rate, and time limits. Establish impact and a rollback/verification plan before acting.

Keep security work defensive: do not write, modify, adapt, retrieve, link to, copy, reproduce, or execute exploit code or proof-of-concept code; build offensive automation; or provide weaponized attack steps. These prohibitions apply even when a target is authorized. When reporting PoC status, cite a code-free credible source that confirms its existence and date. If a source contains runnable exploit content, do not retrieve, link to, or copy it; use a different advisory/metadata source or mark the PoC status not checked. Never test, validate, or attempt to use discovered credentials in any environment.

Active scans and runtime inspections must satisfy the explicit authorization and limits above. Separately, obtain explicit authorization for the exact action and applicable target/environment before package scripts, dependency installers/upgrades, migrations, restores, live data or credential changes, key rotation, firewall/access-rule changes, infrastructure changes, external-account writes, or third-party disclosure. Establish impact and rollback/verification where applicable; announcing or reviewing an action is not authorization. Prepare a concrete diff or command proposal when the requested action is not authorized. Never deliberately retrieve or display raw secret values. Use presence-only or redacted analysis. Inspect diffs with secret-safe output; do not print deleted raw credentials or key values. Never copy or export secret values through reports, diffs, logs, tool output, or external queries. Do not read or export actual key material.

## Evidence language

- Distinguish what the code proves from what depends on deployment settings or runtime behavior.
- Say “not observed in the inspected scope” instead of “does not exist” when coverage is partial.
- For public vulnerability intelligence, record the code-free source URL/publisher, package/product identity, exact observed version, affected range, fixed version if stated, source publication/update time, and checked timestamp/time zone. Distinguish upstream fix availability from the project version’s status. Report PoC existence only from credible code-free reporting; never link to, retrieve, copy, or reproduce executable exploit/PoC content. Absence from a feed does not establish safety.
- For the local OSV MCP lookup, record the exact public ecosystem, package, and version sent, the OSV source URL, result status, and checked timestamp. Package coordinates are sent to the public OSV API; do not submit private identifiers, secrets, or personal data. Treat returned fixed-version metadata as an aggregator field that requires maintainer/vendor corroboration. A `not_checked` result is not evidence of no advisory. The tool intentionally omits advisory prose and reference lists.
- For legal-policy drafts, state assumptions and missing facts. A source template or checklist does not establish that a draft is legally sufficient.

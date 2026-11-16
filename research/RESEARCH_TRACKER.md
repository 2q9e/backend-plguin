# All-in-One Backend Plugin — Research Tracker

**Last updated:** 2026-11-16  
**Status:** Research pass and independent audit correction pass complete; the package now contains nine skills plus a local stdio MCP server for read-only OSV lookups and is committed to `2q9e/backend-plguin` on `main`. Dependencies and the plugin have not been installed; all manual scenarios remain unrun, and host behavior is unevaluated. Future platform and product-scope decisions remain open.  
**Scope:** This folder records the research and evidence base. The sibling `../plugin.json`, `../mcp.json`, `../package.json`, `../server/`, `../skills/`, `../references/`, `../evaluations/`, `../prompts/`, and `../README.md` contain the portable plugin package and its handoff/evaluation documents. Package source is committed at [2q9e/backend-plguin](https://github.com/2q9e/backend-plguin). A local OSV MCP server is implemented; no hosted service, scanner engine, or continuous monitoring system is provided.

## Package implementation and static validation

The package includes a portable root manifest, a local `mcp.json` stdio configuration, a local `server/index.mjs` MCP server, exact direct runtime dependencies in `package.json`, README, nine focused `SKILL.md` workflows, a shared finding/action contract, and manual evaluation scenarios. Its single `query_package_advisories` tool submits one exact public ecosystem/package/version to OSV and returns whitelisted IDs, source URLs, timestamps, matching affected-range events, and fixed-version fields. It omits advisory prose and reference lists; failed or incomplete OSV responses return `not_checked`. This is an aggregator lookup, not a comprehensive advisory review or fixed-version recommendation. The server is local and read-only; it does not provide a hosted service, product backend, scanner engine, or continuous monitoring. Runtime dependencies are not installed, and the plugin remains uninstalled and unpublished.

Static checks performed on 2026-11-16:
- Parsed `plugin.json`, `mcp.json`, and `package.json`; checked the portable plugin and stdio MCP configuration against the retrieved Agent Plugins 1.0.0 schema constraints. The environment did not include a JSON Schema validator package, so a local checker evaluated the applicable schema constraints directly.
- Parsed all nine skill frontmatter blocks and confirmed required `name`/`description` fields and unique names.
- Resolved local Markdown links across all 20 Markdown files and reviewed the package layout.
- Ran `node --check` on a temporary copy of `server/index.mjs`; this checked syntax only and did not execute the server.
- Confirmed all 16 manual evaluation scenarios remain unrun. Installed-host behavior was not evaluated.

No dependencies were installed, the MCP server was not launched, and the OSV API was not queried during validation.

## Implementation source notes

OpenAI's package guidance documents portable MCP configuration in root `mcp.json`; its desktop-only guidance documents local stdio launch entries and the local-executor flag (OpenAI, 2026a, 2026b). The MCP TypeScript SDK documents the current server and stdio APIs and requires Node.js 20 or later (Model Context Protocol, 2026a, 2026b). OSV documents package-version queries through its public API (OSV, n.d.). These sources support the package wiring and lookup protocol; they do not establish installed-host behavior, comprehensive advisory coverage, or source agreement on a fixed version.

### References

Model Context Protocol. (2026a). *Serve over stdio*. TypeScript SDK. https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/serving/stdio.md

Model Context Protocol. (2026b). *Server package manifest*. TypeScript SDK. https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/packages/server/package.json

OpenAI. (2026a). *Package your plugin*. OpenAI Developers. https://developers.openai.com/plugins/build/plugins

OpenAI. (2026b). *Submit desktop-only plugins*. OpenAI Developers. https://developers.openai.com/plugins/deploy/desktop-only

OSV. (n.d.). *API*. OSV. https://google.github.io/osv.dev/api/

## Research files

| File | Coverage |
|---|---|
| [CODEX_PLUGIN_FLOW.md](CODEX_PLUGIN_FLOW.md) | Current official Codex plugin planning, package, test, security, and submission flow |
| [REFERENCE_PROJECTS.md](REFERENCE_PROJECTS.md) | Focused projects covering small parts of the proposed all-in-one plugin; useful capabilities and limitations |
| [SECURITY_AND_VULNERABILITY_RESEARCH.md](SECURITY_AND_VULNERABILITY_RESEARCH.md) | VPS, backend/API and frontend security, vulnerability feeds, exploit evidence, and safe remediation |
| [DATABASE_DATA_PRIVACY_RESEARCH.md](DATABASE_DATA_PRIVACY_RESEARCH.md) | Database handling/security, encryption and key management, passwords, data lifecycle, policy drafting |
| [QUALITY_PERFORMANCE_RESEARCH.md](QUALITY_PERFORMANCE_RESEARCH.md) | Observable AI-assisted code quality, project organization, runtime measurement, caching, safe optimization |

## Research areas

- [x] **VPS security:** OS- and provider-specific scope, host access, network exposure, patching, secrets, recovery, monitoring, and limits of audits.
- [x] **Application backend security:** common app/API risks, authorization, input/query handling, auth/session, resource limits, and source versus runtime evidence.
- [x] **Frontend security:** browser exploit surface, XSS, CSRF, policy headers, client/server boundaries, and runtime validation limits.
- [x] **AI-assisted code quality:** replaced “AI slop” as a subjective label with observable quality and security checks; included evidence limits and counterevidence.
- [x] **Backend runtime optimization:** measurement, profiling, workload-specific comparison, bounded telemetry, cache correctness/resource costs, and regression checks.
- [x] **Code organization/maintainability:** project-specific conventions, boundaries, duplication, dead code, and small reviewable changes.
- [x] **Database development:** queries, transaction behavior, backups/restores, operational context, and performance evidence.
- [x] **Database security:** network isolation, TLS, least privilege, environment separation, secrets, and audit logging limits.
- [x] **Database/data encryption:** threat-model-based layers, key separation, envelope encryption, rotation and recovery.
- [x] **Data management/privacy:** collection-to-deletion lifecycle, password storage, sensitive data in logs/backups, and factual policy drafting.
- [x] **New vulnerabilities/exploits:** OSV/advisory matching, CISA KEV, EPSS, VEX, applicability, uncertainty, and safe remediation.
- [x] **Official plugin flow:** use-case planning, skill/MCP/UI boundary, tool contracts, package formats, local testing, and public review requirements.
- [x] **Reference projects:** specialized scanners, host audit/monitoring, dependency intelligence, profiling, load testing, data tools, and Codex Security.

## Main conclusions

1. Existing tools provide specialized slices; none establishes complete security, privacy, performance, or maintainability across all environments. Integrations must preserve each tool's scope, version, evidence, and limitations.
2. Findings should say what was scanned and what was not. “No finding,” “not checked,” and “inconclusive” are different states.
3. Unknown vulnerability discovery cannot be promised. Public feeds help match known disclosures and exploitation evidence; source review may surface bugs but cannot guarantee unknown zero-day detection.
4. Data policies must reflect actual product behavior and jurisdiction. A data map should precede policy drafting; legal sufficiency needs context-specific review.
5. Optimization should be driven by a measured workload and compare latency, errors, CPU, RAM, database load, and correctness before and after a change.
6. The official plugin guidance favors concrete use cases, focused skills/tools, least privilege, structured outputs, direct/indirect/edge/negative evaluation, and confirmation for consequential writes.

## Future product decisions (not research gaps)

These choices are not inferable from public documentation and are left for product planning; no clarification is required to complete this research:

- First target users and project sizes.
- Supported languages, frameworks, databases, VPS operating systems, and hosting environments.
- Whether future versions should only inspect/explain/propose, or also apply approved changes, monitor, or operate infrastructure.
- Which optional remote MCP integrations, external data feeds, or scanner integrations should be added beyond the current local OSV lookup.
- Jurisdictions to support for Terms of Use and Privacy Policy drafting.

## Research log and evidence provenance

**Date:** 2026-11-16. **Mode:** Deep Discovery, with specialist parallel reference scans and direct follow-up against primary documentation. The reference scans used separate task briefs; final reports and their source guides were consolidated in the research files above.

| Track | Search/query screening reported by track | Candidate records screened | Sources opened/inspected |
|---|---:|---:|---:|
| Application security references | 15 queries | About 80 | 11 |
| Code quality/performance references | 12 queries | About 75 | 17 |
| Database/data privacy references | 17 queries | About 60 | 14 unique official/original sources |
| Vulnerability intelligence references | 19 queries | About 60 distinct records | 17 |

The workstream counts are approximate and not deduplicated across agents. They total 63 specialist-track queries and roughly 275 track-level candidate records; the candidate total is not a global unique-source count. The initial direct follow-up added 24 official-source queries in six grouped searches, plus earlier browsing and source inspection whose operation ledger was not preserved. The audit-correction pass added more official searches and page inspections, but its operation-level counts were not captured. Because the pooled ledger is incomplete and results overlap, no exact deduplicated all-workstream total is claimed. The evidence base emphasizes official standards, project/vendor documentation, research articles, government/privacy sources, and primary data feeds. Search-result counts are screening records, not source counts or evidence of exhaustiveness.

**Access limitation:** During this research, the primary CISA KEV page/feed returned access-denied responses. The CISA-owned KEV data repository and schema were inspected instead; this limitation is called out in the vulnerability and reference notes.

The full CISA BOD 26-04 directive page also returned 403 during the correction pass. Its official CISA announcement was accessible and supports the high-level federal scope and risk-based factors; the full remediation timeline table was not verified and is not reproduced.

**Independent audit and corrections:** Three fresh-context subagents reviewed the research notes read-only, each focused on a different area. Their findings were applied: plugin-flow scope and submission requirements were clarified; Dependabot, Renovate, Wazuh, and Presidio references were corrected; unsupported/stale references were removed; NIST, PIPEDA, password-rate-limiting, NVD, CISA, study-sample, PostgreSQL version/date, and APA suffix details were corrected or qualified. No implementation code was added.

**Citation practice:** Each research note uses APA author-date citations and a matching References section. Source guides identify what key sources support and what they do not establish. Vendor/project docs are treated as evidence of documented functionality and caveats, not as independent proof of effectiveness. Current legal, vulnerability-feed, plugin-submission, and software documentation should be rechecked before adding active integrations, publishing, or making current-status claims because it changes over time.

**User-provided material:** Set the requested plugin topics. **Built-in knowledge:** Not used as evidence. **Implementation note:** The skills-only plugin package was built after this research pass; no product backend, scanner engine, MCP service, or automated test suite was written as part of the research.

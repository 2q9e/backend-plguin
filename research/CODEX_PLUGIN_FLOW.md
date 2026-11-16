<!-- Copyright (c) 2026 2q9e. See ../LICENSE for terms. -->

# ChatGPT and Codex Plugin: Official Development Flow

**Research date:** 2026-11-16  
**Purpose:** Record the current official workflow for planning, packaging, testing, and submitting a plugin in the shared ChatGPT/Codex directory. This is research, not plugin implementation.

## Short answer

OpenAI's plugin documentation recommends starting from user workflows, choosing the smallest package that can complete them, and testing the complete installed experience against a use-case inventory. A plugin can bundle reusable skills, an MCP server, optional lifecycle hooks, or a combination; a custom UI is optional. Skills explain repeatable workflow steps. MCP tools connect to server-backed data and actions; the server must enforce authorization where needed. Hooks are available only for manually installed Codex desktop plugins; packages containing hooks are not eligible for the public directory. This split fits the proposed backend plugin: keep workflows focused, and add integrations only where live data or a controlled action is truly needed ([OpenAI, n.d.-h](https://developers.openai.com/plugins/concepts/plugins); [OpenAI, n.d.-b](https://developers.openai.com/plugins/concepts/skills); [OpenAI, n.d.-g](https://developers.openai.com/plugins/build/plugins)).

## Official flow, translated into research decisions

| Stage | Official direction | Research implication for this plugin |
|---|---|---|
| 1. Inventory use cases | Write user goals, example prompts, desired outcomes, required context, and explicit exclusions. Keep direct, indirect, edge, and out-of-scope requests in the inventory. | Convert the original topic list into concrete jobs: review a repository, assess a VPS configuration, check a database change, inspect a dependency alert, or measure a performance regression. “Manage security” is too broad to evaluate as a single workflow. ([OpenAI, n.d.-a](https://developers.openai.com/plugins/plan/use-case)) |
| 2. Choose package shape | Start with the smallest shape that serves the use cases. A skill can guide a repeatable workflow without an MCP server; MCP is for server-backed data, integrations, or actions; UI is optional. | Begin with local, evidence-based review workflows using the tools Codex already has. Add an MCP integration for specific external feeds or accounts only when the use case needs refreshed data or a controlled action. Do not assume that every plugin capability needs a remote service. This is a design recommendation inferred from the official architecture guidance. ([OpenAI, n.d.-h](https://developers.openai.com/plugins/concepts/plugins); [OpenAI, n.d.-b](https://developers.openai.com/plugins/build/skills)) |
| 3. Define tool contracts | Map each supported goal to reads, writes, required context, authorization, side effects, failure behavior, and structured outputs. Separate operations with different safety or permission needs. ([OpenAI, n.d.-e](https://developers.openai.com/plugins/plan/tools)) | For example, dependency lookup, repository finding export, and applying an upgrade should be separate actions with distinct permissions. A finding should return the matched component/version, source and update time, evidence, uncertainty, and remediation. Never return raw credentials or unrelated user data. |
| 4. Build the workflow and package | Skills contain concise instructions and optional references, scripts, and assets. The current portable layout uses a root plugin manifest, a skills directory, and optional MCP configuration. Codex compatibility packages have a supported compatibility manifest and MCP configuration. The documentation distinguishes the formats; do not rename files and assume the schemas are interchangeable. ([OpenAI, n.d.-b](https://developers.openai.com/plugins/build/skills); [OpenAI, n.d.-g](https://developers.openai.com/plugins/build/plugins)) | Treat the research notes as future reference material, not as a final skill prompt. If these findings are later turned into a plugin, package shorter workflows that link to focused references rather than one enormous instruction file. |
| 5. Apply security and privacy controls | Use least privilege, explain account linking and write access, validate all inputs on the server, verify scopes on every call, redact personal data and secrets from logs, set retention/deletion behavior, and require confirmation for irreversible actions. ([OpenAI, n.d.-k](https://developers.openai.com/plugins/guides/security-privacy)) | Security checks should start read-only. Any later fix, infrastructure mutation, credential rotation, active scan, or issue-tracking write should be an explicit, scoped action with a reviewable diff or plan and confirmation appropriate to its impact. |
| 6. Test the pieces and full package | Test each MCP tool with normal, missing, invalid, unauthorized, and empty-result inputs; then install the packaged plugin from a local source and test it in a new conversation. Include direct, indirect, follow-up, write/confirmation, negative, edge, and intentionally unsupported requests. Keep the evaluation prompts and results for future changes. ([OpenAI, n.d.-d](https://developers.openai.com/plugins/deploy/connect-chatgpt)) | The test inventory should check correct workflow selection as well as finding quality. Include cases where no tool should run, a finding is not applicable, required deployment context is missing, or the source feed is stale/unavailable. |
| 7. Submit and maintain | For public MCP review, provide exactly five positive and three negative test cases, release notes, reviewer details, and an accessible video walkthrough. A published plugin needs a clear privacy policy describing personal-data categories, purposes, recipients, retention timelines, and user controls. Remote MCP review requires website, support, privacy-policy, and terms URLs; skills-only ZIPs do not require the MCP test cases or all four URLs. Keep credentials out of the ZIP. ([OpenAI, n.d.-i](https://developers.openai.com/plugins/plugin-guidelines); [OpenAI, n.d.-l](https://developers.openai.com/plugins/deploy/submission)) | The policy must reflect actual service behavior. Data-flow research and product-specific policy drafting are prerequisites for a public submission, not generic filler text. |

## Key design boundaries

### Distinguish advice, evidence, and action

The plugin should distinguish a code-visible observation from a deployment fact. A source scan can identify a public database bind setting in a configuration file; it cannot prove that the running VPS has that firewall rule. A dependency scanner can match an advisory to a lockfile version; it cannot prove that the vulnerable package is reachable in production. A performance profile describes a particular workload and time window; it does not establish that a different deployment will behave the same way.

Use a consistent result format: **scope and revision; evidence; impact; confidence; environmental assumptions; fix or next check; verification result; limitations; source and retrieval time.** Make “not checked” and “inconclusive” visible states rather than silently interpreting them as safe.

### Keep actions proportionate

The plugin can group checks into read-only review, proposal, and approved change. Public web research, repository inspection, and configuration analysis can be read-only. A patch, package-manager operation, database migration, host change, active web scan, or external ticket write changes state or reaches a target and needs a separate safety path. OpenAI's guidelines state that tool annotations do not replace authentication, authorization, scope checks, validation, or confirmation ([OpenAI, n.d.-i](https://developers.openai.com/plugins/plugin-guidelines); [OpenAI, n.d.-e](https://developers.openai.com/plugins/plan/tools)).

### Consider the existing Codex Security workflow a focused reference

Codex Security is a useful first-party example of a narrow, evidence-centered security workflow: it scopes a repository or folder and revision, reports reviewed and deferred areas, records evidence and attack paths, and separates an accepted finding from patch generation, patch review, application, and verification. Its docs explicitly warn that a completed scan can still have coverage gaps, and that a generated patch is not yet a verified fix ([OpenAI, n.d.-c](https://developers.openai.com/codex/security/plugin); [OpenAI, n.d.-j](https://developers.openai.com/codex/security/plugin/scans); [OpenAI, n.d.-f](https://developers.openai.com/codex/security/plugin/fix-findings)).

That is a strong pattern for other plugin areas, but it does not itself cover privacy-law sufficiency, broad VPS configuration, workload-based performance optimization, or all live vulnerability intelligence. The proposed plugin should reuse the workflow qualities—clear scope, evidence, uncertainty, and reviewable fixes—without implying the security scanner covers those other domains.

## Product decisions outside the scope of public research

The official workflow expects these decisions before implementation:

1. First target users and project sizes.
2. Supported languages, frameworks, databases, VPS operating systems, and hosting platforms.
3. Whether “manage” means inspect, explain, propose changes, apply approved fixes, monitor feeds, or operate live infrastructure.
4. Initial distribution and integration model: local-repository guidance, remote service/integration, or both.
5. Jurisdictions supported by the policy-drafting workflow.

These are product choices, not facts that literature review can decide. Research supports modular boundaries and safe workflows but does not establish the right initial market or supported stack.

## Source guide

| Source | What it supports | What it does not establish |
|---|---|---|
| OpenAI plugin architecture and skills docs | Skill/MCP/UI roles and the smallest-supported-shape principle | That one shape is optimal for this plugin before the use cases are chosen |
| OpenAI use-case and tool-planning docs | Use-case inventory, tool contracts, permissions, side effects, output needs | Correctness of a future implementation |
| OpenAI security and privacy guide | Least privilege, server-side validation, scoped auth, data minimization, log redaction, confirmation | That a plugin is secure merely because it follows checklist language |
| OpenAI connect/test and submission docs | Current test workflow and submission materials | Future policy changes; recheck before packaging or submission |
| OpenAI plugin guidelines and package guide | Shared ChatGPT/Codex directory requirements, privacy disclosures, annotation limits, and lifecycle-hook constraints | Whether a future submission will pass review; policy and package details can change |
| Codex Security plugin documentation | Example of bounded scope, evidence-first findings, coverage disclosure, and reviewed fix lifecycle | Full coverage of the proposed backend plugin's subject areas |

## References

OpenAI. (n.d.-a). *Brainstorm plugin use cases*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/plan/use-case

OpenAI. (n.d.-b). *Build skills*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/build/skills

OpenAI. (n.d.-c). *Codex Security plugin quickstart*. ChatGPT Learn. Retrieved November 16, 2026, from https://developers.openai.com/codex/security/plugin

OpenAI. (n.d.-d). *Connect and test your plugin*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/deploy/connect-chatgpt

OpenAI. (n.d.-e). *Define tools*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/plan/tools

OpenAI. (n.d.-f). *Fix and verify security findings*. ChatGPT Learn. Retrieved November 16, 2026, from https://developers.openai.com/codex/security/plugin/fix-findings

OpenAI. (n.d.-g). *Package your plugin*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/build/plugins

OpenAI. (n.d.-h). *Plugin architecture*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/concepts/plugins

OpenAI. (n.d.-i). *Plugin guidelines*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/plugin-guidelines

OpenAI. (n.d.-j). *Run a Codex Security scan*. ChatGPT Learn. Retrieved November 16, 2026, from https://developers.openai.com/codex/security/plugin/scans

OpenAI. (n.d.-k). *Security & privacy*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/guides/security-privacy

OpenAI. (n.d.-l). *Upload and submit your plugin*. OpenAI Developers. Retrieved November 16, 2026, from https://developers.openai.com/plugins/deploy/submission

---
name: frontend-security
description: "Review browser-facing application code and policies for XSS, CSRF, unsafe content loading, and client-side data risks."
---

# Frontend and browser security review

Use this skill for browser-facing code, client-side data flows, response policies, and frontend exploit-surface reviews. Static source inspection and observed browser behavior are different evidence types.

## Procedure

1. **Set scope.** Record the application paths and revision, framework or browser surface visible in the material, relevant routes and response headers if supplied, and whether the review is static or includes an authorized runtime. Mark unavailable backend or deployment context as not observed.
2. **Review XSS and DOM flows.** Trace untrusted data to unsafe HTML or DOM sinks. Check whether framework-safe rendering, context-appropriate output encoding, or sanitization is used where HTML is intentionally supported. Treat Content Security Policy as defense in depth, not the primary XSS defense; a WAF is not a substitute.
3. **Review CSRF controls in context.** Check state-changing routes, cookie behavior, origin checks, and CSRF-token patterns. Do not treat a SameSite cookie flag alone as complete CSRF protection; consider the documented gaps around state-changing GET requests, sibling subdomains, browser differences, and client-side CSRF.
4. **Review browser policy and content loading.** Inspect available evidence for security headers and CSP, frame embedding, redirects, `postMessage` listeners, and third-party scripts against the application's actual use.
5. **Review client data and API trust.** Look for references to secrets or sensitive tokens in browser storage using presence-only or redacted evidence; never retrieve or display raw values. Check whether client-side validation or hidden controls are relied on as authorization. Confirm that authorization is enforced by the server on each request only when backend evidence is in scope; otherwise report it as an unverified dependency and refer to the backend workflow.
6. **Separate static and runtime evidence.** A suspicious source sink is not by itself proof of browser exploitability. Confirm relevant rendering context, route behavior, and response policy before describing a vulnerability as confirmed. Before any active runtime inspection or request against a running target—including local, development, staging, production, public, or isolated targets—require explicit user authorization for the exact target and scope, plus impact, rate, and time limits. This includes browser inspection that does not send network requests. It does not permit writing, modifying, retrieving, linking to, copying, reproducing, or executing exploit/PoC code or using discovered credentials; follow the shared action contract.

## Output

- State the source revision, client paths, routes or browser target inspected, evidence type, and inspection time.
- Report each issue using [the shared finding contract](../../references/finding-contract.md). Include the data flow or route and minimum redacted evidence, the conditions for impact, confidence, a focused recommendation, and a verification case.
- Separate code-visible observations from runtime behavior, server authorization, and deployed headers. Mark missing backend or deployment evidence as not observed rather than safe.
- List unreviewed routes, frameworks, browser contexts, response policies, and dynamic checks. Do not present a clean static scan as proof that the browser surface is safe.

## Research references

- [Security and vulnerability research](../../research/SECURITY_AND_VULNERABILITY_RESEARCH.md) — XSS, CSRF, browser policy, client-side trust, and static/runtime limits.
- [Reference projects](../../research/REFERENCE_PROJECTS.md) — source-scanner and active DAST coverage and authorization cautions.
- [Codex plugin workflow](../../research/CODEX_PLUGIN_FLOW.md) — evidence boundaries, coverage gaps, and reviewable changes.
- [Finding and action contract](../../references/finding-contract.md) — finding fields, evidence language, and action boundaries.

## Boundaries

Frontend review does not prove server-side authorization, API behavior, or deployed response headers without corresponding evidence. Do not infer exploitability from a source pattern alone or treat SameSite, CSP, or a WAF as a complete defense. Use the backend workflow for server-side authorization and API findings.

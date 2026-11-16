---
name: code-quality
description: Use when reviewing or improving concrete maintainability, organization, or code-quality problems in a repository.
---
<!-- Copyright (c) 2026 2q9e. See ../../LICENSE for terms. -->

# Code quality and maintainability

Review the behavior and maintenance cost that can be observed in the requested scope. Do not infer who or what authored code.

## Read first

- [Quality and performance research](../../research/QUALITY_PERFORMANCE_RESEARCH.md) for review signals and their limits.
- [Finding and action contract](../../references/finding-contract.md) for evidence, impact, confidence, coverage, and reviewable changes.

## Review workflow

1. Establish the requested paths, revision or change, and intended behavior. Read applicable repository instructions and nearby implementations before judging structure or conventions.
2. Trace the relevant behavior and identify specific evidence: duplicated logic, dead code, unnecessary abstractions or dependencies, tangled responsibilities, unclear boundaries, circular dependencies, bypassed project patterns, unsupported APIs, or missing failure handling. Treat these as leads to investigate, not automatic defects.
3. Explain the practical maintenance or correctness cost and the conditions that make it matter. Consider whether the existing approach is intentional, smaller, or safer than the proposed alternative. Do not call code “slop” or label a change low quality without concrete evidence.
4. Recommend the smallest change that addresses a demonstrated problem and fits the project's architecture. Avoid broad rewrites based only on file length, style preference, metrics, or a desire for a uniform directory tree.
5. When the user requests a focused local fix, make it and inspect the diff; otherwise provide a recommendation without editing. A local fix request alone does not authorize package scripts, dependency installation/upgrades, migrations, or other effectful commands; follow the shared contract.
6. Report findings using the shared contract. Include precise locations, evidence, impact, confidence, proposed change, appropriate verification, and inspected and uninspected scope. If analyzer output is used, validate the match in context and disclose its language/rule coverage.

## Evidence and boundaries

- Never infer AI authorship or use generated-code detection as a quality judgment. There is no validated universal “AI slop” score.
- Lines of code, test coverage, comment volume, complexity metrics, and clean lint output can inform review, but none establishes maintainability or correctness alone.
- Check that introduced dependencies, imports, APIs, and configuration keys exist in the versions the project uses. Distinguish a code-visible fact from an assumption about runtime or deployment.
- Keep each explanation and proposed patch focused on the demonstrated issue. State uncertainty and project conventions instead of treating personal style as a requirement.
- Give a verification plan that matches the change. Do not claim verification that was not performed.

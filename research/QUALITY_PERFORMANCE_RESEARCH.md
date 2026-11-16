# AI-Assisted Code Quality and Backend Performance Research

**Research date:** 2026-11-16  
**Purpose:** Turn “anti AI slop,” code organization, and resource optimization into observable review practices that do not trade away correctness or reliability.

## Findings in brief

The reviewed sources do not supply a validated universal “AI slop” score. Treat “slop” as a user shorthand for concrete problems—unnecessary complexity, duplicated or dead code, invented APIs/dependencies, ignored repository conventions, insecure shortcuts, missing failure handling, or unsupported changes—not as a label that can be reliably inferred from code provenance.

Performance work should follow a measurement loop: define the workload and service objective; capture baseline latency, errors, CPU, memory, database demand, and saturation; profile a demonstrated bottleneck; change one thing; then compare representative load and verify behavior. This directly addresses the user's goal of making an app more efficient without starving it or making it worse.

## 1. Making “anti AI slop” measurable

### What the evidence says

OpenSSF's security-focused guide recommends concise, specific, actionable code-assistant instructions grounded in the project's language, platform, dependencies, and secure coding rules. It gives examples such as validating inputs, parameterizing queries, safe output encoding, secure defaults, tests for security-critical functions, and reviewing dependencies. This is practical guidance, not a controlled evaluation proving that a particular instruction set eliminates vulnerable or low-quality output ([OpenSSF Best Practices and AI/ML Working Groups, 2025](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html)).

A 2026 peer-reviewed, preregistered, two-phase study collected 151 solutions from participants (95.4% professional developers); its Phase 2 randomized controlled trial had 75 participants. The frequentist analyses found no significant difference in manual evolution time or code quality between code first developed with and without AI assistance. Bayesian analysis found a small CodeHealth improvement signal for the subgroup whose original code was produced by habitual AI users, with substantial uncertainty. The study used a small Java/Spring Boot web application task, was conducted in late 2024, and measured maintainability rather than security. Its results do not establish that generated code is always maintainable, secure, correct, or equivalent across languages and current coding agents; they do challenge the blanket claim that AI-assisted code is inherently unmaintainable ([Borg et al., 2026](https://doi.org/10.1007/s10664-026-10889-1)).

### Review observable properties, not authorship

Useful checks include:

- **Project fit:** Compare with existing framework patterns, package boundaries, API contracts, naming, error conventions, and documented architecture. Load project instructions and nearby implementations before proposing a new structure.
- **Necessity and scope:** Check whether a change solves the stated request with an appropriately small diff. Flag unused abstractions, duplicate logic, gratuitous dependencies, dead code, and unrelated rewrites with concrete locations.
- **Reality check:** Verify that new imports, APIs, configuration keys, runtime options, and dependency names exist in the project's declared versions. Inspect dependency health, license, and source rather than accepting a plausible-sounding name.
- **Correctness and failure behavior:** Inspect boundary conditions, validation, authorization, timeouts, resource cleanup, retries, concurrency, error paths, and data consistency. Check tests that show both expected success and important failure cases.
- **Security:** Run the relevant source, dependency, and configuration checks; assess whether any finding is real and reachable. Do not let formatting or clean lint output stand in for a security review.
- **Reviewability:** Prefer one explanation and one focused patch per issue. Show evidence and uncertainty instead of vague style judgments such as “this feels AI-written.”

No single measure—lines of code, test coverage, complexity, comments, or generated-code detection—captures quality by itself. An effective plugin should organize findings by demonstrable engineering risk and align with repository conventions. This is a synthesis recommendation from the evidence and practices above.

## 2. Organization and maintainability

“Neat” should mean that a maintainer can find behavior and change it safely, not that every project conforms to one preferred directory tree. Respect the framework's established structure unless evidence shows it is causing an actual problem.

Practical review signals include repeated business logic, functions/modules that own unrelated responsibilities, unclear boundaries between request validation and business rules, circular dependencies, stale documentation, orphaned configuration, dead or duplicate code, tests that are hard to isolate, and a change that bypasses an established abstraction. Each signal needs context: an intentionally centralized module or a small duplicated helper may be cheaper and safer than a new layer.

The plugin should state the cost observed (for example, two copies of the same authorization rule can diverge) and suggest the smallest safe improvement. Avoid broad rewrites triggered only by file length or a style preference. Check the project before recommending a new framework pattern.

## 3. Workload-aware optimization

### A safe optimization sequence

1. **Set the question:** Which endpoint/job is slow or expensive, under what traffic, and against which service objective?
2. **Record a baseline:** p50/p95/p99 latency, throughput, error rate, CPU, memory/RAM, garbage collection or allocation behavior where relevant, queue/connection saturation, and database time/load. Record test environment, data size, and revision.
3. **Find the bottleneck:** Use request traces and metrics to locate the slow component; profile CPU, heap/allocation, locks, or goroutines; inspect database plans for measured slow queries. Do not tune a subsystem just because it is easy to change.
4. **Change one cause at a time:** Explain the expected gain, resource cost, correctness risk, and rollback path. Keep hard limits/backpressure and graceful behavior in the design.
5. **Compare under representative load:** Repeat the workload against the new revision and compare latency, errors, CPU/RAM, query count, and throughput. A lower average latency is not a win if tail latency, error rate, or memory spikes get worse.
6. **Retain the evidence:** Include workload, environment, baseline/after results, and any test differences with the recommendation.

Grafana k6 lets teams express performance thresholds such as p95 latency and error-rate objectives as pass/fail criteria. Thresholds are useful only when based on an appropriate workload and service objective; synthetic measurements do not establish how every production workload behaves ([Grafana Labs, n.d.-c](https://grafana.com/docs/k6/latest/using-k6/thresholds/)).

Grafana Pyroscope profiles CPU, allocation/heap, goroutines, mutex and block behavior. Its documentation says its client stores profile data temporarily in memory and discards new profiles when its backend is down or slow to avoid exhausting application memory; it also recommends testing overhead for the particular workload. That is a good design example for bounded observability, not a guarantee that every profiler has negligible impact ([Grafana Labs, n.d.-a](https://grafana.com/docs/pyroscope/latest/introduction/profiling-types/); [Grafana Labs, n.d.-b](https://grafana.com/docs/pyroscope/latest/configure-client/memory-overhead/)).

OpenTelemetry's metrics specification supports cardinality limits and aggregates measurements that exceed the limit into an overflow series. This bounds the number of time series but reduces attribute detail after overflow. A plugin should therefore flag unbounded/high-cardinality labels (for example, unique users or arbitrary paths), and explain the monitoring tradeoff when a cap is applied ([OpenTelemetry Authors, n.d.](https://opentelemetry.io/docs/specs/otel/metrics/sdk/)).

### Caching needs a correctness and capacity plan

Do not recommend caching simply because it sounds fast. First show repeated reads or database pressure in measurements. For cache-aside, define the key, maximum memory/working set, TTL/staleness tolerance, invalidation-on-write behavior, per-process versus shared cache scope, and behavior when the cache fails. Concurrent misses or mass expiry can create a cache stampede; stale reads can violate product expectations. Redis documentation describes TTL-bounded staleness, write invalidation, and stampede behavior for its cache-aside pattern ([Redis, n.d.](https://redis.io/docs/latest/develop/use-cases/cache-aside/)).

Treat the cache as a distinct resource budget: added RAM can compete with the application or database cache; added network round trips can worsen low-volume paths; serialization and invalidation add CPU and correctness cost. The acceptance condition should include correct data behavior, bounded resource use, and an observed improvement in the target workload.

### Query optimization also needs safe measurement

PostgreSQL EXPLAIN reveals selected scans and joins. EXPLAIN ANALYZE actually executes the statement and adds profiling overhead; for write statements, the effects happen unless managed with a safe transaction/rollback strategy. Therefore a plugin should distinguish a planned query analysis from execution and should not casually run write-query measurements against a live database ([PostgreSQL Global Development Group, n.d.](https://www.postgresql.org/docs/18/sql-explain.html)).

## 4. Suggested quality and performance result format

For each recommendation, include:

- Scope: repository path, revision, service, workload, environment, and relevant configuration.
- Observation: direct code, profile, metric, trace, query plan, or test evidence.
- Expected impact and tradeoff: which bottleneck or maintainability risk it addresses and what resource/correctness cost it may add.
- Confidence and missing context: whether the issue is observed, inferred, or only a possible risk.
- Smallest proposed change and verification: the before/after metric or test that would show improvement without breaking expected behavior.

## Source guide

| Source | Type and contribution | Limitation |
|---|---|---|
| OpenSSF Security-Focused Guide | Practitioner guidance for concise, context-specific secure coding instructions and project-aware checks | Recommendations are not proof of effectiveness or an independent code-quality detector |
| Borg et al. (2026) | Peer-reviewed, preregistered study: 151 participants total, 75 in Phase 2 RCT, and a small Java/Spring Boot task | Frequentist null result is scoped to measured outcomes; the Bayesian habitual-user signal is small and uncertain; it does not assess security or current autonomous agents |
| OpenTelemetry Metrics SDK | Technical specification for limits and overflow behavior | A cap trades observability detail for bounded cardinality; defaults/SDK behavior may vary |
| Pyroscope docs | Vendor technical documentation for profile types and client resource behavior | Overhead depends on implementation, language, workload, and configuration |
| k6 thresholds docs | Product documentation for pass/fail performance objectives | Does not choose the right SLO or production-representative workload for the user |
| Redis cache-aside docs | Vendor documentation for TTL, invalidation, and stampede handling | Example behavior is Redis-specific; does not prove a cache will improve a measured application |
| PostgreSQL EXPLAIN docs | Official engine documentation for query plans, execution, and analysis overhead | Applies to PostgreSQL; live query execution can have side effects and measurement overhead |

## References

Borg, M., Hewett, D., Hagatulah, N., Couderc, N., Söderberg, E., Graham, D., Kini, U., & Farley, D. (2026). Echoes of AI: Investigating the downstream effects of AI assistants on software maintainability. *Empirical Software Engineering, 31*, Article 161. https://doi.org/10.1007/s10664-026-10889-1

Grafana Labs. (n.d.-a). *Profiling types and their uses*. Grafana Pyroscope documentation. Retrieved November 16, 2026, from https://grafana.com/docs/pyroscope/latest/introduction/profiling-types/

Grafana Labs. (n.d.-b). *Pyroscope memory overhead*. Grafana Pyroscope documentation. Retrieved November 16, 2026, from https://grafana.com/docs/pyroscope/latest/configure-client/memory-overhead/

Grafana Labs. (n.d.-c). *Thresholds*. Grafana k6 documentation. Retrieved November 16, 2026, from https://grafana.com/docs/k6/latest/using-k6/thresholds/

OpenSSF Best Practices and AI/ML Working Groups. (2025, August 1). *Security-focused guide for AI code assistant instructions*. OpenSSF. https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions.html

OpenTelemetry Authors. (n.d.). *Metrics SDK*. OpenTelemetry specification. Retrieved November 16, 2026, from https://opentelemetry.io/docs/specs/otel/metrics/sdk/

PostgreSQL Global Development Group. (n.d.). *EXPLAIN*. PostgreSQL 18 documentation. Retrieved November 16, 2026, from https://www.postgresql.org/docs/18/sql-explain.html

Redis. (n.d.). *Cache-aside*. Redis documentation. Retrieved November 16, 2026, from https://redis.io/docs/latest/develop/use-cases/cache-aside/

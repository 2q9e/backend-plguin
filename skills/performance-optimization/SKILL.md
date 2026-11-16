---
name: performance-optimization
description: Use when diagnosing or improving CPU, RAM, latency, cache, database, throughput, or resource-cost behavior.
---
<!-- Copyright (c) 2026 2q9e. See ../../LICENSE for terms. -->

# Workload-based performance optimization

Collect a measured baseline before recommending a code, configuration, cache, or infrastructure change. If the baseline cannot be collected, identify the missing measurements and stop at a measurement plan; do not suggest an optimization change yet.

## Read first

- [Quality and performance research](../../research/QUALITY_PERFORMANCE_RESEARCH.md) for the measurement loop, caching, database analysis, and profiling limits.
- [Reference projects](../../research/REFERENCE_PROJECTS.md) for useful profiling, telemetry, and load-testing patterns and their boundaries.
- [Finding and action contract](../../references/finding-contract.md) for before/after evidence, tradeoffs, and safe action boundaries.

## Measure and diagnose

1. Define the endpoint, job, or service; representative workload and data size; environment and revision; and the relevant service objective. Use supplied measurements or an authorized, representative environment. Before profiling, benchmarking, or load against any running target—including local, development, staging, production, or isolated targets—require explicit user authorization for the exact target and scope, plus impact, rate, and time limits, as stated in the shared action contract.
2. Record a baseline before proposing a change: p50/p95/p99 latency, throughput and errors, CPU, RAM (including peak or saturation), database time/load and query demand, and whether a cache is present. For existing caches, capture hit/miss rate, memory, eviction, and relevant network cost. Record relevant queues, connection pools, allocation/GC, and test conditions where available.
3. Locate the demonstrated bottleneck with traces, metrics, profiles, or query plans. Account for profiler and instrumentation overhead. Do not tune a subsystem because it is familiar or easy to change.
4. Only when the user requests an implementation change and the baseline supports one, change one cause at a time. Otherwise provide the diagnosis and a reviewable proposal without editing code or configuration. State expected gains, CPU/RAM/cache/database/latency tradeoffs, correctness risks, and rollback approach.
5. Only after an implementation change was requested and actually made, and only when the repeat workload is authorized and in scope, rerun the same representative workload and compare before/after results. Recheck correctness and include tail latency, errors, throughput, CPU, RAM, database effects, and cache effects (including any introduced or modified cache)—not just averages. For diagnosis-only requests, stop after measurement and analysis; do not change code or rerun a workload. Treat resource increases as tradeoffs: assess them against capacity, headroom, configured limits, service objectives, and cost; reject changes that cross budgets or weaken correctness.
6. Report the workload, environment, revision, measurements, instrumentation, differences between runs, and what was not measured. Use the shared finding contract.

## Caching and database checks

- Recommend a cache only when measurements show repeated reads or database pressure. Specify key scope, memory bound, TTL and staleness tolerance, invalidation on writes, failure behavior, and protection against concurrent misses or mass expiry. Verify freshness and correctness as well as latency and RAM/network cost.
- For database work, tie a query change to measured demand or a plan. Separate plan inspection from query execution. `EXPLAIN ANALYZE` executes the statement; write-capable query plans and write measurements require separate explicit authorization for the exact target and operation. Active profiling or load against any running target also requires explicit authorization and the impact, rate, and time limits in the shared action contract.
- Consider monitoring overhead and metric cardinality when proposing instrumentation. A cardinality cap bounds resource use but can reduce detail; disclose that tradeoff.

## Boundaries

- Do not describe an unmeasured change as faster, cheaper, or more efficient. State any resource increase and whether measured headroom and configured budgets accommodate it.
- Do not assume synthetic load represents production. State the test scope and avoid unapproved load against live services.
- Do not remove limits, backpressure, validation, authorization, or failure handling just to improve a benchmark.
- A successful profile or benchmark describes only its workload, revision, and environment; state that coverage limit.
